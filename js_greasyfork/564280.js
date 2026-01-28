// ==UserScript==
// @name         驼人云学堂战略规划题库-V1.0
// @namespace    czy
// @version      1.0
// @description  云学堂视频自动播放-2024-08-05新增自动2倍速
// @author       czy
// @icon         https://picobd.yxt.com/orgs/yxt_malladmin/mvcpic/image/201811/71672740d9524c53ac3d60b6a4123bca.png
// @match        http://*.yunxuetang.cn/plan/*.html
// @match        http://*.yunxuetang.cn/kng/plan/document/*
// @match        http://*.yunxuetang.cn/kng/view/document/*
// @match        http://*.yunxuetang.cn/kng/plan/video/*
// @match        http://*.yunxuetang.cn/kng/view/video/*
// @match        http://*.yunxuetang.cn/kng/view/package/*
// @match        http://*.yunxuetang.cn/kng/plan/package/*
// @match        http://*.yunxuetang.cn/kng/o2ostudy/video/*
// @match        http://*.yunxuetang.cn/mit/myhomeworkexprience*
// @match        http://*.yunxuetang.cn/kng/course/package/video/*
// @match        http://*.yunxuetang.cn/kng/course/package/document/*
// @match        http://*.yunxuetang.cn/sty/index.htm/*
// @match        http://*.yunxuetang.cn/kng/o2ostudy/document/*
// @match        https://*.yunxuetang.cn/plan/*.html
// @match        https://*.yunxuetang.cn/kng/plan/document/*
// @match        https://*.yunxuetang.cn/kng/view/document/*
// @match        https://*.yunxuetang.cn/kng/plan/video/*
// @match        https://*.yunxuetang.cn/kng/view/video/*
// @match        https://*.yunxuetang.cn/kng/view/package/*
// @match        https://*.yunxuetang.cn/kng/plan/package/*
// @match        https://*.yunxuetang.cn/kng/o2ostudy/video/*
// @match        https://*.yunxuetang.cn/mit/myhomeworkexprience*
// @match        https://*.yunxuetang.cn/kng/course/package/video/*
// @match        https://*.yunxuetang.cn/kng/course/package/document/*
// @match        https://*.yunxuetang.cn/sty/index.htm/*
// @match        https://*.yunxuetang.cn/kng/o2ostudy/document/*
// @match        https://*.yunxuetang.cn/kng/*
// @match        https://*.yunxuetang.cn/mit/*
// @match        https://*.yunxuetang.cn/sty/*
// @match        https://*.yunxuetang.cn/plan/*
// @match        https://*.yunxuetang.cn/*

// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @license      MIT
// @connect      none
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/564280/%E9%A9%BC%E4%BA%BA%E4%BA%91%E5%AD%A6%E5%A0%82%E6%88%98%E7%95%A5%E8%A7%84%E5%88%92%E9%A2%98%E5%BA%93-V10.user.js
// @updateURL https://update.greasyfork.org/scripts/564280/%E9%A9%BC%E4%BA%BA%E4%BA%91%E5%AD%A6%E5%A0%82%E6%88%98%E7%95%A5%E8%A7%84%E5%88%92%E9%A2%98%E5%BA%93-V10.meta.js
// ==/UserScript==

