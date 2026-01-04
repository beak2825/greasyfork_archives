// ==UserScript==
// @name         TikTok 定邀抓取与样品回填（合并版）
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  一体化：在 affiliate 样品页拉取+缓存定邀详情，并在样品申请页基于本地缓存自动回填定邀名称。
// @match        https://affiliate.tiktok.com/product/sample-request?shop_region=*
// @match        *://*.tiktok.com/product/sample-request*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.2.0/crypto-js.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/lz-string/1.5.0/lz-string.min.js
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/549608/TikTok%20%E5%AE%9A%E9%82%80%E6%8A%93%E5%8F%96%E4%B8%8E%E6%A0%B7%E5%93%81%E5%9B%9E%E5%A1%AB%EF%BC%88%E5%90%88%E5%B9%B6%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/549608/TikTok%20%E5%AE%9A%E9%82%80%E6%8A%93%E5%8F%96%E4%B8%8E%E6%A0%B7%E5%93%81%E5%9B%9E%E5%A1%AB%EF%BC%88%E5%90%88%E5%B9%B6%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
	'use strict';

	// ================= 通用配置 =================
	const STORAGE_KEY = 'tt_aff_invitation_cache_v1';
	const BASE_HOST = 'https://affiliate.tiktok.com';
	const AID_FOR_THIS_API = '4331';
	const OEC_SELLER_ID = '7496000925492218350';
	const SHOP_REGION = (new URL(location.href).searchParams.get('shop_region')) || 'TH';
	const PAGE_SIZE = 100;
	let DEBUG = false; // 可通过菜单开关
	let DETAIL_LOG = false; // 详情抓取日志开关
	const dbg = (...args) => { if (DEBUG) console.log('[合并][DEBUG]', ...args); };

	// ================= 页面类型 =================
	const isAffiliate = location.hostname.includes('affiliate.tiktok.com');

	// ================= 样式 =================
	GM_addStyle(`
		.invitation-name-tag { color: #D92911; font-size: 12px; font-weight: bold; margin-left: 12px; white-space: nowrap; align-self: center; }
		.tm-fixed-btn { position: fixed; z-index: 999999; right: 20px; padding: 10px 20px; font-size: 14px; background: #111827; color: #fff; border: 1px solid #374151; border-radius: 6px; cursor: pointer; box-shadow: 0 2px 5px rgba(0,0,0,0.15); }
		.tm-fixed-btn:hover { background: #0d1526; }
		.tm-fixed-btn:disabled { background: #3f3f46; color: #cbd5e1; cursor: not-allowed; }
	`);

	// ================= 工具：Cookie/参数/压缩存储 =================
	function getCookie(name) {
		const target = name + '=';
		const parts = document.cookie.split(';');
		for (let i = 0; i < parts.length; i++) {
			const s = parts[i].trim();
			if (s.startsWith(target)) return decodeURIComponent(s.slice(target.length));
		}
		return '';
	}
	function buildSearchString(obj) { const usp = new URLSearchParams(); for (const [k, v] of Object.entries(obj)) usp.append(k, String(v)); return usp.toString(); }
	function getBaseParameters() {
		const params = {
			aid: AID_FOR_THIS_API,
			app_name: 'i18n_ecom_alliance', device_id: '0', device_platform: 'web',
			cookie_enabled: navigator.cookieEnabled, screen_width: screen.width, screen_height: screen.height,
			user_language: navigator.language, browser_language: navigator.language, browser_platform: navigator.platform,
			browser_name: navigator.appCodeName, browser_version: navigator.appVersion, browser_online: navigator.onLine,
			timezone_name: Intl.DateTimeFormat().resolvedOptions().timeZone, shop_region: SHOP_REGION
		};
		const svwebid = getCookie('s_v_web_id'); const msToken = getCookie('msToken');
		if (svwebid) params.fp = svwebid; if (msToken) params.msToken = msToken;
		if (OEC_SELLER_ID) params.oec_seller_id = OEC_SELLER_ID; return params;
	}
	async function saveCompressed(key, obj) {
		const json = JSON.stringify(obj);
		const compressed = (typeof LZString !== 'undefined' && LZString?.compressToUTF16) ? LZString.compressToUTF16(json) : json;
		if (typeof GM !== 'undefined' && typeof GM.setValue === 'function') return GM.setValue(key, compressed);
		if (typeof GM_setValue === 'function') return GM_setValue(key, compressed);
		localStorage.setItem(key, compressed);
	}
	async function loadCompressed(key) {
		let raw = '';
		if (typeof GM !== 'undefined' && typeof GM.getValue === 'function') raw = await GM.getValue(key, '');
		else if (typeof GM_getValue === 'function') raw = GM_getValue(key, '');
		else raw = localStorage.getItem(key) || '';
		if (!raw) return null;
		let jsonStr = raw;
		if (typeof LZString !== 'undefined' && LZString?.decompressFromUTF16) { const maybe = LZString.decompressFromUTF16(raw); if (maybe) jsonStr = maybe; }
		try { return JSON.parse(jsonStr); } catch { return null; }
	}

	// ================= X-Bogus & X-Gnarly =================
	class XBogusUtils {
		constructor(ua = '') { this.array = new Array(123).fill(null); this.array[48]=0;this.array[49]=1;this.array[50]=2;this.array[51]=3;this.array[52]=4;this.array[53]=5;this.array[54]=6;this.array[55]=7;this.array[56]=8;this.array[57]=9; this.array[97]=10;this.array[98]=11;this.array[99]=12;this.array[100]=13;this.array[101]=14;this.array[102]=15; this.character='Dkdpgh4ZKsQB80/Mfvw36XI1R25-WUAlEi7NLboqYTOPuzmFjJnryx9HVGcaStCe='; this.ua_key=new Uint8Array([0,1,12]); this.user_agent=ua||navigator.userAgent; }
		md5_str_to_array(e){ if(e.length>32)return e.split('').map(ch=>ch.charCodeAt(0)); const t=[]; for(let r=0;r<e.length;r+=2) t.push((this.array[e.charCodeAt(r)]<<4)|this.array[e.charCodeAt(r+1)]); return t; }
		async md5(e){ const s=(typeof e==='string')?e:e.toString(); return CryptoJS.MD5(s).toString(); }
		async md5_encrypt(e){ const t=await this.md5(this.md5_str_to_array(await this.md5(e))); return this.md5_str_to_array(t); }
		encoding_conversion(e,t,r,n,a,o,i,s,l,c,u,d,f,p,m,h,g,F,A){ return String.fromCharCode(...[e,u,t,d,r,f,n,p,a,m,o,h,i,g,s,F,l,A,c]); }
		encoding_conversion2(e,t,r){ return String.fromCharCode(e)+String.fromCharCode(t)+r; }
		rc4_encrypt(keyBytes,dataBytes){ let r=Array.from({length:256},(_,t)=>t),n=0; for(let t=0;t<256;t++){ n=(n+r[t]+keyBytes[t%keyBytes.length])%256; [r[t],r[n]]=[r[n],r[t]]; } const a=new Uint8Array(dataBytes.length); let o=0; n=0; for(let e=0;e<dataBytes.length;e++){ o=(o+1)%256; n=(n+r[o])%256; [r[o],r[n]]=[r[n],r[o]]; a[e]=dataBytes[e]^r[(r[o]+r[n])%256]; } return a; }
		calculation(e,t,r){ let n=((255&e)<<16)|((255&t)<<8)|r; return this.character[(16515072&n)>>18]+this.character[(258048&n)>>12]+this.character[(4032&n)>>6]+this.character[63&n]; }
		async getXBogus(queryString){ const t=this.md5_str_to_array(await this.md5(btoa(String.fromCharCode(...this.rc4_encrypt(this.ua_key,new TextEncoder().encode(this.user_agent)))))); const r=this.md5_str_to_array(await this.md5(this.md5_str_to_array('d41d8cd98f00b204e9800998ecf8427e'))); const n=await this.md5_encrypt(queryString); const a=Math.floor(Date.now()/1e3); const o=[64,0.00390625,1,12,n[14],n[15],r[14],r[15],t[14],t[15],(a>>24)&255,(a>>16)&255,(a>>8)&255,255&a,32,0,190,144]; let i=o[0]; for(let e=1;e<o.length;e++){ const t=o[e]; if(typeof t==='number') i^=t; } o.push(i); const s=[],l=[]; for(let e=0;e<o.length;e+=2){ s.push(o[e]); if(e+1<o.length) l.push(o[e+1]); } const c=[...s,...l]; const u=this.encoding_conversion2(2,255,String.fromCharCode(...this.rc4_encrypt(new Uint8Array([255]),new TextEncoder().encode(this.encoding_conversion(...c))))); let d=''; for(let e=0;e<u.length;e+=3) d+=this.calculation(u.charCodeAt(e),u.charCodeAt(e+1),u.charCodeAt(e+2)); const withXBogus=`${queryString}&X-Bogus=${d}`; return [withXBogus,d,this.user_agent]; }
	}
	const XGnarlyEncode=(()=>{ const o=[4294967295,138,1498001188,211147047,253,/\s*\(\)\s*{\s*\[\s*native\s+code\s*]\s*}\s*$/,203,288,9,1196819126,3212677781,135,263,193,58,18,244,2931180889,240,173,268,2157053261,261,175,14,5,171,270,156,258,13,15,3732962506,185,169,2,6,132,162,200,3,160,217618912,62,2517678443,44,164,4,96,183,2903579748,3863347763,119,181,10,190,8,2654435769,259,104,230,128,2633865432,225,1,257,143,179,16,600974999,185100057,32,188,53,2718276124,177,196,4294967296,147,117,17,49,7,28,12,266,216,11,0,45,166,247,1451689750]; const i=[o[44],o[74],o[10],o[62],o[42],o[17],o[2],o[21],o[3],o[70],o[50],o[32],o[0]&Date.now(),Math.floor(o[77]*Math.random()),Math.floor(o[77]*Math.random()),Math.floor(o[77]*Math.random())]; let s=o[88]; const l=[o[9],o[69],o[51],o[92]]; function c(e){ const buf=new ArrayBuffer(e<65025?2:4); const dv=new DataView(buf); if(e<65025) dv.setUint16(0,e,false); else dv.setUint32(0,e,false); return new Uint8Array(buf);} function rotl(e,t){return(e<<t)|(e>>>(32-t));} function roundAdd(x,a,b,c,d){ x[a]=((x[a]??0)+(x[b]??0))>>>0; x[d]=rotl(((x[d]??0)^(x[a]??0))>>>0,16)>>>0; x[c]=((x[c]??0)+(x[d]??0))>>>0; x[b]=rotl(((x[b]??0)^(x[c]??0))>>>0,12)>>>0; x[a]=((x[a]??0)+(x[b]??0))>>>0; x[d]=rotl(((x[d]??0)^(x[a]??0))>>>0,8)>>>0; x[c]=((x[c]??0)+(x[d]??0))>>>0; x[b]=rotl(((x[b]??0)^(x[c]??0))>>>0,7)>>>0;} function incCounter(x){ x[12]=(((x[12]??0)+1)&0xffffffff)>>>0;} function chachaLikeCore(state,rounds){ let r=state.slice(); for(let iter=0;iter<rounds;){ roundAdd(r,0,4,8,12); roundAdd(r,1,5,9,13); roundAdd(r,2,6,10,14); roundAdd(r,3,7,11,15); if(++iter>=rounds) break; roundAdd(r,0,5,10,15); roundAdd(r,1,6,11,12); roundAdd(r,2,7,12,13); roundAdd(r,3,4,13,14);} for(let t=0;t<16;++t) r[t]=((r[t]??0)+(state[t]??0))>>>0; return r;} function streamXor(key,rounds,out){ let n=key.slice(),a=0; for(;a+16<out.length;a+=16){ const e=chachaLikeCore(n,rounds); incCounter(n); for(let t=0;t<16;++t) out[a+t]=((out[a+t]??0)^(e[t]??0))>>>0;} const rem=out.length-a; const e2=chachaLikeCore(key.slice(),rounds); for(let t=0;t<rem;++t) out[a+t]=((out[a+t]??0)^(e2[t]??0))>>>0;} function toWordsLE(bytes){ const n=Math.floor(bytes.length/4); const a=bytes.length%4; const outLen=Math.floor((bytes.length+3)/4); const words=Array(outLen).fill(0); let s=0; for(s=0;s<n;++s){ const e=4*s; words[s]=(bytes[e])|(bytes[e+1]<<8)|(bytes[e+2]<<16)|(bytes[e+3]<<24);} if(a>0){ words[s]=0; for(let e=0;e<a;++e) words[s]|=(bytes[4*s+e]<<(8*e)); } return words;} function wordsToBytesLE(words,origLen){ const out=new Array(origLen).fill(0); const n=Math.floor(origLen/4); const a=origLen%4; for(let s=0;s<n;++s){ const v=words[s]??0; const e=4*s; out[e]=v&255; out[e+1]=(v>>>8)&255; out[e+2]=(v>>>16)&255; out[e+3]=(v>>>24)&255;} if(a>0){ const v=words[n]??0; for(let e=0;e<a;++e) out[4*n+e]=(v>>>(8*e))&255;} return out;} function md5hex(str){ return CryptoJS.MD5(str).toString(); }
		return function XGnarlyEncode({queryString,body,userAgent}){ const p={}; p[1]=1; p[2]=0; p[3]=md5hex(queryString||''); p[4]=md5hex(body||''); p[5]=md5hex(userAgent||''); const h=Date.now(); p[6]=Math.floor(h/1000); p[7]=1245783967; p[8]=(1000*h)%2147483648; p[9]='5.1.0'; p[0]=p[6]^p[7]^p[8]^p[1]^p[2]; const g=[Object.keys(p).length]; for(const [k,v] of Object.entries(p)){ g.push(parseInt(k,10)); let rBytes,lenBytes; if(typeof v==='number'){ rBytes=c(v); lenBytes=c(rBytes.length);} else { rBytes=new TextEncoder().encode(v); lenBytes=c(rBytes.length);} g.push(...lenBytes,...rBytes);} let F=''; for(let e=0;e<g.length;e++) F+=String.fromCharCode(g[e]); const A=[],vbytes=[]; let _=0; for(let e=0;e<12;e++){ const rand=Math.floor(4294967296*(function(){ const r=chachaLikeCore(i,8); const nIdx=s&15; const aIdx=(s+8)&15; const t=r[nIdx]; const e2=((r[aIdx]&4294965248)>>>11); if(s===7){ incCounter(i); s=0;} else {++s;} return (t+4294967296*e2)/9007199254740992; })()); A.push(rand); _=((_+(rand&15))&15)>>>0; const t=rand&255,r=(rand>>>8)&255,n=(rand>>>16)&255,a=(rand>>>24)&255; vbytes.push(t,r,n,a);} _+=5; function rc4Encrypt(keyByte,str){ const keyArr=new Uint8Array([keyByte]); const data=new TextEncoder().encode(str); let r=Array.from({length:256},(_,t)=>t),n=0; for(let t=0;t<256;t++){ n=(n+r[t]+keyArr[t%keyArr.length])%256; [r[t],r[n]]=[r[n],r[t]];} const a=new Uint8Array(data.length); let o2=0; n=0; for(let e=0;e<data.length;e++){ o2=(o2+1)%256; n=(n+r[o2])%256; [r[o2],r[n]]=[r[n],r[o2]]; a[e]=data[e]^r[(r[o2]+r[n])%256]; } return a;} const header=String.fromCharCode( l[0],vbytes[0],l[1],vbytes[1],l[2],vbytes[2],l[3],vbytes[3], A[0]&255,(A[0]>>>8)&255,(A[0]>>>16)&255,(A[0]>>>24)&255 ); const part=String.fromCharCode(2)+String.fromCharCode(255)+String.fromCharCode(...rc4Encrypt(255, header + (function toStream(){ const arr=[]; for(let e=0;e<F.length;++e) arr.push(F.charCodeAt(e)); const n=Math.floor(arr.length/4); const a=arr.length%4; const outLen=Math.floor((arr.length+3)/4); const words=Array(outLen).fill(0); for(let s=0;s<n;++s){ const e=4*s; words[s]=arr[e]|(arr[e+1]<<8)|(arr[e+2]<<16)|(arr[e+3]<<24);} if(a>0){ let s2=n; words[s2]=0; for(let e=0;e<a;++e) words[s2]|=(arr[4*s2+e]<<(8*e)); } streamXor(i,_,words); return String.fromCharCode.apply(String, wordsToBytesLE(words,arr.length)); })() )); const chars='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'; let out=''; for(let idx=0;idx<part.length;idx+=3){ const a0=part.charCodeAt(idx),a1=part.charCodeAt(idx+1),a2=part.charCodeAt(idx+2); out+=chars[(a0&0xfc)>>2]; out+=chars[((a0&0x03)<<4)|((a1&0xf0)>>4)]; out+=isNaN(a1)?'':chars[((a1&0x0f)<<2)|((a2&0xc0)>>6)]; out+=isNaN(a2)?'':chars[a2&0x3f]; } return out; };
	})();

	async function getSignedQuery(params, bodyObj) {
		const merged = { ...getBaseParameters(), ...params };
		const qs = buildSearchString(merged);
		const xb = new XBogusUtils(navigator.userAgent);
		const [withXBogus, , ua] = await xb.getXBogus(qs);
		const bodyStr = bodyObj ? JSON.stringify(bodyObj) : '';
		const xgnarly = XGnarlyEncode({ queryString: qs, body: bodyStr, userAgent: ua });
		return `${withXBogus}&X-Gnarly=${xgnarly}`;
	}

	// ================= 抓取：search 分页 + detail 并发 =================
	async function callSearch(cur_page, page_size) {
		const endpoint = '/api/v1/oec/affiliate/seller/invitation_group/search';
		const queryParams = { aid: AID_FOR_THIS_API, oec_seller_id: OEC_SELLER_ID };
		const body = { page_size, cur_page, invitation_group_status: 1, search_params: { filter_accept_status: 3, query_items: [] } };
		const signed = await getSignedQuery(queryParams, body);
		const url = `${BASE_HOST}${endpoint}?${signed}`;
		const resp = await fetch(url, { method: 'POST', headers: { 'Accept': 'application/json, text/plain, */*', 'Content-Type': 'application/json' }, body: JSON.stringify(body), credentials: 'include' });
		const text = await resp.text();
		try { return JSON.parse(text); } catch { return { code: -1, raw: text }; }
	}
	async function callDetail(invitation_group_id) {
		const endpoint = '/api/v1/oec/affiliate/seller/invitation_group/detail';
		const queryParams = { aid: AID_FOR_THIS_API, oec_seller_id: OEC_SELLER_ID };
		const body = { invitation_group_id: String(invitation_group_id) };
		const signed = await getSignedQuery(queryParams, body);
		const url = `${BASE_HOST}${endpoint}?${signed}`;
		dbg('detail fetch ->', { id: invitation_group_id, url, body });
		if (DETAIL_LOG) console.log('[合并][DETAIL] fetch ->', { id: invitation_group_id, url, body });
		const resp = await fetch(url, { method: 'POST', headers: { 'Accept': 'application/json, text/plain, */*', 'Content-Type': 'application/json' }, body: JSON.stringify(body), credentials: 'include' });
		const text = await resp.text();
		try { return JSON.parse(text); } catch { return { code: -1, raw: text }; }
	}
	async function fetchAllInvitations() {
		let hasMore = true; let curPage = 1; const result = [];
		while (hasMore) {
			const pageData = await callSearch(curPage, PAGE_SIZE);
			const list = pageData?.data?.invitation_list || [];
			result.push(...list); hasMore = !!pageData?.data?.has_more; curPage += 1;
			console.log(`[合并] 页 ${curPage-1} 获取 ${list.length} 条，has_more=${hasMore}`);
		}
		return result;
	}
	async function fetchAllDetailsBatched(ids, concurrency = 8) {
		const out = []; let idx = 0;
		let done = 0; const total = ids.length;
		async function worker() { while (idx < ids.length) { const my = idx++; const id = ids[my]; try { const detail = await callDetail(id); if (detail?.data?.invitation) out.push(detail.data.invitation); if (DETAIL_LOG) console.log('[合并][DETAIL] ok ->', id); } catch (e) { console.warn('[合并] 详情失败', id, e); } finally { done++; if (done % 20 === 0 || done === total) { dbg(`detail progress: ${done}/${total}`); if (DETAIL_LOG) console.log(`[合并][DETAIL] progress: ${done}/${total}`); } } } }
		await Promise.all(Array.from({ length: Math.min(concurrency, Math.max(1, ids.length)) }, () => worker()));
		return out;
	}
	function buildCache(invitationDetails) {
		const invitations = {};
		for (const inv of invitationDetails) {
			const id = inv?.id; if (!id) continue; const name = inv?.name ?? '';
			const productIds = Array.from(new Set((inv?.product_list || []).map(p => String(p?.product_id || '')).filter(Boolean)));
			const creatorIds = Array.from(new Set((inv?.creator_id_list || []).map(c => String(c?.base_info?.creator_id || c?.base_info?.creator_oec_id || '')).filter(Boolean)));
			invitations[id] = { id, name, productIds, creatorIds };
		}
		return { version: 1, updatedAt: Date.now(), invitations };
	}

	// ================= 回填逻辑 =================
	const GROUP_LIST_API_PATH = '/api/v1/affiliate/sample/group/list';
	const APPLY_LIST_API_PATH = '/api/v1/affiliate/sample/apply/list';
	let invitationCache = null; let groupCreatorMap = {}; let isExpanding = false;

	async function loadCacheIfNeeded() { if (invitationCache) return; invitationCache = await loadCompressed(STORAGE_KEY); if (!invitationCache) invitationCache = { invitations: {} }; }
	function processGroupListResponse(responseText) { try { const listData = JSON.parse(responseText); if (!listData || !Array.isArray(listData.agg_info)) return; listData.agg_info.forEach(item => { const groupId = item.apply_group?.group_id; const creatorId = item.apply_group?.creator_info?.creator_id; const handle = `@${item.apply_group?.creator_info?.name}`; if (groupId && creatorId && handle) groupCreatorMap[groupId] = { creatorId, handle }; }); } catch (e) { console.error('[合并] 解析达人分组列表失败:', e); } }
	async function processApplyListResponse(responseText, requestUrl) { try { await loadCacheIfNeeded(); const groupId = new URL(requestUrl).searchParams.get('group_id'); const creatorInfo = groupCreatorMap[groupId]; if (!creatorInfo) return; const applyData = JSON.parse(responseText); if (!applyData || !Array.isArray(applyData.apply_infos)) return; applyData.apply_infos.forEach(product => { const productId = String(product.product_id); const creatorId = String(creatorInfo.creatorId); const handle = creatorInfo.handle; const name = findMatchedInvitation(creatorId, productId); if (name) renderTags(handle, productId, name); }); } catch (e) { console.error('[合并] 处理样品申请详情并匹配时出错:', e); } }
	function findMatchedInvitation(creatorId, productId) { const map = invitationCache?.invitations || {}; for (const invId in map) { const inv = map[invId]; if (!inv) continue; const hasProduct = Array.isArray(inv.productIds) && inv.productIds.includes(String(productId)); const hasCreator = Array.isArray(inv.creatorIds) && inv.creatorIds.includes(String(creatorId)); if (hasProduct && hasCreator) return inv.name; } return null; }
	function renderTags(handle, productId, invitationName) { let attempts = 0; const maxAttempts = 40; const interval = 500; const id = setInterval(() => { attempts++; let creatorRow = null; const rows = document.querySelectorAll('tr.arco-table-tr'); for (const row of rows) { if (row.textContent && row.textContent.includes(handle)) { if (row.classList.contains('arco-table-row-expanded')) { creatorRow = row; break; } creatorRow = row; } } if (!creatorRow) { if (attempts > maxAttempts) clearInterval(id); return; } let expandContentRow = creatorRow.nextElementSibling; if (!expandContentRow || !expandContentRow.classList.contains('arco-table-expand-content')) { if (attempts > maxAttempts) clearInterval(id); return; } let productDiv = findProductDivById(expandContentRow, productId); if (!productDiv) { if (attempts > maxAttempts) clearInterval(id); return; } if (!productDiv.querySelector('.invitation-name-tag')) { const tag = document.createElement('span'); tag.className = 'invitation-name-tag'; tag.textContent = invitationName; const msgBtn = productDiv.querySelector('button[data-tid="m4b_button"], button.arco-btn-icon-only'); if (msgBtn && msgBtn.parentElement) msgBtn.insertAdjacentElement('afterend', tag); else productDiv.appendChild(tag); } clearInterval(id); }, interval); }
	function findProductDivById(expandContentRow, productId) { if (!expandContentRow || !productId) return null; const idPrefixes = buildIdPrefixes(productId); const candidates = expandContentRow.querySelectorAll('div[data-e2e="3a7ad23a-8136-80f2"]'); for (const container of candidates) { const typo = container.querySelector('div.arco-typography'); if (!typo) continue; const digits = extractDigits(typo.textContent || ''); if (!digits) continue; if (idPrefixes.some(prefix => digits.startsWith(prefix))) return container; } const allTypos = expandContentRow.querySelectorAll('div.arco-typography'); for (const el of allTypos) { const digits = extractDigits(el.textContent || ''); if (!digits) continue; if (idPrefixes.some(prefix => digits.startsWith(prefix))) return el.closest('div[data-e2e]') || el.parentElement || el; } const allDivs = expandContentRow.querySelectorAll('div'); for (const el of allDivs) { const digits = extractDigits(el.textContent || ''); if (!digits) continue; if (idPrefixes.some(prefix => digits.startsWith(prefix))) return el.closest('div[data-e2e]') || el; } return null; }
	function extractDigits(text) { return (text || '').replace(/\D+/g, ''); }
	function buildIdPrefixes(fullId) { const id = String(fullId).replace(/\D+/g, ''); const lengths = [18,17,16,15,14,13,12,10,8,6]; const set = new Set([id]); lengths.forEach(len => { if (id.length >= len) set.add(id.slice(0, len)); }); return Array.from(set); }
	async function processAndExpandRows() { if (isExpanding) return; const icons = document.querySelectorAll('img[data-e2e="1d3438e3-7ab1-0af5"].rotate-180:not([data-expansion-triggered])'); if (icons.length === 0) { alert('没有找到新的可展开项。'); return; } const controlButton = document.getElementById('control-button'); controlButton.disabled = true; isExpanding = true; for (let i=0;i<icons.length;i++){ const icon=icons[i]; controlButton.innerText=`展开中... (${i+1}/${icons.length})`; icon.dataset.expansionTriggered='true'; icon.click(); if((i+1)%10===0&&(i+1)<icons.length) await new Promise(r=>setTimeout(r,1500)); else await new Promise(r=>setTimeout(r,300)); } isExpanding=false; controlButton.innerText='全部分批展开/重新扫描'; controlButton.disabled=false; }

	// ================= 注入按钮（仅 affiliate 页显示抓取相关） =================
	function addBtn(id, text, bottom, handler){ if (document.getElementById(id)) return; const btn=document.createElement('button'); btn.id=id; btn.textContent=text; Object.assign(btn.style,{ bottom: `${bottom}px` }); btn.className='tm-fixed-btn'; btn.onclick=handler; document.body.appendChild(btn); }
	function injectAffiliateButtons(){ addBtn('tm-aff-pull','拉取最新定邀详情（全量）',100, runAllFetch); addBtn('tm-aff-export','导出缓存JSON',60, exportCache); }

	async function exportCache(){ try { const cache = await loadCompressed(STORAGE_KEY); if (!cache) { alert('没有缓存'); return; } const blob=new Blob([JSON.stringify(cache)],{type:'application/json;charset=utf-8'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=`invitation_cache_${new Date().toISOString().slice(0,19).replace(/[:T]/g,'-')}.json`; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url); alert('缓存导出完成'); } catch(e){ console.error('导出失败',e); alert('导出失败'); } }

	async function runAllFetch(){ try { console.log('[合并] 开始拉取'); const list=await fetchAllInvitations(); const details=await fetchAllDetailsBatched(list.map(i=>i.id),8); const cache=buildCache(details); await saveCompressed(STORAGE_KEY, cache); alert(`定邀拉取完成：列表 ${list.length}，详情 ${details.length}`); } catch(e){ console.error('[合并] 拉取失败',e); alert('拉取失败，请看控制台'); } }

	// ================= 网络拦截：用于回填 =================
	const originalFetch = window.fetch; window.fetch = async function(...args){ const url = args[0] instanceof Request ? args[0].url : args[0]; const resp = await originalFetch.apply(this,args); if (url.includes(GROUP_LIST_API_PATH)) { const cloned=resp.clone(); cloned.text().then(processGroupListResponse); } else if (url.includes(APPLY_LIST_API_PATH)) { const cloned=resp.clone(); cloned.text().then(text=>processApplyListResponse(text,url)); } return resp; };
	const originalOpen = XMLHttpRequest.prototype.open; XMLHttpRequest.prototype.open = function(method, url){ this._requestURL=url; return originalOpen.apply(this, arguments); };
	const originalSend = XMLHttpRequest.prototype.send; XMLHttpRequest.prototype.send = function(){ this.addEventListener('load',()=>{ const url=this.responseURL; if (url.includes(GROUP_LIST_API_PATH)) processGroupListResponse(this.responseText); else if (url.includes(APPLY_LIST_API_PATH)) processApplyListResponse(this.responseText, url); }); return originalSend.apply(this, arguments); };

	function initialize(){ if (isAffiliate) { injectAffiliateButtons(); } const controlButton = document.createElement('button'); controlButton.id='control-button'; controlButton.className='tm-fixed-btn'; controlButton.innerText='全部分批展开'; Object.assign(controlButton.style,{ bottom: '20px' }); document.body.appendChild(controlButton); controlButton.addEventListener('click', processAndExpandRows); GM_registerMenuCommand('分批展开全部', processAndExpandRows, 'e'); GM_registerMenuCommand(`切换调试日志（当前: ${DEBUG?'开':'关'}）`, () => { DEBUG = !DEBUG; alert(`调试日志已${DEBUG?'开启':'关闭'}`); }, 'd'); GM_registerMenuCommand(`切换详情日志（当前: ${DETAIL_LOG?'开':'关'}）`, () => { DETAIL_LOG = !DETAIL_LOG; alert(`详情日志已${DETAIL_LOG?'开启':'关闭'}`); }, 'l'); }
	if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', initialize); } else { initialize(); }

})();
