// ==UserScript==
// @name	Lap  Mod
// @author	googleGuard
// @version	1.0
// @description 贴吧笑舔狗头增强版
// @include	http://tieba.baidu.com/p/*
// @include	http://tb.himg.baidu.com/sys/portrait/item/*
// @run-at	document-end
// @grant	none
// @namespace https://greasyfork.org/users/2580
// @downloadURL https://update.greasyfork.org/scripts/6323/Lap%20%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/6323/Lap%20%20Mod.meta.js
// ==/UserScript==

/********************************************************

	Fork 自 googleGuard(谷哥卫士)
	http://tieba.baidu.com/p/3394607066#59935076172l
	
	Platoo·Young(柏拉图样图森破) 2014-11-8 14:49:29
********************************************************/

(function() {

	'use strict'

	var Editor = document.getElementById('ueditor_replace');
	var Face = document.querySelector('.p_author_face>IMG');
	var LapContain = document.querySelector('.j_draft');
	var LapButton = document.createElement('DIV');
	var cssText = '.d_name:after{color: red;content: "舔";\
    cursor: pointer;display: inline-block;padding-left: 5px;}';
	
	location.hostname == 'tb.himg.baidu.com' && (function() {
		var Img = new Image();
		Img.onload = function() {
			var Cvs = document.createElement('canvas');
			var Ctx = Cvs.getContext('2d');
			Cvs.width = this.width;
			Cvs.height = this.height;
			Ctx.drawImage(this, 0, 0);
			window.parent.postMessage(Cvs.toDataURL(), '*')
		};
		Img.src = location.href;
		return
	})();

	if (!Face || !LapContain || document.getElementById('LAP_BUTTON')) {
		return
	};

	window.addEventListener('message', function(event) {
		var LapImg = new Image();
		var Cvs = document.createElement('CANVAS');
		var Ctx =  Cvs.getContext('2d');
		LapImg.onload = function() {
			var Img = new Image();
			Cvs.width = this.width;
			Cvs.height = this.height;
			Ctx.drawImage(this, 0, 0);
			Img.onload = function() {
				Ctx.save();
				Ctx.rotate(-Math.PI / 100 * 10.5);
				Ctx.drawImage(this, -95, 154, 110, 110);
				Ctx.restore();
				Cvs.toBlob(function(blob) {
					var tbs = new XMLHttpRequest();
					tbs.open('GET', 'http://tieba.baidu.com/dc/common/imgtbs', true);
					tbs.onreadystatechange = function() {
						tbs.readyState == 4 && (function(t) {
							var f = new FormData();
							var x = new XMLHttpRequest();
							f.append('file', blob);
							x.open('POST', 'http://upload.tieba.baidu.com/upload/pic?tbs=' + t.data.tbs, true);
							x.onreadystatechange = function() {
								x.readyState == 4 && (function(u) {
									var i = new Image();
									i.className = 'BDE_Image';
									i.src = u;
									i.setAttribute('unselectable', 'on');
									i.setAttribute('pic_type', 0)
									i.height = '260';
									i.width = '186';									
									Editor.appendChild(i);
								})(JSON.parse(x.responseText).info.pic_water.replace('/tieba/', '/forum/'))
							};
							x.withCredentials=true;
							x.send(f)
						})(JSON.parse(tbs.responseText))
					};
					tbs.send()
				}, 'image/jpeg')
			};
			Img.src = event.data
		};
		LapImg.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALoAAAEECAYAAACfuS5AAAArxElEQVR4AezSsQ3DIAAAwU9Eg1KkSO3OY7Ctp2AUS8hyBkgFpQVZI0F/M9xtjPEGXsDFfKQAfALwBB5I87ruIM3P6DK6ZHTJ6JLRJaNLRpeMLhldUzC6ZHQp8HNUa2Xfd47joJRCa40YI+u6klJiWRb+ktHVe+c8T3LObNvGlx2zCYUvCsP4M+NDyEeSCSUW8jFRbKxs7BBLUoooWchGsrERlkqKko1kI8pHuhYUIjsKKWtSRpG7MDb0/E9v/Ut37q2ZYbp36vzqLM87897znPd93nNzc4OPjw/8xOfzoby8HO3t7RgeHkYwGESyQhJfX19ITU2VvBKNj+Q7gDy4hsYwDMzNzeH6+hqvr6+IhkAggPHxcYyMjCAjIwPJgGma2N/fl3xDoZB0qpycHJSWlqKqqgptbW2or69PhPBNkHynK2jC4TCnpqaoDpsA4loTExNU3YBe5vv7m7u7u1S2iykpKY65FBUVcXBwkOfn53+d07tLQteoasbe3l4C+NXy+/1cXl6ml5mdnWVaWlrUOakOJQVAdbc/E7oL1kXz8vIilmNzcxNO5Obmora2FqqlS3t/e3vDxcWF+HgrBQUFODo6QkNDAzyE/OfJyUmsrKyIH4+VyspK9PX1YXR0VL6Bti5JVsm7u7sdq1l6ejrVwfLq6orq9YU/ub29pfKwtvtmZmboJT4/PzkwMEAAv15q8NbWJdmYnp52PNC6ujpubW2Jp3Xi8vKSZWVlEXubm5vlYniFhYUFxzyzsrLY0dEh9qSnp8eSj/3lX1tbSxaha7a3t5mdnW09SPGvQ0NDfHx8ZDSsr6/LHksMGfi8wNPTE5XtshVtY2Mjlc2isjL8z8PDA1dXV9na2mr3fWQVFhZSWT2PC10jrbypqenPWnNXV5c1jlRHL7ywKF9tm2dLS4uIms575cVFdSfb/Wpu4fHxsZeFrjk4OLB9eQgGg1QDJmNlfn4+IlZNTQ1DoRDdZGdnR15NrP+turqa9/f3jIbn52eqwdpW7P39/VroXsU0Talm1kMrKSnh6ekp48EwjIh4mZmZPDs7ozuIQG27VnFxMU9OThgLh4eHDAQCEbEqKirkd7TQLXh4MPvVgHV3dydDnTXm4uIi3WJsbMwuT+k+8bC3tyeX1xpvaWkpZqH7oUko4XAYGxsbsKIsCzo7OxEv+fn5yMv7x7754ioTBEG8JIID4LFIMJAQHBIuwEm4CPcgJCgcwZCAwBMMCByKgPmqRm2+bsXOmx0xv+SZMi+T9NJ/utquP67XK5rgfr+DEyN3HzCdTvELnMxgPp8bXTYCeYMysukW2FzhcDgYnSk+BOqvaIHClbm7jGoC+XRut5vRZUBjfY5fWSwWRjsej3J25hToBY4Uza9Pq9UKG786tNttdDodo8sU1gTr9dpocloul0vUYTKZYDQamY+ZvU0ugV7Q2vtyuRidjSnG4zFqIIefmxFerxc+nw9SIlsCpy1G54SktpWYNbprbeCWuAR6Rl4PN53PZjNEwLXncl6P7/eLlKhmfjweqKJsQ6sDYsDplNH0/zIK9FKfc9tpjEpqsmLAubybRbh4QSoUcKvVyq2tVZtHwO1Fns8n3u93DoFe2O12RtMpHOfKf3q5k5LtdguOOo3O7SZioZ7mP3R9VQI9k7GiW0cOBgNEwh2x0Z8e6vdUbDYbt1GWvTgWeo/zdn3UTQd6gZ6OcOBcRc1jv99HJNxanE6/cIeZAvUf+/3e6MPhEN1uN36Wsu9sOtAL5/M53EVW6fV64S8Sajzd+bqCIAWn0wlcxxudTkzwZC5qdvTe+Y+9M0ZVIAiC6FxBxFgw8AKC4AEEAxM182gewhuYGIkXEBQzQ0FTsz8vLSr7PbsTTMFP/yJb29NdXd2DItMz0Rvu93tSEOV4OUFRjjzV5rOQrAvcbjc7FRSRn4tkatOjCiJ6gyFB6HFOIfb9fm2k6wKkTdmo5aRTVJJwZUcgBX0vRG/4fD42oo/H4xQFovn7/U6K4XCYugDzq6IqUYPQ8Q1XkZ7PZ1JMp9O+id5AG578XAERAiM6G73soHRXsqIOPM/n85Q98SkSnFoU9qosTSaTRvQKOqJEdZXIcPKFEp1i1B/pZcHiIbYOKJbLJfVBuCtSHZmDwYDTsRG9b/ByVClACclzj6GRTonOx5QHEzqJ5nlIW0+StF6vUzTyIIkGDZQr6p1G9L6Rh4OtLyUP/obWAZo6UIiyqq408hC2att8YPwVIbpiNpuhXlVA9LagyLrwIHtkRHf5Ocd6SbxeLwrRpIDkSJuRoNhm2aojOuiX6A0YjmwhCtmDYItdyFY4orPt1w09hGvn4Hw+Y3NWVyTPqoTobb+5Gykj4hVNj/IiIH1GOC6XiztJ8Nd3NcxBwV0D0Rt+v18SkJ9TkIYWvF6nL7rD3WnarHoONXEBrAXYnM2pRUe0AqI3WNkPouMfD/r/GKrswHVpNenxeNgh5si0DNB15bYPhU4b9UT0BoYeHNEjiUADJS8D0q0A2qwpkjNTjGq6tNvtilyOoBiNRmm1WlVC9EZ0Z58Ntc4ytURTCgDArRGlC9G8VCgpFotFeMqEbIrFWYHFmdZ/I3rFRI/sGKJEyDNooNCQKuqvz3sPk2K73aZo8Ps4sQScHEi0jei1XEIF2RWBUz92TwzdQjwgpcClBVoXUBjS9o/G4XBIWHM1mm82myruGW3whI42OTnlg9SlqCWXSX9nOw5uUFEDuPE8Cl5kzEb0mkBkNZE+3uQkjZSSW7iu12tSIClGA5KTJqm1QXw0jegVkNwWnmjQUQ0bLUTR52mklMLxeFSTGjVHzNoOKbLzQlK3vg9ZsRG9IkAAiGeVhEKdSYrQkhGdXYdWAWFVXCDY9uWKUJQdUsJG9IpANLdED9iexao5SwSuTCdXLjREYptEbMhlbjMSp9MpKfJq7JSvfEmgEb0q+OYQRz/pyz/9LW5ZEJGVZxaz5LJbUT+s/X4fLik6S+5fe2f+K0Va9fHnNe+PJu+PJEYTYyBxwYCLgIsQUHEJICiogCLIgrJgWGZkHIeZMDAyCoIs4MK+eAFFQERUxB0VEdCoCIKDGpeQmDj8Bc97PpWcpHn6qV5uV3dVdZ1vUum+fZtLL986dZZzvmfOnDlYdCN68ZCuLIVF7tCHJesS1VHpVrZFFoO5EFjYrAPRI0eO1MUeuGQLFy50wIhePFDU6ArRybiEVwXIAOm6gatXr4aNVfjK5LMzV+M9efJkNKUoW+yKSnRDxHdlzrJTotPkFC0UMSjcjcIXG5/D2GLcuHGJZnmW2LlzJ2SvExb9xCc+4YARvZjAykZ71BlozjrjMnHiRAK2rgxYDAwMuBCy9hHXLNPmLYgeAtkMdCqN6MVFrIJHj3pHFp0iCmNloYuEde0Gjh8/zmuuqxHQe54l9u7dG+3fz/p9Za9GaYhNwEByvtDUbj1Z0YgfT4svbo7e58Avp7+FrEvY444PzWibpjbJ45OB4Xe1BycFLhX3m+akSSdiaUE3tSOvX7+eXDlCjBw5kiKREb0MRGfIota/5T7Saihp0auCkheldR7jINAko0IakpOCxjAI3kw/5tFHH03tuYH4HEp8XCr6x1/84hfTkEX/Oj9TbOIqpK0LaLZE516XLl2aqQgTGR3eb3jVWLduXfaKY7ZnNHvcvHnTC3Ee2o0pX6AXa+glcNTdmbkfvCZeJxunpd3Wb9682Uvzlh8/fnzdc1/96ld7OSF9VpCrhpcTru7/edvb3pask88Yz2ds0U38H+vMZT90U7DOFEWKBF4TVwUORFHpaUkDhRssf5a+eTitxFVwyZIlGuwWxXUx4FejWMWIGbcUdDggTj+BlOLixYtdViBnLtu0XYgFCxboIEfORDeQIqTfhNQbPdqMfOFPZ94YRvDIgUwGbaoaUGL1+D23+OH4/rwmgleuKFxJCGY5eDyL1/ahD30oMzlqXufnPve52FytFqJyJLpNDRGcMWXDGnA2PWDNO66eEnARuOISMHfJzCfBIQfEqs2UEFBqcAnRdVcRGRslOyTnvmZtyN2jGkZqEvkIAl4yNDzGVYcTo0lXJa8xS3Ei+trJtsQkM8ib50F0A3nrY8eOsaYFHxafEtK3XTxioJcMxytf+Up2ZkIeKn8cWGwKPoNuQ63NrLQqlcEJwMnAycsB8RmTkyCa6iuPJdmVMWPGsEYxMxkNTiqKQ+FnyGewZcsWlAx6RXQDFhGBe1wTlKLa9bdp0YUYaIVzYKWGDh0KEYvSWcnBSRZrHSDFqURHXiLL0UCuhgS80Sro29/+dgd6QHSb3ieg3LNnD1YcwrfVrcggAkUOAjcOrFQZgVXl6EZf+9atW6MSc2RaugsjOhYbvRIsDbfIMbcULNIxiCvCdmTJ/WK903tODGRZonOnq1evTj7DLsEKRpIG9Bs3bvRC2JYLLDJp7z/+8Y97EcL34uP61mCQZjQvrlDd5ylbtL1cOX2XYAUj0oJr1qyJqkHFgOVm2xp53sG1xNoqykiWKui7Mdcls6olPRwM4J46dUoFclJBqo+sw+zZs3FNOtAUMaTFK3wfH/vYx+ihIWjvlPTmukia0E+ZMqUl94RelN27d3tJt3kJUL2hc4g1j/bP6CHFLy++upc6QNdcl74mukT6fsOGDV6sc0v+9yOPPOIlj+wN2UOKRH7EiBENv4Nnn33WiN4upBroRd2pKcGxJtLH4aUg5A3d/04k1kn9LqQG4aXt2Esu34jeSvvnsmXLtAU09ZCiTmLtRZzHS8XO9wYGSLxp06aG34+0A3hJRRrR0yCaJ16mxpta8Q9/+MNeej98vjBXRgpsDcmOETKi1wCLLA1XXtRdGxKcAQORJNbGfkP+SYJG3xm/o2ZhRFcrLhrd+NqpH5goS/nPf/7zXqqe3lAsyBysX79+vRdJveh3J+0V/sknn6w20am4yXLVVIJLXtbLloRktM1QbEgDnZcem9SEwf79+6tJdJFjICXY0FWhxE+J2VAKcNVN/S6liuoPHDhQHaJTxOHsloGEVCuOlReVKSN5ycD3xfc2bNiw6HfLUPmOHTv6n+iyG95LyZjp9dQzH3+OCpuhvJABFy/C/6lujAxv9C3RefMNy/h8AI899pgXTRRvKD9kA56X4ZBUN0ZUBPqP6NIz3rCihqty4sSJPutNMYi6gpdmr+h3TuBKT5JIdvQH0UVl1cvETirJRavbywyk708Y+G5F2DT1+5fxvPITHXdFxCZT3+SECROsCasCEOEnL2oJqa0c9CmVmujSC55K8hkzZiTFBkM1QDo5Lc+OjB1yeaUjOj65rPQgVRh9YzRtWWalepAdR2hARjnBlf/+/fvlIboI7/h58+alWnJmNkWsx1cXVkFNM4B0RZaG6I8//ngqyekbt4asaoPMGsYuxg8GbLD6hSf64cOHOVtTy/kGA5D5XwxilCsi50cOvrhEJ7IWcfooyWV5q8lLGELLTqyW2o4tyxaKR3SmTmTpVPRFy5qPZGrIYIi1hIgUSZQ3q1atKhbRKdmn+VyQXNaf+LJBtAsRSLJ4ogfYtWtXtPeJzla8hMIQndJ9jOQimewvX77sy4YLFy4kLpgo5iYuFwPB3YXh6aefjnJo7NixKEHkT3T8blFRjb5IEZ70ZYOIInnZW//Q+2AvkKH7PKIXKq2bNW+i8yKiLw6ZCtHsLmUTkgiQPvReZFuE7wlsQRruSqz5i7nT53NbqHvkyBEnchPRfTkHDx5MtLnLhnv37tWtUuHn7sPAooVFixZF9d4lNe1yITprRkSVqY4EyC6Lv6U7JksH9oeGYEVLnmAJLytdqgCpqCMIG13c+4K8rLlM77sQIiPMvpyy7jkKV5gDNkvktrkD4X02SSCSyn0e62eI2gPLeFl1U7cgrOc+OpITsdwnvhQVrbJCVn17sd5174v51jyAjmH4Wp555hlfBTzxxBPhe++9j45sM0uhQixfvtxJB5orI/ADRZuEJVjRzRh5ILb5ja16WLd+x8qVK5H8zk8fnSVQkuB3IURllT02PXMx2I7GdjY003Unp95n1Yu0e6Kfrr9jrSH/hkPjCrS8OZLlXDIF5STnH93Pw0a6PBDzVXGtWEQ2efJk188QMSQ3a9YsJ7o/TvE/uC5y+3+uB5CyLL5i3b7Ns2fPOimuuCwBQaWTzUn7QLK2XMrFHFhdPSA3B6RXMicnQhbgBBD5u2TjWh7gZJVhcvYG1e3zPH/+vBORT9fPYIM3GTwyYYIHPSM61gTXJFyGJQUWVoxrAJEJ2Lm/YsUKJz6/ywtcoUSDJFl8mxdOnz7tZBKrLrslQy18PpzUHA9doTgU+tr1Mf19C89P/TdqBLC6bL/uJnAnpVbTW6JLIOSktdKFWLt2rfvsZz/rsgLWeebMmclVIi+w70iEeHKvBUgfUfJapGDiFEo41q0QQ4REb5fM8ec2/nusqxw+fLiTxQtO+plcl4BLiXFlWfCDnmRdULtlkDnWeJOxLiLtmfQk8/d7elARRYdEXJWkqasoOHToEK+vkMd73vOero9EihHl/+rNVjrRuXZXrlyJZlqoaGUJ9uqLylOy/74RNJCkSEWBimVcWDk2JuvacramUfBh0zKxBLdcbvm3GtRiNfmZXf68F3K5WL2iAD8dvxzXsWi4ceNGUtCSJjjXLVAtZWN1T4jOstowrcVO/GnTprmsAUFpLSAYxUeHnOzjl6sHWZDkRBCL70R7G3JDZDYlQ26IrbFC34D3Rrpt/vz5TsR+XJGAUel25ZjvWLR/uk90ol7OqBAf/OAHu5Z6w/8jECNfD3EhOgdEriJkwwckZ/U7bQpchdQ3f4j8+hi3HIrweeFzw+foFY8DhH+T74QTkNWLfC/dBhm9rgejWFepVLlaYE1ZR84ly9A74GpRJyBgD4nKrR4gTtTm/yb6/OA+ROfK2qP2CN7vg//t9hJbGURwIWTnpJE8B0AwyFU14L6+oNtlaAKOEKNGjXIGQw/RXaLLhgIuG+H+dyN6/8CILhNC7tKlS9EeDNlo4AyGnrpt3ew1oMckhBSOkhRgUUCPCwd5co7mMMhuf/eTn/zE3bp1K+nOpPpIqrDQIOvSq4qc5DTZCFwYSQq0P+SL8pLiSnrkP/WpTzWZVTXI0IyX4thD3ys/83hOyFcfHdLE9MyLooI7d+7caFma121IF4CVGkX0c+Nxfl9QdGfwglzp73//exfizW9+c1J2zxsUkgYGBlwMtLDiytTDQMxFZ2gEPM7vqxWM/vnPf3bXrl1ztaBjTTY8uyLgt7/9bSqZb9++7UQdzNXDcPTo0ea/rxLR6TGh8b8WsnSJozBN+Q2GinUyxRAMGDPE0Qj8nudVhuixTjk6+7DqRYAsEnCNwHBIPax9gNnYRuD3PK8SRKdrENcgBA1cBUGz5q5ImdxAbNVskITf87wqEB29FgLRQhOdnvE0kEtnvM9Q3y/SrKLN73leJYhOEQGrXguGFWR9nisKZOFTanGIqm18GMRAa3Xrv68A0WMN9vQdFwW0IchqRxcDUhDxk8CA4hfTShHwOL+vRmWUddXMAYbFhNGjR7N3pnBSw+xMYkcly1ol9cnPTVbIGH7xi194qYfUfr/8zOOFroxmOnhBDwT6iWFRQaSTtUBTOCAFQYcl/Tetz3paqhEhJNnYTK8L+o5Fn97KdvACdSuUcgMUesgCyYcXvvCFztBe1goXj6OS3YtIzkH2EGh3FNBle0gRoGUYrE1X9sUweFt39jN9XwQwvFt7QHZIjlXn4D6HwYjetFgUEXzMU9gfMnPgi1Pep3LHLYfOUZJlodDBffx0I3tjGNER7owICvWa6GqtITfE5qCJi6CTQ/sxIDc5fhUqUsIb0ZvDXJcACAeh4dETyw3B1XJz1JKbkxCpB56DqA1FIYJQToLnnnuOW14nLkzb2ReDEb3b1lzJzaGWm6YtyE1gTKMRP9NQRumfDBD3lcwQm7iCg8ex6o1VXg1GdCxmiCFDhnTN5+ZQy80thIbYEBz3A8JivTnZkMCD1BFAcOZbcV/Ip0N2s+pG9MZ59JjrkgWU2Eru0HJTrOJn3A/6atBXhLAQvoUmL9wX/g7ujBWPGsOIDvliWZdBQi037om6FxyQmwyPbq7g9ypxhuVuO5iE2JwgnCz05OACabrRYESvIyUEDIBK7aCCSg5NBSq5yZZgdbHc3KcllPZfyN1pIxYnCWN0/G1OLs2xG4zooc4i/nGo9QfR2ya26o7zN2sXavFcXCH8fiwvvjWWNwsQpP7jH//gPeDX499zGNmN6A9DLW4wlQIZ08kdSQfyN/QW0kF4gkR6yAkqu+VS4JPz9+nV4f/ndXOiGtGN6LVQotY1TEGWkOBYbLXeoeXmlschGEElEtO4JfytboOtFRCdk5YiUqgRbjCiK4FDK1k7kAypNQ2oez7V54bMuCOsBYRkuWyf4MqBVedKQvYlPMEMRnTNjtTtCcLKq/8OuSE1U/ZkS3Sg9uUvfznZmUKQiteBr65WPQxyDWbROWL9Lyjr0sJL+g6LjrWkYR/XpGjDtLweTkYOXivvqeo5dSO6VikhgqblggAVsSDdaUm2RDMmhSUPFp33RLxAbp33ZESvGNHD5ilNA/Iz7khQhGEZE9IRWO+ytL+SKSKnzlUIf533aI1eVSJ6bToQcuuB5cOa/+tf/8Ifx99G9iCZE+V+CUGuXv10iE4+veRENzQcjo5VKLnVCiUk5/f4tZCcx5A8IAddZnDVQuie9zF06FCyMWXuUzcwHB18wTHLjcUmc6IE55aAkowJuWeI3lck4L287GUvQxUYq67FI0s1lt110YmcmhK8VichufZ18zzITZWSQK2vL+c0id29e5cTvB9y6kZ0iB22vmohh1ssGj4qvSBYb6xbBaBBKe4ZmRg+ozIPZBjRIbRWKZkQ4ovVgIyuQLInWDQu3VUDadG//vWvXNk4wSG/BaVlJfp//vMfJThBV9L2SiGHL7Xi4PNQI1D2gQwjOpVLLs1kF0wXvJ7oEBuLri5eSa9sRnRUtOzLS9+dT1zyt7/9DWNQ0jSjIWnjMJI3Lx5hzWuterlgwD1vweE0QU1SqQTt1BR0zK48MLCBpTnRDWSfCEhJvVJjKBnRDRcuXGiF6AaGQcihE7hr6245YLhx44aT9e0tEt2CUjoZseiQvETBqOHkyZN0orbavWgg67J27VrSjarkpb1B2icU7ZnheRwqT60HV4jaQwtS/G2O8Hmq+ktfEc/lVhWA9Xf671Vyr+pgI8exY8faadM1UES7efOmLgvOC3ri6IkAyTkRtKDFraZCuc+iNPqTOOjf4ZaThCCb5/H7vi0Obty4kcEfI3q7vS8U1XIletA6HQq8tgK1+hAd0jPtRVYJLRv6mdhBJcu3Sl9buXPnDkHoYCaMDAySlBzaek1gHd03xVVg27Ztbv78+a7MkC15iN4OZs+o4f3vf3/fdzDS87R3794k8C4rOIG/+MUvDnZm1MDS2JUrV7r79+9TMU2snwaK6j+rZiN59507d7p//vOfrhaTJk1yw4cPr9W54eA+7ojqTOoB8bilhZpDc/kc/L/cZp7u1BHCkoLPnbRiJ0S3NOO8efOYj4WsDdUMvve973HpDAfGydzgAzfVyIHUSno9KThqiU5+eN++faktxvTp6GyB/j39t43wute9rrQrKX/zm9+4r3zlK52qABggDz3qBH8EdZA3dGfu3bvnVqxYAUn1BMHSs3gWErW0+5S/q3LWMVy6dMl9/etfj1rz8ePHu02bNiWr4FUVTRXSdBRSJQC5z61uFESxQbZ/uzKCDMuSJUvQEApPeiP6YASOSNNhrclUkMUIxUiPHz+ezJsCHoes5LanTp2ayYQWf3vZsmWMN0bToNu3b0+uOKBKy4Kx5FevXnUByCQNJhg1QHTcCyxk6CPzGAoCtScG+WoGWsaOHes6BeTmanHr1i0XAlfqS1/6kpK8UiCLdO7cORfDrFmzBkN0A+0AWGou+9rRqMCt0Vw7/jtWn3z1Bz7wAZSBO94osmbNmsT/D4FqAT77lClTXNWAW7h582b3u9/9zoWYO3eumz59evKk533bMPz617/2ly9f9uIXeiG8V+zevdvz2Yvf7sVt8JKp8ZKp8aJk5jvFoUOH+Nt1h7hO/uLFi76qkFRi9HN561vf6uUK6OF4BxbdfHUul+q+qMXVtBaBJM8hEMJHxE/vdOMfbkkMZIIQjqoixOC4DRs2RDcNPvHEE7Q4WMGoE7D1TsVIcV+4/5e//MX9/e9/h+QEqAnRx40b5yZMmNCxJDdf5i9/+ctoEeuZZ56pZEclBoZ+ljDLAiZPnuze8Y53WGU0CykMhslJy+lmaohO+k6brghCp02b1rE1J1e+detWB8Li0/79+5MgtIpYv369+9a3vhWNVzgBQEZEt45GXU2jFUwIzqEbPDrVf6eySrowBJfkdevWJSdcFUHgTQAags+dGsKwYcOyKhgZILJmXyA3Prr2jJO/RroPq94Jzpw54/74xz+6EKQq3/CGN7gqQpIA7tOf/nR03ecnP/lJN2PGDAcysugGKqJcJtGGh+T45bS/QnJSifiIpCI7SZudOnXKhSBluXr16sqOxiFJjqx3iMWLF7unn37ageyJbkEpQRFWHeuuww609GLRqZx2NCHDFxuCFlqC3KqBYtnjjz8OyWMD7NQY+Ly7QXQDaSyCUoJRXQODVYfk+PCd4Dvf+U5dmZ//i3RixUCQj1vCMEXUL8eSMxgDukh0q5Tq5A/uDOnEd73rXbgyHfVUHz582IVYunSpe8UrXuEqBJq1qPhGPw8s+cDAAGuEerGVzkSOcFsgIH0m9LXwWKeFEIR3wpQmgVaVQNclaUT6h2J46qmnkhSuossW3cRISTPituCzZ7FSMlYceulLX5ocVQFZFYJuJp5i4Ko5c+ZMB4zovRmcRuSI7ItWSjua+qGt4Fe/+pULwZWCk6gKoPhGLLJjx46ojAhWfM+ePQT/PSS6gTQjBM2E6Axu/OEPf3AhGKSoAlAvpnf/xIkTLgYKZQgT6dWth0Q3aP6c7EunYqSM6tHEFTuZqtCkRRwSOdG1h4UUowb6RvQ8NtnhvmDROxUjhejhFUH3SPVxTzm+OC4JU0JR95D9tUhx8FmA/IhuxSMVI6VSOmgt9X//+9/R3pZ+bd7ixF60aBGVTe5HW6I5CRhR1KtazkS3loAhQ4aolvqgrTrZhlhhiqPf8KMf/YgcOUROjWsoFH3kIx/pfM+oIVtfHfVW3Bfuq85Lu7njEDqE3U/4xje+gSUnW5VadX7kkUcSnxwUh+gGXAz6XnBfIPpglG1ji3txg7B4/VAAopJJlRPZOK5eqUEnxaDXvva1DhSP6FY8YsII94WBC9yXdoOnaK5chYzKDK50TEMhF9cI73znOxPpCtQWQDGJbtkX/HTUAGrlMNqy6lwVAugW79ISHLElpOJCmY5Q4BR/nGqo9vEXmOgGChnMjj548IAvDAvdFtFf8pKXRMU/aU99zWte48oAsk7kxBl140B0qRFQMWMudvTo0U5RDqJb6y5r//jC8UshOkfLy8Hw7/H1a8FVoujgKob+Ifnub3/727z/pustCTgXLFigjXBlI7qpeZET5otvs0rKScJBK0BYGi90Ky3TUOfPn0/6dLgCNQFiq6GyWNmIboCoqv2C+0J6kGxKqycJw71FJzoyE9/85jfptEzmOO/evdtSA9yoUaMSBYM5c+bocEpZiW7Qll2sOkEkUzBkX1rJqZMvx9p9//vfd7WASASlZHWKMNbGSB96h61ixIgRuCnMfAYnfemJbuvVCSAhOv4n2ZdWv2BG8Tgpal0eFhCgI1MAotM92DLJseDIOb/3ve+NatyUn+jWp86B+8J0UFtEJ7uiWuy1REf6gqxM3miUReEERQVh5MiRyHIwHJF9n471uhTLfcH6cpnH5SD7goVuNUWJoH+4kQ6fuAh44xvfGM0iQWyar65cuZLkzpcvX64k73Oi2yJe3TrRbpNXVNKCwI9e9ZyBqGl0ewdxCRLZaM8E6HOiW5oRyxdoqbcGiERLQbg/Ex3wvIGvPXHixOjuJhYPg4oR3fx0glLcl3BDRjMwaIGvG1YcyVUXAfSkEHOEKcevfvWrFSS6geAR/xyrzm2rRCdTEx000IJM3iAzxHKvAJT8yQ5VkejWukvWRYnehvsSHQAmn47AURHcF/QlI1VSpvgrSnRb26hrD9she1QxlzTj7du3XRFAdZNuzaDnnKtOFYluYGEXgOhtyGFg0WkSi5K9CGAwIkyDgh//+MdVJLpBV6lD9Db8dFoHoiN0RRrCICiNxBG4WBUkuhWPIC1BJJmTlnftM6gQCzwLtOkCUVVUxEIlA7JDFSW6FY90LXnL7suxY8ei43qvetWriiTzEV2r/rWvfY3hkwoS3Zq86ANp2U+njP7Tn/40GqAWTTpa9qm6APTlsFy4gkS34hEZCqxcUzWva9euoYVOQ1hozVmRXjiNF64wuGa14Mr13e9+t4JEN1DphOQNWwLQO6G8DtlDPProo0m7a9HAFYZ1NgEYp+PErhrRDUy609GI+wLJcWUUWPjTp08zCR9t3CLgQ/CnoDIfDIvE5J9ZIVlFolv2hVUwlMhxS7B2VBKRSKbrb/bs2VH9QYAsGyN6RQWT/CB0X4IRwCoNXlhQiv8NyfHRIT3pOO6nban+zGc+k/R2Fxm07hIoh2q4169fd+9+97urZtEN9GrTgktGgj1FWPA0kmPBUa1i1rLoIqOckJHiEYPTvL9qEd3Q+vYKmqaQg0AXPAauCPSmc7IUBUwY0bobWHSqpBUkuoFRNNJxqY1c27dvp4xet3GN3LvuONq4cSOa4pwIumQ2dzAIzdUq6Msh+1JVH91k65ilJCNBHwzbMhDyoe111qxZ0dXqEPy5556jYYoUJC4BKUqyOPTPFKYlmRFA5Ohq8cMf/tAtW7aM91o1oluacfPmze7nP/85aTmsOOSPNnDh39J//rOf/YyWACTfsJKagyfbwXBHoa5WAdhJRCxCu3LFiG4gS0H7LiNzKFZFp+rJyFy6dCmxiCyVRWYC90WDP1KSjz32WKGWBLz+9a/n/ZBJqtWNJBtTVaJbjzqFFtwXbike4bdzqySneMRoWtgKAMlxX3B1BguuCAih8v/hKmWlnoUbRnFLia44e/asmz59elWDUdNoVJH/2tZdgsuFCxfiqoQkB1RIOyI5QK+cVgOOXbt2ZakRH3OlyL4wPJ3b2rvnvSE3SBDppUPR/+lPf/LSFuCF8F7aALxM7pB4rjukKcxLtsUL+X0nEEk5L1cF/bteXA0vaUqfFWSzRd1rl6uV/8EPfuBzwPM5uy4GfGv8WSzdjRs33L59+9jUhh8e1YihF2bMmDGuE9BRiEBo7ZWCrA1uTEYgwKbAxZWqVqoDASZik6r66Na+y857SAwxUoC/3jHJKTI9+eSTkDzcSo27kWVBjL8ZihnR5FVlH932HhFwppGcbAwtACtXrnSd4syZM+S4o0POpDezAjUCZKIDEHtU2Uc3TJ06NeqTv+lNb/Kik+4lQ+I7hSzN8tIzXvd/DB061Evvu88aBw8erPu/JJXqpQbQcx+9IBbdIESv2zU6Y8YM2nfJrmiOvROQj49thSPlh0XvhhRGqKRL4Yu23aq6LgZ6WrTXnEs+g8WkFslJZ7Ul7tChQ7GBie7ktuPakaRSOdmqSnQDBSDacZ999lkITsUzq74Qhh8IZKPzm1RVacLqUptDVNxIXDHLulS9JQBysOSLzdM0a2VR2t+0aZP78pe/7EJAQgatu4hYlojWYlKZuDVVtOgGJTYS06rP2CHoVaflN200D8Xebg+Dh2JLLBum7aHirottssOfVtm6jiZzEEvaunUrV4do41UPxtuIMZD4iA2MVJ3opqWOBdSFAYMF2Q2yNgcOHIhqsBDsUmntgbR0LD9PJ2aFiW4grdipO4ElZ/ia4DPqHm3ZsoWFvb3s0oxttSNIrlIwasAXx72gMqqb6+gTGWzbrDRURbfXkcXZsGEDA8y91maMLTPAT6edt9+JbkCkiEkhqVhCdiw5WReyEVheiK696S0DVwWLDWKtvbQR9BjUBWKuFdqM/Uh0gw42Uxkks8JBloWiDb4s5MaSa/YFore7zXnVqlXMkUbFhdatW5fbfKyqkyl06qi/XBdzTfCbSfVBbrIrBJwEnhCbvDm3dDFCcFyMtq35xYsXETji70ct6p49e6i85ibYRObl3r174a6jkhPdiI3lxmLpMl2sOYQmCITUHLrNQrdhQGw92mq7/cIXvsC0EK5QVPyTDc7SuOXyAv32tO0GRMdHLyPRDaQEqfixSAsLDnlxSVDm4tKND47VVmKr1R5sw9Z///vfpLJ59OjR1BI8wScnV97DJfjiwQYMYhMMAO+/6EQ3kCHBqlLto9ca8kIw3BLIjRXngNxKcL5YtdyDBdbxox/9KBIYqbuP6Jt53/veVxi57AC4WRTH+HyKSHQDwR6kxlUgHcjPkJg0GlYbgqvlVn8bcnN06hKh0IVlJH3IlSOtv4QUI70sBVoUwGeigbKqHHBVKhjRDbglmg7EMkNqZCLImqhbwpH5pZgcO4HbwMCA27ZtW8NCC0JIdD8yxlY0BWFcONKKtfEFxuJFL3pR3kQ3QLJz584x1AvZsNakywjuILcGk0pwPepG5QhK79y5owpbuDw8ntwCvR/2vjA0Tb6ZSiLWr4lCFj3nRSM5gORkXmqJzmfC55tTMGo+N/JpVO7QNqQAE81maBDJ82N/Q6EE5ugW8McRG127dm2S4SggCMqx3NrMpS4gMnW9JLoVckgBoixFrnvevHnN9u5A3FbaaHle16uOZFYmTZpU+B4eAnTQY1UAIzoEJ/IX8SBusYx8IbghpehypEDEKhgsZQlAPJPbqneI/oBb0sAVKeYQ7UNsPmQsOb424pf43xwQiKAPlyV0QXJdsY6fS+HlLW95i5s5c6buGi0NIm4VcUdPOP7/p7NdVHGH1VIAAAAASUVORK5CYII='
	},false);

	LapButton.id = 'LAP_BUTTON';
	LapButton.className = 'ui_btn ui_btn_m';
	LapButton.appendChild(document.createElement('SPAN')).appendChild(document.createElement('EM')).textContent = '\u8214\u697C\u4E3B';
	LapContain.parentNode.insertBefore(LapButton, LapContain);
	LapButton.addEventListener('click',function(){prpr(Face)},false);
	
	function prpr(f){
		var IFM = document.getElementById('LAP_IFRAME');
		if (IFM) {
			return IFM.src = f.src + '?t=' + (new Date()).getTime();
		};
		IFM = document.createElement('IFRAME');
		IFM.id = 'LAP_IFRAME';
		IFM.style.display = 'none';
		IFM.src = f.src;
		document.documentElement.appendChild(IFM)	
	}
	
	var style = document.createElement('style');
	style.innerHTML = cssText;
	document.head.appendChild(style);
	
	var postList = document.querySelector('#j_p_postlist');
	postList.addEventListener('click',function(e){
		var target = e.target;
		'd_name' === target.className && (function(){
			window.scrollTo(0,2333333);
			var face = target.parentNode.querySelector('.p_author_face>IMG'),
				d = target.parentNode.parentNode.parentNode,
				field = JSON.parse(d.dataset.field),
				f = field.content.post_no,
				n = field.author.user_name,
				p = document.createElement('p');
			p.innerHTML = '笑舔 '+f+' 楼 @'+n+' 狗头<br>';
			setTimeout(function(){Editor.appendChild(p)},300);
			prpr(face);
		})();
	},false);
	
})();