/***********************
		 * 1️⃣ 题库数据（粘你的 txt）
		 ***********************/
		const listQuestion = [
  {
    "id": "c13f4077-a513-48cf-8c4c-f6791754ab20",
    "examQuesId": "3385ff48-9bc8-4bf7-9005-ee6e7323e6c4",
    "sourceId": "c298d0a9-720e-4c3b-867e-95f72901c95b",
    "content": "公司的使命是什么？",
    "quesType": 0,
    "questionType": 0,
    "fileId": "",
    "tranStatus": null,
    "playDetails": null,
    "subQues": 0,
    "parentId": null,
    "orderIndex": 1,
    "itemCount": 4,
    "judgeCorrectOptionContent": "",
    "judgeWrongOptionContent": "",
    "choiceItems": [
      {
        "id": "4e7ca4cc-61c6-4d35-aae9-a8f149d2945d",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "3385ff48-9bc8-4bf7-9005-ee6e7323e6c4",
        "itemContent": "成为全球医疗器械销售冠军",
        "answer": 0,
        "orderIndex": 1,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "205d5feb-cceb-42ee-8abd-b83b8ecb1e15",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "d5c9028d-9414-4e04-bc74-280c7f1dc08b",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "3385ff48-9bc8-4bf7-9005-ee6e7323e6c4",
        "itemContent": "成为全球（中小型）医疗器械创新转化生态平台的构建者",
        "answer": 1,
        "orderIndex": 2,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "0c2ee634-33e1-4fb9-b944-fb3c47384de3",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "a5788a89-b39e-48b6-8c5b-b870535d1795",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "3385ff48-9bc8-4bf7-9005-ee6e7323e6c4",
        "itemContent": "成为全球最大的医疗设备制造商",
        "answer": 0,
        "orderIndex": 3,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "a5be2ff3-d7c4-4be0-869b-81dacea7306a",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "4790dc79-015e-4fac-bdb1-ef0fd3229bd2",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "3385ff48-9bc8-4bf7-9005-ee6e7323e6c4",
        "itemContent": "成为全球医疗技术研发中心",
        "answer": 0,
        "orderIndex": 4,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "dbb405e0-c12f-4593-b33f-d21c2b544777",
        "score": 0,
        "itemPlay": null
      }
    ],
    "fillInItems": null,
    "subQuesList": null,
    "corrected": 0,
    "fillinCorrectedInfo": null,
    "submitQuesAnswers": [
      "a5788a89-b39e-48b6-8c5b-b870535d1795"
    ],
    "correctAnswers": [
      "d5c9028d-9414-4e04-bc74-280c7f1dc08b"
    ],
    "keywords": null,
    "fillinAnswers": null,
    "judgeAnswer": 0,
    "explainText": "",
    "answerPlay": null,
    "explainPlay": null
  },
  {
    "id": "20b61258-46fd-43d7-ada4-379c45ddd14d",
    "examQuesId": "2722762f-fd78-4ac0-93ed-f84554ea0fe9",
    "sourceId": "00c2113f-f036-416e-bd6e-59f9af7742b4",
    "content": "公司的核心价值观不包括以下哪一项",
    "quesType": 0,
    "questionType": 0,
    "fileId": "",
    "tranStatus": null,
    "playDetails": null,
    "subQues": 0,
    "parentId": null,
    "orderIndex": 2,
    "itemCount": 4,
    "judgeCorrectOptionContent": "",
    "judgeWrongOptionContent": "",
    "choiceItems": [
      {
        "id": "b117f40f-50b2-45ea-81f5-a23b66d64549",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "2722762f-fd78-4ac0-93ed-f84554ea0fe9",
        "itemContent": "以客户为中心",
        "answer": 0,
        "orderIndex": 1,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "166ca952-e443-4030-b4a3-89a5d749179c",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "f6e65a13-5f32-4968-b30e-11c2f6d9a9fe",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "2722762f-fd78-4ac0-93ed-f84554ea0fe9",
        "itemContent": "以奋斗者为本",
        "answer": 0,
        "orderIndex": 2,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "c00e050f-3846-442d-88f9-6d719ca679d0",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "949bc500-eb22-4b7c-8ac5-de13d4a5e394",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "2722762f-fd78-4ac0-93ed-f84554ea0fe9",
        "itemContent": "协同共创",
        "answer": 0,
        "orderIndex": 3,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "ca52428f-c7a3-4846-bf9d-16917ab69361",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "70e959ad-3e42-49d7-9c9a-bf9238288d39",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "2722762f-fd78-4ac0-93ed-f84554ea0fe9",
        "itemContent": "追求利润最大化",
        "answer": 1,
        "orderIndex": 4,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "622bce82-bda7-43d6-99f9-2fcca6d1589f",
        "score": 0,
        "itemPlay": null
      }
    ],
    "fillInItems": null,
    "subQuesList": null,
    "corrected": 1,
    "fillinCorrectedInfo": null,
    "submitQuesAnswers": [
      "70e959ad-3e42-49d7-9c9a-bf9238288d39"
    ],
    "correctAnswers": [
      "70e959ad-3e42-49d7-9c9a-bf9238288d39"
    ],
    "keywords": null,
    "fillinAnswers": null,
    "judgeAnswer": 0,
    "explainText": "",
    "answerPlay": null,
    "explainPlay": null
  },
  {
    "id": "187ddf5b-a6bd-4c82-9873-26ac57b534f3",
    "examQuesId": "b50ceb13-ecba-4c1d-975d-5dbae41a0310",
    "sourceId": "3f5393d1-85f8-4256-b149-4e0fb0248bd9",
    "content": "公司五年目标（2030年）的年销售收入是多少",
    "quesType": 0,
    "questionType": 0,
    "fileId": "",
    "tranStatus": null,
    "playDetails": null,
    "subQues": 0,
    "parentId": null,
    "orderIndex": 3,
    "itemCount": 4,
    "judgeCorrectOptionContent": "",
    "judgeWrongOptionContent": "",
    "choiceItems": [
      {
        "id": "8f7fd671-4b56-4d47-a897-8a9f3d15ca11",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "b50ceb13-ecba-4c1d-975d-5dbae41a0310",
        "itemContent": "100亿元",
        "answer": 0,
        "orderIndex": 1,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "a24ba89a-4540-4181-806f-59ea5a97b615",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "4f4aac51-0919-4722-b462-c595dedf6e05",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "b50ceb13-ecba-4c1d-975d-5dbae41a0310",
        "itemContent": "200亿元",
        "answer": 1,
        "orderIndex": 2,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "8341a9bb-fb85-442d-8206-6236728b8ea4",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "db6db65d-e243-46d8-bef5-b2329eefdff3",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "b50ceb13-ecba-4c1d-975d-5dbae41a0310",
        "itemContent": "300亿元",
        "answer": 0,
        "orderIndex": 3,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "71951e3d-d18c-478f-add6-00be8b120ed4",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "776d4dda-b67b-46ba-aa71-de5d1f3cabcb",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "b50ceb13-ecba-4c1d-975d-5dbae41a0310",
        "itemContent": "500亿元",
        "answer": 0,
        "orderIndex": 4,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "1cb4607a-9941-4ddc-8f56-07cee2e0c0e8",
        "score": 0,
        "itemPlay": null
      }
    ],
    "fillInItems": null,
    "subQuesList": null,
    "corrected": 0,
    "fillinCorrectedInfo": null,
    "submitQuesAnswers": [
      "776d4dda-b67b-46ba-aa71-de5d1f3cabcb"
    ],
    "correctAnswers": [
      "4f4aac51-0919-4722-b462-c595dedf6e05"
    ],
    "keywords": null,
    "fillinAnswers": null,
    "judgeAnswer": 0,
    "explainText": "",
    "answerPlay": null,
    "explainPlay": null
  },
  {
    "id": "adf47df0-0f08-44cb-9ddd-af77558a5269",
    "examQuesId": "281b6d93-a566-4496-9327-fe0ad3632894",
    "sourceId": "a63870f9-b799-449a-bf59-c68cb0f5a10f",
    "content": "下列哪项不属于“战略增长引擎”事业部",
    "quesType": 0,
    "questionType": 0,
    "fileId": "",
    "tranStatus": null,
    "playDetails": null,
    "subQues": 0,
    "parentId": null,
    "orderIndex": 4,
    "itemCount": 4,
    "judgeCorrectOptionContent": "",
    "judgeWrongOptionContent": "",
    "choiceItems": [
      {
        "id": "efb3e848-d55a-46d3-8e5d-34775ebac224",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "281b6d93-a566-4496-9327-fe0ad3632894",
        "itemContent": "骨骼肌肉与疼痛事业部",
        "answer": 0,
        "orderIndex": 1,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "7d6c6ede-c9a3-48fa-8e78-cd495603ecd8",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "e5de2eea-8a72-4715-bfbb-34fddc602190",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "281b6d93-a566-4496-9327-fe0ad3632894",
        "itemContent": "介入外科事业部",
        "answer": 0,
        "orderIndex": 2,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "42e85ee7-b95e-4f93-9e82-c08697cf3f9d",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "d72a34a4-1678-4fb2-bbaf-6e7c6ba6e8a2",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "281b6d93-a566-4496-9327-fe0ad3632894",
        "itemContent": "急危重症与麻醉事业部",
        "answer": 1,
        "orderIndex": 3,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "4c7304d4-8d52-43a3-9df0-e41473bee8e5",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "41f4a4a6-8f7c-4fbb-b0e1-10e967d58532",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "281b6d93-a566-4496-9327-fe0ad3632894",
        "itemContent": "超声影像事业部",
        "answer": 0,
        "orderIndex": 4,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "b1d0e83c-d4c3-4d97-8b59-b6e295d8d822",
        "score": 0,
        "itemPlay": null
      }
    ],
    "fillInItems": null,
    "subQuesList": null,
    "corrected": 0,
    "fillinCorrectedInfo": null,
    "submitQuesAnswers": [
      "41f4a4a6-8f7c-4fbb-b0e1-10e967d58532"
    ],
    "correctAnswers": [
      "d72a34a4-1678-4fb2-bbaf-6e7c6ba6e8a2"
    ],
    "keywords": null,
    "fillinAnswers": null,
    "judgeAnswer": 0,
    "explainText": "",
    "answerPlay": null,
    "explainPlay": null
  },
  {
    "id": "20bbf16c-a6a6-432a-a755-6567009d4e9f",
    "examQuesId": "82f87277-be56-4b5a-837c-6be5829b1085",
    "sourceId": "ce81e12d-60a4-4cb4-b871-caabe2330d3f",
    "content": "公司产业边界中“不做”的业务包括",
    "quesType": 0,
    "questionType": 0,
    "fileId": "",
    "tranStatus": null,
    "playDetails": null,
    "subQues": 0,
    "parentId": null,
    "orderIndex": 5,
    "itemCount": 4,
    "judgeCorrectOptionContent": "",
    "judgeWrongOptionContent": "",
    "choiceItems": [
      {
        "id": "624f08b5-9908-4dca-83bb-91e9d649a702",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "82f87277-be56-4b5a-837c-6be5829b1085",
        "itemContent": "智能化中小型医疗器械",
        "answer": 0,
        "orderIndex": 1,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "b96e1a6b-8a37-45eb-8704-0a855d19c4c9",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "f5917bcc-4e80-48da-9671-d83017c1c7b4",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "82f87277-be56-4b5a-837c-6be5829b1085",
        "itemContent": "大型医疗影像设备",
        "answer": 1,
        "orderIndex": 2,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "ee7663f2-b2fd-4b24-a418-132cf366867e",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "a92e9c24-0d10-425d-9dd3-06d7d203e850",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "82f87277-be56-4b5a-837c-6be5829b1085",
        "itemContent": "高值医疗耗材",
        "answer": 0,
        "orderIndex": 3,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "99f6938f-8442-48b6-b0c0-0a3a4bd058df",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "3000f70e-ebe4-4061-bc99-c0497e80efdf",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "82f87277-be56-4b5a-837c-6be5829b1085",
        "itemContent": "信息化中小型医疗器械",
        "answer": 0,
        "orderIndex": 4,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "9460bcdc-19a4-4086-aade-0ab678e7b798",
        "score": 0,
        "itemPlay": null
      }
    ],
    "fillInItems": null,
    "subQuesList": null,
    "corrected": 0,
    "fillinCorrectedInfo": null,
    "submitQuesAnswers": [
      "3000f70e-ebe4-4061-bc99-c0497e80efdf"
    ],
    "correctAnswers": [
      "f5917bcc-4e80-48da-9671-d83017c1c7b4"
    ],
    "keywords": null,
    "fillinAnswers": null,
    "judgeAnswer": 0,
    "explainText": "",
    "answerPlay": null,
    "explainPlay": null
  },
  {
    "id": "7333b3d1-579d-440c-b68d-cdf451c6e507",
    "examQuesId": "0aedc760-d28d-497d-9810-65fcdebdce4a",
    "sourceId": "2c6596aa-a9aa-471d-a7b4-fbf27688961c",
    "content": "区域与客户战略，对于国内市场中长期（6个月以上）目标是？",
    "quesType": 0,
    "questionType": 0,
    "fileId": "",
    "tranStatus": null,
    "playDetails": null,
    "subQues": 0,
    "parentId": null,
    "orderIndex": 6,
    "itemCount": 4,
    "judgeCorrectOptionContent": "",
    "judgeWrongOptionContent": "",
    "choiceItems": [
      {
        "id": "4ad94a14-b491-4190-b873-deb275cd68aa",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "0aedc760-d28d-497d-9810-65fcdebdce4a",
        "itemContent": "聚焦经营11个核心科室的创新成果产出和业务线索推进",
        "answer": 1,
        "orderIndex": 1,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "2a2d7b84-2a03-4881-9527-2ac11e722a4d",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "f1459417-8de1-477e-af2a-e744e96cad4d",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "0aedc760-d28d-497d-9810-65fcdebdce4a",
        "itemContent": "快速建立服务信任",
        "answer": 0,
        "orderIndex": 2,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "05b85cc1-56c0-4cc1-9863-d4879ebe81fc",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "a51f15dc-77a4-498f-a435-01a671294c28",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "0aedc760-d28d-497d-9810-65fcdebdce4a",
        "itemContent": "推动科室协同与项目落地",
        "answer": 0,
        "orderIndex": 3,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "f256d648-874a-4658-9875-e237e94808ed",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "4d056268-94f7-41a4-8a52-8bf74f5c80c9",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "0aedc760-d28d-497d-9810-65fcdebdce4a",
        "itemContent": "实现从服务信任到价值共创的跨越",
        "answer": 0,
        "orderIndex": 4,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "1e7a17b9-ec82-4fd5-9d28-583e9902ae77",
        "score": 0,
        "itemPlay": null
      }
    ],
    "fillInItems": null,
    "subQuesList": null,
    "corrected": 0,
    "fillinCorrectedInfo": null,
    "submitQuesAnswers": [
      "4d056268-94f7-41a4-8a52-8bf74f5c80c9"
    ],
    "correctAnswers": [
      "4ad94a14-b491-4190-b873-deb275cd68aa"
    ],
    "keywords": null,
    "fillinAnswers": null,
    "judgeAnswer": 0,
    "explainText": "",
    "answerPlay": null,
    "explainPlay": null
  },
  {
    "id": "8607ceb4-7889-49fb-ac66-81ca33793dfb",
    "examQuesId": "5bde1beb-bb28-4c01-9dbe-fb5cfe5a8ff7",
    "sourceId": "152feb11-bbda-4363-af07-ee458241cf22",
    "content": "战略客户其中占比10%是那种类型的医院？",
    "quesType": 0,
    "questionType": 0,
    "fileId": "",
    "tranStatus": null,
    "playDetails": null,
    "subQues": 0,
    "parentId": null,
    "orderIndex": 7,
    "itemCount": 4,
    "judgeCorrectOptionContent": "",
    "judgeWrongOptionContent": "",
    "choiceItems": [
      {
        "id": "66e26e7b-b67d-42eb-895e-45be2aa72367",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "5bde1beb-bb28-4c01-9dbe-fb5cfe5a8ff7",
        "itemContent": "地市核心",
        "answer": 0,
        "orderIndex": 1,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "6c355e14-b9dd-42f9-8693-376d8f31ccf1",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "c7ee8101-0056-4867-93b9-a01737af0e33",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "5bde1beb-bb28-4c01-9dbe-fb5cfe5a8ff7",
        "itemContent": "省级标杆",
        "answer": 0,
        "orderIndex": 2,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "4ebc97d6-d25a-4d2f-9355-43879d2ea6a0",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "0f3293af-c464-4840-84ed-b2d3b8687435",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "5bde1beb-bb28-4c01-9dbe-fb5cfe5a8ff7",
        "itemContent": "全国顶级",
        "answer": 1,
        "orderIndex": 3,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "6ea3b80e-4994-4f69-adaf-6f5515587ade",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "e5eb3405-fb92-4479-8f51-84e5fb28b81f",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "5bde1beb-bb28-4c01-9dbe-fb5cfe5a8ff7",
        "itemContent": "地市TOP",
        "answer": 0,
        "orderIndex": 4,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "24e33aba-6784-44c6-b241-b6116330e58d",
        "score": 0,
        "itemPlay": null
      }
    ],
    "fillInItems": null,
    "subQuesList": null,
    "corrected": 0,
    "fillinCorrectedInfo": null,
    "submitQuesAnswers": [
      "e5eb3405-fb92-4479-8f51-84e5fb28b81f"
    ],
    "correctAnswers": [
      "0f3293af-c464-4840-84ed-b2d3b8687435"
    ],
    "keywords": null,
    "fillinAnswers": null,
    "judgeAnswer": 0,
    "explainText": "",
    "answerPlay": null,
    "explainPlay": null
  },
  {
    "id": "afd303df-b2c9-4f3e-a2e0-e2172b3f771c",
    "examQuesId": "204adfdc-da99-4995-9c70-59d9ed5504f5",
    "sourceId": "cbb16590-37ec-4c58-82c7-bf70d35f7b00",
    "content": "联合创新主导建设以（）为依托的创新联合体？",
    "quesType": 0,
    "questionType": 0,
    "fileId": "",
    "tranStatus": null,
    "playDetails": null,
    "subQues": 0,
    "parentId": null,
    "orderIndex": 8,
    "itemCount": 4,
    "judgeCorrectOptionContent": "",
    "judgeWrongOptionContent": "",
    "choiceItems": [
      {
        "id": "bac38320-b126-4d0b-9bb9-f4dd2a4e6edc",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "204adfdc-da99-4995-9c70-59d9ed5504f5",
        "itemContent": "企业",
        "answer": 0,
        "orderIndex": 1,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "9e29b970-7e97-4c33-9f23-414b1b5dee66",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "3fbe708e-bb9a-4472-8f67-673eeaa66fd8",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "204adfdc-da99-4995-9c70-59d9ed5504f5",
        "itemContent": "驼人",
        "answer": 1,
        "orderIndex": 2,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "f9fcfa35-5de9-4dfd-acb4-d69565a48ef6",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "b6e43a76-b55b-4161-887c-c871dbc723a1",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "204adfdc-da99-4995-9c70-59d9ed5504f5",
        "itemContent": "医院",
        "answer": 0,
        "orderIndex": 3,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "f195949d-4bcc-414e-96cd-a13953c22098",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "e756f282-e09a-4dc9-b36f-ea68cf072581",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "204adfdc-da99-4995-9c70-59d9ed5504f5",
        "itemContent": "高校",
        "answer": 0,
        "orderIndex": 4,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "2c5ee617-fdd5-4618-a8ec-66b339acccf0",
        "score": 0,
        "itemPlay": null
      }
    ],
    "fillInItems": null,
    "subQuesList": null,
    "corrected": 0,
    "fillinCorrectedInfo": null,
    "submitQuesAnswers": [
      "e756f282-e09a-4dc9-b36f-ea68cf072581"
    ],
    "correctAnswers": [
      "3fbe708e-bb9a-4472-8f67-673eeaa66fd8"
    ],
    "keywords": null,
    "fillinAnswers": null,
    "judgeAnswer": 0,
    "explainText": "",
    "answerPlay": null,
    "explainPlay": null
  },
  {
    "id": "bba92ce6-7e20-4c86-b179-dd7198557e94",
    "examQuesId": "be4c9d8f-a3fd-4462-82c8-194dbd42da16",
    "sourceId": "837fdc75-2b47-4bb4-8883-4cd7ad3b6a24",
    "content": "战略解码与耦合评审”是在哪个流程中固化的?",
    "quesType": 0,
    "questionType": 0,
    "fileId": "",
    "tranStatus": null,
    "playDetails": null,
    "subQues": 0,
    "parentId": null,
    "orderIndex": 9,
    "itemCount": 4,
    "judgeCorrectOptionContent": "",
    "judgeWrongOptionContent": "",
    "choiceItems": [
      {
        "id": "1fb90774-9a07-4a52-9d89-69a89f698e7e",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "be4c9d8f-a3fd-4462-82c8-194dbd42da16",
        "itemContent": "集团战略执行（DSTE）流程",
        "answer": 1,
        "orderIndex": 1,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "658b607b-d8ad-4981-a078-d975aa1f59d2",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "e041c3a5-fdd7-479e-8c1c-47a1b40e3c2f",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "be4c9d8f-a3fd-4462-82c8-194dbd42da16",
        "itemContent": "产品研发流程",
        "answer": 0,
        "orderIndex": 2,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "0c8f8735-93a7-46cc-9e98-12c8b17a39b0",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "e3f00441-68b1-47b3-a0c1-eb51663b13b5",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "be4c9d8f-a3fd-4462-82c8-194dbd42da16",
        "itemContent": "销售与服务流程",
        "answer": 0,
        "orderIndex": 3,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "61b6377d-8e5b-418b-9a8e-c7068b21efe8",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "ef13f364-c698-4c9c-b97a-22ae04c48270",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "be4c9d8f-a3fd-4462-82c8-194dbd42da16",
        "itemContent": "应链管理流程",
        "answer": 0,
        "orderIndex": 4,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "18182d3e-b28d-4454-8d42-371d400bee46",
        "score": 0,
        "itemPlay": null
      }
    ],
    "fillInItems": null,
    "subQuesList": null,
    "corrected": 0,
    "fillinCorrectedInfo": null,
    "submitQuesAnswers": [
      "ef13f364-c698-4c9c-b97a-22ae04c48270"
    ],
    "correctAnswers": [
      "1fb90774-9a07-4a52-9d89-69a89f698e7e"
    ],
    "keywords": null,
    "fillinAnswers": null,
    "judgeAnswer": 0,
    "explainText": "",
    "answerPlay": null,
    "explainPlay": null
  },
  {
    "id": "548cd12e-3a47-4e84-bfa4-8c25cab70a95",
    "examQuesId": "06a5073b-0d53-4b3c-bebd-5ba12c929654",
    "sourceId": "c2ce10e0-38d6-46b5-b1fb-940c30eb439b",
    "content": "“联合&nbsp;Charter”制度适用于以下哪类项目？",
    "quesType": 0,
    "questionType": 0,
    "fileId": "",
    "tranStatus": null,
    "playDetails": null,
    "subQues": 0,
    "parentId": null,
    "orderIndex": 10,
    "itemCount": 4,
    "judgeCorrectOptionContent": "",
    "judgeWrongOptionContent": "",
    "choiceItems": [
      {
        "id": "408e8a61-d77d-4c20-ae80-f10078f70d9d",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "06a5073b-0d53-4b3c-bebd-5ba12c929654",
        "itemContent": "所有事业部独立项目",
        "answer": 0,
        "orderIndex": 1,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "c0567700-26f6-4932-88eb-b5bd4e6d538f",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "afbd047c-9c6f-4ff9-8966-429001ba6e38",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "06a5073b-0d53-4b3c-bebd-5ba12c929654",
        "itemContent": "涉及多部门的核心项目",
        "answer": 1,
        "orderIndex": 2,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "cf22fae8-c009-43b1-86e8-d02cf43369d5",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "ca010915-3008-4f55-9298-0e819586c370",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "06a5073b-0d53-4b3c-bebd-5ba12c929654",
        "itemContent": "仅研发平台内部项目",
        "answer": 0,
        "orderIndex": 3,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "4afa97aa-a87f-49ae-ab64-a5d7614cdae6",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "26a04501-177c-4ac3-8b85-eefe3ce8924e",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "06a5073b-0d53-4b3c-bebd-5ba12c929654",
        "itemContent": "仅销售与服务项目",
        "answer": 0,
        "orderIndex": 4,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "61d59972-23a9-42b7-91e5-9cc81d3278d1",
        "score": 0,
        "itemPlay": null
      }
    ],
    "fillInItems": null,
    "subQuesList": null,
    "corrected": 0,
    "fillinCorrectedInfo": null,
    "submitQuesAnswers": [
      "26a04501-177c-4ac3-8b85-eefe3ce8924e"
    ],
    "correctAnswers": [
      "afbd047c-9c6f-4ff9-8966-429001ba6e38"
    ],
    "keywords": null,
    "fillinAnswers": null,
    "judgeAnswer": 0,
    "explainText": "",
    "answerPlay": null,
    "explainPlay": null
  },
  {
    "id": "2d8561d8-cb2a-4b6c-bf44-847da134e923",
    "examQuesId": "f1d42d95-d018-497a-88b5-6e693e3023a8",
    "sourceId": "e8866fe8-59eb-40b3-8b23-7011d3d05b2a",
    "content": "CBB是指什么？",
    "quesType": 0,
    "questionType": 0,
    "fileId": "",
    "tranStatus": null,
    "playDetails": null,
    "subQues": 0,
    "parentId": null,
    "orderIndex": 11,
    "itemCount": 4,
    "judgeCorrectOptionContent": "",
    "judgeWrongOptionContent": "",
    "choiceItems": [
      {
        "id": "d7fb66e2-d77b-472a-8714-a5ace7486687",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "f1d42d95-d018-497a-88b5-6e693e3023a8",
        "itemContent": "客户业务模块",
        "answer": 0,
        "orderIndex": 1,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "c9a0ab23-8028-40f5-af74-4bd3faf67468",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "18716a07-ba28-4e23-ba67-f518964a0231",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "f1d42d95-d018-497a-88b5-6e693e3023a8",
        "itemContent": "共用构建模块",
        "answer": 1,
        "orderIndex": 2,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "d6eefdf6-be6a-44c8-b9da-822505673c0f",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "13863df5-727e-48f6-bdd9-a065605c2d3e",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "f1d42d95-d018-497a-88b5-6e693e3023a8",
        "itemContent": "核心业务单元",
        "answer": 0,
        "orderIndex": 3,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "940caf43-7385-4d1b-8116-6fb295835bae",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "a0a42777-63c8-4c4d-9644-0b8fe22deea1",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "f1d42d95-d018-497a-88b5-6e693e3023a8",
        "itemContent": "协同开发协议",
        "answer": 0,
        "orderIndex": 4,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "2a712448-517f-4a1b-99bb-826744610a7f",
        "score": 0,
        "itemPlay": null
      }
    ],
    "fillInItems": null,
    "subQuesList": null,
    "corrected": 0,
    "fillinCorrectedInfo": null,
    "submitQuesAnswers": [
      "a0a42777-63c8-4c4d-9644-0b8fe22deea1"
    ],
    "correctAnswers": [
      "18716a07-ba28-4e23-ba67-f518964a0231"
    ],
    "keywords": null,
    "fillinAnswers": null,
    "judgeAnswer": 0,
    "explainText": "",
    "answerPlay": null,
    "explainPlay": null
  },
  {
    "id": "32adc23a-9b3c-49a9-a357-2933b787e5d9",
    "examQuesId": "e83bb8df-b80c-4ae4-9365-da8184456871",
    "sourceId": "2f8cfb41-4701-4b13-88e1-03525ce2a8ce",
    "content": "公司中负责“中长期战略规划、市场洞察、品牌管理”的部门是？",
    "quesType": 0,
    "questionType": 0,
    "fileId": "",
    "tranStatus": null,
    "playDetails": null,
    "subQues": 0,
    "parentId": null,
    "orderIndex": 12,
    "itemCount": 4,
    "judgeCorrectOptionContent": "",
    "judgeWrongOptionContent": "",
    "choiceItems": [
      {
        "id": "b000ce83-3f06-432d-a99c-d9bc25a6f58e",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "e83bb8df-b80c-4ae4-9365-da8184456871",
        "itemContent": "销售与服务总部",
        "answer": 0,
        "orderIndex": 1,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "ed2f18db-70de-4db6-8b31-e75fc27df7e2",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "a1adc37e-ebf5-427d-9373-971547e970c7",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "e83bb8df-b80c-4ae4-9365-da8184456871",
        "itemContent": "产品研发总部",
        "answer": 0,
        "orderIndex": 2,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "9466550c-d5b1-4ced-b0e7-662fc0047be0",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "30116257-7877-4cfa-9a30-05bb5dfee554",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "e83bb8df-b80c-4ae4-9365-da8184456871",
        "itemContent": "战略与MKT部",
        "answer": 1,
        "orderIndex": 3,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "baa42314-af36-4f76-bba1-1a684545cb52",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "62c50bcc-a47e-4cb8-8d69-aa0c4e18516c",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "e83bb8df-b80c-4ae4-9365-da8184456871",
        "itemContent": "蓝光实验室",
        "answer": 0,
        "orderIndex": 4,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "450f01c8-a472-4c8d-9e23-4899701d3b15",
        "score": 0,
        "itemPlay": null
      }
    ],
    "fillInItems": null,
    "subQuesList": null,
    "corrected": 0,
    "fillinCorrectedInfo": null,
    "submitQuesAnswers": [
      "62c50bcc-a47e-4cb8-8d69-aa0c4e18516c"
    ],
    "correctAnswers": [
      "30116257-7877-4cfa-9a30-05bb5dfee554"
    ],
    "keywords": null,
    "fillinAnswers": null,
    "judgeAnswer": 0,
    "explainText": "",
    "answerPlay": null,
    "explainPlay": null
  },
  {
    "id": "4f370a8b-d9e9-4855-9cdd-4d5cc18a56bd",
    "examQuesId": "091e51a6-b1b1-43ae-9b81-9f16a20a7735",
    "sourceId": "39d4e5fc-c8d9-463f-a8e5-12996d90b2e1",
    "content": "2026年被公司定义为什么主题年？",
    "quesType": 0,
    "questionType": 0,
    "fileId": "",
    "tranStatus": null,
    "playDetails": null,
    "subQues": 0,
    "parentId": null,
    "orderIndex": 13,
    "itemCount": 4,
    "judgeCorrectOptionContent": "",
    "judgeWrongOptionContent": "",
    "choiceItems": [
      {
        "id": "5157762b-a986-4132-930d-8bb47d37dac4",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "091e51a6-b1b1-43ae-9b81-9f16a20a7735",
        "itemContent": "品牌升级年",
        "answer": 0,
        "orderIndex": 1,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "1cf85fc2-c612-4ae0-a1f4-4ae9d4f919e6",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "29a4af72-9bcd-41d1-8bc0-bfee0aa72ce9",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "091e51a6-b1b1-43ae-9b81-9f16a20a7735",
        "itemContent": "新品上市年",
        "answer": 1,
        "orderIndex": 2,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "c929cf8a-bd6a-4c08-b006-3c95c015c4bf",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "1bec26e6-1ae5-4a81-9444-19b62dcf3f8a",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "091e51a6-b1b1-43ae-9b81-9f16a20a7735",
        "itemContent": "生态合作年",
        "answer": 0,
        "orderIndex": 3,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "d2378e11-82e4-469e-a3a8-6e2c5a9b3319",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "eff8ca13-cbc7-4f3f-860f-113ad1f42306",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "091e51a6-b1b1-43ae-9b81-9f16a20a7735",
        "itemContent": "市场扩张年",
        "answer": 0,
        "orderIndex": 4,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "cfb55ce8-cae8-4c74-88cf-192c95a18f35",
        "score": 0,
        "itemPlay": null
      }
    ],
    "fillInItems": null,
    "subQuesList": null,
    "corrected": 0,
    "fillinCorrectedInfo": null,
    "submitQuesAnswers": [
      "eff8ca13-cbc7-4f3f-860f-113ad1f42306"
    ],
    "correctAnswers": [
      "29a4af72-9bcd-41d1-8bc0-bfee0aa72ce9"
    ],
    "keywords": null,
    "fillinAnswers": null,
    "judgeAnswer": 0,
    "explainText": "",
    "answerPlay": null,
    "explainPlay": null
  },
  {
    "id": "1d454ef7-da9a-433a-bcd6-1b7854cbf465",
    "examQuesId": "4c43415c-e415-4b1a-96b2-5d0a11f435b4",
    "sourceId": "1ced917f-bb3e-4d74-a4e8-4d4dde3a2001",
    "content": "通过市场洞察项目，事业部牵头输出的文件是什么？",
    "quesType": 0,
    "questionType": 0,
    "fileId": "",
    "tranStatus": null,
    "playDetails": null,
    "subQues": 0,
    "parentId": null,
    "orderIndex": 14,
    "itemCount": 4,
    "judgeCorrectOptionContent": "",
    "judgeWrongOptionContent": "",
    "choiceItems": [
      {
        "id": "f91ef22b-1633-4a4c-ab73-205153d66c2f",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "4c43415c-e415-4b1a-96b2-5d0a11f435b4",
        "itemContent": "《市场分析报告》",
        "answer": 0,
        "orderIndex": 1,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "23fa362d-1c12-40b0-bb79-38da037d04cd",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "a84697fa-2f21-42e5-8351-c4f6e7117a67",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "4c43415c-e415-4b1a-96b2-5d0a11f435b4",
        "itemContent": "《年度销售计划》",
        "answer": 0,
        "orderIndex": 2,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "aa06df66-0cc7-4dc6-849e-074b17354f97",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "8303efac-431a-40b2-b627-c086e74bc5eb",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "4c43415c-e415-4b1a-96b2-5d0a11f435b4",
        "itemContent": "《核心客户群与解决方案手册》",
        "answer": 1,
        "orderIndex": 3,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "b3cb5039-575d-4d4c-a31b-05f2616d7f88",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "c818014a-3233-439d-ad97-f4d55f90fa7f",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "4c43415c-e415-4b1a-96b2-5d0a11f435b4",
        "itemContent": "《产品技术白皮书》",
        "answer": 0,
        "orderIndex": 4,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "bee0d27b-9492-4376-bb4d-42b51248d37d",
        "score": 0,
        "itemPlay": null
      }
    ],
    "fillInItems": null,
    "subQuesList": null,
    "corrected": 1,
    "fillinCorrectedInfo": null,
    "submitQuesAnswers": [
      "8303efac-431a-40b2-b627-c086e74bc5eb"
    ],
    "correctAnswers": [
      "8303efac-431a-40b2-b627-c086e74bc5eb"
    ],
    "keywords": null,
    "fillinAnswers": null,
    "judgeAnswer": 0,
    "explainText": "",
    "answerPlay": null,
    "explainPlay": null
  },
  {
    "id": "5cecedfd-824d-4ece-8040-47a13a2cc221",
    "examQuesId": "ddb70da8-ee50-4b68-9619-45001dde70f6",
    "sourceId": "8f3150c5-eedd-45d4-bfb4-ce3aef067d1b",
    "content": "公司计划以多少家战略医院为支点构建生态网络？",
    "quesType": 0,
    "questionType": 0,
    "fileId": "",
    "tranStatus": null,
    "playDetails": null,
    "subQues": 0,
    "parentId": null,
    "orderIndex": 15,
    "itemCount": 4,
    "judgeCorrectOptionContent": "",
    "judgeWrongOptionContent": "",
    "choiceItems": [
      {
        "id": "a06e436d-8e05-4033-b353-52aec250dfd9",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "ddb70da8-ee50-4b68-9619-45001dde70f6",
        "itemContent": "200家",
        "answer": 0,
        "orderIndex": 1,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "1f9cfe91-b1ef-4778-94de-4c767d21551c",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "3239b1ed-5328-4b91-ba84-5d873e9f06fd",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "ddb70da8-ee50-4b68-9619-45001dde70f6",
        "itemContent": "300家",
        "answer": 0,
        "orderIndex": 2,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "c8b91c1b-ab36-4c81-a6c9-a5c82100e498",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "a3c9ef2f-3f87-4415-8a10-04d85ce8f6b0",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "ddb70da8-ee50-4b68-9619-45001dde70f6",
        "itemContent": "500家",
        "answer": 1,
        "orderIndex": 3,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "979a929c-045c-45b8-8833-4917fc9a9e18",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "1bc4de11-4050-42a8-b770-5fed185737ec",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "ddb70da8-ee50-4b68-9619-45001dde70f6",
        "itemContent": "1000家",
        "answer": 0,
        "orderIndex": 4,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "d127bb32-11a3-4e90-9b80-bd1cebf0a49f",
        "score": 0,
        "itemPlay": null
      }
    ],
    "fillInItems": null,
    "subQuesList": null,
    "corrected": 0,
    "fillinCorrectedInfo": null,
    "submitQuesAnswers": [
      "1bc4de11-4050-42a8-b770-5fed185737ec"
    ],
    "correctAnswers": [
      "a3c9ef2f-3f87-4415-8a10-04d85ce8f6b0"
    ],
    "keywords": null,
    "fillinAnswers": null,
    "judgeAnswer": 0,
    "explainText": "",
    "answerPlay": null,
    "explainPlay": null
  },
  {
    "id": "6aca9049-1394-4e0d-bb62-304bbcb2343e",
    "examQuesId": "af85e17c-d1dd-44d3-8346-0d6f42a68eab",
    "sourceId": "1fadf27c-e6c8-4531-ac25-b15dbd17ac90",
    "content": "在医院协同创新体系中嵌入专利与临床创新项目的__与__双维评审？",
    "quesType": 0,
    "questionType": 0,
    "fileId": "",
    "tranStatus": null,
    "playDetails": null,
    "subQues": 0,
    "parentId": null,
    "orderIndex": 16,
    "itemCount": 4,
    "judgeCorrectOptionContent": "",
    "judgeWrongOptionContent": "",
    "choiceItems": [
      {
        "id": "5f80f1b4-ad69-4438-83f5-b79695593969",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "af85e17c-d1dd-44d3-8346-0d6f42a68eab",
        "itemContent": "实用价值与商业价值",
        "answer": 0,
        "orderIndex": 1,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "c0025ddd-ec2b-4252-b3b3-cfa80a5c27f6",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "1f67a8b7-e8c8-4c2f-88ed-78097678d3c6",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "af85e17c-d1dd-44d3-8346-0d6f42a68eab",
        "itemContent": "客户价值与关系价值",
        "answer": 0,
        "orderIndex": 2,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "276dcbe8-25a5-4f62-bbe2-648afd771045",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "7e8c245f-55de-4fe9-87c7-1a032950c601",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "af85e17c-d1dd-44d3-8346-0d6f42a68eab",
        "itemContent": "客户价值与商业价值",
        "answer": 1,
        "orderIndex": 3,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "ed9de0d7-4703-4daa-abb1-ddbba6d5c9dc",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "4dfaa46b-4099-4789-be70-6141ad861d57",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "af85e17c-d1dd-44d3-8346-0d6f42a68eab",
        "itemContent": "实用价值与关系价值",
        "answer": 0,
        "orderIndex": 4,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "a5c29d43-9fb7-483b-8b55-7ff8a9926128",
        "score": 0,
        "itemPlay": null
      }
    ],
    "fillInItems": null,
    "subQuesList": null,
    "corrected": 0,
    "fillinCorrectedInfo": null,
    "submitQuesAnswers": [
      "4dfaa46b-4099-4789-be70-6141ad861d57"
    ],
    "correctAnswers": [
      "7e8c245f-55de-4fe9-87c7-1a032950c601"
    ],
    "keywords": null,
    "fillinAnswers": null,
    "judgeAnswer": 0,
    "explainText": "",
    "answerPlay": null,
    "explainPlay": null
  },
  {
    "id": "6e6bd09e-1ca9-4d70-b472-e486b3c46a80",
    "examQuesId": "ca840192-46d1-4ab5-ae87-7332fbe42a16",
    "sourceId": "dde639d9-064c-4347-a009-2e0b6e141c5e",
    "content": "医院创新项目转化费用的多少将作为平台费？",
    "quesType": 0,
    "questionType": 0,
    "fileId": "",
    "tranStatus": null,
    "playDetails": null,
    "subQues": 0,
    "parentId": null,
    "orderIndex": 17,
    "itemCount": 4,
    "judgeCorrectOptionContent": "",
    "judgeWrongOptionContent": "",
    "choiceItems": [
      {
        "id": "b5e9d36f-1183-44af-831b-5be2344f1cc8",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "ca840192-46d1-4ab5-ae87-7332fbe42a16",
        "itemContent": "0.05",
        "answer": 0,
        "orderIndex": 1,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "7f1de1a1-521f-4a14-84c8-7402c5a6c391",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "d3f586e3-ede4-40a9-8efc-8af6a5586c2f",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "ca840192-46d1-4ab5-ae87-7332fbe42a16",
        "itemContent": "0.1",
        "answer": 1,
        "orderIndex": 2,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "e921ba44-2fd3-4d41-83e8-bee473b3d3e2",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "6f7bcbb0-eb39-445a-a02f-ca755b4c3e44",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "ca840192-46d1-4ab5-ae87-7332fbe42a16",
        "itemContent": "0.15",
        "answer": 0,
        "orderIndex": 3,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "4aecf46b-267c-428a-a7a9-a0be5707248a",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "1508e917-9aa0-44d3-b5d7-76de6be04171",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "ca840192-46d1-4ab5-ae87-7332fbe42a16",
        "itemContent": "0.2",
        "answer": 0,
        "orderIndex": 4,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "7270d87d-ffc1-455c-9618-d6a9a81815ca",
        "score": 0,
        "itemPlay": null
      }
    ],
    "fillInItems": null,
    "subQuesList": null,
    "corrected": 0,
    "fillinCorrectedInfo": null,
    "submitQuesAnswers": [
      "1508e917-9aa0-44d3-b5d7-76de6be04171"
    ],
    "correctAnswers": [
      "d3f586e3-ede4-40a9-8efc-8af6a5586c2f"
    ],
    "keywords": null,
    "fillinAnswers": null,
    "judgeAnswer": 0,
    "explainText": "",
    "answerPlay": null,
    "explainPlay": null
  },
  {
    "id": "5b4e7c70-69f7-4036-be00-555201c44115",
    "examQuesId": "72f3bcf3-e811-46ab-9e7c-95bd2931438a",
    "sourceId": "836b5c8e-55e7-4b1b-a365-922422ee3a7a",
    "content": "国内市场的核心目标是与国内（）家顶尖及标杆医院建立长期、深度的战略合作关系？",
    "quesType": 0,
    "questionType": 0,
    "fileId": "",
    "tranStatus": null,
    "playDetails": null,
    "subQues": 0,
    "parentId": null,
    "orderIndex": 18,
    "itemCount": 4,
    "judgeCorrectOptionContent": "",
    "judgeWrongOptionContent": "",
    "choiceItems": [
      {
        "id": "41688cc3-47e0-4db4-8c22-8e594ae2dad9",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "72f3bcf3-e811-46ab-9e7c-95bd2931438a",
        "itemContent": "100",
        "answer": 0,
        "orderIndex": 1,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "4b2473de-efa3-46ea-93c0-cce521f92c59",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "05fc290a-4122-47f9-beb2-db50f000927c",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "72f3bcf3-e811-46ab-9e7c-95bd2931438a",
        "itemContent": "150",
        "answer": 0,
        "orderIndex": 2,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "f4e65c32-0bbb-4754-a145-222365c5d8cc",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "a408bb72-a480-4be1-ad77-0664f769f22f",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "72f3bcf3-e811-46ab-9e7c-95bd2931438a",
        "itemContent": "350",
        "answer": 0,
        "orderIndex": 3,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "7a0b4121-cd1d-4356-a4cf-721568213331",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "36a80919-32cf-4e3a-8649-b69ede349704",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "72f3bcf3-e811-46ab-9e7c-95bd2931438a",
        "itemContent": "500",
        "answer": 1,
        "orderIndex": 4,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "4d0c777a-3912-4ab4-8ca6-529193627165",
        "score": 0,
        "itemPlay": null
      }
    ],
    "fillInItems": null,
    "subQuesList": null,
    "corrected": 1,
    "fillinCorrectedInfo": null,
    "submitQuesAnswers": [
      "36a80919-32cf-4e3a-8649-b69ede349704"
    ],
    "correctAnswers": [
      "36a80919-32cf-4e3a-8649-b69ede349704"
    ],
    "keywords": null,
    "fillinAnswers": null,
    "judgeAnswer": 0,
    "explainText": "",
    "answerPlay": null,
    "explainPlay": null
  },
  {
    "id": "60dcdb26-aa3a-4e19-be8d-8ee9220089e0",
    "examQuesId": "ce83217a-c2de-4a3e-9fd9-0da2c803343e",
    "sourceId": "0f0ea4d8-0c63-4b06-9afc-16a0c7b083a2",
    "content": "从短期交易关系转向（长期价值共创与利益共享的战略合作伙伴关系），是什么模式转型？",
    "quesType": 0,
    "questionType": 0,
    "fileId": "",
    "tranStatus": null,
    "playDetails": null,
    "subQues": 0,
    "parentId": null,
    "orderIndex": 19,
    "itemCount": 4,
    "judgeCorrectOptionContent": "",
    "judgeWrongOptionContent": "",
    "choiceItems": [
      {
        "id": "35513c08-3464-494e-aec6-64ee8b7ce152",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "ce83217a-c2de-4a3e-9fd9-0da2c803343e",
        "itemContent": "客户中心化",
        "answer": 0,
        "orderIndex": 1,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "e36ac6b3-1608-4631-8cdf-ba11acbdad8d",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "ae00c80a-5217-4986-982e-43162f963fe4",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "ce83217a-c2de-4a3e-9fd9-0da2c803343e",
        "itemContent": "关系伙伴化",
        "answer": 1,
        "orderIndex": 2,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "5dd57342-a658-49a5-8f61-79e15b954c7c",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "45f237c6-5261-43a7-8d8c-c0096749d913",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "ce83217a-c2de-4a3e-9fd9-0da2c803343e",
        "itemContent": "角色平台化",
        "answer": 0,
        "orderIndex": 3,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "fcf587ca-936e-498c-b4a4-3f0eb7070bf7",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "fa5f7361-5153-422d-80cc-1b4ca6419298",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "ce83217a-c2de-4a3e-9fd9-0da2c803343e",
        "itemContent": "渠道立体化",
        "answer": 0,
        "orderIndex": 4,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "ded421a8-9f5e-4922-b22d-1c2e20e0c7a0",
        "score": 0,
        "itemPlay": null
      }
    ],
    "fillInItems": null,
    "subQuesList": null,
    "corrected": 0,
    "fillinCorrectedInfo": null,
    "submitQuesAnswers": [
      "fa5f7361-5153-422d-80cc-1b4ca6419298"
    ],
    "correctAnswers": [
      "ae00c80a-5217-4986-982e-43162f963fe4"
    ],
    "keywords": null,
    "fillinAnswers": null,
    "judgeAnswer": 0,
    "explainText": "",
    "answerPlay": null,
    "explainPlay": null
  },
  {
    "id": "8daf9b2b-e217-497e-9350-8a40b495bbc4",
    "examQuesId": "c1789d1d-67bd-4b3d-a2f3-26b0d7225ff4",
    "sourceId": "9180ed7b-314d-48e8-93bc-7a8ad0964b60",
    "content": "从渠道商驱动转向（终端客户的深度洞察与经营），是什么模式转型？",
    "quesType": 0,
    "questionType": 0,
    "fileId": "",
    "tranStatus": null,
    "playDetails": null,
    "subQues": 0,
    "parentId": null,
    "orderIndex": 20,
    "itemCount": 4,
    "judgeCorrectOptionContent": "",
    "judgeWrongOptionContent": "",
    "choiceItems": [
      {
        "id": "f2b217c9-9483-4ab2-b0bb-3213c38f2482",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "c1789d1d-67bd-4b3d-a2f3-26b0d7225ff4",
        "itemContent": "客户中心化",
        "answer": 1,
        "orderIndex": 1,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "15da13a9-9d0c-48cc-a856-220c1a90eea1",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "1ce9bf34-0f0c-4c03-854b-6b5dabb9761d",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "c1789d1d-67bd-4b3d-a2f3-26b0d7225ff4",
        "itemContent": "关系伙伴化",
        "answer": 0,
        "orderIndex": 2,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "e4ad9d1c-541c-4a59-b9ba-75b11cd4e76a",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "0a601580-04ef-47a9-bbf5-284d9cd0eba1",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "c1789d1d-67bd-4b3d-a2f3-26b0d7225ff4",
        "itemContent": "角色平台化",
        "answer": 0,
        "orderIndex": 3,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "60b2ee3b-7d48-47a1-9cc4-d2ae34c9159b",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "1b786f40-7c38-4231-954a-8fb19ca751f0",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "c1789d1d-67bd-4b3d-a2f3-26b0d7225ff4",
        "itemContent": "渠道立体化",
        "answer": 0,
        "orderIndex": 4,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "eb6d04b4-6365-4683-a429-9db832dd1495",
        "score": 0,
        "itemPlay": null
      }
    ],
    "fillInItems": null,
    "subQuesList": null,
    "corrected": 0,
    "fillinCorrectedInfo": null,
    "submitQuesAnswers": [
      "1b786f40-7c38-4231-954a-8fb19ca751f0"
    ],
    "correctAnswers": [
      "f2b217c9-9483-4ab2-b0bb-3213c38f2482"
    ],
    "keywords": null,
    "fillinAnswers": null,
    "judgeAnswer": 0,
    "explainText": "",
    "answerPlay": null,
    "explainPlay": null
  },
  {
    "id": "e2d8dd3f-9e52-4e74-b3fe-5fecf82cac0d",
    "examQuesId": "1ce4ab07-9c9e-418b-b539-2efc36cc84d6",
    "sourceId": "57a711ac-9472-43c4-94f3-df0b3a8c0f6f",
    "content": "从单一产品供应商转向（整合解决方案提供者及产业创新生态平台构建者），是什么模式转型？",
    "quesType": 0,
    "questionType": 0,
    "fileId": "",
    "tranStatus": null,
    "playDetails": null,
    "subQues": 0,
    "parentId": null,
    "orderIndex": 21,
    "itemCount": 4,
    "judgeCorrectOptionContent": "",
    "judgeWrongOptionContent": "",
    "choiceItems": [
      {
        "id": "fd7f0f83-eeb6-4c3d-a4db-64a9176dbf08",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "1ce4ab07-9c9e-418b-b539-2efc36cc84d6",
        "itemContent": "客户中心化",
        "answer": 0,
        "orderIndex": 1,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "68a91f2a-f961-4bbc-bad0-ad169b314576",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "c63cac13-a2eb-4773-8984-bc702bee7aba",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "1ce4ab07-9c9e-418b-b539-2efc36cc84d6",
        "itemContent": "关系伙伴化",
        "answer": 0,
        "orderIndex": 2,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "ba576327-5e28-40f8-b9ba-42717b8afe2f",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "7286df4d-0a1a-4fa1-9c53-f62f8e648293",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "1ce4ab07-9c9e-418b-b539-2efc36cc84d6",
        "itemContent": "角色平台化",
        "answer": 1,
        "orderIndex": 3,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "e0ba028b-2ea3-40a2-99a2-b8a26394bcbb",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "a6533653-4118-4a84-9fd3-c96f174d1594",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "1ce4ab07-9c9e-418b-b539-2efc36cc84d6",
        "itemContent": "渠道立体化",
        "answer": 0,
        "orderIndex": 4,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "1a5f7cbc-6375-4968-8a23-f757637c4d8a",
        "score": 0,
        "itemPlay": null
      }
    ],
    "fillInItems": null,
    "subQuesList": null,
    "corrected": 0,
    "fillinCorrectedInfo": null,
    "submitQuesAnswers": [
      "a6533653-4118-4a84-9fd3-c96f174d1594"
    ],
    "correctAnswers": [
      "7286df4d-0a1a-4fa1-9c53-f62f8e648293"
    ],
    "keywords": null,
    "fillinAnswers": null,
    "judgeAnswer": 0,
    "explainText": "",
    "answerPlay": null,
    "explainPlay": null
  },
  {
    "id": "d9979ed7-9968-46fc-8913-74a74450364f",
    "examQuesId": "a5eb8e61-86a5-45cb-97cd-60c60185989f",
    "sourceId": "5b8a35aa-9e77-4108-8198-821265b3fbf1",
    "content": "拓展直销（专注战略客户、大客户）与联合直销（与合作伙伴共拓市场），实现渠道可控与市场渗透的平衡，是什么模式转型？",
    "quesType": 0,
    "questionType": 0,
    "fileId": "",
    "tranStatus": null,
    "playDetails": null,
    "subQues": 0,
    "parentId": null,
    "orderIndex": 22,
    "itemCount": 4,
    "judgeCorrectOptionContent": "",
    "judgeWrongOptionContent": "",
    "choiceItems": [
      {
        "id": "c311367a-2360-48f6-b3e2-f0b926452f23",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "a5eb8e61-86a5-45cb-97cd-60c60185989f",
        "itemContent": "客户中心化",
        "answer": 0,
        "orderIndex": 1,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "209a1bfd-7e57-4c51-8f7a-dae90e078164",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "312bd0c1-595a-4b63-bee6-bb1f4f8bcf2d",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "a5eb8e61-86a5-45cb-97cd-60c60185989f",
        "itemContent": "关系伙伴化",
        "answer": 0,
        "orderIndex": 2,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "b012a70b-3402-4a08-874b-3c88d1368ecf",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "dd6d56f0-2f59-4da1-af69-fd086fa88f78",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "a5eb8e61-86a5-45cb-97cd-60c60185989f",
        "itemContent": "角色平台化",
        "answer": 0,
        "orderIndex": 3,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "10f34e9e-6a1a-4e43-83e3-558b2d8aff3d",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "2ac7fdf5-3185-4ce2-9e5f-111bfe8d944d",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "a5eb8e61-86a5-45cb-97cd-60c60185989f",
        "itemContent": "渠道立体化",
        "answer": 1,
        "orderIndex": 4,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "b1e9b502-9b18-4600-8e73-e195f197732e",
        "score": 0,
        "itemPlay": null
      }
    ],
    "fillInItems": null,
    "subQuesList": null,
    "corrected": 1,
    "fillinCorrectedInfo": null,
    "submitQuesAnswers": [
      "2ac7fdf5-3185-4ce2-9e5f-111bfe8d944d"
    ],
    "correctAnswers": [
      "2ac7fdf5-3185-4ce2-9e5f-111bfe8d944d"
    ],
    "keywords": null,
    "fillinAnswers": null,
    "judgeAnswer": 0,
    "explainText": "",
    "answerPlay": null,
    "explainPlay": null
  },
  {
    "id": "44f4f611-24d8-4a92-8bc0-ccb7597fe360",
    "examQuesId": "594c9c05-1252-4c0b-8592-0f50349eca36",
    "sourceId": "4b063f10-b106-4d69-a70d-8f1f03a2a08c",
    "content": "销售策略的关键策略举措中，“铁三角”深度落地，“铁三角”人员组成是？",
    "quesType": 0,
    "questionType": 0,
    "fileId": "",
    "tranStatus": null,
    "playDetails": null,
    "subQues": 0,
    "parentId": null,
    "orderIndex": 23,
    "itemCount": 4,
    "judgeCorrectOptionContent": "",
    "judgeWrongOptionContent": "",
    "choiceItems": [
      {
        "id": "842d3ecb-92bf-436d-9bad-0304c6e1493f",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "594c9c05-1252-4c0b-8592-0f50349eca36",
        "itemContent": "客户经理+解决方案专家+交付服务专家",
        "answer": 1,
        "orderIndex": 1,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "09ee7798-ae58-4d9b-92cf-f154453648da",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "f9ce799e-4b83-4993-90b8-cf420a896ea0",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "594c9c05-1252-4c0b-8592-0f50349eca36",
        "itemContent": "项目经理+解决方案专家+交付服务专家",
        "answer": 0,
        "orderIndex": 2,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "cfeaac21-2234-4c4b-a426-a8e7e9cf2c69",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "054b769b-80be-49b1-820e-9cd0b3da19a6",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "594c9c05-1252-4c0b-8592-0f50349eca36",
        "itemContent": "市场经理+解决方案专家+临床专家",
        "answer": 0,
        "orderIndex": 3,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "0ec968f6-7a40-47dc-b836-73487715edf3",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "de7978d7-e188-4cbf-8a5d-4d1e538efcb8",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "594c9c05-1252-4c0b-8592-0f50349eca36",
        "itemContent": "客户经理+解决方案专家+临床专家",
        "answer": 0,
        "orderIndex": 4,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "a6c2b38d-4bfa-4ce3-af4c-5438c10f0a3a",
        "score": 0,
        "itemPlay": null
      }
    ],
    "fillInItems": null,
    "subQuesList": null,
    "corrected": 0,
    "fillinCorrectedInfo": null,
    "submitQuesAnswers": [
      "de7978d7-e188-4cbf-8a5d-4d1e538efcb8"
    ],
    "correctAnswers": [
      "842d3ecb-92bf-436d-9bad-0304c6e1493f"
    ],
    "keywords": null,
    "fillinAnswers": null,
    "judgeAnswer": 0,
    "explainText": "",
    "answerPlay": null,
    "explainPlay": null
  },
  {
    "id": "d9066730-3902-42e5-8112-03c06b7b26e6",
    "examQuesId": "077b25c0-d16d-4d6e-a44a-09a5709aa0d9",
    "sourceId": "8ec92414-6d80-4707-95d5-39fd810b95a0",
    "content": "区域市场精耕：打造标杆样板，不包括哪个？",
    "quesType": 0,
    "questionType": 0,
    "fileId": "",
    "tranStatus": null,
    "playDetails": null,
    "subQues": 0,
    "parentId": null,
    "orderIndex": 24,
    "itemCount": 4,
    "judgeCorrectOptionContent": "",
    "judgeWrongOptionContent": "",
    "choiceItems": [
      {
        "id": "10471972-ffb1-4947-a32c-7e0c353aa610",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "077b25c0-d16d-4d6e-a44a-09a5709aa0d9",
        "itemContent": "“一省一策”与战略非战略二选一",
        "answer": 0,
        "orderIndex": 1,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "6ee76fbd-055b-468b-8ce3-894b9b26ddc0",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "55addf92-10e0-47b4-a665-fd07a9bbb1e7",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "077b25c0-d16d-4d6e-a44a-09a5709aa0d9",
        "itemContent": "样板医院建设",
        "answer": 0,
        "orderIndex": 2,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "93012dec-ed5e-4cbd-a988-eab628bcc43c",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "0f5a99ff-ad98-4890-a5c5-1aed4ffda4e9",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "077b25c0-d16d-4d6e-a44a-09a5709aa0d9",
        "itemContent": "经验固化与推广",
        "answer": 0,
        "orderIndex": 3,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "de99df8e-c254-465d-8024-3c8d5c78da24",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "04443f76-71dc-43cd-87e7-27a1047c408d",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "077b25c0-d16d-4d6e-a44a-09a5709aa0d9",
        "itemContent": "低价策略",
        "answer": 1,
        "orderIndex": 4,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "fe9b5642-1413-4532-a3ff-92977d402144",
        "score": 0,
        "itemPlay": null
      }
    ],
    "fillInItems": null,
    "subQuesList": null,
    "corrected": 1,
    "fillinCorrectedInfo": null,
    "submitQuesAnswers": [
      "04443f76-71dc-43cd-87e7-27a1047c408d"
    ],
    "correctAnswers": [
      "04443f76-71dc-43cd-87e7-27a1047c408d"
    ],
    "keywords": null,
    "fillinAnswers": null,
    "judgeAnswer": 0,
    "explainText": "",
    "answerPlay": null,
    "explainPlay": null
  },
  {
    "id": "28a14733-0d3a-4e81-bdc8-e3806483227e",
    "examQuesId": "a9e1e262-81a2-4ea7-81c8-4814f344453c",
    "sourceId": "454fb457-f738-4d88-89f7-9c9dce3d1717",
    "content": "国产替代攻坚：选择对国产友好的标杆医院/KOL进行试点替代，形成示范案例。是哪种系统化替代路径？",
    "quesType": 0,
    "questionType": 0,
    "fileId": "",
    "tranStatus": null,
    "playDetails": null,
    "subQues": 0,
    "parentId": null,
    "orderIndex": 25,
    "itemCount": 4,
    "judgeCorrectOptionContent": "",
    "judgeWrongOptionContent": "",
    "choiceItems": [
      {
        "id": "82303f7b-de51-4090-b0f5-53989b05c1ca",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "a9e1e262-81a2-4ea7-81c8-4814f344453c",
        "itemContent": "标杆替代",
        "answer": 1,
        "orderIndex": 1,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "8c41d0cd-6483-4674-bcd0-656c465e9040",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "4322c2aa-f8f5-44b5-9f70-8c519d485f71",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "a9e1e262-81a2-4ea7-81c8-4814f344453c",
        "itemContent": "普通替代",
        "answer": 0,
        "orderIndex": 2,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "5cea8886-dc1a-41cc-96aa-b55fef65ff6d",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "123cc10c-d15b-445a-b9a1-275b92ee3463",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "a9e1e262-81a2-4ea7-81c8-4814f344453c",
        "itemContent": "小规模传播",
        "answer": 0,
        "orderIndex": 3,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "065d9831-da20-4f7f-a9dd-48733ab1702a",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "bbc4b333-349f-4954-af6a-a1009febda86",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "a9e1e262-81a2-4ea7-81c8-4814f344453c",
        "itemContent": "规模推广",
        "answer": 0,
        "orderIndex": 4,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "ea49dae3-2ebc-4877-b8fb-e7b1cdd15870",
        "score": 0,
        "itemPlay": null
      }
    ],
    "fillInItems": null,
    "subQuesList": null,
    "corrected": 0,
    "fillinCorrectedInfo": null,
    "submitQuesAnswers": [
      "bbc4b333-349f-4954-af6a-a1009febda86"
    ],
    "correctAnswers": [
      "82303f7b-de51-4090-b0f5-53989b05c1ca"
    ],
    "keywords": null,
    "fillinAnswers": null,
    "judgeAnswer": 0,
    "explainText": "",
    "answerPlay": null,
    "explainPlay": null
  },
  {
    "id": "687edcf9-1174-4064-a5ad-e6bf52e16471",
    "examQuesId": "e7be103f-002f-4766-bf71-d83b45753bdf",
    "sourceId": "ed53383e-ae31-4c56-8364-4e18c64219cb",
    "content": "国产替代攻坚：通过学术会议、标杆参观、数据发布、线上轰炸等方式，进行全国性推广。是哪种系统化替代路径？",
    "quesType": 0,
    "questionType": 0,
    "fileId": "",
    "tranStatus": null,
    "playDetails": null,
    "subQues": 0,
    "parentId": null,
    "orderIndex": 26,
    "itemCount": 4,
    "judgeCorrectOptionContent": "",
    "judgeWrongOptionContent": "",
    "choiceItems": [
      {
        "id": "903ce9d7-cc2c-4133-a7af-0ed790358ef9",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "e7be103f-002f-4766-bf71-d83b45753bdf",
        "itemContent": "标杆替代",
        "answer": 0,
        "orderIndex": 1,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "d5c1921f-143e-4d65-bc62-fc31361968ff",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "52e423bd-7b27-4bf6-8191-37975f25f815",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "e7be103f-002f-4766-bf71-d83b45753bdf",
        "itemContent": "普通替代",
        "answer": 0,
        "orderIndex": 2,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "43086c28-3ea5-4698-b275-50f86f67316d",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "0eb22eb0-56b1-4cd9-923f-ce3421dbfb5e",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "e7be103f-002f-4766-bf71-d83b45753bdf",
        "itemContent": "小规模传播",
        "answer": 0,
        "orderIndex": 3,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "26f39803-e027-4aec-8579-a24b74e017b8",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "cb162d71-8c75-411a-8fde-81190a9c1494",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "e7be103f-002f-4766-bf71-d83b45753bdf",
        "itemContent": "规模推广",
        "answer": 1,
        "orderIndex": 4,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "ff60a3e9-6ebf-437d-b235-2c7bf7a31171",
        "score": 0,
        "itemPlay": null
      }
    ],
    "fillInItems": null,
    "subQuesList": null,
    "corrected": 1,
    "fillinCorrectedInfo": null,
    "submitQuesAnswers": [
      "cb162d71-8c75-411a-8fde-81190a9c1494"
    ],
    "correctAnswers": [
      "cb162d71-8c75-411a-8fde-81190a9c1494"
    ],
    "keywords": null,
    "fillinAnswers": null,
    "judgeAnswer": 0,
    "explainText": "",
    "answerPlay": null,
    "explainPlay": null
  },
  {
    "id": "2aef42d3-0a7c-4261-9d1f-bae567817b71",
    "examQuesId": "0af7431f-5c67-41d0-a30a-a47d85075f48",
    "sourceId": "58761833-90fa-4d10-80d5-ec95cf2c7922",
    "content": "销售策略的关键策略举措中，集采市场决胜目标：确保在国家、省级等带量采购中应中尽中，中标即（），上量即盈利。",
    "quesType": 0,
    "questionType": 0,
    "fileId": "",
    "tranStatus": null,
    "playDetails": null,
    "subQues": 0,
    "parentId": null,
    "orderIndex": 27,
    "itemCount": 4,
    "judgeCorrectOptionContent": "",
    "judgeWrongOptionContent": "",
    "choiceItems": [
      {
        "id": "46bc928f-67b5-45ed-8351-12d10a6a8050",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "0af7431f-5c67-41d0-a30a-a47d85075f48",
        "itemContent": "成功",
        "answer": 0,
        "orderIndex": 1,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "102ef4d8-f802-4905-b9d1-c3453512b581",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "fa20f84b-b2c3-4cdc-9c08-2f9b40014163",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "0af7431f-5c67-41d0-a30a-a47d85075f48",
        "itemContent": "上量",
        "answer": 1,
        "orderIndex": 2,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "c18af9b5-93d9-40de-b323-6d8530e0d3af",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "d27f191e-b373-4b8a-b34f-9c3934f2ac86",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "0af7431f-5c67-41d0-a30a-a47d85075f48",
        "itemContent": "盈利",
        "answer": 0,
        "orderIndex": 3,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "c30eb2f5-fc96-4f5b-8e23-350d06045859",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "a8d16820-1ba7-4ea7-9ef4-f704c66d615c",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "0af7431f-5c67-41d0-a30a-a47d85075f48",
        "itemContent": "回款",
        "answer": 0,
        "orderIndex": 4,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "6cdf98c0-6a65-429b-9f07-fd3b566fec8d",
        "score": 0,
        "itemPlay": null
      }
    ],
    "fillInItems": null,
    "subQuesList": null,
    "corrected": 0,
    "fillinCorrectedInfo": null,
    "submitQuesAnswers": [
      "a8d16820-1ba7-4ea7-9ef4-f704c66d615c"
    ],
    "correctAnswers": [
      "fa20f84b-b2c3-4cdc-9c08-2f9b40014163"
    ],
    "keywords": null,
    "fillinAnswers": null,
    "judgeAnswer": 0,
    "explainText": "",
    "answerPlay": null,
    "explainPlay": null
  },
  {
    "id": "d6645c16-1386-4ffb-af36-614f2d73accf",
    "examQuesId": "82b41a31-9d53-479c-bb94-3aeef94052e6",
    "sourceId": "3e208bdf-4939-471c-9d9c-e14dae6b0938",
    "content": "销售策略的关键策略举措中，创新生态驱动不包括？",
    "quesType": 0,
    "questionType": 0,
    "fileId": "",
    "tranStatus": null,
    "playDetails": null,
    "subQues": 0,
    "parentId": null,
    "orderIndex": 28,
    "itemCount": 4,
    "judgeCorrectOptionContent": "",
    "judgeWrongOptionContent": "",
    "choiceItems": [
      {
        "id": "3dfba438-47a3-4433-95d2-ea52a994e7a1",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "82b41a31-9d53-479c-bb94-3aeef94052e6",
        "itemContent": "创新联盟",
        "answer": 0,
        "orderIndex": 1,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "38e918ab-df2d-40a0-b7a1-d0ed240f4261",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "b9bd4962-cb65-4812-91ff-b0a9e8bcaf21",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "82b41a31-9d53-479c-bb94-3aeef94052e6",
        "itemContent": "百家应用网络",
        "answer": 0,
        "orderIndex": 2,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "3924b9f2-22a6-4765-ae87-b55d6608cfda",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "dd9afbe6-d427-4b5f-a91e-1358da053c72",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "82b41a31-9d53-479c-bb94-3aeef94052e6",
        "itemContent": "直销、分销",
        "answer": 1,
        "orderIndex": 3,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "29270b39-2ea1-4748-a858-d3963e5fa2eb",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "7d8b7c18-cb90-41b8-9d72-5e1210baf9b7",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "82b41a31-9d53-479c-bb94-3aeef94052e6",
        "itemContent": "生态反哺",
        "answer": 0,
        "orderIndex": 4,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "4d226af7-0991-486c-b16a-05238dbcd8ac",
        "score": 0,
        "itemPlay": null
      }
    ],
    "fillInItems": null,
    "subQuesList": null,
    "corrected": 1,
    "fillinCorrectedInfo": null,
    "submitQuesAnswers": [
      "dd9afbe6-d427-4b5f-a91e-1358da053c72"
    ],
    "correctAnswers": [
      "dd9afbe6-d427-4b5f-a91e-1358da053c72"
    ],
    "keywords": null,
    "fillinAnswers": null,
    "judgeAnswer": 0,
    "explainText": "",
    "answerPlay": null,
    "explainPlay": null
  },
  {
    "id": "82585396-a35b-4e20-84dd-0acf00c91863",
    "examQuesId": "9f7382d0-6260-421e-9cd4-93f0d48eb85f",
    "sourceId": "eb067d3c-4fec-4560-ba2c-97e92e6bb160",
    "content": "销售策略的关键策略举措中，竞争管理升级的目标：实现从_(1)_应战到_(2)_谋局的竞争格局掌控。",
    "quesType": 0,
    "questionType": 0,
    "fileId": "",
    "tranStatus": null,
    "playDetails": null,
    "subQues": 0,
    "parentId": null,
    "orderIndex": 29,
    "itemCount": 4,
    "judgeCorrectOptionContent": "",
    "judgeWrongOptionContent": "",
    "choiceItems": [
      {
        "id": "2c5cda18-7a3b-4bae-8d07-e20a22f27597",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "9f7382d0-6260-421e-9cd4-93f0d48eb85f",
        "itemContent": "(1)被动，(2)主动",
        "answer": 1,
        "orderIndex": 1,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "7d698d32-95e5-45c8-a41f-c81e8f45de04",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "1ceb9726-1255-431f-9b0a-5e4eba4a4be9",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "9f7382d0-6260-421e-9cd4-93f0d48eb85f",
        "itemContent": "(1)主动，(2)被动",
        "answer": 0,
        "orderIndex": 2,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "38c6d9fc-df83-4147-81d7-8c7189136202",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "1ef04510-c0b0-4dcf-8ac9-b8413ddb26d2",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "9f7382d0-6260-421e-9cd4-93f0d48eb85f",
        "itemContent": "(1)被动，(2)被动",
        "answer": 0,
        "orderIndex": 3,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "b476574e-8817-4507-bd26-e3e8bb048ca5",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "d37e0c89-9bc7-4225-b390-b80675f61918",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "9f7382d0-6260-421e-9cd4-93f0d48eb85f",
        "itemContent": "(1)主动，(2)主动",
        "answer": 0,
        "orderIndex": 4,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "daf33511-c8e4-467f-becb-e2cfda4c889c",
        "score": 0,
        "itemPlay": null
      }
    ],
    "fillInItems": null,
    "subQuesList": null,
    "corrected": 0,
    "fillinCorrectedInfo": null,
    "submitQuesAnswers": [
      "d37e0c89-9bc7-4225-b390-b80675f61918"
    ],
    "correctAnswers": [
      "2c5cda18-7a3b-4bae-8d07-e20a22f27597"
    ],
    "keywords": null,
    "fillinAnswers": null,
    "judgeAnswer": 0,
    "explainText": "",
    "answerPlay": null,
    "explainPlay": null
  },
  {
    "id": "a16aaba8-6a11-46a5-9074-6f1f31696b82",
    "examQuesId": "ec109a51-6437-4696-8609-63973cd58e63",
    "sourceId": "b323ae49-2146-4d9f-9732-34b195d850e5",
    "content": "销售策略的关键策略举措中，竞争管理升级，三层管理区域级是？",
    "quesType": 0,
    "questionType": 0,
    "fileId": "",
    "tranStatus": null,
    "playDetails": null,
    "subQues": 0,
    "parentId": null,
    "orderIndex": 30,
    "itemCount": 4,
    "judgeCorrectOptionContent": "",
    "judgeWrongOptionContent": "",
    "choiceItems": [
      {
        "id": "902ed016-daab-4a45-8b59-f38cf5fb5025",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "ec109a51-6437-4696-8609-63973cd58e63",
        "itemContent": "制定整体竞争战略，管理核心产品线与关键对手",
        "answer": 0,
        "orderIndex": 1,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "3c12876a-1505-47ad-bec0-0eff08ba74d8",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "0e04c107-3bba-413f-bacc-8661de022a82",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "ec109a51-6437-4696-8609-63973cd58e63",
        "itemContent": "针对具体产品，制定差异化竞争策略",
        "answer": 0,
        "orderIndex": 2,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "e4c9409c-a50a-4f77-9d48-68199581d9fb",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "391337cc-a6f3-4f3f-a681-215eac94fdd6",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "ec109a51-6437-4696-8609-63973cd58e63",
        "itemContent": "识别区域重点竞争对手，制定区域“夺标（灯塔医院）”与“守仓（核心市场）”计划",
        "answer": 1,
        "orderIndex": 3,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "ecc85388-7203-4db5-bd19-985a4a2d8593",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "07bf10f5-801c-4ae9-b814-9664eb608a6b",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "ec109a51-6437-4696-8609-63973cd58e63",
        "itemContent": "实现从被动应战到主动谋局的竞争格局掌控",
        "answer": 0,
        "orderIndex": 4,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "6e66db03-8a5f-41e0-90a6-92b8bbc16b66",
        "score": 0,
        "itemPlay": null
      }
    ],
    "fillInItems": null,
    "subQuesList": null,
    "corrected": 0,
    "fillinCorrectedInfo": null,
    "submitQuesAnswers": [
      "07bf10f5-801c-4ae9-b814-9664eb608a6b"
    ],
    "correctAnswers": [
      "391337cc-a6f3-4f3f-a681-215eac94fdd6"
    ],
    "keywords": null,
    "fillinAnswers": null,
    "judgeAnswer": 0,
    "explainText": "",
    "answerPlay": null,
    "explainPlay": null
  },
  {
    "id": "8ced20b9-bc53-4402-ac5f-abfaa9c63f7c",
    "examQuesId": "625fb3f9-f6e9-410b-afeb-623b25989b5a",
    "sourceId": "e9be299e-91ea-4f39-9dc4-4bd452c168d5",
    "content": "研发与技术战略中，导向转变要求从“不拘一格降成本”向下列（）转变？",
    "quesType": 0,
    "questionType": 0,
    "fileId": "",
    "tranStatus": null,
    "playDetails": null,
    "subQues": 0,
    "parentId": null,
    "orderIndex": 31,
    "itemCount": 4,
    "judgeCorrectOptionContent": "",
    "judgeWrongOptionContent": "",
    "choiceItems": [
      {
        "id": "3120826b-4b0b-4936-afdc-d761d7004274",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "625fb3f9-f6e9-410b-afeb-623b25989b5a",
        "itemContent": "集采突围",
        "answer": 0,
        "orderIndex": 1,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "85fa82f0-2003-4d6f-8184-7abf1ac70873",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "d29b72ca-ecf8-46b0-a526-bb3ee09dbf4f",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "625fb3f9-f6e9-410b-afeb-623b25989b5a",
        "itemContent": "创新生态",
        "answer": 0,
        "orderIndex": 2,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "e332dcda-5072-48c1-9825-92bb654df3b2",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "fe254d35-0289-46e5-abec-9a2304a885c0",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "625fb3f9-f6e9-410b-afeb-623b25989b5a",
        "itemContent": "提质降本",
        "answer": 1,
        "orderIndex": 3,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "02878a90-7d5e-412f-8eb4-b65739100ee1",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "b45205f3-4cee-4c4e-8065-94f2878da4c7",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "625fb3f9-f6e9-410b-afeb-623b25989b5a",
        "itemContent": "技术独立",
        "answer": 0,
        "orderIndex": 4,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "6c31454d-ba90-45b5-a1fa-df39d83fc056",
        "score": 0,
        "itemPlay": null
      }
    ],
    "fillInItems": null,
    "subQuesList": null,
    "corrected": 0,
    "fillinCorrectedInfo": null,
    "submitQuesAnswers": [
      "b45205f3-4cee-4c4e-8065-94f2878da4c7"
    ],
    "correctAnswers": [
      "fe254d35-0289-46e5-abec-9a2304a885c0"
    ],
    "keywords": null,
    "fillinAnswers": null,
    "judgeAnswer": 0,
    "explainText": "",
    "answerPlay": null,
    "explainPlay": null
  },
  {
    "id": "c4d3d359-f9ae-424e-8aea-3a56e502c567",
    "examQuesId": "47636b60-73fe-4449-9967-8ed7fb17344e",
    "sourceId": "0274d56b-d2ed-4289-9ec0-da1bf0e67461",
    "content": "研发与技术战略中，导向转变要求从“同质化抄袭”向（）双轮驱动转变？",
    "quesType": 0,
    "questionType": 0,
    "fileId": "",
    "tranStatus": null,
    "playDetails": null,
    "subQues": 0,
    "parentId": null,
    "orderIndex": 32,
    "itemCount": 4,
    "judgeCorrectOptionContent": "",
    "judgeWrongOptionContent": "",
    "choiceItems": [
      {
        "id": "d59c5e2b-d169-47f5-b185-cec3d4d809a1",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "47636b60-73fe-4449-9967-8ed7fb17344e",
        "itemContent": "市场与临床需求导向",
        "answer": 1,
        "orderIndex": 1,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "4ef1fd6c-89e8-4d40-b382-ff6efc1e2228",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "5586dca8-b934-4bec-92e8-1010c2c6f4a0",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "47636b60-73fe-4449-9967-8ed7fb17344e",
        "itemContent": "市场需求",
        "answer": 0,
        "orderIndex": 2,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "d9dcc2f2-0f11-40a5-b47c-2a8725fb16c7",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "537de7ca-9c98-4891-bd50-26d44c861a8f",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "47636b60-73fe-4449-9967-8ed7fb17344e",
        "itemContent": "临床需求",
        "answer": 0,
        "orderIndex": 3,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "6a2db5e5-c385-496e-8b3c-cd2f88cd5837",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "4ea02140-fcd1-46a6-bc45-f7656113c6c9",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "47636b60-73fe-4449-9967-8ed7fb17344e",
        "itemContent": "科研能力与临床需求导向",
        "answer": 0,
        "orderIndex": 4,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "f12e2e50-3cdd-4195-b1ec-bdbc49486216",
        "score": 0,
        "itemPlay": null
      }
    ],
    "fillInItems": null,
    "subQuesList": null,
    "corrected": 0,
    "fillinCorrectedInfo": null,
    "submitQuesAnswers": [
      "537de7ca-9c98-4891-bd50-26d44c861a8f"
    ],
    "correctAnswers": [
      "d59c5e2b-d169-47f5-b185-cec3d4d809a1"
    ],
    "keywords": null,
    "fillinAnswers": null,
    "judgeAnswer": 0,
    "explainText": "",
    "answerPlay": null,
    "explainPlay": null
  },
  {
    "id": "769dad8d-8f59-476d-8c16-f507ed2b5736",
    "examQuesId": "c442ef66-aead-4cb0-ae20-e4dea951ec87",
    "sourceId": "525289ff-0f44-44e9-8343-455d7dcbe224",
    "content": "研发与技术战略中，产品升级转型：由低值通用耗材逐步转向（）治疗耗材和（）中小型设备？",
    "quesType": 0,
    "questionType": 0,
    "fileId": "",
    "tranStatus": null,
    "playDetails": null,
    "subQues": 0,
    "parentId": null,
    "orderIndex": 33,
    "itemCount": 4,
    "judgeCorrectOptionContent": "",
    "judgeWrongOptionContent": "",
    "choiceItems": [
      {
        "id": "a8803666-0524-4ec7-b1ca-c778384a472e",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "c442ef66-aead-4cb0-ae20-e4dea951ec87",
        "itemContent": "低值，易携带",
        "answer": 0,
        "orderIndex": 1,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "0cad0dfe-ae42-4920-82c3-ccb713329bae",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "c8b36f49-c9d2-43fa-8449-87b6e6f97734",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "c442ef66-aead-4cb0-ae20-e4dea951ec87",
        "itemContent": "高值，智能化",
        "answer": 1,
        "orderIndex": 2,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "4e28baf2-6837-4b08-9ea8-da80cc6b5ae5",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "4132650e-0f85-49ac-876f-716bf6f9ea5b",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "c442ef66-aead-4cb0-ae20-e4dea951ec87",
        "itemContent": "低值，智能化",
        "answer": 0,
        "orderIndex": 3,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "a4718c5f-9435-4a8f-bf77-50bd25cf55d6",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "7a0f822d-7a2a-4067-a042-64aed53297fc",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "c442ef66-aead-4cb0-ae20-e4dea951ec87",
        "itemContent": "高值，机械化",
        "answer": 0,
        "orderIndex": 4,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "05c55531-f1b8-47f4-a075-661833aca4cc",
        "score": 0,
        "itemPlay": null
      }
    ],
    "fillInItems": null,
    "subQuesList": null,
    "corrected": 0,
    "fillinCorrectedInfo": null,
    "submitQuesAnswers": [
      "7a0f822d-7a2a-4067-a042-64aed53297fc"
    ],
    "correctAnswers": [
      "c8b36f49-c9d2-43fa-8449-87b6e6f97734"
    ],
    "keywords": null,
    "fillinAnswers": null,
    "judgeAnswer": 0,
    "explainText": "",
    "answerPlay": null,
    "explainPlay": null
  },
  {
    "id": "d1b585f3-7842-40e8-88f6-4b1eb533a0a2",
    "examQuesId": "2ea707cd-26c4-45d5-befa-390d266d5964",
    "sourceId": "e5f64564-1e8e-47a6-af0c-8eca38d5fbdb",
    "content": "研发与技术战略中，创新转化落地，三年实现一千余项战略医院创新项目转化，充分利用上海、北京、广东等地医疗政策和医疗器械（），实现研发在全国、生产在总部、注册在当地的协同模式？",
    "quesType": 0,
    "questionType": 0,
    "fileId": "",
    "tranStatus": null,
    "playDetails": null,
    "subQues": 0,
    "parentId": null,
    "orderIndex": 34,
    "itemCount": 4,
    "judgeCorrectOptionContent": "",
    "judgeWrongOptionContent": "",
    "choiceItems": [
      {
        "id": "dad2e180-0488-4a58-b255-7a05eaf6f776",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "2ea707cd-26c4-45d5-befa-390d266d5964",
        "itemContent": "注册人制度",
        "answer": 1,
        "orderIndex": 1,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "78578c37-ed18-47ac-bcc6-256d23c8efb3",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "176098e7-502b-49c2-9699-fa510f9ec694",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "2ea707cd-26c4-45d5-befa-390d266d5964",
        "itemContent": "产品需求",
        "answer": 0,
        "orderIndex": 2,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "82fc6051-d270-4370-a16f-07c465e8d982",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "fcec1a06-a82a-4287-9e3c-0aad17c8170e",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "2ea707cd-26c4-45d5-befa-390d266d5964",
        "itemContent": "国际化注册",
        "answer": 0,
        "orderIndex": 3,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "13d69071-da10-407d-8bd1-85f6a62e7bc0",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "a5160b46-5f35-4e38-92d5-670cfde04685",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "2ea707cd-26c4-45d5-befa-390d266d5964",
        "itemContent": "市场资源需求",
        "answer": 0,
        "orderIndex": 4,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "4755ca25-bae0-4ebb-bebe-aaeca7c9975e",
        "score": 0,
        "itemPlay": null
      }
    ],
    "fillInItems": null,
    "subQuesList": null,
    "corrected": 0,
    "fillinCorrectedInfo": null,
    "submitQuesAnswers": [
      "a5160b46-5f35-4e38-92d5-670cfde04685"
    ],
    "correctAnswers": [
      "dad2e180-0488-4a58-b255-7a05eaf6f776"
    ],
    "keywords": null,
    "fillinAnswers": null,
    "judgeAnswer": 0,
    "explainText": "",
    "answerPlay": null,
    "explainPlay": null
  },
  {
    "id": "619e968b-3b4f-43d2-9436-95e9498400ec",
    "examQuesId": "f1cf9b53-fa07-4094-bd1f-9a4e1ec99fe6",
    "sourceId": "f98fc4d2-d376-4ae4-be14-46cf4bfec68b",
    "content": "研发与技术战略中，短期聚焦（）类产品，保证增量，长期聚焦大市场、大机会的确定性的大产品，匹配充分的资源及人力？",
    "quesType": 0,
    "questionType": 0,
    "fileId": "",
    "tranStatus": null,
    "playDetails": null,
    "subQues": 0,
    "parentId": null,
    "orderIndex": 35,
    "itemCount": 3,
    "judgeCorrectOptionContent": "",
    "judgeWrongOptionContent": "",
    "choiceItems": [
      {
        "id": "3c9bbe83-5e82-4e63-9dc1-48c973b5e059",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "f1cf9b53-fa07-4094-bd1f-9a4e1ec99fe6",
        "itemContent": "H2",
        "answer": 1,
        "orderIndex": 1,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "8fc56abe-df61-45d2-aa09-7fe8c27e5688",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "ec98dbfe-2762-4469-a5be-90811f485eca",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "f1cf9b53-fa07-4094-bd1f-9a4e1ec99fe6",
        "itemContent": "H1",
        "answer": 0,
        "orderIndex": 2,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "11e45cad-7632-46ab-bdc9-3e3219c2802b",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "d3cd5955-23d7-4723-9cda-659f8df9af81",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "f1cf9b53-fa07-4094-bd1f-9a4e1ec99fe6",
        "itemContent": "H3",
        "answer": 0,
        "orderIndex": 3,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "76869a64-2563-447d-837e-7532ed032a2c",
        "score": 0,
        "itemPlay": null
      }
    ],
    "fillInItems": null,
    "subQuesList": null,
    "corrected": 0,
    "fillinCorrectedInfo": null,
    "submitQuesAnswers": [
      "d3cd5955-23d7-4723-9cda-659f8df9af81"
    ],
    "correctAnswers": [
      "3c9bbe83-5e82-4e63-9dc1-48c973b5e059"
    ],
    "keywords": null,
    "fillinAnswers": null,
    "judgeAnswer": 0,
    "explainText": "",
    "answerPlay": null,
    "explainPlay": null
  },
  {
    "id": "05a9e4d0-5a73-4de0-8e40-aa8127dd8566",
    "examQuesId": "215fcf95-de31-42db-8b69-de09364f9e75",
    "sourceId": "77396fa4-4dbe-4256-8595-cd3a5ce1cef3",
    "content": "人力资源战略,全面推行流程型矩阵式组织，强化“（）”作战单元？",
    "quesType": 0,
    "questionType": 0,
    "fileId": "",
    "tranStatus": null,
    "playDetails": null,
    "subQues": 0,
    "parentId": null,
    "orderIndex": 36,
    "itemCount": 4,
    "judgeCorrectOptionContent": "",
    "judgeWrongOptionContent": "",
    "choiceItems": [
      {
        "id": "4c5082af-1000-44bf-972b-ca164d3f2430",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "215fcf95-de31-42db-8b69-de09364f9e75",
        "itemContent": "客户经理",
        "answer": 0,
        "orderIndex": 1,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "8c80ee58-ff4a-4fc1-80f9-e8e8a1f046d0",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "67c55ade-516c-40b7-a15f-3e09dc059b58",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "215fcf95-de31-42db-8b69-de09364f9e75",
        "itemContent": "市场经理",
        "answer": 0,
        "orderIndex": 2,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "f14386bb-5cc7-4446-bc0d-526d032e8be8",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "f571954d-eb52-4689-aecd-1861eb7480d1",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "215fcf95-de31-42db-8b69-de09364f9e75",
        "itemContent": "解决方案经理",
        "answer": 0,
        "orderIndex": 3,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "2297ba68-1d6f-4c66-bb70-474fb1c3b711",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "330a7a02-0f97-46bc-b48e-d11476b56d90",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "215fcf95-de31-42db-8b69-de09364f9e75",
        "itemContent": "铁三角",
        "answer": 1,
        "orderIndex": 4,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "2dc980ad-dc03-44a2-8b94-4e11b69d516d",
        "score": 0,
        "itemPlay": null
      }
    ],
    "fillInItems": null,
    "subQuesList": null,
    "corrected": 1,
    "fillinCorrectedInfo": null,
    "submitQuesAnswers": [
      "330a7a02-0f97-46bc-b48e-d11476b56d90"
    ],
    "correctAnswers": [
      "330a7a02-0f97-46bc-b48e-d11476b56d90"
    ],
    "keywords": null,
    "fillinAnswers": null,
    "judgeAnswer": 0,
    "explainText": "",
    "answerPlay": null,
    "explainPlay": null
  },
  {
    "id": "e4124e8f-216e-4f85-8d1b-ffcfb196f0c1",
    "examQuesId": "9b5c7f67-a0e7-4fc4-9b5c-88c51432219f",
    "sourceId": "938be7a7-03fa-4502-b1c0-70b17f859f9d",
    "content": "人力资源战略的资源聚焦要求，向战略客户等重点方向至少投入（&nbsp;）的资源？",
    "quesType": 0,
    "questionType": 0,
    "fileId": "",
    "tranStatus": null,
    "playDetails": null,
    "subQues": 0,
    "parentId": null,
    "orderIndex": 37,
    "itemCount": 4,
    "judgeCorrectOptionContent": "",
    "judgeWrongOptionContent": "",
    "choiceItems": [
      {
        "id": "db3d47a8-af23-4935-90c2-44df79326d15",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "9b5c7f67-a0e7-4fc4-9b5c-88c51432219f",
        "itemContent": "0.8",
        "answer": 1,
        "orderIndex": 1,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "fcb563f6-abe4-49ec-9716-d4657ddba2c6",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "ea0c6552-1703-4d61-b01c-8cbed0a54d85",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "9b5c7f67-a0e7-4fc4-9b5c-88c51432219f",
        "itemContent": "0.1",
        "answer": 0,
        "orderIndex": 2,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "285cba7a-fe3b-4d35-b7fb-f8db4df30784",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "9a9f41fa-9935-49c5-a1b3-e3a2e45735f7",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "9b5c7f67-a0e7-4fc4-9b5c-88c51432219f",
        "itemContent": "0.05",
        "answer": 0,
        "orderIndex": 3,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "7499a783-cc77-414c-946e-8d14d0825f63",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "941a6902-f142-443b-88de-257c563771c7",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "9b5c7f67-a0e7-4fc4-9b5c-88c51432219f",
        "itemContent": "0.15",
        "answer": 0,
        "orderIndex": 4,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "dc13a75e-09e9-4a7b-b5ee-6aafc5f218be",
        "score": 0,
        "itemPlay": null
      }
    ],
    "fillInItems": null,
    "subQuesList": null,
    "corrected": 0,
    "fillinCorrectedInfo": null,
    "submitQuesAnswers": [
      "941a6902-f142-443b-88de-257c563771c7"
    ],
    "correctAnswers": [
      "db3d47a8-af23-4935-90c2-44df79326d15"
    ],
    "keywords": null,
    "fillinAnswers": null,
    "judgeAnswer": 0,
    "explainText": "",
    "answerPlay": null,
    "explainPlay": null
  },
  {
    "id": "a0f907f6-7fd7-4675-ba7f-24ddee0b83e1",
    "examQuesId": "508fb9c3-acea-449c-b7d5-56517c5df9d7",
    "sourceId": "7cbe8249-0e3d-4166-9e79-b7e8a9b5b8fa",
    "content": "财经战略,对事业部实行（）中心改革？",
    "quesType": 0,
    "questionType": 0,
    "fileId": "",
    "tranStatus": null,
    "playDetails": null,
    "subQues": 0,
    "parentId": null,
    "orderIndex": 38,
    "itemCount": 4,
    "judgeCorrectOptionContent": "",
    "judgeWrongOptionContent": "",
    "choiceItems": [
      {
        "id": "f36723ce-8c34-4d99-be62-41a791377d5a",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "508fb9c3-acea-449c-b7d5-56517c5df9d7",
        "itemContent": "需求",
        "answer": 0,
        "orderIndex": 1,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "a71c315a-287e-4fd5-b7c7-a5d1cf043555",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "75807802-97ff-48a9-83d6-2f1bf6834ea1",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "508fb9c3-acea-449c-b7d5-56517c5df9d7",
        "itemContent": "利润",
        "answer": 1,
        "orderIndex": 2,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "d9937f55-1ba3-49cf-87b1-5f6485463c7b",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "59c10a25-2a36-48f0-8e11-af01ba2cd481",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "508fb9c3-acea-449c-b7d5-56517c5df9d7",
        "itemContent": "研发",
        "answer": 0,
        "orderIndex": 3,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "7cf2975a-4db1-4b42-86cb-42eb22ebb309",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "bbd5c173-c174-46ca-a55a-34ce6bb4fb01",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "508fb9c3-acea-449c-b7d5-56517c5df9d7",
        "itemContent": "技术",
        "answer": 0,
        "orderIndex": 4,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "ec267a30-09a5-4d3e-8656-97b7f668a5e2",
        "score": 0,
        "itemPlay": null
      }
    ],
    "fillInItems": null,
    "subQuesList": null,
    "corrected": 0,
    "fillinCorrectedInfo": null,
    "submitQuesAnswers": [
      "bbd5c173-c174-46ca-a55a-34ce6bb4fb01"
    ],
    "correctAnswers": [
      "75807802-97ff-48a9-83d6-2f1bf6834ea1"
    ],
    "keywords": null,
    "fillinAnswers": null,
    "judgeAnswer": 0,
    "explainText": "",
    "answerPlay": null,
    "explainPlay": null
  },
  {
    "id": "0808a081-dbaa-4a40-ba89-fd4095271908",
    "examQuesId": "2ad85774-de2a-44aa-bd89-1ed4cca1d6f5",
    "sourceId": "65333325-5403-4abe-b609-30ac16ffafcf",
    "content": "财经战略，对超声、疼痛、介入事业部实行（）预算投入机制？",
    "quesType": 0,
    "questionType": 0,
    "fileId": "",
    "tranStatus": null,
    "playDetails": null,
    "subQues": 0,
    "parentId": null,
    "orderIndex": 39,
    "itemCount": 4,
    "judgeCorrectOptionContent": "",
    "judgeWrongOptionContent": "",
    "choiceItems": [
      {
        "id": "7970da1b-d3be-47e4-984e-8f171eb4c12b",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "2ad85774-de2a-44aa-bd89-1ed4cca1d6f5",
        "itemContent": "限制式",
        "answer": 0,
        "orderIndex": 1,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "e2f67b08-2d8c-459c-8701-27c54668059a",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "6707e7cf-bff7-4391-b285-94087a8ab46e",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "2ad85774-de2a-44aa-bd89-1ed4cca1d6f5",
        "itemContent": "开放式",
        "answer": 1,
        "orderIndex": 2,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "86eba838-e604-4080-be61-9c2dd820a037",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "c421f596-06c8-476c-9179-cbe5de567409",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "2ad85774-de2a-44aa-bd89-1ed4cca1d6f5",
        "itemContent": "滚动",
        "answer": 0,
        "orderIndex": 3,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "89cdb318-0a94-4c7f-a6b3-29155eaab7b0",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "5bd99fce-61ab-4afa-96e6-05358614807f",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "2ad85774-de2a-44aa-bd89-1ed4cca1d6f5",
        "itemContent": "固定",
        "answer": 0,
        "orderIndex": 4,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "111ee3ec-f9cd-4a74-96e8-cd104150fbb7",
        "score": 0,
        "itemPlay": null
      }
    ],
    "fillInItems": null,
    "subQuesList": null,
    "corrected": 0,
    "fillinCorrectedInfo": null,
    "submitQuesAnswers": [
      "5bd99fce-61ab-4afa-96e6-05358614807f"
    ],
    "correctAnswers": [
      "6707e7cf-bff7-4391-b285-94087a8ab46e"
    ],
    "keywords": null,
    "fillinAnswers": null,
    "judgeAnswer": 0,
    "explainText": "",
    "answerPlay": null,
    "explainPlay": null
  },
  {
    "id": "943871a4-4057-49bc-82c0-09ed34864b92",
    "examQuesId": "3ca331ee-6f69-4e06-a818-42ab5e92e6a1",
    "sourceId": "5ee7e7d4-62a7-487e-bb1a-9e91ab5f4e05",
    "content": "供应链战略，构建“敏捷、可靠、（）”的供应链网络？",
    "quesType": 0,
    "questionType": 0,
    "fileId": "",
    "tranStatus": null,
    "playDetails": null,
    "subQues": 0,
    "parentId": null,
    "orderIndex": 40,
    "itemCount": 4,
    "judgeCorrectOptionContent": "",
    "judgeWrongOptionContent": "",
    "choiceItems": [
      {
        "id": "dffd5626-f15d-42e5-9b46-3e1caf9fa087",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "3ca331ee-6f69-4e06-a818-42ab5e92e6a1",
        "itemContent": "低成本",
        "answer": 1,
        "orderIndex": 1,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "b21fdef2-4209-46bf-92e6-79434a70bf94",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "06cc305f-d30d-4fe2-857c-6d7f3a4344a4",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "3ca331ee-6f69-4e06-a818-42ab5e92e6a1",
        "itemContent": "高成本",
        "answer": 0,
        "orderIndex": 2,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "7e49b431-2270-4a87-ae4a-377ca88ffd6d",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "851eb795-b9c5-4028-a14d-9db118172a25",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "3ca331ee-6f69-4e06-a818-42ab5e92e6a1",
        "itemContent": "高效",
        "answer": 0,
        "orderIndex": 3,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "05cb2e33-dd81-42ab-a1e6-8427cf154de3",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "9a78a9cb-b745-4a09-b525-6c1e3c4237d9",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "3ca331ee-6f69-4e06-a818-42ab5e92e6a1",
        "itemContent": "柔性",
        "answer": 0,
        "orderIndex": 4,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "6004710a-109b-4633-90c1-9999972932eb",
        "score": 0,
        "itemPlay": null
      }
    ],
    "fillInItems": null,
    "subQuesList": null,
    "corrected": 0,
    "fillinCorrectedInfo": null,
    "submitQuesAnswers": [
      "9a78a9cb-b745-4a09-b525-6c1e3c4237d9"
    ],
    "correctAnswers": [
      "dffd5626-f15d-42e5-9b46-3e1caf9fa087"
    ],
    "keywords": null,
    "fillinAnswers": null,
    "judgeAnswer": 0,
    "explainText": "",
    "answerPlay": null,
    "explainPlay": null
  },
  {
    "id": "3aef43ef-93af-42e1-b310-5f94734d2578",
    "examQuesId": "0f880630-ff6f-47dd-abe4-12c6adeb1f0c",
    "sourceId": "f7955f3a-b7d6-4e1f-90da-6f2e9a72cfad",
    "content": "供应链战略，建立采购“三支柱”,包括（）采购、运营采购、采购支持模型",
    "quesType": 0,
    "questionType": 0,
    "fileId": "",
    "tranStatus": null,
    "playDetails": null,
    "subQues": 0,
    "parentId": null,
    "orderIndex": 41,
    "itemCount": 3,
    "judgeCorrectOptionContent": "",
    "judgeWrongOptionContent": "",
    "choiceItems": [
      {
        "id": "f8397958-34de-46b5-9135-5e170dcf76a9",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "0f880630-ff6f-47dd-abe4-12c6adeb1f0c",
        "itemContent": "战略",
        "answer": 1,
        "orderIndex": 1,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "31c3a429-3ef3-4573-8fa0-eee1eeb60c94",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "45b0c28c-f7ed-45c3-8206-ce5ffb6fb220",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "0f880630-ff6f-47dd-abe4-12c6adeb1f0c",
        "itemContent": "非战略",
        "answer": 0,
        "orderIndex": 2,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "0a5cb20f-3f5a-4621-9939-347a7a599b08",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "010fe278-dfe4-4b9c-8eb7-820a14e1f143",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "0f880630-ff6f-47dd-abe4-12c6adeb1f0c",
        "itemContent": "集中",
        "answer": 0,
        "orderIndex": 3,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "75ae5c5a-934d-430d-b5bd-0a2b3f552f8f",
        "score": 0,
        "itemPlay": null
      }
    ],
    "fillInItems": null,
    "subQuesList": null,
    "corrected": 0,
    "fillinCorrectedInfo": null,
    "submitQuesAnswers": [
      "010fe278-dfe4-4b9c-8eb7-820a14e1f143"
    ],
    "correctAnswers": [
      "f8397958-34de-46b5-9135-5e170dcf76a9"
    ],
    "keywords": null,
    "fillinAnswers": null,
    "judgeAnswer": 0,
    "explainText": "",
    "answerPlay": null,
    "explainPlay": null
  },
  {
    "id": "20ca6800-ff25-4a21-8529-8d4079201a84",
    "examQuesId": "5b1410e5-e518-4283-85ae-afdbd6f74328",
    "sourceId": "5dc29b68-e62a-4ea8-85db-8ff78efd54e0",
    "content": "运营与质量，资产与资本效率，聚焦核心业务；关注（），严控非必要开支？",
    "quesType": 0,
    "questionType": 0,
    "fileId": "",
    "tranStatus": null,
    "playDetails": null,
    "subQues": 0,
    "parentId": null,
    "orderIndex": 42,
    "itemCount": 4,
    "judgeCorrectOptionContent": "",
    "judgeWrongOptionContent": "",
    "choiceItems": [
      {
        "id": "c3beac17-9e46-49a3-bb69-84b354c4ec96",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "5b1410e5-e518-4283-85ae-afdbd6f74328",
        "itemContent": "医院回款率",
        "answer": 0,
        "orderIndex": 1,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "29252d01-aab5-4645-bd7f-acb0a619b773",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "60710b52-b7a8-498f-8b25-ba0ee86d3448",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "5b1410e5-e518-4283-85ae-afdbd6f74328",
        "itemContent": "投资回报率",
        "answer": 1,
        "orderIndex": 2,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "4dbd0af5-4a43-4d25-af81-fb6d9ee3e9a3",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "d0953265-69cc-45dc-ba98-e2ad3f6e4e25",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "5b1410e5-e518-4283-85ae-afdbd6f74328",
        "itemContent": "毛利率",
        "answer": 0,
        "orderIndex": 3,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "f5bcf3da-075e-4cd0-b435-3cf6bb87e372",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "122fb7c8-befd-4e70-8ef8-7ab4a7cd37d5",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "5b1410e5-e518-4283-85ae-afdbd6f74328",
        "itemContent": "净利率",
        "answer": 0,
        "orderIndex": 4,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "0b9762c3-85dd-4d3d-8bd8-3e083f2f0517",
        "score": 0,
        "itemPlay": null
      }
    ],
    "fillInItems": null,
    "subQuesList": null,
    "corrected": 0,
    "fillinCorrectedInfo": null,
    "submitQuesAnswers": [
      "d0953265-69cc-45dc-ba98-e2ad3f6e4e25"
    ],
    "correctAnswers": [
      "60710b52-b7a8-498f-8b25-ba0ee86d3448"
    ],
    "keywords": null,
    "fillinAnswers": null,
    "judgeAnswer": 0,
    "explainText": "",
    "answerPlay": null,
    "explainPlay": null
  },
  {
    "id": "741b5759-c79e-403c-b709-f7efb2f38146",
    "examQuesId": "de796e66-3f40-4cd0-af48-893b9e497d0b",
    "sourceId": "dd029b13-a4d0-4a05-9e30-b5e89a2488eb",
    "content": "流程与IT战略，在2030+构建生态（），达到跨事业部数据智能与协同创新<br/>构建行业智能生态？",
    "quesType": 0,
    "questionType": 0,
    "fileId": "",
    "tranStatus": null,
    "playDetails": null,
    "subQues": 0,
    "parentId": null,
    "orderIndex": 43,
    "itemCount": 4,
    "judgeCorrectOptionContent": "",
    "judgeWrongOptionContent": "",
    "choiceItems": [
      {
        "id": "e55f28a2-e2b6-451c-b9fc-a7f90f6c0ca8",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "de796e66-3f40-4cd0-af48-893b9e497d0b",
        "itemContent": "整合期",
        "answer": 0,
        "orderIndex": 1,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "223771cd-9503-431c-aba6-864a6423d868",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "c761eb0c-7b0f-46a6-ace7-215e4079c55a",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "de796e66-3f40-4cd0-af48-893b9e497d0b",
        "itemContent": "价值期",
        "answer": 0,
        "orderIndex": 2,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "c95236f8-34da-4cea-b176-a2976f1435c3",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "c7e8cc28-a093-4b5a-9049-01a755cfca10",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "de796e66-3f40-4cd0-af48-893b9e497d0b",
        "itemContent": "赋能期",
        "answer": 0,
        "orderIndex": 3,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "397e72a9-99c5-4315-96dd-a621f681fab3",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "26aaeb10-834e-4ed4-92b6-4f857991eaa0",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "de796e66-3f40-4cd0-af48-893b9e497d0b",
        "itemContent": "智能期",
        "answer": 1,
        "orderIndex": 4,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "7e295928-5268-4962-be1b-1ea46a654a1e",
        "score": 0,
        "itemPlay": null
      }
    ],
    "fillInItems": null,
    "subQuesList": null,
    "corrected": 0,
    "fillinCorrectedInfo": null,
    "submitQuesAnswers": [
      "c7e8cc28-a093-4b5a-9049-01a755cfca10"
    ],
    "correctAnswers": [
      "26aaeb10-834e-4ed4-92b6-4f857991eaa0"
    ],
    "keywords": null,
    "fillinAnswers": null,
    "judgeAnswer": 0,
    "explainText": "",
    "answerPlay": null,
    "explainPlay": null
  },
  {
    "id": "1fbd7904-2823-4813-961d-a0d648020019",
    "examQuesId": "5db4dac7-81a5-455d-9240-e899fdce96e4",
    "sourceId": "63994bea-f6db-4c4e-bfef-531b8c95e271",
    "content": "风险管理与应对,外部环境风险发生概率中、影响程度极高，需要制定《关键核心技术自主可控路线图》，按季度复盘进展等措施应对是那种风险？",
    "quesType": 0,
    "questionType": 0,
    "fileId": "",
    "tranStatus": null,
    "playDetails": null,
    "subQues": 0,
    "parentId": null,
    "orderIndex": 44,
    "itemCount": 4,
    "judgeCorrectOptionContent": "",
    "judgeWrongOptionContent": "",
    "choiceItems": [
      {
        "id": "6d20a6d4-eec7-4f4a-be74-2f06665d4874",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "5db4dac7-81a5-455d-9240-e899fdce96e4",
        "itemContent": "核心技术被“卡脖子”",
        "answer": 1,
        "orderIndex": 1,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "a7c7bdb9-a7af-4ae1-a78d-559b9afcc324",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "2be2bca8-57fc-4a57-bb91-487b18096950",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "5db4dac7-81a5-455d-9240-e899fdce96e4",
        "itemContent": "集中采购范围扩大",
        "answer": 0,
        "orderIndex": 2,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "615daf73-e7f1-4121-9053-9f24e2894d5f",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "a4341150-93de-403c-938c-3e401021180d",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "5db4dac7-81a5-455d-9240-e899fdce96e4",
        "itemContent": "现金流中断",
        "answer": 0,
        "orderIndex": 3,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "e4f2bdbf-2a8c-4758-8c8e-7f55dc1a5534",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "8f395ac5-7451-4f6a-951f-7151ac1704a8",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "5db4dac7-81a5-455d-9240-e899fdce96e4",
        "itemContent": "激进收入目标下的经营质量风险",
        "answer": 0,
        "orderIndex": 4,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "178193ba-3115-4c39-8e39-08391e8a95da",
        "score": 0,
        "itemPlay": null
      }
    ],
    "fillInItems": null,
    "subQuesList": null,
    "corrected": 0,
    "fillinCorrectedInfo": null,
    "submitQuesAnswers": [
      "8f395ac5-7451-4f6a-951f-7151ac1704a8"
    ],
    "correctAnswers": [
      "6d20a6d4-eec7-4f4a-be74-2f06665d4874"
    ],
    "keywords": null,
    "fillinAnswers": null,
    "judgeAnswer": 0,
    "explainText": "",
    "answerPlay": null,
    "explainPlay": null
  },
  {
    "id": "b9fa022e-a070-4ab2-b8d0-eefd9dd323aa",
    "examQuesId": "9994ddce-bee3-4094-a374-a7f45ccb8864",
    "sourceId": "f2019c6f-01a7-4624-bcc7-d9ec8ac921f5",
    "content": "风险管理与应对,知识产权侵权发生概率高、影响程度高，属于风险那一类别？",
    "quesType": 0,
    "questionType": 0,
    "fileId": "",
    "tranStatus": null,
    "playDetails": null,
    "subQues": 0,
    "parentId": null,
    "orderIndex": 45,
    "itemCount": 4,
    "judgeCorrectOptionContent": "",
    "judgeWrongOptionContent": "",
    "choiceItems": [
      {
        "id": "168a0dd2-cc55-4ba5-9833-6c1bc2d61f42",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "9994ddce-bee3-4094-a374-a7f45ccb8864",
        "itemContent": "人才引进风险",
        "answer": 0,
        "orderIndex": 1,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "6e5289ca-dc62-4626-aec6-793a8059fef5",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "d2247ef2-d8dc-40e3-af66-4d4323f9389b",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "9994ddce-bee3-4094-a374-a7f45ccb8864",
        "itemContent": "战略执行风险",
        "answer": 0,
        "orderIndex": 2,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "769d8257-868c-4b87-9ef0-0b465caddd2d",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "6c3e1af6-424f-4e6b-8c27-3f450d6677e9",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "9994ddce-bee3-4094-a374-a7f45ccb8864",
        "itemContent": "知识产权风险",
        "answer": 1,
        "orderIndex": 3,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "d8dd3b38-e314-4bfc-af70-4a2f3d1036d4",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "8f9b2694-37bc-4c53-be38-d357c671716f",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "9994ddce-bee3-4094-a374-a7f45ccb8864",
        "itemContent": "内部运营风险",
        "answer": 0,
        "orderIndex": 4,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "1ffd4f1c-2fc8-4cc3-bd11-214b67e9292f",
        "score": 0,
        "itemPlay": null
      }
    ],
    "fillInItems": null,
    "subQuesList": null,
    "corrected": 1,
    "fillinCorrectedInfo": null,
    "submitQuesAnswers": [
      "6c3e1af6-424f-4e6b-8c27-3f450d6677e9"
    ],
    "correctAnswers": [
      "6c3e1af6-424f-4e6b-8c27-3f450d6677e9"
    ],
    "keywords": null,
    "fillinAnswers": null,
    "judgeAnswer": 0,
    "explainText": "",
    "answerPlay": null,
    "explainPlay": null
  },
  {
    "id": "ae0afe13-fe88-4305-8b0a-852301d4624c",
    "examQuesId": "55e72b01-4abf-4cb1-ae7a-5540444c8d1c",
    "sourceId": "6ba093af-51f2-4f55-b3c6-44f313954a40",
    "content": "战略实施保障，资源保障方面，设立“战略合作与投资专项资金”，业务按照“（）”进行战略性投入？",
    "quesType": 0,
    "questionType": 0,
    "fileId": "",
    "tranStatus": null,
    "playDetails": null,
    "subQues": 0,
    "parentId": null,
    "orderIndex": 46,
    "itemCount": 4,
    "judgeCorrectOptionContent": "",
    "judgeWrongOptionContent": "",
    "choiceItems": [
      {
        "id": "b48a9144-3049-495d-9a09-65a6fe252fb7",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "55e72b01-4abf-4cb1-ae7a-5540444c8d1c",
        "itemContent": "721原则",
        "answer": 1,
        "orderIndex": 1,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "6ac9e550-0cf4-4a01-8126-36c6895bed11",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "e5f3e052-3756-42c9-bf54-4b28a6f47f1e",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "55e72b01-4abf-4cb1-ae7a-5540444c8d1c",
        "itemContent": "622原则",
        "answer": 0,
        "orderIndex": 2,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "b10c2bbf-507a-4ffc-9b62-0760bf5f1afd",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "378a4eaf-5960-47c3-a68c-8901d79fcfd9",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "55e72b01-4abf-4cb1-ae7a-5540444c8d1c",
        "itemContent": "811原则",
        "answer": 0,
        "orderIndex": 3,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "71da7bdf-f596-40bd-bedc-6bacab96a2b1",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "c243fea6-24ff-4d32-b65d-40be0a446992",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "55e72b01-4abf-4cb1-ae7a-5540444c8d1c",
        "itemContent": "532原则",
        "answer": 0,
        "orderIndex": 4,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "0b139958-b64a-4797-a13e-f313f3c90c93",
        "score": 0,
        "itemPlay": null
      }
    ],
    "fillInItems": null,
    "subQuesList": null,
    "corrected": 0,
    "fillinCorrectedInfo": null,
    "submitQuesAnswers": [
      "378a4eaf-5960-47c3-a68c-8901d79fcfd9"
    ],
    "correctAnswers": [
      "b48a9144-3049-495d-9a09-65a6fe252fb7"
    ],
    "keywords": null,
    "fillinAnswers": null,
    "judgeAnswer": 0,
    "explainText": "",
    "answerPlay": null,
    "explainPlay": null
  },
  {
    "id": "c9fb5923-3731-4a04-878f-22a1351650b7",
    "examQuesId": "951e830a-9bfa-446d-8a95-cdfb8719c1e6",
    "sourceId": "dd37e3c2-1074-46a0-99ec-de39f9acbda8",
    "content": "战略实施保障，文化塑造方面，持续宣传“（）”和“协同共创”的价值观？",
    "quesType": 0,
    "questionType": 0,
    "fileId": "",
    "tranStatus": null,
    "playDetails": null,
    "subQues": 0,
    "parentId": null,
    "orderIndex": 47,
    "itemCount": 4,
    "judgeCorrectOptionContent": "",
    "judgeWrongOptionContent": "",
    "choiceItems": [
      {
        "id": "942b854e-f01a-4851-9fb5-6fd9b06f9d7d",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "951e830a-9bfa-446d-8a95-cdfb8719c1e6",
        "itemContent": "以客户为中心",
        "answer": 1,
        "orderIndex": 1,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "55d9fe57-382c-4649-af8a-73f7939f5eb4",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "53a0c54e-9189-41b3-8ac1-d0fd7c765cf5",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "951e830a-9bfa-446d-8a95-cdfb8719c1e6",
        "itemContent": "创新转化领航者",
        "answer": 0,
        "orderIndex": 2,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "e33d7ea6-c5bf-41fb-b41a-89dd4556518b",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "bae960c9-5d66-4a35-a540-f4c242d6ddb3",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "951e830a-9bfa-446d-8a95-cdfb8719c1e6",
        "itemContent": "智能生态",
        "answer": 0,
        "orderIndex": 3,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "c1450a9a-fcf0-4362-95d4-327e424b251d",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "a0ac07fb-310a-446f-86aa-14599f26ff6f",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "951e830a-9bfa-446d-8a95-cdfb8719c1e6",
        "itemContent": "为创新思想买单",
        "answer": 0,
        "orderIndex": 4,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "dd984f83-8e7b-4f24-b25a-ea76803fd7c5",
        "score": 0,
        "itemPlay": null
      }
    ],
    "fillInItems": null,
    "subQuesList": null,
    "corrected": 0,
    "fillinCorrectedInfo": null,
    "submitQuesAnswers": [
      "a0ac07fb-310a-446f-86aa-14599f26ff6f"
    ],
    "correctAnswers": [
      "942b854e-f01a-4851-9fb5-6fd9b06f9d7d"
    ],
    "keywords": null,
    "fillinAnswers": null,
    "judgeAnswer": 0,
    "explainText": "",
    "answerPlay": null,
    "explainPlay": null
  },
  {
    "id": "010f405d-4f36-49cd-af7f-22c7ac1da87d",
    "examQuesId": "0103785f-4039-4d37-83a7-6b74dd6b8289",
    "sourceId": "1d367d77-331d-48e2-a742-fdb156c1b740",
    "content": "以下哪些属于“基石现金牛”事业部？",
    "quesType": 1,
    "questionType": 0,
    "fileId": "",
    "tranStatus": null,
    "playDetails": null,
    "subQues": 0,
    "parentId": null,
    "orderIndex": 48,
    "itemCount": 4,
    "judgeCorrectOptionContent": "",
    "judgeWrongOptionContent": "",
    "choiceItems": [
      {
        "id": "c664c03c-aea1-4cb0-a456-771db65a55f4",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "0103785f-4039-4d37-83a7-6b74dd6b8289",
        "itemContent": "急危重症与麻醉事业部",
        "answer": 1,
        "orderIndex": 1,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "ff0c93d8-45e7-4e33-b39a-088b1dd5773b",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "9ee303d7-59eb-4c77-8383-153bad842130",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "0103785f-4039-4d37-83a7-6b74dd6b8289",
        "itemContent": "智慧护理事业部",
        "answer": 1,
        "orderIndex": 2,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "09210e2c-75a9-4914-bebd-5ddcab10ec19",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "1a3360d9-0b92-4642-b2cb-183b32023575",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "0103785f-4039-4d37-83a7-6b74dd6b8289",
        "itemContent": "医美事业部",
        "answer": 0,
        "orderIndex": 3,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "353dd9da-9077-4b4f-aac4-2996bf932154",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "c39ca258-2c19-498a-87cd-7437ae43d800",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "0103785f-4039-4d37-83a7-6b74dd6b8289",
        "itemContent": "泌尿及肾病事业部",
        "answer": 1,
        "orderIndex": 4,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "bfb8dcc4-e6d0-4f05-a640-40d39ab1beea",
        "score": 0,
        "itemPlay": null
      }
    ],
    "fillInItems": null,
    "subQuesList": null,
    "corrected": 0,
    "fillinCorrectedInfo": null,
    "submitQuesAnswers": [
      "c39ca258-2c19-498a-87cd-7437ae43d800"
    ],
    "correctAnswers": [
      "c664c03c-aea1-4cb0-a456-771db65a55f4",
      "9ee303d7-59eb-4c77-8383-153bad842130",
      "c39ca258-2c19-498a-87cd-7437ae43d800"
    ],
    "keywords": null,
    "fillinAnswers": null,
    "judgeAnswer": 0,
    "explainText": "",
    "answerPlay": null,
    "explainPlay": null
  },
  {
    "id": "ffb02411-1b17-4a33-9ff8-543bf9de911b",
    "examQuesId": "e1458885-dd71-489c-b3f0-616d1f93c7f6",
    "sourceId": "196af322-65cf-485b-8d9e-d77003278833",
    "content": "公司愿景包括哪些内容？",
    "quesType": 1,
    "questionType": 0,
    "fileId": "",
    "tranStatus": null,
    "playDetails": null,
    "subQues": 0,
    "parentId": null,
    "orderIndex": 49,
    "itemCount": 4,
    "judgeCorrectOptionContent": "",
    "judgeWrongOptionContent": "",
    "choiceItems": [
      {
        "id": "49a3b1a2-55d4-4c06-9e34-1b4d03c28065",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "e1458885-dd71-489c-b3f0-616d1f93c7f6",
        "itemContent": "为创新思想买单",
        "answer": 1,
        "orderIndex": 1,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "a7742f90-a1ef-4ea4-8f96-38e1f958d9bd",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "e9ec2f6d-7dc0-4ab0-b3d7-e4ecccf63629",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "e1458885-dd71-489c-b3f0-616d1f93c7f6",
        "itemContent": "让创意生根",
        "answer": 1,
        "orderIndex": 2,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "c66320a2-b6e4-4344-be87-8c0b8d929a97",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "9a3238ef-6eb4-4e38-969b-958e22a427df",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "e1458885-dd71-489c-b3f0-616d1f93c7f6",
        "itemContent": "助医者改变世界",
        "answer": 1,
        "orderIndex": 3,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "b8549b53-5c97-40da-8196-d55006f9476b",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "c575753a-b942-4fd5-bd3d-c4e67ed278a1",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "e1458885-dd71-489c-b3f0-616d1f93c7f6",
        "itemContent": "成为全球最大医疗器械公司",
        "answer": 0,
        "orderIndex": 4,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "3ec40ffd-1daa-47d9-a095-c3e285309104",
        "score": 0,
        "itemPlay": null
      }
    ],
    "fillInItems": null,
    "subQuesList": null,
    "corrected": 0,
    "fillinCorrectedInfo": null,
    "submitQuesAnswers": [
      "c575753a-b942-4fd5-bd3d-c4e67ed278a1"
    ],
    "correctAnswers": [
      "49a3b1a2-55d4-4c06-9e34-1b4d03c28065",
      "e9ec2f6d-7dc0-4ab0-b3d7-e4ecccf63629",
      "9a3238ef-6eb4-4e38-969b-958e22a427df"
    ],
    "keywords": null,
    "fillinAnswers": null,
    "judgeAnswer": 0,
    "explainText": "",
    "answerPlay": null,
    "explainPlay": null
  },
  {
    "id": "2c1152ed-3640-4846-ab37-6bcc60ad2253",
    "examQuesId": "5e5e7012-93e3-4bb4-beaf-322a3f35248a",
    "sourceId": "ee11af1d-c7df-4ff1-8902-65e1340c2667",
    "content": "产业边界中“聚焦”的业务包括哪些？",
    "quesType": 1,
    "questionType": 0,
    "fileId": "",
    "tranStatus": null,
    "playDetails": null,
    "subQues": 0,
    "parentId": null,
    "orderIndex": 50,
    "itemCount": 4,
    "judgeCorrectOptionContent": "",
    "judgeWrongOptionContent": "",
    "choiceItems": [
      {
        "id": "50dd43b5-7b48-4dd2-9669-ec7bf20b7210",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "5e5e7012-93e3-4bb4-beaf-322a3f35248a",
        "itemContent": "智能化中小型医疗器械",
        "answer": 1,
        "orderIndex": 1,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "9b1cc2a8-e68a-4174-8cff-c4c9e3936d3f",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "b140562c-b65a-4829-8d9a-6492067e8fe4",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "5e5e7012-93e3-4bb4-beaf-322a3f35248a",
        "itemContent": "大型CT设备",
        "answer": 0,
        "orderIndex": 2,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "b878dfa3-965f-4537-87fa-740fe5eda8b2",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "e2cb59b7-5799-4d5c-ae24-0369c3fce866",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "5e5e7012-93e3-4bb4-beaf-322a3f35248a",
        "itemContent": "生物类制品",
        "answer": 0,
        "orderIndex": 3,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "768c02ef-418c-419d-9c22-51318508e2ef",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "7be43494-8f44-45a2-8a3d-949d397d2ff3",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "5e5e7012-93e3-4bb4-beaf-322a3f35248a",
        "itemContent": "高值医疗耗材",
        "answer": 1,
        "orderIndex": 4,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "6824ddb8-24ff-4528-a101-7cab44447808",
        "score": 0,
        "itemPlay": null
      }
    ],
    "fillInItems": null,
    "subQuesList": null,
    "corrected": 0,
    "fillinCorrectedInfo": null,
    "submitQuesAnswers": [
      "7be43494-8f44-45a2-8a3d-949d397d2ff3"
    ],
    "correctAnswers": [
      "50dd43b5-7b48-4dd2-9669-ec7bf20b7210",
      "7be43494-8f44-45a2-8a3d-949d397d2ff3"
    ],
    "keywords": null,
    "fillinAnswers": null,
    "judgeAnswer": 0,
    "explainText": "",
    "answerPlay": null,
    "explainPlay": null
  },
  {
    "id": "a8d33ea2-cee1-4843-8058-37b08c475c13",
    "examQuesId": "c8616e0c-996e-4283-b092-fa0095688c2e",
    "sourceId": "9fbe2302-3721-4e86-aac4-1480d96e9073",
    "content": "创新孵化器包括哪些项目或事业部？",
    "quesType": 1,
    "questionType": 0,
    "fileId": "",
    "tranStatus": null,
    "playDetails": null,
    "subQues": 0,
    "parentId": null,
    "orderIndex": 51,
    "itemCount": 4,
    "judgeCorrectOptionContent": "",
    "judgeWrongOptionContent": "",
    "choiceItems": [
      {
        "id": "a728bef3-808f-44b1-83d4-fd84ba4d472c",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "c8616e0c-996e-4283-b092-fa0095688c2e",
        "itemContent": "中医及医美事业部",
        "answer": 1,
        "orderIndex": 1,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "881ca654-ca15-43ea-9d7e-27e306fadbb3",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "35672d70-f0ce-4c4d-9ca3-abaf79cd7a31",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "c8616e0c-996e-4283-b092-fa0095688c2e",
        "itemContent": "智慧护理",
        "answer": 0,
        "orderIndex": 2,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "82d5eff2-15d3-4616-a08c-62b81b1c3e67",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "b67bff74-892d-447f-a2a5-436262560d44",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "c8616e0c-996e-4283-b092-fa0095688c2e",
        "itemContent": "骨科3D打印定制化植入物项目",
        "answer": 1,
        "orderIndex": 3,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "6363b90d-b2a2-4fa9-9528-b2f322a120a1",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "90818369-7af2-4333-b0b0-3aea6f03657d",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "c8616e0c-996e-4283-b092-fa0095688c2e",
        "itemContent": "超声影像事业部",
        "answer": 0,
        "orderIndex": 4,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "8201b411-0894-4e2b-8076-1e4dbe893929",
        "score": 0,
        "itemPlay": null
      }
    ],
    "fillInItems": null,
    "subQuesList": null,
    "corrected": 0,
    "fillinCorrectedInfo": null,
    "submitQuesAnswers": [
      "90818369-7af2-4333-b0b0-3aea6f03657d"
    ],
    "correctAnswers": [
      "a728bef3-808f-44b1-83d4-fd84ba4d472c",
      "b67bff74-892d-447f-a2a5-436262560d44"
    ],
    "keywords": null,
    "fillinAnswers": null,
    "judgeAnswer": 0,
    "explainText": "",
    "answerPlay": null,
    "explainPlay": null
  },
  {
    "id": "9d8406e1-7260-4250-9a3f-f93c418a58ea",
    "examQuesId": "1c24d334-1ac0-483a-97cc-49cbbf3469ab",
    "sourceId": "401008ba-6e30-489f-82e0-a3b6b358bdcc",
    "content": "通过创新，满足客户（）需求与（）诉求，搭建立体化客户关系",
    "quesType": 1,
    "questionType": 0,
    "fileId": "",
    "tranStatus": null,
    "playDetails": null,
    "subQues": 0,
    "parentId": null,
    "orderIndex": 52,
    "itemCount": 4,
    "judgeCorrectOptionContent": "",
    "judgeWrongOptionContent": "",
    "choiceItems": [
      {
        "id": "b156c210-5b27-438e-b81a-299e2eb51782",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "1c24d334-1ac0-483a-97cc-49cbbf3469ab",
        "itemContent": "科研创新需求",
        "answer": 1,
        "orderIndex": 1,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "ff202e4a-7525-44ee-9d70-73337b11ae58",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "69363c62-29ee-4f8f-9ba5-e20f4204b5d5",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "1c24d334-1ac0-483a-97cc-49cbbf3469ab",
        "itemContent": "待遇提高需求",
        "answer": 0,
        "orderIndex": 2,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "7afb1091-8763-4cc8-b07b-0e8a89b773b7",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "3274a4f2-ee8f-4abf-b25a-a60a89bb8a41",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "1c24d334-1ac0-483a-97cc-49cbbf3469ab",
        "itemContent": "能力提高需求",
        "answer": 0,
        "orderIndex": 3,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "1d8c0e21-c6ca-4e78-af7d-e64a2f3687f4",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "72078ed0-8669-4a90-b97a-bcbe8cb8703b",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "1c24d334-1ac0-483a-97cc-49cbbf3469ab",
        "itemContent": "专业职称晋升诉求",
        "answer": 1,
        "orderIndex": 4,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "c968d7d4-61ae-4783-a09b-9cd04388ab77",
        "score": 0,
        "itemPlay": null
      }
    ],
    "fillInItems": null,
    "subQuesList": null,
    "corrected": 0,
    "fillinCorrectedInfo": null,
    "submitQuesAnswers": [
      "72078ed0-8669-4a90-b97a-bcbe8cb8703b"
    ],
    "correctAnswers": [
      "b156c210-5b27-438e-b81a-299e2eb51782",
      "72078ed0-8669-4a90-b97a-bcbe8cb8703b"
    ],
    "keywords": null,
    "fillinAnswers": null,
    "judgeAnswer": 0,
    "explainText": "",
    "answerPlay": null,
    "explainPlay": null
  },
  {
    "id": "e01864bb-f451-439e-9509-d61c2bd9bcd3",
    "examQuesId": "2c831137-4d8f-4f50-b04e-a594366e6c39",
    "sourceId": "994374cc-b996-42af-a9c3-1219de3dda08",
    "content": "非战略客户是通过哪两方面来实现规模化高效增长？",
    "quesType": 1,
    "questionType": 0,
    "fileId": "",
    "tranStatus": null,
    "playDetails": null,
    "subQues": 0,
    "parentId": null,
    "orderIndex": 53,
    "itemCount": 4,
    "judgeCorrectOptionContent": "",
    "judgeWrongOptionContent": "",
    "choiceItems": [
      {
        "id": "7b0da908-b00a-4827-a655-892e141fd9a4",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "2c831137-4d8f-4f50-b04e-a594366e6c39",
        "itemContent": "渠道赋能",
        "answer": 1,
        "orderIndex": 1,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "a887495b-5051-4b1f-8b2e-6c34ff99f2d2",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "9c5c4f6c-42d7-4eba-b2c8-5f8b859fb90b",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "2c831137-4d8f-4f50-b04e-a594366e6c39",
        "itemContent": "标准化解决方案",
        "answer": 1,
        "orderIndex": 2,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "6b0ece4e-56dd-4f15-aa2b-b52000a45b87",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "609585f3-bfa6-4b0d-b0d6-381c53a1b123",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "2c831137-4d8f-4f50-b04e-a594366e6c39",
        "itemContent": "铁三角机制",
        "answer": 0,
        "orderIndex": 3,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "433d4e8c-b269-4e12-8850-3a3aea4667dc",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "bd34fe0c-fdd0-4ebc-9880-aad840f04d1b",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "2c831137-4d8f-4f50-b04e-a594366e6c39",
        "itemContent": "驻院工程师",
        "answer": 0,
        "orderIndex": 4,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "c3615106-95b6-4743-b7be-3ad754a9dc14",
        "score": 0,
        "itemPlay": null
      }
    ],
    "fillInItems": null,
    "subQuesList": null,
    "corrected": 0,
    "fillinCorrectedInfo": null,
    "submitQuesAnswers": [
      "bd34fe0c-fdd0-4ebc-9880-aad840f04d1b"
    ],
    "correctAnswers": [
      "7b0da908-b00a-4827-a655-892e141fd9a4",
      "9c5c4f6c-42d7-4eba-b2c8-5f8b859fb90b"
    ],
    "keywords": null,
    "fillinAnswers": null,
    "judgeAnswer": 0,
    "explainText": "",
    "answerPlay": null,
    "explainPlay": null
  },
  {
    "id": "88ebb4a1-2f2b-463a-892c-bce0377db783",
    "examQuesId": "b614f06e-c535-4d13-a5b9-798d0d15ea77",
    "sourceId": "73189a9e-8aae-4731-9677-409d21f2e589",
    "content": "集团战略与协同委员会的参与人员包括",
    "quesType": 1,
    "questionType": 0,
    "fileId": "",
    "tranStatus": null,
    "playDetails": null,
    "subQues": 0,
    "parentId": null,
    "orderIndex": 54,
    "itemCount": 4,
    "judgeCorrectOptionContent": "",
    "judgeWrongOptionContent": "",
    "choiceItems": [
      {
        "id": "01da410b-870d-4529-97aa-19984632ca1b",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "b614f06e-c535-4d13-a5b9-798d0d15ea77",
        "itemContent": "总裁",
        "answer": 1,
        "orderIndex": 1,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "9076a805-6cf8-49c3-8621-a4ec34e7ef74",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "bf1cdb02-d97d-44e1-aa39-ff73dffa2cb7",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "b614f06e-c535-4d13-a5b9-798d0d15ea77",
        "itemContent": "各业务总部一把手",
        "answer": 1,
        "orderIndex": 2,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "7f01bd82-7010-4fae-8f07-df4f593d6bad",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "45713870-a02f-41c0-a3d8-433259074ea3",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "b614f06e-c535-4d13-a5b9-798d0d15ea77",
        "itemContent": "所有事业部员工",
        "answer": 0,
        "orderIndex": 3,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "a85ef95d-3b58-4961-9db9-a6c8951a5fb5",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "af5ae476-79c1-4523-9351-79b6bf382125",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "b614f06e-c535-4d13-a5b9-798d0d15ea77",
        "itemContent": "外部顾问",
        "answer": 0,
        "orderIndex": 4,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "876d0d28-2fc3-4b0d-aa02-824554b952bc",
        "score": 0,
        "itemPlay": null
      }
    ],
    "fillInItems": null,
    "subQuesList": null,
    "corrected": 0,
    "fillinCorrectedInfo": null,
    "submitQuesAnswers": [
      "af5ae476-79c1-4523-9351-79b6bf382125"
    ],
    "correctAnswers": [
      "01da410b-870d-4529-97aa-19984632ca1b",
      "bf1cdb02-d97d-44e1-aa39-ff73dffa2cb7"
    ],
    "keywords": null,
    "fillinAnswers": null,
    "judgeAnswer": 0,
    "explainText": "",
    "answerPlay": null,
    "explainPlay": null
  },
  {
    "id": "82b0739b-aa67-4757-89de-34ec68ebd2ce",
    "examQuesId": "a47e9e14-06c8-425f-8e52-fa2d3eac8907",
    "sourceId": "c7278022-4d82-43db-97ba-f066bc5365c3",
    "content": "各事业部的SP/BP需明确承接哪些战略方向？",
    "quesType": 1,
    "questionType": 0,
    "fileId": "",
    "tranStatus": null,
    "playDetails": null,
    "subQues": 0,
    "parentId": null,
    "orderIndex": 55,
    "itemCount": 4,
    "judgeCorrectOptionContent": "",
    "judgeWrongOptionContent": "",
    "choiceItems": [
      {
        "id": "816407d6-d850-43b2-a160-f1148ce76941",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "a47e9e14-06c8-425f-8e52-fa2d3eac8907",
        "itemContent": "智能化",
        "answer": 1,
        "orderIndex": 1,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "47e54f62-391c-4bf2-a669-52ee221b02b0",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "bb4716cb-3826-4312-81ad-4e49d0071428",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "a47e9e14-06c8-425f-8e52-fa2d3eac8907",
        "itemContent": "信息化",
        "answer": 1,
        "orderIndex": 2,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "c944e2f3-8a72-4f7a-816b-2db3f3fda39a",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "81f6eeaf-040b-4485-bd04-5567b270b575",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "a47e9e14-06c8-425f-8e52-fa2d3eac8907",
        "itemContent": "平台化",
        "answer": 1,
        "orderIndex": 3,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "7531505c-aab4-4b2f-b863-4d9011942194",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "9a00c4bd-f064-40b7-b783-c5e7a10e15b5",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "a47e9e14-06c8-425f-8e52-fa2d3eac8907",
        "itemContent": "数字化",
        "answer": 0,
        "orderIndex": 4,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "89a706d5-ce9a-434c-a0e2-8824d9593ff3",
        "score": 0,
        "itemPlay": null
      }
    ],
    "fillInItems": null,
    "subQuesList": null,
    "corrected": 0,
    "fillinCorrectedInfo": null,
    "submitQuesAnswers": [
      "9a00c4bd-f064-40b7-b783-c5e7a10e15b5"
    ],
    "correctAnswers": [
      "816407d6-d850-43b2-a160-f1148ce76941",
      "bb4716cb-3826-4312-81ad-4e49d0071428",
      "81f6eeaf-040b-4485-bd04-5567b270b575"
    ],
    "keywords": null,
    "fillinAnswers": null,
    "judgeAnswer": 0,
    "explainText": "",
    "answerPlay": null,
    "explainPlay": null
  },
  {
    "id": "677f977e-d3df-4563-a55f-b5d35d13eff8",
    "examQuesId": "679fe0b2-c77f-43d2-ab46-9b87d6bfb567",
    "sourceId": "e4546c23-02d7-47fb-b5b0-fb0d7e05b7d5",
    "content": "以下哪些属于“公司研发平台”？",
    "quesType": 1,
    "questionType": 0,
    "fileId": "",
    "tranStatus": null,
    "playDetails": null,
    "subQues": 0,
    "parentId": null,
    "orderIndex": 56,
    "itemCount": 4,
    "judgeCorrectOptionContent": "",
    "judgeWrongOptionContent": "",
    "choiceItems": [
      {
        "id": "3c3b62bd-8acd-4c70-985a-1153879b68ab",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "679fe0b2-c77f-43d2-ab46-9b87d6bfb567",
        "itemContent": "事业部",
        "answer": 0,
        "orderIndex": 1,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "40d572de-e7ca-4d44-89fe-2be0571a89b2",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "b9c73c1c-b6c9-459e-89ae-aba4b9b53182",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "679fe0b2-c77f-43d2-ab46-9b87d6bfb567",
        "itemContent": "产品研发总部",
        "answer": 1,
        "orderIndex": 2,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "bde90d71-d559-4193-8189-8a619cba776a",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "eb2fc3f1-21d2-47fd-9370-0c50607a8f0b",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "679fe0b2-c77f-43d2-ab46-9b87d6bfb567",
        "itemContent": "蓝光实验室",
        "answer": 1,
        "orderIndex": 3,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "28edc707-cea8-44f7-901f-66fc0ada0022",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "3a015163-5107-449c-a631-6285c379174f",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "679fe0b2-c77f-43d2-ab46-9b87d6bfb567",
        "itemContent": "销售与服务总部",
        "answer": 0,
        "orderIndex": 4,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "52440d99-6c7e-4799-a887-8caed1f1feca",
        "score": 0,
        "itemPlay": null
      }
    ],
    "fillInItems": null,
    "subQuesList": null,
    "corrected": 0,
    "fillinCorrectedInfo": null,
    "submitQuesAnswers": [
      "3a015163-5107-449c-a631-6285c379174f"
    ],
    "correctAnswers": [
      "b9c73c1c-b6c9-459e-89ae-aba4b9b53182",
      "eb2fc3f1-21d2-47fd-9370-0c50607a8f0b"
    ],
    "keywords": null,
    "fillinAnswers": null,
    "judgeAnswer": 0,
    "explainText": "",
    "answerPlay": null,
    "explainPlay": null
  },
  {
    "id": "fb04b8cf-37a4-4759-badd-8c4ed4ef5f54",
    "examQuesId": "f675a9aa-90fc-4c48-b47e-37dc82ea7061",
    "sourceId": "4d5388a2-5802-466f-a5be-e9a0358f8a12",
    "content": "销售与服务总部的职能包括？",
    "quesType": 1,
    "questionType": 0,
    "fileId": "",
    "tranStatus": null,
    "playDetails": null,
    "subQues": 0,
    "parentId": null,
    "orderIndex": 57,
    "itemCount": 4,
    "judgeCorrectOptionContent": "",
    "judgeWrongOptionContent": "",
    "choiceItems": [
      {
        "id": "f1fae9c7-5199-4816-b3ec-9a099fc678b2",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "f675a9aa-90fc-4c48-b47e-37dc82ea7061",
        "itemContent": "战略执行",
        "answer": 1,
        "orderIndex": 1,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "f852d2f9-bb88-4861-8221-6e722bf3a3ea",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "e820d69d-31e5-4299-bec2-85104dcb8829",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "f675a9aa-90fc-4c48-b47e-37dc82ea7061",
        "itemContent": "战术支撑",
        "answer": 1,
        "orderIndex": 2,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "dd5ec14d-60c8-4a49-9187-d27df7cdabb8",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "00c89742-8669-439e-bf22-5419adbd71ac",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "f675a9aa-90fc-4c48-b47e-37dc82ea7061",
        "itemContent": "技术研发",
        "answer": 0,
        "orderIndex": 3,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "40c93f7c-bd9e-47c2-99c4-aba7bb0f74e9",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "4acc0191-b00d-4c04-bad3-2b69fdb51da3",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "f675a9aa-90fc-4c48-b47e-37dc82ea7061",
        "itemContent": "供应链管理",
        "answer": 0,
        "orderIndex": 4,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "4239bd94-1190-4251-82f7-b1e210a3265e",
        "score": 0,
        "itemPlay": null
      }
    ],
    "fillInItems": null,
    "subQuesList": null,
    "corrected": 0,
    "fillinCorrectedInfo": null,
    "submitQuesAnswers": [
      "4acc0191-b00d-4c04-bad3-2b69fdb51da3"
    ],
    "correctAnswers": [
      "f1fae9c7-5199-4816-b3ec-9a099fc678b2",
      "e820d69d-31e5-4299-bec2-85104dcb8829"
    ],
    "keywords": null,
    "fillinAnswers": null,
    "judgeAnswer": 0,
    "explainText": "",
    "answerPlay": null,
    "explainPlay": null
  },
  {
    "id": "96948d26-5cfd-4662-8404-572af9ca43f3",
    "examQuesId": "1723f758-1f79-42e7-816f-f5cd0831b0cf",
    "sourceId": "268db0c3-4d79-4e15-98c1-d265dbbc191c",
    "content": "产品研发总部对什么负责？",
    "quesType": 1,
    "questionType": 0,
    "fileId": "",
    "tranStatus": null,
    "playDetails": null,
    "subQues": 0,
    "parentId": null,
    "orderIndex": 58,
    "itemCount": 4,
    "judgeCorrectOptionContent": "",
    "judgeWrongOptionContent": "",
    "choiceItems": [
      {
        "id": "84e8b07e-ba88-44ef-9825-1ece8fe8ab12",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "1723f758-1f79-42e7-816f-f5cd0831b0cf",
        "itemContent": "集团医疗产品的整体竞争力",
        "answer": 1,
        "orderIndex": 1,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "f7dcfd82-b1ee-46ee-a6d9-1cb2de9bdfb6",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "7a11f6a9-d941-4451-888f-c967b51e0f10",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "1723f758-1f79-42e7-816f-f5cd0831b0cf",
        "itemContent": "市场品牌管理",
        "answer": 0,
        "orderIndex": 2,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "d4ec5cd0-5b2f-4c17-a5d6-c4ab53250344",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "ac5787c9-9c85-4d7f-9c4e-69a5407e2987",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "1723f758-1f79-42e7-816f-f5cd0831b0cf",
        "itemContent": "端到端的全流程产品管理",
        "answer": 1,
        "orderIndex": 3,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "a830109d-965e-4576-8288-52755723275e",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "eaaaf20b-8485-4a30-a573-65efac8a1e0b",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "1723f758-1f79-42e7-816f-f5cd0831b0cf",
        "itemContent": "客户满意度直接提升",
        "answer": 0,
        "orderIndex": 4,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "0408414d-e6a9-4178-b13b-0838993bff82",
        "score": 0,
        "itemPlay": null
      }
    ],
    "fillInItems": null,
    "subQuesList": null,
    "corrected": 0,
    "fillinCorrectedInfo": null,
    "submitQuesAnswers": [
      "eaaaf20b-8485-4a30-a573-65efac8a1e0b"
    ],
    "correctAnswers": [
      "84e8b07e-ba88-44ef-9825-1ece8fe8ab12",
      "ac5787c9-9c85-4d7f-9c4e-69a5407e2987"
    ],
    "keywords": null,
    "fillinAnswers": null,
    "judgeAnswer": 0,
    "explainText": "",
    "answerPlay": null,
    "explainPlay": null
  },
  {
    "id": "2e82625f-a6e1-486f-a169-d33aba167834",
    "examQuesId": "f1fe89df-281e-4ee4-b47f-aa81b9484b2f",
    "sourceId": "1f478cd1-217e-4c2e-8de7-822b4f666fc9",
    "content": "品牌塑造活动包括以下哪些？",
    "quesType": 1,
    "questionType": 0,
    "fileId": "",
    "tranStatus": null,
    "playDetails": null,
    "subQues": 0,
    "parentId": null,
    "orderIndex": 59,
    "itemCount": 4,
    "judgeCorrectOptionContent": "",
    "judgeWrongOptionContent": "",
    "choiceItems": [
      {
        "id": "98a6c1fb-febd-489d-bcff-a2a135ab5182",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "f1fe89df-281e-4ee4-b47f-aa81b9484b2f",
        "itemContent": "举办驼人科技奖创新大赛",
        "answer": 1,
        "orderIndex": 1,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "8d9da283-a059-4f62-a46c-99333c6a2a45",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "13e11851-d623-4ac2-ad78-2cf90ade6f83",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "f1fe89df-281e-4ee4-b47f-aa81b9484b2f",
        "itemContent": "发布年度创新白皮书",
        "answer": 1,
        "orderIndex": 2,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "e85d1e4b-2457-4dfa-8c22-e27824685539",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "d81c5a12-28f9-493b-8cf0-a045f50e6173",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "f1fe89df-281e-4ee4-b47f-aa81b9484b2f",
        "itemContent": "建设驼人医创谷",
        "answer": 1,
        "orderIndex": 3,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "61a99ba2-b334-4da2-8445-6e18d1083b0e",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "baa0c718-e1d1-48ee-9251-157bfea4b4e1",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "f1fe89df-281e-4ee4-b47f-aa81b9484b2f",
        "itemContent": "召开生态大会",
        "answer": 1,
        "orderIndex": 4,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "0dc2948c-f11b-454f-9f09-bc319dce2e9a",
        "score": 0,
        "itemPlay": null
      }
    ],
    "fillInItems": null,
    "subQuesList": null,
    "corrected": 0,
    "fillinCorrectedInfo": null,
    "submitQuesAnswers": [
      "baa0c718-e1d1-48ee-9251-157bfea4b4e1"
    ],
    "correctAnswers": [
      "98a6c1fb-febd-489d-bcff-a2a135ab5182",
      "13e11851-d623-4ac2-ad78-2cf90ade6f83",
      "d81c5a12-28f9-493b-8cf0-a045f50e6173",
      "baa0c718-e1d1-48ee-9251-157bfea4b4e1"
    ],
    "keywords": null,
    "fillinAnswers": null,
    "judgeAnswer": 0,
    "explainText": "",
    "answerPlay": null,
    "explainPlay": null
  },
  {
    "id": "590fa896-bcd4-4976-ba7f-94c76ecdf8f1",
    "examQuesId": "7d6379a8-07dd-4688-81ea-970428388c7b",
    "sourceId": "992a3dd3-b571-414b-a810-516405fb974e",
    "content": "医院协同创新体系包括以下哪些内容？",
    "quesType": 1,
    "questionType": 0,
    "fileId": "",
    "tranStatus": null,
    "playDetails": null,
    "subQues": 0,
    "parentId": null,
    "orderIndex": 60,
    "itemCount": 4,
    "judgeCorrectOptionContent": "",
    "judgeWrongOptionContent": "",
    "choiceItems": [
      {
        "id": "21c72e3a-a127-4752-bea1-c5dad24d3f24",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "7d6379a8-07dd-4688-81ea-970428388c7b",
        "itemContent": "建设全国性专科创新联合体",
        "answer": 1,
        "orderIndex": 1,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "32281d1c-e570-4565-a50e-1dd4031efbc6",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "baef03b4-21cb-4bb9-b732-cd4004a52bb0",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "7d6379a8-07dd-4688-81ea-970428388c7b",
        "itemContent": "签约500家战略医院",
        "answer": 1,
        "orderIndex": 2,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "b9902180-4d4f-496e-adb6-c7c37c076577",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "4f195dfc-a631-4913-a8f3-6357e581f6b9",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "7d6379a8-07dd-4688-81ea-970428388c7b",
        "itemContent": "设立专项基金",
        "answer": 1,
        "orderIndex": 3,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "b09137d2-d25c-4eeb-99ed-9e829f0bb444",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "9015499a-5b08-457d-934d-e227eaeec40b",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "7d6379a8-07dd-4688-81ea-970428388c7b",
        "itemContent": "开展线上电商促销",
        "answer": 0,
        "orderIndex": 4,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "6704c1ed-3889-4c2c-8573-b8f7dde4eea1",
        "score": 0,
        "itemPlay": null
      }
    ],
    "fillInItems": null,
    "subQuesList": null,
    "corrected": 0,
    "fillinCorrectedInfo": null,
    "submitQuesAnswers": [
      "9015499a-5b08-457d-934d-e227eaeec40b"
    ],
    "correctAnswers": [
      "21c72e3a-a127-4752-bea1-c5dad24d3f24",
      "baef03b4-21cb-4bb9-b732-cd4004a52bb0",
      "4f195dfc-a631-4913-a8f3-6357e581f6b9"
    ],
    "keywords": null,
    "fillinAnswers": null,
    "judgeAnswer": 0,
    "explainText": "",
    "answerPlay": null,
    "explainPlay": null
  },
  {
    "id": "7c6394ca-eb4f-418d-9ea7-812893e77958",
    "examQuesId": "788f6655-4d90-43be-8798-e9314869240e",
    "sourceId": "c623e008-1c58-4a63-aad9-9f0f5ee04d46",
    "content": "企业创新合作中，我们能进行合作的企业包含哪些类型？",
    "quesType": 1,
    "questionType": 0,
    "fileId": "",
    "tranStatus": null,
    "playDetails": null,
    "subQues": 0,
    "parentId": null,
    "orderIndex": 61,
    "itemCount": 4,
    "judgeCorrectOptionContent": "",
    "judgeWrongOptionContent": "",
    "choiceItems": [
      {
        "id": "8e6bb3b7-d2c6-4014-a93a-cd1b0fcae422",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "788f6655-4d90-43be-8798-e9314869240e",
        "itemContent": "产品上具有互补性的专精特新的企业",
        "answer": 1,
        "orderIndex": 1,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "c88d11d1-c16f-4227-a9ab-ecdaec40ba95",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "459d7a60-5ad6-4e46-95a6-6a32eb8d53a1",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "788f6655-4d90-43be-8798-e9314869240e",
        "itemContent": "技术上具有互补性的专精特新企业",
        "answer": 1,
        "orderIndex": 2,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "b8b666da-a9c9-49bf-83ce-93525a9d68b9",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "0e51203c-9c31-44f4-86cb-9be6a83c27ab",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "788f6655-4d90-43be-8798-e9314869240e",
        "itemContent": "生产及营销上具有互补性的专精特新企业",
        "answer": 1,
        "orderIndex": 3,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "8ad6e0e0-016c-4a4c-928f-17f2bd5b4ce8",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "5f3d4ccf-53f7-405f-9f3b-3983e79e5827",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "788f6655-4d90-43be-8798-e9314869240e",
        "itemContent": "中小型企业",
        "answer": 1,
        "orderIndex": 4,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "d296c4f4-8d91-468e-9c49-e9b50fb93512",
        "score": 0,
        "itemPlay": null
      }
    ],
    "fillInItems": null,
    "subQuesList": null,
    "corrected": 0,
    "fillinCorrectedInfo": null,
    "submitQuesAnswers": [
      "5f3d4ccf-53f7-405f-9f3b-3983e79e5827"
    ],
    "correctAnswers": [
      "8e6bb3b7-d2c6-4014-a93a-cd1b0fcae422",
      "459d7a60-5ad6-4e46-95a6-6a32eb8d53a1",
      "0e51203c-9c31-44f4-86cb-9be6a83c27ab",
      "5f3d4ccf-53f7-405f-9f3b-3983e79e5827"
    ],
    "keywords": null,
    "fillinAnswers": null,
    "judgeAnswer": 0,
    "explainText": "",
    "answerPlay": null,
    "explainPlay": null
  },
  {
    "id": "43c0bd16-dbef-4630-b4a1-523a9417ed9d",
    "examQuesId": "d3a539d6-469e-432a-bb70-ae964fbef8c2",
    "sourceId": "a6d90e14-0fd2-4995-94d4-ea395bf41a25",
    "content": "高校技术合作的目的是形成什么？",
    "quesType": 1,
    "questionType": 0,
    "fileId": "",
    "tranStatus": null,
    "playDetails": null,
    "subQues": 0,
    "parentId": null,
    "orderIndex": 62,
    "itemCount": 4,
    "judgeCorrectOptionContent": "",
    "judgeWrongOptionContent": "",
    "choiceItems": [
      {
        "id": "6960aed7-c7b4-4e32-b309-a5d0be13a41c",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "d3a539d6-469e-432a-bb70-ae964fbef8c2",
        "itemContent": "可共享的生态技术货架",
        "answer": 1,
        "orderIndex": 1,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "5c2d269a-c136-4719-9f46-d7aeb59923e9",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "4c399695-4f42-4105-b1e5-31b465cb42b7",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "d3a539d6-469e-432a-bb70-ae964fbef8c2",
        "itemContent": "可复用的技术平台",
        "answer": 1,
        "orderIndex": 2,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "7df11f7b-1f45-4cff-90cb-a1dd9bc31859",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "649a5857-7e71-41d0-b34a-9b090d385315",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "d3a539d6-469e-432a-bb70-ae964fbef8c2",
        "itemContent": "独立的研发子公司",
        "answer": 0,
        "orderIndex": 3,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "3dc66a63-dc7c-43ac-8be7-077ea30b80fb",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "d59e9e81-dd39-4067-a8d6-facbc5cc484a",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "d3a539d6-469e-432a-bb70-ae964fbef8c2",
        "itemContent": "封闭的技术库",
        "answer": 0,
        "orderIndex": 4,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "4f01022e-b2b4-479c-9b12-d31ecc09e6c9",
        "score": 0,
        "itemPlay": null
      }
    ],
    "fillInItems": null,
    "subQuesList": null,
    "corrected": 0,
    "fillinCorrectedInfo": null,
    "submitQuesAnswers": [
      "d59e9e81-dd39-4067-a8d6-facbc5cc484a"
    ],
    "correctAnswers": [
      "6960aed7-c7b4-4e32-b309-a5d0be13a41c",
      "4c399695-4f42-4105-b1e5-31b465cb42b7"
    ],
    "keywords": null,
    "fillinAnswers": null,
    "judgeAnswer": 0,
    "explainText": "",
    "answerPlay": null,
    "explainPlay": null
  },
  {
    "id": "4e95bfad-f136-4a8b-b0ec-02511148f222",
    "examQuesId": "fbce7090-c55e-4c8c-b9a7-a96d7b93eee4",
    "sourceId": "6d8e438f-fa51-4219-a576-c89294b57b6f",
    "content": "“驼人生态合作平台”支持哪些功能？",
    "quesType": 1,
    "questionType": 0,
    "fileId": "",
    "tranStatus": null,
    "playDetails": null,
    "subQues": 0,
    "parentId": null,
    "orderIndex": 63,
    "itemCount": 4,
    "judgeCorrectOptionContent": "",
    "judgeWrongOptionContent": "",
    "choiceItems": [
      {
        "id": "42913873-955a-45e7-a7c1-360d5c31b3c6",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "fbce7090-c55e-4c8c-b9a7-a96d7b93eee4",
        "itemContent": "线上需求发布",
        "answer": 1,
        "orderIndex": 1,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "c53bc145-97e3-4b9c-98c6-8fddfdc1a4fe",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "7ae73196-9038-4e0f-961e-391597bf2735",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "fbce7090-c55e-4c8c-b9a7-a96d7b93eee4",
        "itemContent": "能力匹配",
        "answer": 1,
        "orderIndex": 2,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "87edee19-e388-4a67-a547-80a266651c3e",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "5bc15a15-6360-4fd3-9d51-a08e46461aae",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "fbce7090-c55e-4c8c-b9a7-a96d7b93eee4",
        "itemContent": "合约管理",
        "answer": 1,
        "orderIndex": 3,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "dc092848-bd41-4719-a403-1bd0cdbd397c",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "c630f489-78d2-42cc-bf70-9b7a937f84c9",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "fbce7090-c55e-4c8c-b9a7-a96d7b93eee4",
        "itemContent": "合作结算",
        "answer": 1,
        "orderIndex": 4,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "739e9665-d414-4345-a136-1a7f682e1c94",
        "score": 0,
        "itemPlay": null
      }
    ],
    "fillInItems": null,
    "subQuesList": null,
    "corrected": 0,
    "fillinCorrectedInfo": null,
    "submitQuesAnswers": [
      "c630f489-78d2-42cc-bf70-9b7a937f84c9"
    ],
    "correctAnswers": [
      "42913873-955a-45e7-a7c1-360d5c31b3c6",
      "7ae73196-9038-4e0f-961e-391597bf2735",
      "5bc15a15-6360-4fd3-9d51-a08e46461aae",
      "c630f489-78d2-42cc-bf70-9b7a937f84c9"
    ],
    "keywords": null,
    "fillinAnswers": null,
    "judgeAnswer": 0,
    "explainText": "",
    "answerPlay": null,
    "explainPlay": null
  },
  {
    "id": "3a0fab9b-25aa-41e2-989e-969f0529bca7",
    "examQuesId": "ca65a796-8ddf-4105-b2be-a7786c977214",
    "sourceId": "295d03cd-aab4-41d3-a859-506a1c880965",
    "content": "销售策略，核心战略转型包括哪些方面？",
    "quesType": 1,
    "questionType": 0,
    "fileId": "",
    "tranStatus": null,
    "playDetails": null,
    "subQues": 0,
    "parentId": null,
    "orderIndex": 64,
    "itemCount": 4,
    "judgeCorrectOptionContent": "",
    "judgeWrongOptionContent": "",
    "choiceItems": [
      {
        "id": "db77ea68-7375-45ed-a269-b8f7108334ea",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "ca65a796-8ddf-4105-b2be-a7786c977214",
        "itemContent": "客户中心化",
        "answer": 1,
        "orderIndex": 1,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "55d2aafd-fadc-4920-9293-8d6be7e79181",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "1820ee0d-e865-4bec-8930-7e1e0a2a344b",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "ca65a796-8ddf-4105-b2be-a7786c977214",
        "itemContent": "角色平台化",
        "answer": 1,
        "orderIndex": 2,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "34b5d7bc-74d7-4482-9840-f68124db98f8",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "963af449-efed-4e96-8e5d-c540e4a16787",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "ca65a796-8ddf-4105-b2be-a7786c977214",
        "itemContent": "关系伙伴化",
        "answer": 1,
        "orderIndex": 3,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "290987f3-9865-403b-97ef-4ca8aeb0d121",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "6f066ff7-3924-450e-9b7b-5f89861fa4b3",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "ca65a796-8ddf-4105-b2be-a7786c977214",
        "itemContent": "渠道立体化",
        "answer": 1,
        "orderIndex": 4,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "9caa09d2-7efe-48bc-b7d0-9e7046989c89",
        "score": 0,
        "itemPlay": null
      }
    ],
    "fillInItems": null,
    "subQuesList": null,
    "corrected": 0,
    "fillinCorrectedInfo": null,
    "submitQuesAnswers": [
      "6f066ff7-3924-450e-9b7b-5f89861fa4b3"
    ],
    "correctAnswers": [
      "db77ea68-7375-45ed-a269-b8f7108334ea",
      "1820ee0d-e865-4bec-8930-7e1e0a2a344b",
      "963af449-efed-4e96-8e5d-c540e4a16787",
      "6f066ff7-3924-450e-9b7b-5f89861fa4b3"
    ],
    "keywords": null,
    "fillinAnswers": null,
    "judgeAnswer": 0,
    "explainText": "",
    "answerPlay": null,
    "explainPlay": null
  },
  {
    "id": "db25bdfa-4bbc-48b8-9eac-7e6b5d8f5f91",
    "examQuesId": "74f29f31-4769-44e9-a08b-f14201a9d673",
    "sourceId": "f7e1e4fa-b3fd-4a89-8cba-770405b8cf06",
    "content": "区域市场精耕：打造标杆样板，包括哪些方面？",
    "quesType": 1,
    "questionType": 0,
    "fileId": "",
    "tranStatus": null,
    "playDetails": null,
    "subQues": 0,
    "parentId": null,
    "orderIndex": 65,
    "itemCount": 3,
    "judgeCorrectOptionContent": "",
    "judgeWrongOptionContent": "",
    "choiceItems": [
      {
        "id": "48e05855-051b-42af-add1-e485f05a094b",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "74f29f31-4769-44e9-a08b-f14201a9d673",
        "itemContent": "“一省一策”与战略非战略二选一",
        "answer": 1,
        "orderIndex": 1,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "6d0740eb-b85f-4b51-a922-42b54b9ecc32",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "6f160799-44c1-47d4-8344-4f68c1cc3d86",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "74f29f31-4769-44e9-a08b-f14201a9d673",
        "itemContent": "样板医院建设",
        "answer": 1,
        "orderIndex": 2,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "03a0ffd9-32c9-4b6b-97b1-5575e911c899",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "563af069-a2cc-42f4-8359-3b563ca3754b",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "74f29f31-4769-44e9-a08b-f14201a9d673",
        "itemContent": "经验固化与推广",
        "answer": 1,
        "orderIndex": 3,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "c8c31720-bea1-4715-b1bf-1ea82bf709d1",
        "score": 0,
        "itemPlay": null
      }
    ],
    "fillInItems": null,
    "subQuesList": null,
    "corrected": 0,
    "fillinCorrectedInfo": null,
    "submitQuesAnswers": [
      "563af069-a2cc-42f4-8359-3b563ca3754b"
    ],
    "correctAnswers": [
      "48e05855-051b-42af-add1-e485f05a094b",
      "6f160799-44c1-47d4-8344-4f68c1cc3d86",
      "563af069-a2cc-42f4-8359-3b563ca3754b"
    ],
    "keywords": null,
    "fillinAnswers": null,
    "judgeAnswer": 0,
    "explainText": "",
    "answerPlay": null,
    "explainPlay": null
  },
  {
    "id": "d1f70b39-57e5-45b8-bfcd-c3b320fb1ac5",
    "examQuesId": "259e9ecb-59d6-4367-8e63-06c7e99e6a62",
    "sourceId": "f86c28df-31da-422f-b124-dc97030d2275",
    "content": "创新生态驱动：临床与市场闭环，目标是构建哪三方面（）的良性循环",
    "quesType": 1,
    "questionType": 0,
    "fileId": "",
    "tranStatus": null,
    "playDetails": null,
    "subQues": 0,
    "parentId": null,
    "orderIndex": 66,
    "itemCount": 3,
    "judgeCorrectOptionContent": "",
    "judgeWrongOptionContent": "",
    "choiceItems": [
      {
        "id": "a997ea4a-8209-48fb-8794-af6611ab598b",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "259e9ecb-59d6-4367-8e63-06c7e99e6a62",
        "itemContent": "临床驱动创新",
        "answer": 1,
        "orderIndex": 1,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "dcca5bde-d90b-40d1-9df3-655598815883",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "a6a10fef-5ca7-4677-9f88-f2e3c1200240",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "259e9ecb-59d6-4367-8e63-06c7e99e6a62",
        "itemContent": "市场验证价值",
        "answer": 1,
        "orderIndex": 2,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "ddb94f3c-9f31-4541-bd83-68f1b0a1a497",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "40ff4fb8-7440-49ff-93e8-a412fc47dc1f",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "259e9ecb-59d6-4367-8e63-06c7e99e6a62",
        "itemContent": "生态反哺研发",
        "answer": 1,
        "orderIndex": 3,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "ec6bf613-f6ad-43a9-beec-c24123ce9fcd",
        "score": 0,
        "itemPlay": null
      }
    ],
    "fillInItems": null,
    "subQuesList": null,
    "corrected": 0,
    "fillinCorrectedInfo": null,
    "submitQuesAnswers": [
      "40ff4fb8-7440-49ff-93e8-a412fc47dc1f"
    ],
    "correctAnswers": [
      "a997ea4a-8209-48fb-8794-af6611ab598b",
      "a6a10fef-5ca7-4677-9f88-f2e3c1200240",
      "40ff4fb8-7440-49ff-93e8-a412fc47dc1f"
    ],
    "keywords": null,
    "fillinAnswers": null,
    "judgeAnswer": 0,
    "explainText": "",
    "answerPlay": null,
    "explainPlay": null
  },
  {
    "id": "28a6bd2c-1510-42ab-8cef-9a2368eb961d",
    "examQuesId": "4283659e-bf2e-4f7f-8d4c-2b73a6e96e86",
    "sourceId": "d93779cc-1ed5-490d-bf40-0f5b15d9cc9d",
    "content": "研发与技术战略，属于技术布局的有",
    "quesType": 1,
    "questionType": 0,
    "fileId": "",
    "tranStatus": null,
    "playDetails": null,
    "subQues": 0,
    "parentId": null,
    "orderIndex": 67,
    "itemCount": 4,
    "judgeCorrectOptionContent": "",
    "judgeWrongOptionContent": "",
    "choiceItems": [
      {
        "id": "27826f07-4758-425b-ba6a-741fb467a50a",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "4283659e-bf2e-4f7f-8d4c-2b73a6e96e86",
        "itemContent": "AI超声诊断",
        "answer": 1,
        "orderIndex": 1,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "244ece60-8229-4587-bfa0-15d5d10b3a2d",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "3aa23550-dca4-43d6-8e09-b1ea333f66b2",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "4283659e-bf2e-4f7f-8d4c-2b73a6e96e86",
        "itemContent": "医疗机器人",
        "answer": 1,
        "orderIndex": 2,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "70d16c52-86f7-40b9-b2d9-8a4b937b1d53",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "68d1a6be-0173-4789-a2a4-ff1f0d7be583",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "4283659e-bf2e-4f7f-8d4c-2b73a6e96e86",
        "itemContent": "智能介入导管",
        "answer": 1,
        "orderIndex": 3,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "d22cc642-00a7-47b2-bacd-7053c477c9b2",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "eaff29c3-d84c-457a-a925-d87d0bc5b802",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "4283659e-bf2e-4f7f-8d4c-2b73a6e96e86",
        "itemContent": "医用涂层",
        "answer": 1,
        "orderIndex": 4,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "fc1241d7-2076-49d3-a887-4e95d990affa",
        "score": 0,
        "itemPlay": null
      }
    ],
    "fillInItems": null,
    "subQuesList": null,
    "corrected": 0,
    "fillinCorrectedInfo": null,
    "submitQuesAnswers": [
      "eaff29c3-d84c-457a-a925-d87d0bc5b802"
    ],
    "correctAnswers": [
      "27826f07-4758-425b-ba6a-741fb467a50a",
      "3aa23550-dca4-43d6-8e09-b1ea333f66b2",
      "68d1a6be-0173-4789-a2a4-ff1f0d7be583",
      "eaff29c3-d84c-457a-a925-d87d0bc5b802"
    ],
    "keywords": null,
    "fillinAnswers": null,
    "judgeAnswer": 0,
    "explainText": "",
    "answerPlay": null,
    "explainPlay": null
  },
  {
    "id": "5708bbf9-b69c-477c-8fc0-3cabc695e4e1",
    "examQuesId": "8deb0aa0-7e1f-4e50-9305-bd10b240b869",
    "sourceId": "683ae0ad-a7de-4058-b3a9-905758746caf",
    "content": "研发与技术战略，集采突围与产品竞争力提升包括哪些？",
    "quesType": 1,
    "questionType": 0,
    "fileId": "",
    "tranStatus": null,
    "playDetails": null,
    "subQues": 0,
    "parentId": null,
    "orderIndex": 68,
    "itemCount": 4,
    "judgeCorrectOptionContent": "",
    "judgeWrongOptionContent": "",
    "choiceItems": [
      {
        "id": "4d5229d8-8640-41b9-8bd8-7ae9a39f00e8",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "8deb0aa0-7e1f-4e50-9305-bd10b240b869",
        "itemContent": "持续深化现有产品升级",
        "answer": 1,
        "orderIndex": 1,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "421b9096-b5ee-4151-adbf-a5823f37b5d4",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "20943939-f094-4280-8fa1-609de0f4c150",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "8deb0aa0-7e1f-4e50-9305-bd10b240b869",
        "itemContent": "解决遗留问题",
        "answer": 1,
        "orderIndex": 2,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "daa63d61-0984-4086-bdfa-8526475d532f",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "31265650-fcb1-440e-81d5-d46ed12017be",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "8deb0aa0-7e1f-4e50-9305-bd10b240b869",
        "itemContent": "依据医保收费路径，制定产品注册策略",
        "answer": 1,
        "orderIndex": 3,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "603d738f-fd83-4127-8af4-8dbf1f0ad96b",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "f75f5888-3648-4de0-b190-46613b34b29a",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "8deb0aa0-7e1f-4e50-9305-bd10b240b869",
        "itemContent": "实现“国家创新医疗器械”认定零突破",
        "answer": 1,
        "orderIndex": 4,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "7c4f80ae-aef8-449a-9555-4db9c7530c7a",
        "score": 0,
        "itemPlay": null
      }
    ],
    "fillInItems": null,
    "subQuesList": null,
    "corrected": 0,
    "fillinCorrectedInfo": null,
    "submitQuesAnswers": [
      "f75f5888-3648-4de0-b190-46613b34b29a"
    ],
    "correctAnswers": [
      "4d5229d8-8640-41b9-8bd8-7ae9a39f00e8",
      "20943939-f094-4280-8fa1-609de0f4c150",
      "31265650-fcb1-440e-81d5-d46ed12017be",
      "f75f5888-3648-4de0-b190-46613b34b29a"
    ],
    "keywords": null,
    "fillinAnswers": null,
    "judgeAnswer": 0,
    "explainText": "",
    "answerPlay": null,
    "explainPlay": null
  },
  {
    "id": "51b1e839-12a2-46a6-bd04-f9bacdad40a0",
    "examQuesId": "08a1e635-f0bf-4273-924f-049d006a78d3",
    "sourceId": "a063b747-cf90-49bb-8446-73115c702fdd",
    "content": "全国市场划分的三大梯队，第一梯队定位是集团粮仓是那些省份？",
    "quesType": 1,
    "questionType": 0,
    "fileId": "",
    "tranStatus": null,
    "playDetails": null,
    "subQues": 0,
    "parentId": null,
    "orderIndex": 69,
    "itemCount": 4,
    "judgeCorrectOptionContent": "",
    "judgeWrongOptionContent": "",
    "choiceItems": [
      {
        "id": "1a91be65-1f77-41cf-bbde-d250bb494efc",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "08a1e635-f0bf-4273-924f-049d006a78d3",
        "itemContent": "河南",
        "answer": 1,
        "orderIndex": 1,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "31c7bffd-c6cd-49e2-a208-4a1e38ca5aec",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "cff32d7f-a70c-4e77-b4cb-e46d32011bec",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "08a1e635-f0bf-4273-924f-049d006a78d3",
        "itemContent": "山东",
        "answer": 1,
        "orderIndex": 2,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "d6d70b17-bcf6-4207-9297-c46bb174098d",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "cd27eccb-0588-4f99-ba0e-223351119b0b",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "08a1e635-f0bf-4273-924f-049d006a78d3",
        "itemContent": "广东",
        "answer": 1,
        "orderIndex": 3,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "5dd86621-ff62-4232-917f-8eb0a8b11789",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "dda9c11d-a427-40e8-b152-1e13c92ec7fb",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "08a1e635-f0bf-4273-924f-049d006a78d3",
        "itemContent": "河北",
        "answer": 1,
        "orderIndex": 4,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "832d5fec-6dfb-4e73-8f24-b08f293b33bb",
        "score": 0,
        "itemPlay": null
      }
    ],
    "fillInItems": null,
    "subQuesList": null,
    "corrected": 0,
    "fillinCorrectedInfo": null,
    "submitQuesAnswers": [
      "dda9c11d-a427-40e8-b152-1e13c92ec7fb"
    ],
    "correctAnswers": [
      "1a91be65-1f77-41cf-bbde-d250bb494efc",
      "cff32d7f-a70c-4e77-b4cb-e46d32011bec",
      "cd27eccb-0588-4f99-ba0e-223351119b0b",
      "dda9c11d-a427-40e8-b152-1e13c92ec7fb"
    ],
    "keywords": null,
    "fillinAnswers": null,
    "judgeAnswer": 0,
    "explainText": "",
    "answerPlay": null,
    "explainPlay": null
  },
  {
    "id": "577b7ba8-c63a-4702-af90-db7c67d062af",
    "examQuesId": "1277ea21-0dcb-4716-92be-1928c4882171",
    "sourceId": "48597802-06db-4e3e-af05-4e65e73e0b70",
    "content": "联合创新，公司可以从哪些方面来实现深度精耕区域与客户？",
    "quesType": 1,
    "questionType": 0,
    "fileId": "",
    "tranStatus": null,
    "playDetails": null,
    "subQues": 0,
    "parentId": null,
    "orderIndex": 70,
    "itemCount": 4,
    "judgeCorrectOptionContent": "",
    "judgeWrongOptionContent": "",
    "choiceItems": [
      {
        "id": "562873c5-437b-41e3-ab8b-0c940eb824ca",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "1277ea21-0dcb-4716-92be-1928c4882171",
        "itemContent": "推进郑州创新孵化器（驼人医创谷）发展",
        "answer": 1,
        "orderIndex": 1,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "3efeaadc-3668-4828-acde-42b6c006cb9d",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "62a8a57b-b5ab-4d1e-adae-d39a9f3caeb9",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "1277ea21-0dcb-4716-92be-1928c4882171",
        "itemContent": "推进异地注册人服务，建立“多地持证、河南生产、全国销售”模式",
        "answer": 1,
        "orderIndex": 2,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "1b479229-44fa-453c-8931-a2c565256b12",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "8cd0680e-f2c5-4a33-8e7c-621c79bd655f",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "1277ea21-0dcb-4716-92be-1928c4882171",
        "itemContent": "全面推行“一院一策”创新转化方案",
        "answer": 1,
        "orderIndex": 3,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "30e3f15b-3058-468f-80ee-7ba25adfadfc",
        "score": 0,
        "itemPlay": null
      },
      {
        "id": "595569de-dd8a-46d0-8f3c-df29fe8dc278",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": "1277ea21-0dcb-4716-92be-1928c4882171",
        "itemContent": "每年应新增不少于360个有竞争力的价值产品成功转化",
        "answer": 1,
        "orderIndex": 4,
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "2b1866d1-29b9-4794-96c6-405f35a08553",
        "score": 0,
        "itemPlay": null
      }
    ],
    "fillInItems": null,
    "subQuesList": null,
    "corrected": 0,
    "fillinCorrectedInfo": null,
    "submitQuesAnswers": [
      "595569de-dd8a-46d0-8f3c-df29fe8dc278"
    ],
    "correctAnswers": [
      "562873c5-437b-41e3-ab8b-0c940eb824ca",
      "62a8a57b-b5ab-4d1e-adae-d39a9f3caeb9",
      "8cd0680e-f2c5-4a33-8e7c-621c79bd655f",
      "595569de-dd8a-46d0-8f3c-df29fe8dc278"
    ],
    "keywords": null,
    "fillinAnswers": null,
    "judgeAnswer": 0,
    "explainText": "",
    "answerPlay": null,
    "explainPlay": null
  },
  {
    "id": "f4e2f6b8-44c1-47e5-a855-f8553f9c13b7",
    "examQuesId": "de111008-9551-43ab-8ca9-22bf2345a978",
    "sourceId": "8a746497-958f-4fcf-bb57-bce0d411fe89",
    "content": "公司使命是“为创新思想买单，让创意生根，助医者改变世界”。",
    "quesType": 2,
    "questionType": 0,
    "fileId": "",
    "tranStatus": null,
    "playDetails": null,
    "subQues": 0,
    "parentId": null,
    "orderIndex": 71,
    "itemCount": 0,
    "judgeCorrectOptionContent": "正确",
    "judgeWrongOptionContent": "错误",
    "choiceItems": null,
    "fillInItems": null,
    "subQuesList": null,
    "corrected": 1,
    "fillinCorrectedInfo": null,
    "submitQuesAnswers": [
      "0"
    ],
    "correctAnswers": null,
    "keywords": null,
    "fillinAnswers": null,
    "judgeAnswer": 0,
    "explainText": "",
    "answerPlay": null,
    "explainPlay": null
  },
  {
    "id": "7d440cd0-8829-43ad-99a9-fbf47bfe0005",
    "examQuesId": "0fafa5b2-e81b-4874-8dd1-d0b11b2238c7",
    "sourceId": "c555620d-c3b8-4d1e-a5dc-c86aeb402908",
    "content": "公司聚焦的业务包括大型医疗影像设备如CT、MRI。",
    "quesType": 2,
    "questionType": 0,
    "fileId": "",
    "tranStatus": null,
    "playDetails": null,
    "subQues": 0,
    "parentId": null,
    "orderIndex": 72,
    "itemCount": 0,
    "judgeCorrectOptionContent": "正确",
    "judgeWrongOptionContent": "错误",
    "choiceItems": null,
    "fillInItems": null,
    "subQuesList": null,
    "corrected": 1,
    "fillinCorrectedInfo": null,
    "submitQuesAnswers": [
      "0"
    ],
    "correctAnswers": null,
    "keywords": null,
    "fillinAnswers": null,
    "judgeAnswer": 0,
    "explainText": "",
    "answerPlay": null,
    "explainPlay": null
  },
  {
    "id": "88a2479c-5343-48fc-bec2-7c27e9a42ed1",
    "examQuesId": "e17ea6c1-0b17-495c-8633-066ff37a96dc",
    "sourceId": "67bbbfbe-25af-4a01-b08e-992a743c1f02",
    "content": "骨科3D打印定制化植入物项目升级为“个性化医疗解决方案”平台。",
    "quesType": 2,
    "questionType": 0,
    "fileId": "",
    "tranStatus": null,
    "playDetails": null,
    "subQues": 0,
    "parentId": null,
    "orderIndex": 73,
    "itemCount": 0,
    "judgeCorrectOptionContent": "正确",
    "judgeWrongOptionContent": "错误",
    "choiceItems": null,
    "fillInItems": null,
    "subQuesList": null,
    "corrected": 0,
    "fillinCorrectedInfo": null,
    "submitQuesAnswers": [
      "0"
    ],
    "correctAnswers": null,
    "keywords": null,
    "fillinAnswers": null,
    "judgeAnswer": 1,
    "explainText": "",
    "answerPlay": null,
    "explainPlay": null
  },
  {
    "id": "b1468a38-1114-44b9-8b9e-831c45e60b52",
    "examQuesId": "7c4bf8b7-d622-4c6b-8f67-e5117f988ee1",
    "sourceId": "38302b5e-c854-4264-9007-8ddae4490746",
    "content": "公司现有核心业务计划全部上市。",
    "quesType": 2,
    "questionType": 0,
    "fileId": "",
    "tranStatus": null,
    "playDetails": null,
    "subQues": 0,
    "parentId": null,
    "orderIndex": 74,
    "itemCount": 0,
    "judgeCorrectOptionContent": "正确",
    "judgeWrongOptionContent": "错误",
    "choiceItems": null,
    "fillInItems": null,
    "subQuesList": null,
    "corrected": 1,
    "fillinCorrectedInfo": null,
    "submitQuesAnswers": [
      "0"
    ],
    "correctAnswers": null,
    "keywords": null,
    "fillinAnswers": null,
    "judgeAnswer": 0,
    "explainText": "",
    "answerPlay": null,
    "explainPlay": null
  },
  {
    "id": "f50104d9-86f8-4838-a3f6-40a835413981",
    "examQuesId": "d5a1f426-ac97-4550-bc48-209a0e89ef19",
    "sourceId": "65a3cb7a-347e-4dd8-876c-4f43d8a0753f",
    "content": "公司价值观包括“以客户为中心，以奋斗者为本”。",
    "quesType": 2,
    "questionType": 0,
    "fileId": "",
    "tranStatus": null,
    "playDetails": null,
    "subQues": 0,
    "parentId": null,
    "orderIndex": 75,
    "itemCount": 0,
    "judgeCorrectOptionContent": "正确",
    "judgeWrongOptionContent": "错误",
    "choiceItems": null,
    "fillInItems": null,
    "subQuesList": null,
    "corrected": 0,
    "fillinCorrectedInfo": null,
    "submitQuesAnswers": [
      "0"
    ],
    "correctAnswers": null,
    "keywords": null,
    "fillinAnswers": null,
    "judgeAnswer": 1,
    "explainText": "",
    "answerPlay": null,
    "explainPlay": null
  },
  {
    "id": "88c07352-b9dc-4f27-8a90-52036568e278",
    "examQuesId": "e9958816-7ccc-42ef-81b9-0e2f22d2716e",
    "sourceId": "4b0b4054-e3c4-41f6-b7a8-cb7dba2f6f74",
    "content": "区域与客户战略的国内市场，目标是与500家医院的战略合作关系遵循“&nbsp;签约-融入-深化-共赢”的推进路径。",
    "quesType": 2,
    "questionType": 0,
    "fileId": "",
    "tranStatus": null,
    "playDetails": null,
    "subQues": 0,
    "parentId": null,
    "orderIndex": 76,
    "itemCount": 0,
    "judgeCorrectOptionContent": "正确",
    "judgeWrongOptionContent": "错误",
    "choiceItems": null,
    "fillInItems": null,
    "subQuesList": null,
    "corrected": 0,
    "fillinCorrectedInfo": null,
    "submitQuesAnswers": [
      "0"
    ],
    "correctAnswers": null,
    "keywords": null,
    "fillinAnswers": null,
    "judgeAnswer": 1,
    "explainText": "",
    "answerPlay": null,
    "explainPlay": null
  },
  {
    "id": "4e5d3d60-0c97-4088-85be-4059a89327ab",
    "examQuesId": "1417d409-dcc6-40cb-a654-2f7512bd6207",
    "sourceId": "38d820e3-b1a8-487f-9ada-a630ad06a45f",
    "content": "全国市场划分为三大梯队，第一梯队有河南、广东、河北、山东、四川、北京、上海。",
    "quesType": 2,
    "questionType": 0,
    "fileId": "",
    "tranStatus": null,
    "playDetails": null,
    "subQues": 0,
    "parentId": null,
    "orderIndex": 77,
    "itemCount": 0,
    "judgeCorrectOptionContent": "正确",
    "judgeWrongOptionContent": "错误",
    "choiceItems": null,
    "fillInItems": null,
    "subQuesList": null,
    "corrected": 0,
    "fillinCorrectedInfo": null,
    "submitQuesAnswers": [
      "0"
    ],
    "correctAnswers": null,
    "keywords": null,
    "fillinAnswers": null,
    "judgeAnswer": 1,
    "explainText": "",
    "answerPlay": null,
    "explainPlay": null
  },
  {
    "id": "7e24c6cf-d364-4c1a-93b9-0fb9912a36f4",
    "examQuesId": "f2ead117-a1fa-4af2-9d4b-8d9b54b78687",
    "sourceId": "e43a8fa3-dca2-40e7-a686-6927a9f2c81e",
    "content": "集团战略与协同委员会每半年召开一次战略对齐与协同复盘会。",
    "quesType": 2,
    "questionType": 0,
    "fileId": "",
    "tranStatus": null,
    "playDetails": null,
    "subQues": 0,
    "parentId": null,
    "orderIndex": 78,
    "itemCount": 0,
    "judgeCorrectOptionContent": "正确",
    "judgeWrongOptionContent": "错误",
    "choiceItems": null,
    "fillInItems": null,
    "subQuesList": null,
    "corrected": 1,
    "fillinCorrectedInfo": null,
    "submitQuesAnswers": [
      "0"
    ],
    "correctAnswers": null,
    "keywords": null,
    "fillinAnswers": null,
    "judgeAnswer": 0,
    "explainText": "",
    "answerPlay": null,
    "explainPlay": null
  },
  {
    "id": "eb5b7b05-5e22-4ee9-896f-83fbb0f32b0a",
    "examQuesId": "15ad5f66-46fb-4927-aecd-53a3edd5e68e",
    "sourceId": "80dd1f9b-fcdd-43bd-9d0c-f7ac41cd2d19",
    "content": "各事业部的SP/BP中需说明对集团公共技术平台的使用计划与协同开发需求。",
    "quesType": 2,
    "questionType": 0,
    "fileId": "",
    "tranStatus": null,
    "playDetails": null,
    "subQues": 0,
    "parentId": null,
    "orderIndex": 79,
    "itemCount": 0,
    "judgeCorrectOptionContent": "正确",
    "judgeWrongOptionContent": "错误",
    "choiceItems": null,
    "fillInItems": null,
    "subQuesList": null,
    "corrected": 0,
    "fillinCorrectedInfo": null,
    "submitQuesAnswers": [
      "0"
    ],
    "correctAnswers": null,
    "keywords": null,
    "fillinAnswers": null,
    "judgeAnswer": 1,
    "explainText": "",
    "answerPlay": null,
    "explainPlay": null
  },
  {
    "id": "d2a4889e-9647-47a2-8cc6-15410d938a3e",
    "examQuesId": "6dfff05c-bc08-4233-9e5f-7f28fd2be59f",
    "sourceId": "f0683fd8-4b91-47c0-82ec-8cb4f4799baa",
    "content": "“联合&nbsp;Charter”制度要求多部门共同签署项目任务书，明确职责与收益分享机制。",
    "quesType": 2,
    "questionType": 0,
    "fileId": "",
    "tranStatus": null,
    "playDetails": null,
    "subQues": 0,
    "parentId": null,
    "orderIndex": 80,
    "itemCount": 0,
    "judgeCorrectOptionContent": "正确",
    "judgeWrongOptionContent": "错误",
    "choiceItems": null,
    "fillInItems": null,
    "subQuesList": null,
    "corrected": 0,
    "fillinCorrectedInfo": null,
    "submitQuesAnswers": [
      "0"
    ],
    "correctAnswers": null,
    "keywords": null,
    "fillinAnswers": null,
    "judgeAnswer": 1,
    "explainText": "",
    "answerPlay": null,
    "explainPlay": null
  },
  {
    "id": "f9e38865-9c32-4792-b221-4f06b9d595f8",
    "examQuesId": "83fa4fe0-6c1f-4ca4-ba99-9ef4a21efd9e",
    "sourceId": "4477a4fe-f39c-47e3-ba1e-56e4e56d5915",
    "content": "蓝光实验室是公司的市场策略执行与赋能中心。",
    "quesType": 2,
    "questionType": 0,
    "fileId": "",
    "tranStatus": null,
    "playDetails": null,
    "subQues": 0,
    "parentId": null,
    "orderIndex": 81,
    "itemCount": 0,
    "judgeCorrectOptionContent": "正确",
    "judgeWrongOptionContent": "错误",
    "choiceItems": null,
    "fillInItems": null,
    "subQuesList": null,
    "corrected": 1,
    "fillinCorrectedInfo": null,
    "submitQuesAnswers": [
      "0"
    ],
    "correctAnswers": null,
    "keywords": null,
    "fillinAnswers": null,
    "judgeAnswer": 0,
    "explainText": "",
    "answerPlay": null,
    "explainPlay": null
  },
  {
    "id": "2e30e472-ffb3-40d8-a57e-6666341c7be7",
    "examQuesId": "dd8b529d-50c0-40ec-8e39-8c3058b9eb65",
    "sourceId": "f205a425-396d-4215-9a84-7caaf28681ad",
    "content": "供应链部门不参与战略协同，仅负责生产交付。",
    "quesType": 2,
    "questionType": 0,
    "fileId": "",
    "tranStatus": null,
    "playDetails": null,
    "subQues": 0,
    "parentId": null,
    "orderIndex": 82,
    "itemCount": 0,
    "judgeCorrectOptionContent": "正确",
    "judgeWrongOptionContent": "错误",
    "choiceItems": null,
    "fillInItems": null,
    "subQuesList": null,
    "corrected": 1,
    "fillinCorrectedInfo": null,
    "submitQuesAnswers": [
      "0"
    ],
    "correctAnswers": null,
    "keywords": null,
    "fillinAnswers": null,
    "judgeAnswer": 0,
    "explainText": "",
    "answerPlay": null,
    "explainPlay": null
  },
  {
    "id": "2c5371a3-04b0-43af-a70a-cfc9b8bd1258",
    "examQuesId": "5df64b5b-bd65-4b6e-bd72-f66de4930de9",
    "sourceId": "d3e63afa-c2c0-453b-acb4-b1fa314efc56",
    "content": "市场洞察项目由集团战略MKT独立完成，事业部不参与。",
    "quesType": 2,
    "questionType": 0,
    "fileId": "",
    "tranStatus": null,
    "playDetails": null,
    "subQues": 0,
    "parentId": null,
    "orderIndex": 83,
    "itemCount": 0,
    "judgeCorrectOptionContent": "正确",
    "judgeWrongOptionContent": "错误",
    "choiceItems": null,
    "fillInItems": null,
    "subQuesList": null,
    "corrected": 1,
    "fillinCorrectedInfo": null,
    "submitQuesAnswers": [
      "0"
    ],
    "correctAnswers": null,
    "keywords": null,
    "fillinAnswers": null,
    "judgeAnswer": 0,
    "explainText": "",
    "answerPlay": null,
    "explainPlay": null
  },
  {
    "id": "418ff33e-c949-4d58-a604-78ba3c0617c9",
    "examQuesId": "279437d9-f929-46be-a14d-c6e606531b4e",
    "sourceId": "5af14a54-6edd-4814-a457-a58117285529",
    "content": "专科创新联合体基于29个科室及对应学科建设。",
    "quesType": 2,
    "questionType": 0,
    "fileId": "",
    "tranStatus": null,
    "playDetails": null,
    "subQues": 0,
    "parentId": null,
    "orderIndex": 84,
    "itemCount": 0,
    "judgeCorrectOptionContent": "正确",
    "judgeWrongOptionContent": "错误",
    "choiceItems": null,
    "fillInItems": null,
    "subQuesList": null,
    "corrected": 0,
    "fillinCorrectedInfo": null,
    "submitQuesAnswers": [
      "0"
    ],
    "correctAnswers": null,
    "keywords": null,
    "fillinAnswers": null,
    "judgeAnswer": 1,
    "explainText": "",
    "answerPlay": null,
    "explainPlay": null
  },
  {
    "id": "ae1820cb-78c5-4ce6-89f9-6ee98f3da7c4",
    "examQuesId": "0e7772c8-097d-4bee-b4eb-3a438500639e",
    "sourceId": "49a13cce-9f35-4ca3-9b9d-71277f4855c4",
    "content": "医院创新项目转化过程中，驼人提供从概念验证到生产上市的全链条服务。",
    "quesType": 2,
    "questionType": 0,
    "fileId": "",
    "tranStatus": null,
    "playDetails": null,
    "subQues": 0,
    "parentId": null,
    "orderIndex": 85,
    "itemCount": 0,
    "judgeCorrectOptionContent": "正确",
    "judgeWrongOptionContent": "错误",
    "choiceItems": null,
    "fillInItems": null,
    "subQuesList": null,
    "corrected": 0,
    "fillinCorrectedInfo": null,
    "submitQuesAnswers": [
      "0"
    ],
    "correctAnswers": null,
    "keywords": null,
    "fillinAnswers": null,
    "judgeAnswer": 1,
    "explainText": "",
    "answerPlay": null,
    "explainPlay": null
  },
  {
    "id": "12bebe54-03a5-44fe-a269-aa2720eaf217",
    "examQuesId": "804f56f8-3c23-4c23-8ddd-eb709744dddb",
    "sourceId": "59aebdb9-ff53-499b-afe0-89954b4f1f09",
    "content": "对于平台内客户，生态伙伴企业可自行开展销售工作。",
    "quesType": 2,
    "questionType": 0,
    "fileId": "",
    "tranStatus": null,
    "playDetails": null,
    "subQues": 0,
    "parentId": null,
    "orderIndex": 86,
    "itemCount": 0,
    "judgeCorrectOptionContent": "正确",
    "judgeWrongOptionContent": "错误",
    "choiceItems": null,
    "fillInItems": null,
    "subQuesList": null,
    "corrected": 1,
    "fillinCorrectedInfo": null,
    "submitQuesAnswers": [
      "0"
    ],
    "correctAnswers": null,
    "keywords": null,
    "fillinAnswers": null,
    "judgeAnswer": 0,
    "explainText": "",
    "answerPlay": null,
    "explainPlay": null
  },
  {
    "id": "7b29b181-7891-49ba-a4c8-6516b513d55e",
    "examQuesId": "e3e94f20-939d-4444-be51-b7ada9acd532",
    "sourceId": "c5cc2394-4289-4291-8432-bea450d16c71",
    "content": "高校技术合作以“临床需求为导向”为主要原则。",
    "quesType": 2,
    "questionType": 0,
    "fileId": "",
    "tranStatus": null,
    "playDetails": null,
    "subQues": 0,
    "parentId": null,
    "orderIndex": 87,
    "itemCount": 0,
    "judgeCorrectOptionContent": "正确",
    "judgeWrongOptionContent": "错误",
    "choiceItems": null,
    "fillInItems": null,
    "subQuesList": null,
    "corrected": 0,
    "fillinCorrectedInfo": null,
    "submitQuesAnswers": [
      "0"
    ],
    "correctAnswers": null,
    "keywords": null,
    "fillinAnswers": null,
    "judgeAnswer": 1,
    "explainText": "",
    "answerPlay": null,
    "explainPlay": null
  },
  {
    "id": "43226f2e-5e5e-4805-acd7-2232f3b99bad",
    "examQuesId": "a03ccf64-9e9a-4e14-bcca-0fde20cc0ba8",
    "sourceId": "53ed18af-9c38-45d3-a263-2d9b41c963f4",
    "content": "客户分级包括战略客户和非战略客户。",
    "quesType": 2,
    "questionType": 0,
    "fileId": "",
    "tranStatus": null,
    "playDetails": null,
    "subQues": 0,
    "parentId": null,
    "orderIndex": 88,
    "itemCount": 0,
    "judgeCorrectOptionContent": "正确",
    "judgeWrongOptionContent": "错误",
    "choiceItems": null,
    "fillInItems": null,
    "subQuesList": null,
    "corrected": 0,
    "fillinCorrectedInfo": null,
    "submitQuesAnswers": [
      "0"
    ],
    "correctAnswers": null,
    "keywords": null,
    "fillinAnswers": null,
    "judgeAnswer": 1,
    "explainText": "",
    "answerPlay": null,
    "explainPlay": null
  },
  {
    "id": "93496115-0499-4e98-86c7-2d4111a05be4",
    "examQuesId": "81229862-7776-4f0f-b820-155910c069c4",
    "sourceId": "2a0b1907-17de-44b9-8cd3-465a31dd80b2",
    "content": "销售策略的关键策略举措中，竞争管理升级的三层管理包含集团级、产品级、区域级。",
    "quesType": 2,
    "questionType": 0,
    "fileId": "",
    "tranStatus": null,
    "playDetails": null,
    "subQues": 0,
    "parentId": null,
    "orderIndex": 89,
    "itemCount": 0,
    "judgeCorrectOptionContent": "正确",
    "judgeWrongOptionContent": "错误",
    "choiceItems": null,
    "fillInItems": null,
    "subQuesList": null,
    "corrected": 0,
    "fillinCorrectedInfo": null,
    "submitQuesAnswers": [
      "0"
    ],
    "correctAnswers": null,
    "keywords": null,
    "fillinAnswers": null,
    "judgeAnswer": 1,
    "explainText": "",
    "answerPlay": null,
    "explainPlay": null
  },
  {
    "id": "d7eb4ad9-e85f-4d2b-add7-473628b06088",
    "examQuesId": "e154cef7-68fe-48a5-9fb3-86680334292e",
    "sourceId": "a12ed9f2-8521-42fa-85af-780da5bd7e43",
    "content": "竞争管理中，对低价恶意冲标者提前预警并制定反制方案（如产品组合策略、服务增值等），&nbsp;明确各产品规格型号对应各价格梯队，满足市场要求。",
    "quesType": 2,
    "questionType": 0,
    "fileId": "",
    "tranStatus": null,
    "playDetails": null,
    "subQues": 0,
    "parentId": null,
    "orderIndex": 90,
    "itemCount": 0,
    "judgeCorrectOptionContent": "正确",
    "judgeWrongOptionContent": "错误",
    "choiceItems": null,
    "fillInItems": null,
    "subQuesList": null,
    "corrected": 0,
    "fillinCorrectedInfo": null,
    "submitQuesAnswers": [
      "0"
    ],
    "correctAnswers": null,
    "keywords": null,
    "fillinAnswers": null,
    "judgeAnswer": 1,
    "explainText": "",
    "answerPlay": null,
    "explainPlay": null
  },
  {
    "id": "8f51042d-ffe9-419c-9e15-25e0180be8f3",
    "examQuesId": "5570752d-9c4a-44ec-ad20-2b1ecc5f893d",
    "sourceId": "95277d07-1b35-4047-b1de-90f503c4cdb6",
    "content": "研发与技术战略，导向是从“同质化抄袭”向“市场与临床需求导向”双轮驱动转变；由“不拘一格降成本”向“提质降本”转变。",
    "quesType": 2,
    "questionType": 0,
    "fileId": "",
    "tranStatus": null,
    "playDetails": null,
    "subQues": 0,
    "parentId": null,
    "orderIndex": 91,
    "itemCount": 0,
    "judgeCorrectOptionContent": "正确",
    "judgeWrongOptionContent": "错误",
    "choiceItems": null,
    "fillInItems": null,
    "subQuesList": null,
    "corrected": 0,
    "fillinCorrectedInfo": null,
    "submitQuesAnswers": [
      "0"
    ],
    "correctAnswers": null,
    "keywords": null,
    "fillinAnswers": null,
    "judgeAnswer": 1,
    "explainText": "",
    "answerPlay": null,
    "explainPlay": null
  },
  {
    "id": "420d8451-2ffb-4e54-b45b-2ee2f04726ec",
    "examQuesId": "c7580aa7-4767-443f-ac73-10b5b38693ef",
    "sourceId": "82dbaab5-a7d1-4ce4-ae13-bb4257fd302b",
    "content": "人力资源战略激励机制，基于企业创造价值、导向战略客户的创新激励，塑造“获取分享”的奋斗者文化。",
    "quesType": 2,
    "questionType": 0,
    "fileId": "",
    "tranStatus": null,
    "playDetails": null,
    "subQues": 0,
    "parentId": null,
    "orderIndex": 92,
    "itemCount": 0,
    "judgeCorrectOptionContent": "正确",
    "judgeWrongOptionContent": "错误",
    "choiceItems": null,
    "fillInItems": null,
    "subQuesList": null,
    "corrected": 0,
    "fillinCorrectedInfo": null,
    "submitQuesAnswers": [
      "0"
    ],
    "correctAnswers": null,
    "keywords": null,
    "fillinAnswers": null,
    "judgeAnswer": 1,
    "explainText": "",
    "answerPlay": null,
    "explainPlay": null
  },
  {
    "id": "340a943d-fe45-4629-9869-37b28309f0d4",
    "examQuesId": "e19a3cc4-9a81-4ed1-a8f8-abba735704ce",
    "sourceId": "a8764a74-cd7e-4e85-9792-c74ed0b6104e",
    "content": "战略实施保障，绩效管理将“直销及混合直销模式在销售收入中的占比”作为对销售总监等核心管理层的关键考核指标。",
    "quesType": 2,
    "questionType": 0,
    "fileId": "",
    "tranStatus": null,
    "playDetails": null,
    "subQues": 0,
    "parentId": null,
    "orderIndex": 93,
    "itemCount": 0,
    "judgeCorrectOptionContent": "正确",
    "judgeWrongOptionContent": "错误",
    "choiceItems": null,
    "fillInItems": null,
    "subQuesList": null,
    "corrected": 0,
    "fillinCorrectedInfo": null,
    "submitQuesAnswers": [
      "0"
    ],
    "correctAnswers": null,
    "keywords": null,
    "fillinAnswers": null,
    "judgeAnswer": 1,
    "explainText": "",
    "answerPlay": null,
    "explainPlay": null
  },
  {
    "id": "e2cef9b0-3d82-4305-854b-b1837a53a459",
    "examQuesId": "a71fedc7-0b2a-4eab-9e5a-204d23baea35",
    "sourceId": "c207a8cd-14a8-4738-bddb-812d0ef0bfc2",
    "content": "公司的企业精神是“持续创新，_____（1）_____”。",
    "quesType": 3,
    "questionType": 0,
    "fileId": "",
    "tranStatus": null,
    "playDetails": null,
    "subQues": 0,
    "parentId": null,
    "orderIndex": 94,
    "itemCount": 1,
    "judgeCorrectOptionContent": "",
    "judgeWrongOptionContent": "",
    "choiceItems": null,
    "fillInItems": [
      {
        "id": "fb0814d7-df5a-453f-81a4-8e0a7e906db6",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": null,
        "itemAnswer": "砥砺前行",
        "orderIndex": 1,
        "itemAnswer1": "",
        "itemAnswer2": "",
        "itemAnswer3": "",
        "itemAnswer4": "",
        "itemAnswer5": "",
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "e7dc55e2-a77f-4799-83a2-4a9ca6c2150f",
        "score": 0,
        "totalScore": 0
      }
    ],
    "subQuesList": null,
    "corrected": 0,
    "fillinCorrectedInfo": [
      0
    ],
    "submitQuesAnswers": [
      "1"
    ],
    "correctAnswers": null,
    "keywords": null,
    "fillinAnswers": [
      {
        "id": "fb0814d7-df5a-453f-81a4-8e0a7e906db6",
        "itemAnswer": "砥砺前行",
        "orderIndex": 0,
        "itemAnswer1": "",
        "itemAnswer2": "",
        "itemAnswer3": "",
        "itemAnswer4": "",
        "itemAnswer5": "",
        "corrected": 0
      }
    ],
    "judgeAnswer": 0,
    "explainText": "",
    "answerPlay": null,
    "explainPlay": null
  },
  {
    "id": "b18a5062-95c8-4040-83f5-fa6502a6c215",
    "examQuesId": "ff87c14f-18e0-49ce-a257-d41a09f8be07",
    "sourceId": "2843289a-6db1-47e7-9c0e-e06a0a72673a",
    "content": "公司十年愿景是达到_____（1）_____亿元规模，跻身中国医疗器械公司规模前三。",
    "quesType": 3,
    "questionType": 0,
    "fileId": "",
    "tranStatus": null,
    "playDetails": null,
    "subQues": 0,
    "parentId": null,
    "orderIndex": 95,
    "itemCount": 1,
    "judgeCorrectOptionContent": "",
    "judgeWrongOptionContent": "",
    "choiceItems": null,
    "fillInItems": [
      {
        "id": "f74512b7-1749-4bf6-93cf-cf15573ab777",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": null,
        "itemAnswer": "500",
        "orderIndex": 1,
        "itemAnswer1": "",
        "itemAnswer2": "",
        "itemAnswer3": "",
        "itemAnswer4": "",
        "itemAnswer5": "",
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "90bf958b-a738-42e6-98cf-3242ff0f7519",
        "score": 0,
        "totalScore": 0
      }
    ],
    "subQuesList": null,
    "corrected": 0,
    "fillinCorrectedInfo": [
      0
    ],
    "submitQuesAnswers": [
      "1"
    ],
    "correctAnswers": null,
    "keywords": null,
    "fillinAnswers": [
      {
        "id": "f74512b7-1749-4bf6-93cf-cf15573ab777",
        "itemAnswer": "500",
        "orderIndex": 0,
        "itemAnswer1": "",
        "itemAnswer2": "",
        "itemAnswer3": "",
        "itemAnswer4": "",
        "itemAnswer5": "",
        "corrected": 0
      }
    ],
    "judgeAnswer": 0,
    "explainText": "",
    "answerPlay": null,
    "explainPlay": null
  },
  {
    "id": "684ee729-7af3-42e5-ae6a-968fea145d7f",
    "examQuesId": "f447727a-fd2d-4366-b129-04b53c22c6d7",
    "sourceId": "8b96d908-9672-4856-9f62-3799a0cc3e3d",
    "content": "公司产业边界中明确“不做”的包括药品（除药械组合）、大型医疗影像设备、IVD试剂及设备、____（1）_____。",
    "quesType": 3,
    "questionType": 0,
    "fileId": "",
    "tranStatus": null,
    "playDetails": null,
    "subQues": 0,
    "parentId": null,
    "orderIndex": 96,
    "itemCount": 1,
    "judgeCorrectOptionContent": "",
    "judgeWrongOptionContent": "",
    "choiceItems": null,
    "fillInItems": [
      {
        "id": "5bb2baf6-72f5-4cd6-8f35-762915a84c8b",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": null,
        "itemAnswer": "生物类制品",
        "orderIndex": 1,
        "itemAnswer1": "",
        "itemAnswer2": "",
        "itemAnswer3": "",
        "itemAnswer4": "",
        "itemAnswer5": "",
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "689efe4d-6a75-4372-aecb-91814c938cbb",
        "score": 0,
        "totalScore": 0
      }
    ],
    "subQuesList": null,
    "corrected": 0,
    "fillinCorrectedInfo": [
      0
    ],
    "submitQuesAnswers": [
      "1"
    ],
    "correctAnswers": null,
    "keywords": null,
    "fillinAnswers": [
      {
        "id": "5bb2baf6-72f5-4cd6-8f35-762915a84c8b",
        "itemAnswer": "生物类制品",
        "orderIndex": 0,
        "itemAnswer1": "",
        "itemAnswer2": "",
        "itemAnswer3": "",
        "itemAnswer4": "",
        "itemAnswer5": "",
        "corrected": 0
      }
    ],
    "judgeAnswer": 0,
    "explainText": "",
    "answerPlay": null,
    "explainPlay": null
  },
  {
    "id": "f452fe7f-1760-4569-9885-118763285d72",
    "examQuesId": "ed976bf8-37a5-448e-8d39-494e089f3185",
    "sourceId": "5e05f1ff-848d-4d15-becc-2bbafeebff1b",
    "content": "公司品牌定位是“驼人，医疗器械创新转化的_____（1）_____”。",
    "quesType": 3,
    "questionType": 0,
    "fileId": "",
    "tranStatus": null,
    "playDetails": null,
    "subQues": 0,
    "parentId": null,
    "orderIndex": 97,
    "itemCount": 1,
    "judgeCorrectOptionContent": "",
    "judgeWrongOptionContent": "",
    "choiceItems": null,
    "fillInItems": [
      {
        "id": "8c4d9ce3-2f2f-4f0e-ae0e-63302ec3a923",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": null,
        "itemAnswer": "领航者",
        "orderIndex": 1,
        "itemAnswer1": "",
        "itemAnswer2": "",
        "itemAnswer3": "",
        "itemAnswer4": "",
        "itemAnswer5": "",
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "a86fd074-60e6-4c09-a36d-f814f61343ae",
        "score": 0,
        "totalScore": 0
      }
    ],
    "subQuesList": null,
    "corrected": 0,
    "fillinCorrectedInfo": [
      0
    ],
    "submitQuesAnswers": [
      "1"
    ],
    "correctAnswers": null,
    "keywords": null,
    "fillinAnswers": [
      {
        "id": "8c4d9ce3-2f2f-4f0e-ae0e-63302ec3a923",
        "itemAnswer": "领航者",
        "orderIndex": 0,
        "itemAnswer1": "",
        "itemAnswer2": "",
        "itemAnswer3": "",
        "itemAnswer4": "",
        "itemAnswer5": "",
        "corrected": 0
      }
    ],
    "judgeAnswer": 0,
    "explainText": "",
    "answerPlay": null,
    "explainPlay": null
  },
  {
    "id": "690ac77a-9fb9-459e-9259-b596e9f730d3",
    "examQuesId": "9ebf1994-dad7-43ac-abe1-5f358757443a",
    "sourceId": "587676a6-220a-4cfb-b5d5-6dc28f53d3c3",
    "content": "公司五年目标中，2030年毛利额为_____（1）_____亿元。",
    "quesType": 3,
    "questionType": 0,
    "fileId": "",
    "tranStatus": null,
    "playDetails": null,
    "subQues": 0,
    "parentId": null,
    "orderIndex": 98,
    "itemCount": 1,
    "judgeCorrectOptionContent": "",
    "judgeWrongOptionContent": "",
    "choiceItems": null,
    "fillInItems": [
      {
        "id": "fc00f11d-26a6-48ab-837f-c70179bdb657",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": null,
        "itemAnswer": "80",
        "orderIndex": 1,
        "itemAnswer1": "",
        "itemAnswer2": "",
        "itemAnswer3": "",
        "itemAnswer4": "",
        "itemAnswer5": "",
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "01a5037b-9feb-44d7-afc8-028396acd034",
        "score": 0,
        "totalScore": 0
      }
    ],
    "subQuesList": null,
    "corrected": 0,
    "fillinCorrectedInfo": [
      0
    ],
    "submitQuesAnswers": [
      "1"
    ],
    "correctAnswers": null,
    "keywords": null,
    "fillinAnswers": [
      {
        "id": "fc00f11d-26a6-48ab-837f-c70179bdb657",
        "itemAnswer": "80",
        "orderIndex": 0,
        "itemAnswer1": "",
        "itemAnswer2": "",
        "itemAnswer3": "",
        "itemAnswer4": "",
        "itemAnswer5": "",
        "corrected": 0
      }
    ],
    "judgeAnswer": 0,
    "explainText": "",
    "answerPlay": null,
    "explainPlay": null
  },
  {
    "id": "274af434-a3d4-4e10-b8e2-f1bc3b0d1b2e",
    "examQuesId": "1cd2c250-a31b-4ca0-8b72-904325335d85",
    "sourceId": "7401c5be-2944-4269-b2fc-895fbd7d9031",
    "content": "联合创新通过推进___（1）___服务，建立“多地持证、河南生产、全国销售”模式。",
    "quesType": 3,
    "questionType": 0,
    "fileId": "",
    "tranStatus": null,
    "playDetails": null,
    "subQues": 0,
    "parentId": null,
    "orderIndex": 99,
    "itemCount": 1,
    "judgeCorrectOptionContent": "",
    "judgeWrongOptionContent": "",
    "choiceItems": null,
    "fillInItems": [
      {
        "id": "34a66592-6a74-49fd-8a9f-99177f26f045",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": null,
        "itemAnswer": "异地注册人",
        "orderIndex": 1,
        "itemAnswer1": "",
        "itemAnswer2": "",
        "itemAnswer3": "",
        "itemAnswer4": "",
        "itemAnswer5": "",
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "34219c7c-5460-44a3-956e-a2cd9dec1a32",
        "score": 0,
        "totalScore": 0
      }
    ],
    "subQuesList": null,
    "corrected": 0,
    "fillinCorrectedInfo": [
      0
    ],
    "submitQuesAnswers": [
      "1"
    ],
    "correctAnswers": null,
    "keywords": null,
    "fillinAnswers": [
      {
        "id": "34a66592-6a74-49fd-8a9f-99177f26f045",
        "itemAnswer": "异地注册人",
        "orderIndex": 0,
        "itemAnswer1": "",
        "itemAnswer2": "",
        "itemAnswer3": "",
        "itemAnswer4": "",
        "itemAnswer5": "",
        "corrected": 0
      }
    ],
    "judgeAnswer": 0,
    "explainText": "",
    "answerPlay": null,
    "explainPlay": null
  },
  {
    "id": "e2c1b8fe-58d1-4d83-9659-c7037d3e4aa4",
    "examQuesId": "fa5e35c6-b859-4a82-89de-0b2d3c4cab43",
    "sourceId": "f33e768a-6b92-40d1-801d-c3563a6f37e2",
    "content": "联合创新对于不同医院全面推行“___（1）___”创新转化方案",
    "quesType": 3,
    "questionType": 0,
    "fileId": "",
    "tranStatus": null,
    "playDetails": null,
    "subQues": 0,
    "parentId": null,
    "orderIndex": 100,
    "itemCount": 1,
    "judgeCorrectOptionContent": "",
    "judgeWrongOptionContent": "",
    "choiceItems": null,
    "fillInItems": [
      {
        "id": "d1d88cef-df7b-44fb-ba75-e710c5b8b689",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": null,
        "itemAnswer": "一院一策",
        "orderIndex": 1,
        "itemAnswer1": "",
        "itemAnswer2": "",
        "itemAnswer3": "",
        "itemAnswer4": "",
        "itemAnswer5": "",
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "b5a20412-f3fa-4939-b40d-dc69bcb84b3e",
        "score": 0,
        "totalScore": 0
      }
    ],
    "subQuesList": null,
    "corrected": 0,
    "fillinCorrectedInfo": [
      0
    ],
    "submitQuesAnswers": [
      "1"
    ],
    "correctAnswers": null,
    "keywords": null,
    "fillinAnswers": [
      {
        "id": "d1d88cef-df7b-44fb-ba75-e710c5b8b689",
        "itemAnswer": "一院一策",
        "orderIndex": 0,
        "itemAnswer1": "",
        "itemAnswer2": "",
        "itemAnswer3": "",
        "itemAnswer4": "",
        "itemAnswer5": "",
        "corrected": 0
      }
    ],
    "judgeAnswer": 0,
    "explainText": "",
    "answerPlay": null,
    "explainPlay": null
  },
  {
    "id": "6cc1bc06-b5a2-4d02-bf72-31364cd79284",
    "examQuesId": "35af8cc4-cc4d-4920-8a5c-cecf754d1040",
    "sourceId": "084a980b-bc0d-43fa-b732-98890a124642",
    "content": "全国市场三大梯队，第一梯队高端创新与品牌示范定位是北京和___（1）___。",
    "quesType": 3,
    "questionType": 0,
    "fileId": "",
    "tranStatus": null,
    "playDetails": null,
    "subQues": 0,
    "parentId": null,
    "orderIndex": 101,
    "itemCount": 1,
    "judgeCorrectOptionContent": "",
    "judgeWrongOptionContent": "",
    "choiceItems": null,
    "fillInItems": [
      {
        "id": "872f767c-f7c1-455d-9431-a156c4e59c67",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": null,
        "itemAnswer": "上海",
        "orderIndex": 1,
        "itemAnswer1": "",
        "itemAnswer2": "",
        "itemAnswer3": "",
        "itemAnswer4": "",
        "itemAnswer5": "",
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "b0d8f5b0-96e7-400d-8c59-fd36e4a8fd32",
        "score": 0,
        "totalScore": 0
      }
    ],
    "subQuesList": null,
    "corrected": 0,
    "fillinCorrectedInfo": [
      0
    ],
    "submitQuesAnswers": [
      "1"
    ],
    "correctAnswers": null,
    "keywords": null,
    "fillinAnswers": [
      {
        "id": "872f767c-f7c1-455d-9431-a156c4e59c67",
        "itemAnswer": "上海",
        "orderIndex": 0,
        "itemAnswer1": "",
        "itemAnswer2": "",
        "itemAnswer3": "",
        "itemAnswer4": "",
        "itemAnswer5": "",
        "corrected": 0
      }
    ],
    "judgeAnswer": 0,
    "explainText": "",
    "answerPlay": null,
    "explainPlay": null
  },
  {
    "id": "339a42aa-bb39-40e3-8523-a2241a318f7c",
    "examQuesId": "97e83690-4a91-42d5-85f8-0280b0d057ea",
    "sourceId": "380dee54-6649-4e83-a2cb-e18d87c62091",
    "content": "集团战略与协同委员会每____（1）_____召开一次战略对齐与协同复盘会。",
    "quesType": 3,
    "questionType": 0,
    "fileId": "",
    "tranStatus": null,
    "playDetails": null,
    "subQues": 0,
    "parentId": null,
    "orderIndex": 102,
    "itemCount": 1,
    "judgeCorrectOptionContent": "",
    "judgeWrongOptionContent": "",
    "choiceItems": null,
    "fillInItems": [
      {
        "id": "f275e56e-762b-4322-a9a5-8b09bee49057",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": null,
        "itemAnswer": "季度",
        "orderIndex": 1,
        "itemAnswer1": "",
        "itemAnswer2": "",
        "itemAnswer3": "",
        "itemAnswer4": "",
        "itemAnswer5": "",
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "ac150e32-081a-478e-a372-27613fa4b428",
        "score": 0,
        "totalScore": 0
      }
    ],
    "subQuesList": null,
    "corrected": 0,
    "fillinCorrectedInfo": [
      0
    ],
    "submitQuesAnswers": [
      "1"
    ],
    "correctAnswers": null,
    "keywords": null,
    "fillinAnswers": [
      {
        "id": "f275e56e-762b-4322-a9a5-8b09bee49057",
        "itemAnswer": "季度",
        "orderIndex": 0,
        "itemAnswer1": "",
        "itemAnswer2": "",
        "itemAnswer3": "",
        "itemAnswer4": "",
        "itemAnswer5": "",
        "corrected": 0
      }
    ],
    "judgeAnswer": 0,
    "explainText": "",
    "answerPlay": null,
    "explainPlay": null
  },
  {
    "id": "9bd9613e-927b-424e-8ca8-f367f98dddf4",
    "examQuesId": "a3538182-8d86-4b9c-9111-444ba757d374",
    "sourceId": "457ad2da-dc9d-414e-a3a1-b83af4e80ee7",
    "content": "战略解码与耦合评审作为______（1）____决策的关键依据。",
    "quesType": 3,
    "questionType": 0,
    "fileId": "",
    "tranStatus": null,
    "playDetails": null,
    "subQues": 0,
    "parentId": null,
    "orderIndex": 103,
    "itemCount": 1,
    "judgeCorrectOptionContent": "",
    "judgeWrongOptionContent": "",
    "choiceItems": null,
    "fillInItems": [
      {
        "id": "bda40b44-aa98-4f47-8471-48b841f68269",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": null,
        "itemAnswer": "IPMT",
        "orderIndex": 1,
        "itemAnswer1": "",
        "itemAnswer2": "",
        "itemAnswer3": "",
        "itemAnswer4": "",
        "itemAnswer5": "",
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "11a494a2-e5c4-4de7-8660-5bf2dc501cb9",
        "score": 0,
        "totalScore": 0
      }
    ],
    "subQuesList": null,
    "corrected": 0,
    "fillinCorrectedInfo": [
      0
    ],
    "submitQuesAnswers": [
      "1"
    ],
    "correctAnswers": null,
    "keywords": null,
    "fillinAnswers": [
      {
        "id": "bda40b44-aa98-4f47-8471-48b841f68269",
        "itemAnswer": "IPMT",
        "orderIndex": 0,
        "itemAnswer1": "",
        "itemAnswer2": "",
        "itemAnswer3": "",
        "itemAnswer4": "",
        "itemAnswer5": "",
        "corrected": 0
      }
    ],
    "judgeAnswer": 0,
    "explainText": "",
    "answerPlay": null,
    "explainPlay": null
  },
  {
    "id": "fdc1d7a8-be48-4195-8c31-afca9c8a64ac",
    "examQuesId": "7513c251-8ff3-4214-9896-62abf84dde9f",
    "sourceId": "222974ed-1a91-4ca5-9900-659bcfa07ab5",
    "content": "事业部通过制定“平台路标与产品路标用于牵引”_____（1）_____规划其CBB发展路径。",
    "quesType": 3,
    "questionType": 0,
    "fileId": "",
    "tranStatus": null,
    "playDetails": null,
    "subQues": 0,
    "parentId": null,
    "orderIndex": 104,
    "itemCount": 1,
    "judgeCorrectOptionContent": "",
    "judgeWrongOptionContent": "",
    "choiceItems": null,
    "fillInItems": [
      {
        "id": "e07bae95-1fad-40ab-a4f8-d9333b329b02",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": null,
        "itemAnswer": "蓝光实验室",
        "orderIndex": 1,
        "itemAnswer1": "",
        "itemAnswer2": "",
        "itemAnswer3": "",
        "itemAnswer4": "",
        "itemAnswer5": "",
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "711f5517-43c5-47d0-b560-49469b135bc0",
        "score": 0,
        "totalScore": 0
      }
    ],
    "subQuesList": null,
    "corrected": 0,
    "fillinCorrectedInfo": [
      0
    ],
    "submitQuesAnswers": [
      "1"
    ],
    "correctAnswers": null,
    "keywords": null,
    "fillinAnswers": [
      {
        "id": "e07bae95-1fad-40ab-a4f8-d9333b329b02",
        "itemAnswer": "蓝光实验室",
        "orderIndex": 0,
        "itemAnswer1": "",
        "itemAnswer2": "",
        "itemAnswer3": "",
        "itemAnswer4": "",
        "itemAnswer5": "",
        "corrected": 0
      }
    ],
    "judgeAnswer": 0,
    "explainText": "",
    "answerPlay": null,
    "explainPlay": null
  },
  {
    "id": "b4d5f0af-e870-4bb6-9c23-46ab566e5a0c",
    "examQuesId": "d0fbcca9-cb3b-49ed-acd1-f81e6f47cd3d",
    "sourceId": "14fb0d32-0dbb-44b5-872d-74fe8d85b7ad",
    "content": "_____（1）_____是公司核心业务经营中心和利润中心",
    "quesType": 3,
    "questionType": 0,
    "fileId": "",
    "tranStatus": null,
    "playDetails": null,
    "subQues": 0,
    "parentId": null,
    "orderIndex": 105,
    "itemCount": 1,
    "judgeCorrectOptionContent": "",
    "judgeWrongOptionContent": "",
    "choiceItems": null,
    "fillInItems": [
      {
        "id": "b501dd82-3b16-441d-86e1-f999a418e015",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": null,
        "itemAnswer": "事业部",
        "orderIndex": 1,
        "itemAnswer1": "",
        "itemAnswer2": "",
        "itemAnswer3": "",
        "itemAnswer4": "",
        "itemAnswer5": "",
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "9c3f3147-5da2-43bb-87d9-2ee9168aab33",
        "score": 0,
        "totalScore": 0
      }
    ],
    "subQuesList": null,
    "corrected": 0,
    "fillinCorrectedInfo": [
      0
    ],
    "submitQuesAnswers": [
      "1"
    ],
    "correctAnswers": null,
    "keywords": null,
    "fillinAnswers": [
      {
        "id": "b501dd82-3b16-441d-86e1-f999a418e015",
        "itemAnswer": "事业部",
        "orderIndex": 0,
        "itemAnswer1": "",
        "itemAnswer2": "",
        "itemAnswer3": "",
        "itemAnswer4": "",
        "itemAnswer5": "",
        "corrected": 0
      }
    ],
    "judgeAnswer": 0,
    "explainText": "",
    "answerPlay": null,
    "explainPlay": null
  },
  {
    "id": "c382adf7-a4b2-4e30-8584-45355e5bf0fe",
    "examQuesId": "366d4d8f-970d-42f0-b18c-4323dc082fef",
    "sourceId": "007a2d23-e355-458c-8062-0e4cfdfa04b1",
    "content": "战略MKT是市场战略的“____（1）____”，负责中长期战略规划。",
    "quesType": 3,
    "questionType": 0,
    "fileId": "",
    "tranStatus": null,
    "playDetails": null,
    "subQues": 0,
    "parentId": null,
    "orderIndex": 106,
    "itemCount": 1,
    "judgeCorrectOptionContent": "",
    "judgeWrongOptionContent": "",
    "choiceItems": null,
    "fillInItems": [
      {
        "id": "cfa1452d-30b5-431d-8a70-a731c2d02782",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": null,
        "itemAnswer": "大脑",
        "orderIndex": 1,
        "itemAnswer1": "",
        "itemAnswer2": "",
        "itemAnswer3": "",
        "itemAnswer4": "",
        "itemAnswer5": "",
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "47db4737-35cd-4f79-8f2e-65c859b1834e",
        "score": 0,
        "totalScore": 0
      }
    ],
    "subQuesList": null,
    "corrected": 0,
    "fillinCorrectedInfo": [
      0
    ],
    "submitQuesAnswers": [
      "1"
    ],
    "correctAnswers": null,
    "keywords": null,
    "fillinAnswers": [
      {
        "id": "cfa1452d-30b5-431d-8a70-a731c2d02782",
        "itemAnswer": "大脑",
        "orderIndex": 0,
        "itemAnswer1": "",
        "itemAnswer2": "",
        "itemAnswer3": "",
        "itemAnswer4": "",
        "itemAnswer5": "",
        "corrected": 0
      }
    ],
    "judgeAnswer": 0,
    "explainText": "",
    "answerPlay": null,
    "explainPlay": null
  },
  {
    "id": "efb4b0b1-0288-4de8-bc5a-2b4987ed8f85",
    "examQuesId": "9a8b9dd9-d007-4adb-a1c4-04d9a15e3235",
    "sourceId": "fab34a31-8d77-42aa-a7e5-964fe2c3e237",
    "content": "品牌定位宣传语是：“驼人，创新转化铁三角的全球品牌_____（1）_____。",
    "quesType": 3,
    "questionType": 0,
    "fileId": "",
    "tranStatus": null,
    "playDetails": null,
    "subQues": 0,
    "parentId": null,
    "orderIndex": 107,
    "itemCount": 1,
    "judgeCorrectOptionContent": "",
    "judgeWrongOptionContent": "",
    "choiceItems": null,
    "fillInItems": [
      {
        "id": "4f4ce271-e375-46c6-baba-75a0e661d9bb",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": null,
        "itemAnswer": "策源地",
        "orderIndex": 1,
        "itemAnswer1": "",
        "itemAnswer2": "",
        "itemAnswer3": "",
        "itemAnswer4": "",
        "itemAnswer5": "",
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "7a5f2be5-7959-446f-94ec-53e1117dae90",
        "score": 0,
        "totalScore": 0
      }
    ],
    "subQuesList": null,
    "corrected": 0,
    "fillinCorrectedInfo": [
      0
    ],
    "submitQuesAnswers": [
      "1"
    ],
    "correctAnswers": null,
    "keywords": null,
    "fillinAnswers": [
      {
        "id": "4f4ce271-e375-46c6-baba-75a0e661d9bb",
        "itemAnswer": "策源地",
        "orderIndex": 0,
        "itemAnswer1": "",
        "itemAnswer2": "",
        "itemAnswer3": "",
        "itemAnswer4": "",
        "itemAnswer5": "",
        "corrected": 0
      }
    ],
    "judgeAnswer": 0,
    "explainText": "",
    "answerPlay": null,
    "explainPlay": null
  },
  {
    "id": "fd92df8e-1325-4f3a-8f58-c32acdd79d3e",
    "examQuesId": "b725c016-3ac4-4eff-809a-edc6f1d6e487",
    "sourceId": "1308013e-b822-4189-8655-26e7d86b0dbc",
    "content": "企业创新合作中，与在产品、技术、生产及营销上具有互补性的“专精特新”及__（1）__企业签订战略合作备忘录或战略合作框架协议。",
    "quesType": 3,
    "questionType": 0,
    "fileId": "",
    "tranStatus": null,
    "playDetails": null,
    "subQues": 0,
    "parentId": null,
    "orderIndex": 108,
    "itemCount": 1,
    "judgeCorrectOptionContent": "",
    "judgeWrongOptionContent": "",
    "choiceItems": null,
    "fillInItems": [
      {
        "id": "40aaf2a4-5180-4709-bce3-03bd27e31440",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": null,
        "itemAnswer": "中小型",
        "orderIndex": 1,
        "itemAnswer1": "",
        "itemAnswer2": "",
        "itemAnswer3": "",
        "itemAnswer4": "",
        "itemAnswer5": "",
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "cfe26f65-6463-4918-bac5-0fdba622798f",
        "score": 0,
        "totalScore": 0
      }
    ],
    "subQuesList": null,
    "corrected": 0,
    "fillinCorrectedInfo": [
      0
    ],
    "submitQuesAnswers": [
      "1"
    ],
    "correctAnswers": null,
    "keywords": null,
    "fillinAnswers": [
      {
        "id": "40aaf2a4-5180-4709-bce3-03bd27e31440",
        "itemAnswer": "中小型",
        "orderIndex": 0,
        "itemAnswer1": "",
        "itemAnswer2": "",
        "itemAnswer3": "",
        "itemAnswer4": "",
        "itemAnswer5": "",
        "corrected": 0
      }
    ],
    "judgeAnswer": 0,
    "explainText": "",
    "answerPlay": null,
    "explainPlay": null
  },
  {
    "id": "3621cabd-1f94-4ec6-81f3-8f6b953aa2cf",
    "examQuesId": "9f7ed4b2-ba9f-47a9-b4e0-a788d2dccfbe",
    "sourceId": "fa1cc2f9-79dd-431e-955c-ebf0731d06bc",
    "content": "嵌入专利与临床创新项目的评审机制是“客户价值与_____（1）_____双维评审”",
    "quesType": 3,
    "questionType": 0,
    "fileId": "",
    "tranStatus": null,
    "playDetails": null,
    "subQues": 0,
    "parentId": null,
    "orderIndex": 109,
    "itemCount": 1,
    "judgeCorrectOptionContent": "",
    "judgeWrongOptionContent": "",
    "choiceItems": null,
    "fillInItems": [
      {
        "id": "10c9ed02-f8e8-42a2-8f90-52ffd677077f",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": null,
        "itemAnswer": "商业价值",
        "orderIndex": 1,
        "itemAnswer1": "",
        "itemAnswer2": "",
        "itemAnswer3": "",
        "itemAnswer4": "",
        "itemAnswer5": "",
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "91acd011-b334-4bcf-8452-628573a1c224",
        "score": 0,
        "totalScore": 0
      }
    ],
    "subQuesList": null,
    "corrected": 0,
    "fillinCorrectedInfo": [
      0
    ],
    "submitQuesAnswers": [
      "1"
    ],
    "correctAnswers": null,
    "keywords": null,
    "fillinAnswers": [
      {
        "id": "10c9ed02-f8e8-42a2-8f90-52ffd677077f",
        "itemAnswer": "商业价值",
        "orderIndex": 0,
        "itemAnswer1": "",
        "itemAnswer2": "",
        "itemAnswer3": "",
        "itemAnswer4": "",
        "itemAnswer5": "",
        "corrected": 0
      }
    ],
    "judgeAnswer": 0,
    "explainText": "",
    "answerPlay": null,
    "explainPlay": null
  },
  {
    "id": "0721dbe2-2934-453d-b7c3-f545333a24f1",
    "examQuesId": "7036b633-8c55-4299-9112-4c5c45bfb65f",
    "sourceId": "c3096797-26c1-409c-8dd9-3e0b5049bdc3",
    "content": "依托____（1）_____与异地注册人制度，为医院创新项目提供全链条服务。",
    "quesType": 3,
    "questionType": 0,
    "fileId": "",
    "tranStatus": null,
    "playDetails": null,
    "subQues": 0,
    "parentId": null,
    "orderIndex": 110,
    "itemCount": 1,
    "judgeCorrectOptionContent": "",
    "judgeWrongOptionContent": "",
    "choiceItems": null,
    "fillInItems": [
      {
        "id": "0815cd85-5d05-471c-a3cb-bd4d30fdfc4f",
        "orgId": "21459769-2273-40f4-a5b5-925e3e96e71b",
        "examQuesId": null,
        "itemAnswer": "郑州医创谷",
        "orderIndex": 1,
        "itemAnswer1": "",
        "itemAnswer2": "",
        "itemAnswer3": "",
        "itemAnswer4": "",
        "itemAnswer5": "",
        "examId": "123e8923-6b52-4c3a-bb22-e61bdbc008bf",
        "sourceItemId": "33ab29a5-bedd-4362-847f-e5904a77b6cc",
        "score": 0,
        "totalScore": 0
      }
    ],
    "subQuesList": null,
    "corrected": -1,
    "fillinCorrectedInfo": null,
    "submitQuesAnswers": null,
    "correctAnswers": null,
    "keywords": null,
    "fillinAnswers": null,
    "judgeAnswer": 0,
    "explainText": null,
    "answerPlay": null,
    "explainPlay": null
  }
];


