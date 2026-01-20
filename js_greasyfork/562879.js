// ==UserScript==
// @name         大学生就业服务平台一键选择
// @namespace    http://tampermonkey.net/
// @version      2026-01-20
// @description  大学生就业服务平台一键选择岗位，可以跳过指定公司与关键词，并设置同一家公司最大投递数；按左右键翻页
// @author       卡布奇诺
// @match        https://www.ncss.cn/student/jobs/index.html
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562879/%E5%A4%A7%E5%AD%A6%E7%94%9F%E5%B0%B1%E4%B8%9A%E6%9C%8D%E5%8A%A1%E5%B9%B3%E5%8F%B0%E4%B8%80%E9%94%AE%E9%80%89%E6%8B%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/562879/%E5%A4%A7%E5%AD%A6%E7%94%9F%E5%B0%B1%E4%B8%9A%E6%9C%8D%E5%8A%A1%E5%B9%B3%E5%8F%B0%E4%B8%80%E9%94%AE%E9%80%89%E6%8B%A9.meta.js
// ==/UserScript==

(function () {
  'use strict'

  // 同一家公司最大投递数
  const maxSameCompany = 2
  // 跳过公司
  const skipCorps = []
  // 跳过关键词
  const skipKeywords = ['公告', '客服', '销售', '保险', '实习']

  // 读取已投递岗位
  const appliedJobs = JSON.parse(localStorage.getItem('appliedJobs')) || []
  // 今天日期
  const today = new Date().toLocaleDateString()

  function selectJobs(e) {
    // 1. 获取岗位
    // 选择'.jobList'元素
    const jobList = document.querySelectorAll('.jobList')

    // 2. 选择岗位
    // 存储勾选的公司岗位数量
    const selectedJobsCount = {}
    for (let i = 0; i < jobList.length; i++) {
      const job = jobList[i]
      const id = job.dataset.id
      const jobName = job.dataset.job
      const corp = job.dataset.corp

      // 跳过公司
      if (skipCorps.includes(corp)) {
        continue
      }

      // 跳过关键词
      if (skipKeywords.some((keyword) => job.textContent.includes(keyword))) {
        continue
      }

      // 检查是否有记录该公司
      let appliedCorp = appliedJobs.find((item) => item.corp === corp)
      if (appliedCorp) {
        // 有记录
        if (appliedCorp.jobs.some((item) => item.id === id)) {
          continue
        }
        if (job.querySelector('.apply.hide')) {
          appliedCorp.jobs.push({ id, jobName })
          continue
        }
        // 超过最大投递数
        if (appliedCorp.jobs.length + (selectedJobsCount[corp] || 0) >= maxSameCompany) {
          continue
        }
      } else {
        // 没有记录
        appliedJobs.push({ corp, jobs: [] })
        appliedCorp = appliedJobs.find((item) => item.corp === corp)

        if (job.querySelector('.apply.hide')) {
          appliedCorp.jobs.push({ id, jobName })
          continue
        }
      }

      // 勾选岗位
      const checkbox = job.querySelector('input[type="checkbox"]')
      checkbox.checked = true
      // 更新勾选的公司岗位数量
      selectedJobsCount[corp] = (selectedJobsCount[corp] || 0) + 1
    }

    const n = document.querySelectorAll('.tobeSelected:checked').length
    e.target.textContent = `一键选择(${n})`
    if (n > 0) {
      // 点击'投递简历'按钮
      const multiApplyBtn = document.querySelector('.multiApply')
      multiApplyBtn.click()
    }
  }

  function updateJobs() {
    const jobList = document.querySelectorAll('.jobList')
    for (let i = 0; i < jobList.length; i++) {
      const job = jobList[i]
      const id = job.dataset.id
      const jobName = job.dataset.job
      const corp = job.dataset.corp

      const checkbox = job.querySelector('input[type="checkbox"]')
      if (checkbox.checked) {
        // 往appliedJobs中添加岗位
        let appliedCorp = appliedJobs.find((item) => item.corp === corp)
        if (!appliedCorp) {
          appliedJobs.push({ corp, jobs: [] })
          appliedCorp = appliedJobs.find((item) => item.corp === corp)
        }
        if (appliedCorp.jobs.some((item) => item.id === id)) {
          continue
        }
        appliedCorp.jobs.push({ id, jobName, applyDate: today })
      }
    }

    // 存储已投递岗位
    localStorage.setItem('appliedJobs', JSON.stringify(appliedJobs))
  }

  // 添加“选择”按钮
  const selectBtn = document.createElement('button')
  selectBtn.type = 'button'
  selectBtn.className = 'btn btn-default'
  selectBtn.textContent = '一键选择'
  selectBtn.style = 'margin:0 14px 0 0;'
  const tdSelect = document.querySelector('#td-select')
  tdSelect.parentNode.insertBefore(selectBtn, tdSelect)
  selectBtn.addEventListener('click', selectJobs)

  // 点击'确认投递'按钮事件
  const ensureApplyBtn = document.querySelector('#ensureAppyjobMuti .ensureApply')
  ensureApplyBtn.addEventListener('click', updateJobs)

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') {
      const nextBtn = document.querySelector('.next')
      if (nextBtn) { nextBtn.click() }
    }
    if (e.key === 'ArrowLeft') {
      const prevBtn = document.querySelector('.prev')
      if (prevBtn) { prevBtn.click() }
    }
  })
})()

/* 数据类型
type Job = {
  id: string;
  jobName: string;
  applyDate: string;
}
type AppliedJobs = {
  corp: string;
  jobs: Job[];
}[]
*/

/* 手动修改
console.log(localStorage.getItem('appliedJobs'))
let jsonData = []
if (jsonData.length > 0) {
  localStorage.setItem('appliedJobs', JSON.stringify(jsonData))
}
*/