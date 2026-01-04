// ==UserScript==
// @name         Chinese Thesaurus Web Clipper for Obsidian
// @namespace    https://ct.istic.ac.cn
// @version      v1.0.1.20251117
// @description  A user script that exports Chinese Thesaurus Item metadata as Obsidian Markdown files (Obsidian Chinese Thesaurus Web Clipper).
// @author       abc202306
// @match        https://ct.istic.ac.cn/site/organize/info/*
// @icon         none
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556076/Chinese%20Thesaurus%20Web%20Clipper%20for%20Obsidian.user.js
// @updateURL https://update.greasyfork.org/scripts/556076/Chinese%20Thesaurus%20Web%20Clipper%20for%20Obsidian.meta.js
// ==/UserScript==

(function () {
  'use strict'

  // Entry point
  setTimeout(startChineseThesaurusWebclipper, 500)

  function startChineseThesaurusWebclipper () {
    const title = document.querySelectorAll('.col-md-6>h3')[0].textContent

    const fileContentPartsList = [
      ...document.querySelectorAll('#home table.table-bordered')
    ]
      .map(table => getRecord(table))
      .filter(record => record)
      .map(record => getFileContentParts(record))

    const count = fileContentPartsList.length

    if (count === 0) {
      return
    }

    for (let i = 0; i < count; i++) {
      const [yamlFrontMatterStr, tableStr] = fileContentPartsList[i]
      const fileContent =
        i === 0
          ? [yamlFrontMatterStr, `# ${title}\n`, tableStr].join('\n')
          : [yamlFrontMatterStr, tableStr].join('\n')
      const obsidianURI = getObsidianURI(title, fileContent)
      if (confirm('Do you want to proceed? (' + (i + 1) + '/' + count + ')')) {
        window.location.href = obsidianURI
      } else {
        break
      }
    }
  }

  // Build Obsidian URI
  function getObsidianURI (title, fileContent) {
    const params = [
      ['file', `chinesethesaurusdb/chinesethesaurus/${title}`],
      ['content', fileContent],
      ['append', '1']
    ]
      .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
      .join('&')

    return `obsidian://new?${params};`
  }

  const keyMap = {
    sources: '来源',
    english: '英文',
    synonyms: '同义词',
    broadterms: '上位词',
    narrowerterms: '下位词',
    relatedterms: '相关词',
    categories: '分类'
  }
  const keyRMap = Object.fromEntries(
    Object.entries(keyMap).map(([k, v]) => [v, k])
  )

  function getRecord (table) {
    const rows = table.querySelectorAll('tr')
    const record = {
      english: null, // string
      synonyms: [], // string array
      sources: [], // wikilink string array
      broadterms: [], // wikilink string array
      narrowerterms: [], // wikilink string array
      relatedterms: [], // wikilink string array
      categories: [], // wikilink string array (All of the category wikilinks have the aliase text)
      aliases: [] // string array
    }
    rows.forEach(row => {
      const th = row.querySelector('th')
      const td = row.querySelector('td')
      if (!th || !td) {
        throw new Error('Unexpected table structure')
      }
      const key = th.innerText.trim()
      if (!(key in keyRMap)) {
        throw new Error(`Unexpected key: ${key}`)
      }
      const recordKey = keyRMap[key]

      const tdText = td.innerText.trim()

      record[recordKey] =
        recordKey === 'english'
          ? tdText
          : [
              'synonyms',
              'sources',
              'broadterms',
              'narrowerterms',
              'relatedterms'
            ].includes(recordKey)
          ? tdText
              .split('、')
              .map(s => s.trim())
              .filter(s => s.length > 0)
          : recordKey === 'categories'
          ? tdText
              .split(/、(?=[A-Z])/g)
              .map(str => {
                const res = /^([a-zA-Z0-9\-\.\*\+\_]+)(.*)/.exec(
                  str.replace(/\*/g, '_')
                )
                return (res[1] + ' ' + res[2]).trim()
              })
              .filter(s => s.length > 0)
          : []
    })
    if (record.english === 'saline water;salt brine;saltwater;salt-water') {
      return null
    }
    record.aliases = record.aliases
      .concat(record.synonyms)
      .concat(record.english ? [record.english] : [])
    return record
  }

  function getWikilink(linkText) {
    const invalidCharRegex = /[\\\/\:\*\?\"\<\>\|]/g
    const result = invalidCharRegex.exec(linkText);
    if (result) {
      invalidCharRegex.lastIndex = 0
      const path = linkText.replace(invalidCharRegex, '_');
      return `[[${path}|${linkText}]]`;
    }
    return `[[${linkText}]]`;
  }

  function getFileContentParts (record) {
    const orderedKey = [
      'sources',
      'categories',
      'english',
      'synonyms',
      'broadterms',
      'narrowerterms',
      'relatedterms'
    ]
    const validOrderedKey = orderedKey.filter(key => record[key]?.length !== 0)
    const now = getLocalISOStringWithTimezone()
    const yamlFrontMatterStr =
      '---\nup:\n  - "[[汉语主题词]]"\n' +
      validOrderedKey.map(key =>
        key === 'english'
          ? `english: ${record.english}\n`
          : key === 'synonyms'
          ? `synonyms:${record.synonyms.map(s => `\n  - ${s}`).join('')}\n`
          : ['sources', 'broadterms', 'narrowerterms', 'relatedterms'].includes(
              key
            )
          ? `${key}:${record[key].map(s => `\n  - "${getWikilink(s)}"`).join('')}\n`
          : key === 'categories'
          ? `categories:${record.categories.map(
              s => `\n  - "[[${s} 主题词分类|${s}]]"`
            ).join('')}\n`
          : ''
      ).join('') +
      'ctime: ' +
      now +
      '\n' +
      'mtime: ' +
      now +
      '\n' +
      '---\n'

    const tableStr =
      '| | |\n| --- | --- |\n' +
      validOrderedKey
        .map(key =>
          key === 'english'
            ? `| ${keyMap[key]} | ${record.english} |\n`
            : key === 'synonyms'
            ? `| ${keyMap[key]} | ${record.synonyms.join('、')} |\n`
            : [
                'sources',
                'broadterms',
                'narrowerterms',
                'relatedterms'
              ].includes(key)
            ? `| ${keyMap[key]} | ${record[key]
                .map(s => getWikilink(s).replace(/\|/g, '\\|'))
                .join('、')} |\n`
            : key === 'categories'
            ? `| ${keyMap[key]} | ${record.categories
                .map(s => `[[${s} 主题词分类\\|${s}]]`)
                .join('、')} |\n`
            : ''
        ).join('');

    return [yamlFrontMatterStr, tableStr]
  }

  function getLocalISOStringWithTimezone () {
    const date = new Date()
    const pad = n => String(n).padStart(2, '0')

    const offset = -date.getTimezoneOffset() // actual UTC offset in minutes
    const sign = offset >= 0 ? '+' : '-'
    const hours = pad(Math.floor(Math.abs(offset) / 60))
    const minutes = pad(Math.abs(offset) % 60)

    return (
      `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
        date.getDate()
      )}T` +
      `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
        date.getSeconds()
      )}` +
      `${sign}${hours}:${minutes}`
    )
  }
})()