// 左上角悬浮查答案面板（手动点击+1秒自动更新，带开关）
(function() {
    // 全局定时器变量，控制自动更新（初始关闭）
    let autoAnswerTimer = null;
    // 面板DOM节点缓存
    let panel = null;
    let btnManual = null;
    let btnAuto = null;
    let answerBox = null;

    // 第一步：判断是否已创建面板，避免重复生成
    const existingPanel = document.getElementById('quesAnswerPanel');
    if (existingPanel) {
        panel = existingPanel;
        btnManual = document.getElementById('getAnswerBtn');
        btnAuto = document.getElementById('toggleAutoBtn');
        answerBox = document.getElementById('answerDisplay');
        console.log('✅ 答案面板已存在，直接显示');
        panel.style.display = 'block';
        return;
    }

    // 第二步：创建悬浮面板DOM结构（左上角固定，双按钮布局）
    panel = document.createElement('div');
    panel.id = 'quesAnswerPanel';
    panel.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        z-index: 99999; /* 最高层级，不被遮挡 */
        background: #fff;
        padding: 15px;
        border: 2px solid #1890ff;
        border-radius: 0 0 8px 0;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        min-width: 320px;
        font-family: sans-serif;
        opacity: 0.8;
    `;

    // 按钮容器（适配双按钮布局）
    const btnContainer = document.createElement('div');
    btnContainer.style.cssText = `
        display: flex;
        gap: 8px;
        margin-bottom: 10px;
        width: 100%;
    `;

    // 1. 手动获取答案按钮
    btnManual = document.createElement('button');
    btnManual.id = 'getAnswerBtn';
    btnManual.innerText = '手动获取答案';
    btnManual.style.cssText = `
        flex: 1;
        padding: 8px 0;
        background: #1890ff;
        color: #fff;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        font-weight: bold;
    `;
    btnManual.onmouseover = () => btnManual.style.background = '#40a9ff';
    btnManual.onmouseout = () => btnManual.style.background = '#1890ff';

    // 2. 自动更新开关按钮（初始关闭状态）
    btnAuto = document.createElement('button');
    btnAuto.id = 'toggleAutoBtn';
    btnAuto.innerText = '开启自动更新';
    btnAuto.style.cssText = `
        flex: 1;
        padding: 8px 0;
        background: #faad14;
        color: #fff;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        font-weight: bold;
    `;
    btnAuto.onmouseover = () => btnAuto.style.background = '#ffc53d';
    btnAuto.onmouseout = () => {
        btnAuto.style.background = autoAnswerTimer ? '#52c41a' : '#faad14';
    };

    // 答案展示区域
    answerBox = document.createElement('div');
    answerBox.id = 'answerDisplay';
    answerBox.style.cssText = `
        padding: 10px;
        border: 1px solid #e8e8e8;
        border-radius: 4px;
        min-height: 80px;
        font-size: 13px;
        line-height: 1.8;
        color: #333;
        white-space: pre-wrap;
    `;
    answerBox.innerText = '👉 可选：手动点击按钮获取答案\n👉 可选：点击开启自动更新（1秒/次）\n💡 仅匹配listQuestion中的题目内容';

    // 组装面板
    btnContainer.appendChild(btnManual);
    btnContainer.appendChild(btnAuto);
    panel.appendChild(btnContainer);
    panel.appendChild(answerBox);
    document.body.appendChild(panel);

    // 第三步：核心逻辑 - 匹配题目并显示答案（手动/自动共用）
    function getCurrentAnswer() {
        // 1. 获取页面题目文本并预处理
        const mainEl = document.querySelectorAll('.main')[0];
        if (!mainEl) {
            answerBox.innerHTML = `<span style="color: #ff4d4f;">❌ 未找到题目容器(.main)</span>`;
            return;
        }
        const pageText = mainEl.innerText.replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim();
        if (!pageText) {
            answerBox.innerHTML = `<span style="color: #ff4d4f;">❌ 题目容器无内容</span>`;
            return;
        }

        // 2. 匹配listQuestion（页面文本包含题目内容即匹配，核心逻辑）
        let currentQues = null;
        for (const ques of listQuestion) {
            const quesContent = ques.content.replace(/\s+/g, ' ').trim();
            if (pageText.includes(quesContent)) {
                currentQues = ques;
                break;
            }
        }

        // 3. 匹配失败处理
        if (!currentQues) {
            answerBox.innerHTML = `<span style="color: #ff4d4f;">❌ 未匹配到对应题目！</span><br>💡 确认listQuestion包含当前题`;
            return;
        }

        // 4. 题型映射+提取正确答案（适配所有题型）
        const quesTypeMap = {0: '单选题', 1: '多选题', 2: '判断题', 3: '填空题'};
        const showType = quesTypeMap[currentQues.quesType] || '未知题型';
        let correctAnswer = '';

        switch (currentQues.quesType) {
            case 0: // 单选题：提取唯一正确选项
                correctAnswer = currentQues.choiceItems?.find(item => item.answer === 1)?.itemContent || '未找到答案';
                break;
            case 1: // 多选题：顿号拼接所有正确选项
                const multiItems = currentQues.choiceItems?.filter(item => item.answer === 1)?.map(item => item.itemContent);
                correctAnswer = multiItems?.length ? multiItems.join('、') : '未找到答案';
                break;
            case 2: // 判断题：转换为正确/错误
                correctAnswer = currentQues.judgeAnswer === 1 ? '正确' : '错误';
                break;
            case 3: // 填空题：兼容多字段命名
                correctAnswer = currentQues.fillinAnswers?.[0]?.itemAnswer 
                    || currentQues.fillInItems?.[0]?.itemAnswer 
                    || currentQues.itemAnswer 
                    || '未找到答案';
                break;
            default:
                correctAnswer = '未知题型，无法提取答案';
        }

        // 5. 格式化显示答案（彩色高亮，排版清晰）
        answerBox.innerHTML = `
            <div><span style="color: #52c41a; font-weight: bold;">✅ 匹配成功 | ${showType}</span></div>
            <div><span style="font-weight: bold;">📝 题目：</span>${currentQues.content}</div>
            <div style="margin-top: 6px;"><span style="font-weight: bold; color: #1890ff; font-size: 14px;">🎯 正确答案：</span>${correctAnswer}</div>
        `;
    }

    // 第四步：自动更新开关逻辑（1秒/次，防重复开启）
    function toggleAutoAnswer() {
        if (!autoAnswerTimer) {
            // 开启自动更新：1000ms执行一次，立即执行一次避免等待
            getCurrentAnswer();
            autoAnswerTimer = setInterval(getCurrentAnswer, 1000);
            btnAuto.innerText = '关闭自动更新';
            btnAuto.style.background = '#52c41a'; // 绿色标识开启状态
            answerBox.innerHTML = `<span style="color: #52c41a; font-weight: bold;">⚡ 已开启自动更新（1秒/次），切换题目自动刷新答案！</span>`;
            console.log('✅ 自动更新已开启，每隔1秒获取一次答案');
        } else {
            // 关闭自动更新：清除定时器，重置状态
            clearInterval(autoAnswerTimer);
            autoAnswerTimer = null;
            btnAuto.innerText = '开启自动更新';
            btnAuto.style.background = '#faad14'; // 黄色标识关闭状态
            answerBox.innerHTML = `<span style="color: #faad14; font-weight: bold;">⏸ 已关闭自动更新，可手动点击按钮获取答案</span>`;
            console.log('✅ 自动更新已关闭');
        }
    }

    // 第五步：绑定按钮点击事件
    btnManual.onclick = getCurrentAnswer; // 手动获取
    btnAuto.onclick = toggleAutoAnswer;   // 切换自动更新

    console.log('✅ 答案面板创建成功，左上角悬浮显示（支持手动/自动获取答案）！');
})();