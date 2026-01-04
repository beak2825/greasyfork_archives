// ==UserScript==
// @name         Big Banana🍌 Quick Prompts
// @namespace    https://glidea.zenfeed.xyz/
// @version      1.0
// @description  为 Google AI Studio 添加快捷 Prompt 功能
// @author       Glidea
// @match        https://aistudio.google.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/548440/Big%20Banana%F0%9F%8D%8C%20Quick%20Prompts.user.js
// @updateURL https://update.greasyfork.org/scripts/548440/Big%20Banana%F0%9F%8D%8C%20Quick%20Prompts.meta.js
// ==/UserScript==

; (function () {
    let modal = null;
    'use strict'

    function findPromptInput() {
        return document.querySelector('ms-prompt-input-wrapper textarea')
    }

    function findRunButton() {
        return document.querySelector('ms-run-button button')
    }

    function waitForElements() {
        const checkInterval = setInterval(() => {
            const input = findPromptInput()
            const runBtn = findRunButton()

            if (input && runBtn) {
                clearInterval(checkInterval)
                initBananaButton(runBtn)
                startObserver()
            }
        }, 1000)
    }

    function startObserver() {
        const observer = new MutationObserver(() => {
            const existingBtn = document.getElementById('banana-btn')
            const runBtn = findRunButton()

            if (!existingBtn && runBtn) {
                console.log('检测到香蕉按钮消失，重新添加')
                initBananaButton(runBtn)
            }
        })

        observer.observe(document.body, {
            childList: true,
            subtree: true
        })
    }

    function initBananaButton(runButton) {
        console.log('开始创建香蕉按钮', runButton)
        const bananaBtn = createBananaButton()
        const buttonWrapper = runButton.parentElement
        console.log('按钮的父元素:', buttonWrapper)
        console.log('按钮的祖父元素:', buttonWrapper.parentElement)

        try {
            buttonWrapper.parentElement.insertBefore(bananaBtn, buttonWrapper)
            console.log('香蕉按钮插入成功')
        } catch (error) {
            console.error('插入香蕉按钮失败:', error)
            // 尝试其他插入方式
            buttonWrapper.insertAdjacentElement('beforebegin', bananaBtn)
            console.log('使用 insertAdjacentElement 重试')
        }
    }

    function getCurrentTheme() {
        return document.body.classList.contains('dark-theme') ? 'dark' : 'light'
    }

    function getThemeColors(theme) {
        if (theme === 'dark') {
            return {
                background: '#202124',
                surface: '#303134',
                border: '#5f6368',
                text: '#e8eaed',
                textSecondary: '#9aa0a6',
                primary: '#9aa0a6',
                hover: '#414345',
                inputBg: '#303134',
                inputBorder: '#5f6368',
                shadow: 'rgba(0,0,0,0.3)'
            }
        } else {
            return {
                background: 'white',
                surface: 'white',
                border: '#e8eaed',
                text: '#202124',
                textSecondary: '#5f6368',
                primary: '#5f6368',
                hover: '#f8f9fa',
                inputBg: 'white',
                inputBorder: '#dadce0',
                shadow: 'rgba(0,0,0,0.12)'
            }
        }
    }

    function createBananaButton() {
        console.log('创建香蕉按钮')
        const wrapper = document.createElement('div')
        wrapper.className = 'button-wrapper'

        const btn = document.createElement('button')
        btn.id = 'banana-btn'
        btn.className = 'mat-mdc-tooltip-trigger ms-button-borderless ms-button-icon'

        const updateButtonTheme = () => {
            const colors = getThemeColors(getCurrentTheme())
            btn.style.cssText = `width: 40px; height: 40px; border-radius: 50%; border: none; background: ${colors.hover}; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 18px; margin-right: 8px; transition: background-color 0.2s;`
        }

        updateButtonTheme()
        btn.title = '快捷提示'
        btn.textContent = '🍌'

        btn.addEventListener('mouseenter', () => {
            const colors = getThemeColors(getCurrentTheme())
            btn.style.background = colors.border
        })
        btn.addEventListener('mouseleave', () => {
            const colors = getThemeColors(getCurrentTheme())
            btn.style.background = colors.hover
        })

        btn.addEventListener('click', () => {
            console.log('香蕉按钮被点击')
            showModal()
        })

        wrapper.appendChild(btn)
        console.log('香蕉按钮创建完成:', wrapper)
        return wrapper
    }

    const quickPrompts = [
        {
            title: '分离3D模型',
            previewImage:
                'https://github.com/PicoTrex/Awesome-Nano-Banana-images/blob/main/images/case4/output.jpg?raw=true',
            prompt: '将图像制作成白天和等距视图仅限[建筑]',
            author: '@Zieeett',
            mode: 'edit'
        },
        {
            title: '一键智能修图',
            previewImage:
                'https://github.com/PicoTrex/Awesome-Nano-Banana-images/blob/main/images/case7/output.jpg?raw=true',
            prompt: '这张照片很无聊很平淡。增强它！增加对比度，提升色彩，改善光线使其更丰富，你可以裁剪和删除影响构图的细节',
            author: '@op7418',
            mode: 'edit'
        },
        {
            title: '切换俯视角度',
            previewImage:
                'https://github.com/PicoTrex/Awesome-Nano-Banana-images/blob/main/images/case9/output.jpg?raw=true',
            prompt: '将照片转换为俯视角度并标记摄影师的位置',
            author: '@op7418',
            mode: 'edit'
        },
        {
            title: '二次元表情',
            previewImage: 'https://i.mji.rip/2025/09/04/efc060e59e2d9c2e4a137db8564fc492.png',
            prompt: 'Character emotions sheet, multiple expressions of the provided character, featuring happy, sad, angry, surprised, shy, confused, playful, disgusted, thoughtful, crying, and embarrassed. Full set of emotions, clear and distinct expressions, clean background',
            author: '@Gorden_Sun',
            mode: 'edit'
        },
        {
            title: ' 批量换发型',
            previewImage:
                'https://github.com/PicoTrex/Awesome-Nano-Banana-images/blob/main/images/case15/output.jpg?raw=true',
            prompt: '以九宫格的方式生成这个人不同发型的头像',
            author: '@balconychy',
            mode: 'edit'
        },
        {
            title: '换装',
            previewImage: 'https://i.mji.rip/2025/09/04/b9c7402974fba6627ab1b0bf3fce065d.png',
            prompt: `将输入图像中人物的服装替换为参考图像中显示的目标服装。保持人物的姿势、面部表情、背景和整体真实感不变。让新服装看起来自然、合身，并与光线和阴影保持一致。不要改变人物的身份或环境——只改变衣服`,
            author: '@skirano',
            mode: 'edit'
        },
        {
            title: '换发型',
            previewImage: 'https://i.mji.rip/2025/09/04/c4dffca8a2916cd1fbefa21237751b81.png',
            prompt: `请仔细分析我提供的照片。你的任务是为照片中的主要人物更换一个新的发型，同时必须严格遵守以下规则：
1.  **身份保持**：必须完整保留人物的面部特征、五官、皮肤纹理和表情，确保看起来是同一个人。
2.  **背景不变**：人物所处的背景、环境和光线条件必须保持原样，不做任何改动。
3.  **身体姿态不变**：人物的头部姿态、身体姿势和穿着的衣物必须保持不变。
4.  **无缝融合**：新的发型需要根据人物的头型、脸型和现场光照进行智能调整，确保发丝的质感、光泽和阴影都与原始照片完美融合，达到高度逼真、无缝衔接的效果。

---
**女士发型参考：**
*   飘逸的长直发 (Flowing long straight hair)
*   浪漫的大波浪卷发 (Romantic wavy curls)
*   俏皮的短波波头 (Playful short bob)
*   优雅的法式刘海和及肩发 (Elegant French bangs with shoulder-length hair)
*   精致的复古盘发 (Exquisite vintage updo)
*   帅气利落的超短发/精灵短发 (Chic and neat pixie cut)
*   蓬松的羊毛卷 (Fluffy afro curls)
*   高马尾 (High ponytail)
*   脏辫 (Dreadlocks)
*   银灰色渐变长发 (Silver-grey ombre long hair)

**男士发型参考：**
*   经典的商务背头 (Classic business slick-back)
*   时尚的纹理短发/飞机头 (Modern textured short hair / Quiff)
*   清爽的圆寸 (Clean buzz cut)
*   复古中分发型 (Retro middle part hairstyle)
*   蓬松的韩式卷发 (Fluffy Korean-style curly hair)
*   随性的及肩长发 (Casual shoulder-length long hair)
*    undercut发型（两侧剃短，顶部留长）(Undercut)
*   莫霍克发型 (Mohawk)
*   武士发髻/丸子头 (Man bun)
---

请将人物的发型更换为： 俏皮的短波波头`,
            author: 'Official',
            mode: 'edit'
        },
        {
            title: '时光滤镜',
            previewImage: 'https://i.mji.rip/2025/09/04/281360a8257436f6ad0b5e56b0982deb.png',
            prompt: `请重新构想照片中的人物，使其完全符合某个特定年代的风格。这包括人物的服装、发型、照片的整体画质和滤镜和构图，以及该年代所特有的整体美学风格。最终输出必须是高度逼真的图像，并清晰地展现人物。

目标年代为： 1900`,
            author: 'Official',
            mode: 'edit'
        },
        {
            title: '黑白装逼肖像',
            previewImage: 'https://i.mji.rip/2025/09/04/f03851e1fbea897dee75a109d497e2c7.png',
            prompt: `高分辨率的黑白肖像摄影作品，采用编辑类与艺术摄影风格。保持人物面部特征一致，仅改变姿态与构图。背景为柔和渐变，从中灰过渡到近乎纯白，配合细腻的胶片颗粒质感，营造经典黑白影像的氛围。
主体穿着 黑色 T 恤，以不同随机姿态出现：抬手触脸、手指交叠于胸前、用手部分遮挡面容、轻触下颌等，强调自然、优雅的手部动作。面部依旧保留原有神态，只在角度和光线中体现变化，局部捕捉眼神、颧骨或唇角的细节。
光线为温柔的定向光，柔和地勾勒出脸部、手部与 T 恤的纹理；画面简洁，留有大面积负空间。没有文字或标志，只有光影、姿态与情绪交织。
整体氛围亲密、永恒，像呼吸或思索间的停顿，被捕捉为诗意的瞬间。`,
            author: 'LinuxDO@Bensong',
            mode: 'edit'
        },
        {
            title: '3D模型手办 (复杂背景)',
            previewImage: 'https://i.mji.rip/2025/09/04/a5fb782fded5b3778e2b39a455aa1fad.png',
            prompt: `将用户提供的2D图片生成一张高品质、照片级的3D模型手办图片。手办应制作精良，细致入微地捕捉2D角色插画中的精髓和设计。

**手办细节：**

-   **姿势：** 手办的姿势应动态化，反映2D图片中原始角色的动作或标志性姿态。
-   **服饰与配件：** 忠实地以三维形式再现2D角色的所有服饰、盔甲、配饰（如武器、首饰、头饰）以及复杂的图案，并赋予其逼真的纹理（如布料的褶皱、金属的光泽、皮革的纹理）。
-   **头发：** 头发应塑造成具有流动感和真实感的造型，与角色的发型和长度相匹配。
-   **面部特征：** 手办的面部应准确呈现角色的表情和五官。
-   **材质外观：** 手办应呈现出制作精良的塑料或树脂模型的质感，带有微妙的反光和适当的材质光泽。

**场景与展示：**

-   **环境：** 手办摆放在一个整洁有序的桌面上，使用圆形透明丙烯酸基座，类似一个模型爱好者的工作室。
-   **背景屏幕：** 在手办后方的背景中，有一个电脑显示器，上面显示着该角色的3D模型Blender建模过程，展示其数字模型。屏幕应散发出柔和的光芒，照亮桌面的一部分。
-   **包装盒：** 在手办旁边，稍微面向观察者倾斜放置着手办的零售包装盒。包装盒的艺术设计应以与手办姿态相似的同一角色为特色，并带有风格化的品牌名称（例如：“Good Smile Company”或类似的虚构品牌），可能还有角色名称。包装盒应看起来专业设计。
-   **桌面物品：** 桌面上手办和包装盒周围，散落着各种模型工具和用品，可以包括：
    -   小罐颜料或油漆瓶
    -   精细的画笔
    -   模型工具（如镊子、小型切割刀、雕刻工具）
    -   带有网格线的切割垫
    -   参考书或画册
    -   其他一些暗示创意工作区的小型艺术相关杂物。
-   **灯光：** 场景应采用柔和的自然光或类似工作室的灯光照明，突出手办的细节，并产生柔和的阴影，营造出深度和真实感。

**整体美感：** 图像应传达出一种已完成的、专业制作的收藏级手办的感觉，并将其置于其创作和开发背景中进行展示。焦点是手办本身，但周围的元素增强了其创作和展示的故事性。
`,
            author: 'LinuxDO@DT2025',
            mode: 'edit'
        },
        {
            title: '复古宣传海报',
            previewImage:
                'https://camo.githubusercontent.com/d8ee52518aa3db45867fbaac63b4b57f6ad2e24e96a7519bab0c306747c0da21/68747470733a2f2f626962696770742d617070732e636861747669642e61692f63686174696d672f67656d696e692d74685a656a4d675830504752316e50796a315a33742e706e673f763d31',
            prompt: "复古宣传海报风格，突出中文文字，背景为红黄放射状图案。画面中心位置有一位美丽的年轻女性，以精致复古风格绘制，面带微笑，气质优雅，具有亲和力。主题是GPT最新AI绘画服务的广告促销，强调'惊爆价9.9/张'、'适用各种场景、图像融合、局部重绘'、'每张提交3次修改'、'AI直出效果，无需修改'，底部醒目标注'有意向点右下\"我想要\"'，右下角绘制一个手指点击按钮动作，左下角展示OpenAI标志。",
            author: '@dotey',
            mode: 'generate'
        },
        {
            title: '定制动漫手办',
            previewImage:
                'https://camo.githubusercontent.com/db8e5dc52a7c7d814c573877ee03225c4d4e761d0d987fbec05f1c8f3be8ebe2/68747470733a2f2f626962696770742d617070732e636861747669642e61692f63686174696d672f67656d696e692d71564b36666d2d66503861342d4c7870614e374a692e706e673f763d31',
            prompt: '生成一张摆放于桌面上的动漫风格手办照片，以日常随手用手机拍摄的轻松休闲视角呈现。手办模型以附件中人物照片为基础，精确还原照片中人物的全身姿势、面部表情以及服装造型，确保手办全身完整呈现。整体设计精致细腻，头发与服饰采用自然柔和的渐变色彩与细腻质感，风格偏向日系动漫风，细节丰富，质感真实，观感精美。',
            author: '@dotey',
            mode: 'edit'
        },
        {
            title: '定制Q版钥匙串',
            previewImage:
                'https://camo.githubusercontent.com/0749f414a01d6b6e053e86e0edd1877d1c7a5666683b04071da0115cf7830653/68747470733a2f2f626962696770742d617070732e636861747669642e61692f63686174696d672f67656d696e692d424f4877686d6b2d482d4c785133393865706b50702e706e673f763d31',
            prompt: '一张特写照片，展示一个被人手握住的可爱多彩钥匙串。钥匙串的造型为 [参考图片] 的 Q 版风格。钥匙串由柔软橡胶材质制成，带有粗黑描边，连接在一个小巧的银色钥匙圈上，背景为中性色调。',
            author: '@azed_ai',
            mode: 'edit'
        },
        {
            title: '金色吊坠项链',
            previewImage:
                'https://camo.githubusercontent.com/ef76535afd5a80239f3a4da844f5ffd07882b93ad2b27e8d12850061cb330a22/68747470733a2f2f626962696770742d617070732e636861747669642e61692f63686174696d672f67656d696e692d6a79516c7674765963795957753631585f63576b362e706e673f763d31',
            prompt: '一张照片级写实的特写图像，展示一条由女性手握持的金质吊坠项链。吊坠上刻有 [图像 / 表情符号] 的浮雕图案，悬挂在一条抛光金链上。背景为柔和虚化的中性米色调，采用自然光照，肤色真实，风格为产品摄影，画面比例为 16:9。',
            author: '@azed_ai',
            mode: 'edit'
        },
        {
            title: '原创宝可梦生成',
            previewImage:
                'https://camo.githubusercontent.com/c4a11a7e1012e9f7b1c0a9da081507a923ebc5d9f2a1f02e1b552a6f398d3060/68747470733a2f2f626962696770742d617070732e636861747669642e61692f63686174696d672f67656d696e692d306679596f3764325663337566486e5855306678682e706e673f763d31',
            prompt: '根据此物体（提供的照片）创作一个原创生物。该生物应看起来像是属于一个奇幻怪物捕捉宇宙，具有受复古日式RPG怪物艺术影响的可爱或酷炫设计。图像必须包含：\\n  – 生物的全身视图，灵感来自物体的形状、材料或用途。\\n  – 在其脚边有一个小球体或胶囊（类似于精灵球），其设计图案和颜色与物体的外观相匹配——不是标准的精灵球，而是自定义设计。\\n  – 为生物发明的名字，显示在其旁边或下方。 – 其元素类型（例如火、水、金属、自然、电……），基于物体的核心属性。插图应看起来像是来自奇幻生物百科全书，线条清晰，阴影柔和，设计富有表现力且以角色为驱动。',
            author: '@Anima_Labs',
            mode: 'edit'
        },
        {
            title: '3D Q版大学拟人化形象',
            previewImage:
                'https://camo.githubusercontent.com/a4ec79c77aa9d82a3ac05572963439535987464070ab3a0f18f05b6cf28a1484/68747470733a2f2f626962696770742d617070732e636861747669642e61692f63686174696d672f67656d696e692d4a6e687479666157524c4a34387079314673324c382e706e673f763d31',
            prompt: '给 {西北工业大学} 画一个拟人化的3D Q版美少女形象，体现学校 {航空航天航海三航} 特色',
            author: '@dotey',
            mode: 'generate'
        },
        {
            title: 'Logo 形状创意书架',
            previewImage:
                'https://camo.githubusercontent.com/8c9656afeca8088a32f1e33e896fcac050ca4a69dd854ced4df32b903727df74/68747470733a2f2f626962696770742d617070732e636861747669642e61692f63686174696d672f67656d696e692d6833675f616a7455356873373059793074736b694e2e706e673f763d31',
            prompt: '拍摄一张现代书架的照片，其造型灵感来源于 [LOGO] 的形状。书架由流畅、互相连接的曲线构成，形成多个大小不一的分区。整体材质为光滑的哑光黑色金属，曲线内部设有木质层板。柔和暖色的 LED 灯带勾勒出内侧曲线轮廓。书架安装在一个中性色调的墙面上，上面摆放着色彩丰富的书籍、小型绿植和极简风格的艺术摆件。整体氛围富有创意、优雅且略带未来感。',
            author: '@umesh_ai',
            mode: 'generate'
        },
        {
            title: '剪影艺术',
            previewImage:
                'https://camo.githubusercontent.com/cb6e5f986b2031c8eb3953f29fa01733c18907ef1a2828e72674d9c28bbe5b2f/68747470733a2f2f626962696770742d617070732e636861747669642e61692f63686174696d672f67656d696e692d72657472792d576e46454552544a4a626e4470636a4b64623335552e706e673f763d31',
            prompt: '一个 [东方巨龙] 的基础轮廓剪影。背景为亮黄色，剪影为纯黑色实心填充。',
            author: '@umesh_ai',
            mode: 'generate'
        },
        {
            title: '磨砂玻璃后的虚实对比剪影',
            previewImage:
                'https://camo.githubusercontent.com/39b333bbe057c8bfbbec026f843b2cfb9d7a399ae63eef6121839731786ecb0c/68747470733a2f2f626962696770742d617070732e636861747669642e61692f63686174696d672f67656d696e692d7044736142346f5f6f694e496a75645f6a357970702e706e673f763d31',
            prompt: '一张黑白照片，展示了一个[主体]在磨砂或半透明表面后的模糊剪影。其[部分]轮廓清晰，紧贴表面，与其余朦胧、模糊的身影形成鲜明对比。背景是柔和的灰色渐变色调，增强了神秘和艺术的氛围。',
            author: '@umesh_ai',
            mode: 'generate'
        },
        {
            title: '自拍生成摇头娃娃',
            previewImage:
                'https://camo.githubusercontent.com/65210cc20d1ddd967e05e0cc20805dccceda04f3d30991e2e1925a8f86b54b1c/68747470733a2f2f626962696770742d617070732e636861747669642e61692f63686174696d672f67656d696e692d654a7a7761703765374b7353774a6f665933696a382e706e673f763d31',
            prompt: '将这张照片变成一个摇头娃娃：头部稍微放大，保持面部准确，身体卡通化。[把它放在书架上]。',
            author: '@thisdudelikesAI',
            mode: 'edit'
        },
        {
            title: '三只动物与地标自拍',
            previewImage:
                'https://camo.githubusercontent.com/fb16e65d547095227d221354766db4c0ee775c9d5247e6337fe1397f0ee42d3b/68747470733a2f2f626962696770742d617070732e636861747669642e61692f63686174696d672f67656d696e692d794164365071514d7438365658364e68315146436c2e706e673f763d31',
            prompt: '三只[动物类型]在标志性[地标]前的特写自拍照，它们表情各异，拍摄于黄金时刻，采用电影般的灯光。动物们靠近镜头，头挨着头，模仿自拍姿势，展现出喜悦、惊讶和平静的表情。背景展示了[地标]完整的建筑细节，光线柔和，氛围温暖。采用摄影感、写实卡通风格拍摄，高细节，1:1 宽高比。',
            author: '@berryxia_ai',
            mode: 'generate'
        },
        {
            title: '透视3D出屏效果',
            previewImage:
                'https://camo.githubusercontent.com/ff60c97d59ac8dcf08130db0dc8dc94f22222cee56f80800d4950e53170facd6/68747470733a2f2f626962696770742d617070732e636861747669642e61692f63686174696d672f67656d696e692d72657472792d5a775834584a427a3542714d63764f585963656e302e706e673f763d31',
            prompt: '超写实，从上往下俯视角拍摄，一个美丽的ins模特【安妮海瑟薇 / 见参考图片】，有着精致美丽的妆容和时尚的造型，站在一部被人托起的智能手机屏幕上，画面营造出强烈的透视错觉。强调女孩从手机中站出来的三维效果。她戴着黑框眼镜，穿着高街风，俏皮地摆着可爱的pose。手机屏幕被处理成深色地板，像是一个小舞台。场景使用强烈的强制透视（forced perspective）表现手掌、手机与女孩之间的比例差异。背景为干净的灰色，使用柔和室内光，浅景深，整体风格为超现实写实合成。透视特别强',
            author: '@ZHO_ZHO_ZHO',
            mode: 'edit'
        },
        {
            title: '谷歌地图变身古代藏宝图',
            previewImage:
                'https://camo.githubusercontent.com/2b53ef31557db7f68efd49a9b95e6cf04e40863e7bfc5878ab654ec7056283fa/68747470733a2f2f626962696770742d617070732e636861747669642e61692f63686174696d672f67656d696e692d72657472792d6a5058363570464c424d54767a56614367536a6c7a2e706e673f763d31',
            prompt: '将图像转换为绘制在古老羊皮纸上的古代藏宝图。地图包含详细的元素，如海洋上的帆船、海岸线上的古老港口或城堡、通向标记宝藏地点的大"X"的虚线路径、山脉、棕榈树和装饰性的罗盘玫瑰。整体风格让人联想到旧时的海盗冒险电影。',
            author: '@umesh_ai',
            mode: 'edit'
        },
        {
            title: '品牌化键盘键帽',
            previewImage:
                'https://camo.githubusercontent.com/08cd326bf7298cec0e74668e927df19988dd715cbe5968a82583554bf8a8fd1b/68747470733a2f2f626962696770742d617070732e636861747669642e61692f63686174696d672f67656d696e692d712d35377a6149545362376435593231596136526b2e706e673f763d31',
            prompt: '一个超逼真的3D渲染图，展示了四个机械键盘键帽，排列成紧密的2x2网格，所有键帽相互接触。从等轴测角度观察。一个键帽是透明的，上面用红色印刷着"{just}"字样。另外三个键帽采用颜色：{黑色、紫色和白色}。一个键帽上带有Github的Logo。另外两个键帽上分别写着"{fork}"和"{it}"。逼真的塑料纹理，圆润的雕刻键帽，柔和的阴影，干净的浅灰色背景。',
            author: '@egeberkina',
            mode: 'generate'
        },
        {
            title: '微型立体场景移轴摄影',
            previewImage:
                'https://camo.githubusercontent.com/e10a8da63bb593ebe441a539072aee82de9a2a03dea0420002133fe0a23980eb/68747470733a2f2f626962696770742d617070732e636861747669642e61692f63686174696d672f67656d696e692d72657472792d64346d7443793244755a6b32626b5869444d6f4f532e706e673f763d31',
            prompt: '从上方俯瞰的超高细节迷你【Cyberpunk】景观，采用倾斜移轴鏡頭效果。场景中充满如玩具般的元素，全部以高解析度 CG 呈现。光线戏剧化，营造出大片的氛围，色彩鲜明，对比强烈，强调景深效果与拟真微观视角，使观者仿佛俯瞰一个玩具世界般的迷你现实，画面中包含大量视觉笑点与极具重复观看价值的细节设计',
            author: '@terry623',
            mode: 'generate'
        },
        {
            title: '镀铬emoji徽章',
            previewImage:
                'https://camo.githubusercontent.com/4a973f06b0fc116ae1f42b5a5ec370f08ae0606212cd5f5e1b6e2fd5e1724b06/68747470733a2f2f626962696770742d617070732e636861747669642e61692f63686174696d672f67656d696e692d72657472792d2d51577a495941744f374b433348746868736a48302e706e673f763d31',
            prompt: '高精度的 3D 渲染图，按照 emoji 图标 {👍} 展示一个金属质感的徽章，固定在竖直的商品卡片上，具有超光滑的镀铬质感和圆润的 3D 图标造型，风格化的未来主义设计，带有柔和的反光与干净的阴影。纸质卡片顶部中央带有一个冲切的欧式挂孔，徽章上方是醒目的标题 "{Awesome}"，下方配有趣味标语 "{Smash that ⭐ if you like it!}"。背景为柔和的灰色，使用柔光摄影棚灯光，整体风格极简。',
            author: '@egeberkina',
            mode: 'generate'
        },
        {
            title: '儿童涂色页插画',
            previewImage:
                'https://camo.githubusercontent.com/77d141c0b20a88c50ae0f517d829f92e0743f32220e023b795eba354669d6167/68747470733a2f2f626962696770742d617070732e636861747669642e61692f63686174696d672f67656d696e692d76566f56516b367256514246326247554d47664f722e706e673f763d31',
            prompt: `一张黑白线描涂色插画，适合直接打印在标准尺寸（8.5x11英寸）的纸张上，无纸张边框。整体插画风格清新简洁，使用清晰流畅的黑色轮廓线条，无阴影、无灰阶、无颜色填充，背景纯白，便于涂色。
【同时为了方便不会涂色的用户，请在右下角用小图生成一个完整的彩色版本供参考】
适合人群：【6-9岁小朋友】
画面描述：
【一只独角兽在森林的草地上漫步，阳光明媚，蓝天白云】`,
            author: '@dotey',
            mode: 'generate'
        },
        {
            title: '字母与单词含义融合',
            previewImage:
                'https://camo.githubusercontent.com/ab4ecc5f919ae1f59f23dd6dbc42cb6e75aaecc7369943cc4346a2958d2efbc7/68747470733a2f2f626962696770742d617070732e636861747669642e61692f63686174696d672f67656d696e692d646b335630734c4c54443966515730444d3970786e2e706e673f763d31',
            prompt: `在字母中融入单词的含义，将图形和字母巧妙融合在一起。
单词：{ beautify }
下面加上单词的简要说明`,
            author: '@dotey',
            mode: 'generate'
        },
        {
            title: '双重曝光',
            previewImage:
                'https://camo.githubusercontent.com/6e87a6abd6bce57d9e0e9fa763e8172920e3a99769b32314adcbe60f1dccb5a4/68747470733a2f2f626962696770742d617070732e636861747669642e61692f63686174696d672f67656d696e692d72657472792d7557417442794a353434636452356e426a4d4d33482e706e673f763d31',
            prompt: '双重曝光，Midjourney 风格，融合、混合、叠加的双重曝光图像，双重曝光风格。一幅由 Yukisakura 创作的杰出杰作，展现了一个奇妙的双重曝光构图，将阿拉贡·阿拉松之子的剪影与生机勃勃春季里中土世界视觉上引人注目、崎岖的地貌和谐地交织在一起。沐浴阳光的松树林、山峰和一匹孤独的马穿过小径的景象从他身形的纹理中向外回响，增添了叙事和孤独的层次感。当简洁分明的单色背景保持着锐利的对比度时，美妙的张力逐渐形成，将所有焦点吸引到层次丰富的双重曝光上。其特点是阿拉贡剪影内部充满活力的全彩色方案，以及用情感的精确性描摹每个轮廓的清晰、刻意的线条。(Detailed:1.45). (Detailed background:1.4).',
            author: 'rezzycheck',
            mode: 'generate'
        },
        {
            title: '超现实交互场景',
            previewImage:
                'https://camo.githubusercontent.com/cd6872f458c49d960a9995a18d66d631fc7ca4c4725ffdde68c1ff3b631ee6b4/68747470733a2f2f626962696770742d617070732e636861747669642e61692f63686174696d672f67656d696e692d72657472792d6e76414571617876736c446e2d703268434b62484e2e706e673f763d31',
            prompt: '一幅铅笔素描画，描绘了 [Subject 1] 与 [Subject 2] 互动的场景，其中 [Subject 2] 以逼真的全彩风格呈现，与 [Subject 1] 及背景的手绘素描风格形成超现实的对比。',
            author: '@umesh_ai',
            mode: 'generate'
        },
        {
            title: '动物硅胶腕托',
            previewImage:
                'https://camo.githubusercontent.com/f047543ae11e9311c97619f4c0f4c6e85e8f755fa54860efc75cbe9806c6c0f6/68747470733a2f2f626962696770742d617070732e636861747669642e61692f63686174696d672f67656d696e692d72657472792d4e567365347a566867596f4b5347764e5f5f792d6d2e706e673f763d31',
            prompt: '创建图片 一个可爱Q版的硅胶护腕托，外形基于【🐼】表情，采用柔软的食品级硅胶材质，表面为亲肤哑光质感，内部填充慢回弹棉，拟人化卡通风格，表情生动，双手张开趴在桌面上，呈现出拥抱手腕的姿势，整体造型圆润软萌，颜色为【🐼】配色，风格治愈可爱，适合办公使用，背景为白色纯色，柔和布光，产品摄影风格，前视角或45度俯视，高清细节，突出硅胶质感与舒适功能',
            author: '@ZHO_ZHO_ZHO',
            mode: 'generate'
        },
        {
            title: '发光线条解剖图',
            previewImage:
                'https://camo.githubusercontent.com/8270aa4a29f6ff2256fd4130a1fceb7b54e6df26269c91001ece8e6d705e6450/68747470733a2f2f626962696770742d617070732e636861747669642e61692f63686174696d672f67656d696e692d72657472792d756b6e5f617a747a413479544e474e46315143546c2e706e673f763d31',
            prompt: '一幅数字插画，描绘了一个 [SUBJECT]，其结构由一组发光、干净且纯净的蓝色线条勾勒而成。画面设定在深色背景之上，以突出 [SUBJECT] 的形态与特征。某个特定部位，如 [PART]，通过红色光晕加以强调，以表示该区域的重要性或特殊意义。整体风格兼具教育性与视觉吸引力，设计上仿佛是一种先进的成像技术。',
            author: '@umesh_ai',
            mode: 'generate'
        },
        {
            title: '特色城市天气预报',
            previewImage:
                'https://camo.githubusercontent.com/9253d5b1312c7723cb62b2f0e889cb567cbc1175eb82a5d30895e8cb2b30f123/68747470733a2f2f626962696770742d617070732e636861747669642e61692f63686174696d672f67656d696e692d786c397a45753772335644584f5f4f5a474d3161372e706e673f763d31',
            prompt: '以清晰的45°俯视角度，展示一个等距微缩模型场景，内容为[上海东方明珠塔、外滩]等城市特色建筑，天气效果巧妙融入场景中，柔和的多云天气与城市轻柔互动。使用基于物理的真实渲染（PBR）和逼真的光照效果，纯色背景，清晰简洁。画面采用居中构图，凸显出三维模型精准而细腻的美感。在图片上方展示"[上海 多云 20°C]"，并附有多云天气图标。',
            author: '@dotey',
            mode: 'generate'
        },
        {
            title: '半透明玻璃质感变换',
            previewImage:
                'https://camo.githubusercontent.com/26762f716c908798fdd198713ea346482f703876642dc776e088a11ec621d73c/68747470733a2f2f626962696770742d617070732e636861747669642e61692f63686174696d672f67656d696e692d5f61446969377072333163376e4243333065734c742e706e673f763d31',
            prompt: '将附图变换为柔软的3D半透明玻璃，具有磨砂哑光效果和细致的纹理，原始色彩，以浅灰色背景为中心，在空间中轻轻漂浮，柔和的阴影，自然的光线',
            author: '@azed_ai',
            mode: 'edit'
        },
        {
            title: '代码风格名片',
            previewImage:
                'https://camo.githubusercontent.com/df13c0036d9f88c0374664df82ad0eea0198b765521bb54b127b8437edb6519a/68747470733a2f2f626962696770742d617070732e636861747669642e61692f63686174696d672f67656d696e692d59356e785a6374343972356a70444a67657a6968742e706e673f763d31',
            prompt: '特写镜头：一只手正拿着一张设计成 VS Code 中 JSON 文件外观的名片。名片上的代码以真实的 JSON 语法高亮格式呈现。窗口界面包含典型的工具栏图标和标题栏，标题显示为 Business Card.json，整体风格与 VS Code 界面完全一致。背景略微虚化，突出展示名片内容。\n名片上的 JSON 代码如下所示：\n{\n  "name": "Jamez Bondos",\n  "title": "Your Title",\n  "email": "your@email.com",\n  "link": "yourwebsite"\n}',
            author: '@umesh_ai',
            mode: 'generate'
        },
        {
            title: '乐高城市景观',
            previewImage:
                'https://camo.githubusercontent.com/f95d2fab4d47abf6501175038b12d57649e46ff0599cb3ed96ae45bedde81eed/68747470733a2f2f626962696770742d617070732e636861747669642e61692f63686174696d672f67656d696e692d72657472792d4e632d7641686149487148697369637a69525551352e706e673f763d31',
            prompt: '创建一幅高度精细且色彩鲜艳的乐高版上海外滩景象。前景呈现经典的外滩历史建筑群，用乐高砖块精致还原西式与新古典主义风格的建筑立面，包括钟楼、穹顶、柱廊等细节。乐高小人们正在沿江漫步、拍照、观光，街道两旁停靠着经典样式的乐高汽车。背景是壮观的黄浦江，以蓝色半透明乐高砖拼接，江面上有乐高渡轮和游览船。对岸的浦东陆家嘴高楼林立，包括东方明珠塔、上海中心、金茂大厦和环球金融中心，这些超现代乐高摩天大楼色彩丰富、造型逼真。天空为乐高明亮蓝色，点缀少量白色乐高积木云朵，整体呈现充满活力与现代感的视觉效果。',
            author: '@dotey',
            mode: 'generate'
        },
        {
            title: '迷你 3D 建筑',
            previewImage:
                'https://camo.githubusercontent.com/45805585582b815a1605fa805d0243240c1f38067c7d6418c029f9e645fcd413/68747470733a2f2f626962696770742d617070732e636861747669642e61692f63686174696d672f67656d696e692d30625170484970696d594c4c72534a3871653643362e706e673f763d31',
            prompt: '3D Q版迷你风格，一个充满奇趣的迷你星巴克咖啡馆，外观就像一个巨大的外带咖啡杯，还有盖子和吸管。建筑共两层，大大的玻璃窗清晰地展示出内部温馨而精致的设计：木质的家具、温暖的灯光以及忙碌的咖啡师们。街道上有可爱的小人偶漫步或坐着，四周布置着长凳、街灯和植物盆栽，营造出迷人的城市一角。整体采用城市微缩景观风格，细节丰富、逼真，画面光线柔和、呈现出午后的惬意感受。',
            author: '@dotey',
            mode: 'generate'
        },
        {
            title: '创意绿植花盆',
            previewImage:
                'https://camo.githubusercontent.com/21c44f84989b1176b77bf9bda731611c7b9f7081db4be73c0d67d10bcc9a4d5f/68747470733a2f2f626962696770742d617070732e636861747669642e61692f63686174696d672f67656d696e692d4b4d76665a6b4c4675764d457a437a4254387977722e706e673f763d31',
            prompt: '一张高质量的照片，展示一个可爱的陶瓷[物体/动物]形状的花盆，表面光滑，里面装满了各种生机勃勃的多肉植物和绿色植物，包括尖刺的十二卷、莲座状的石莲花和精致的白色小花。花盆带有一个友好的面孔，放置在柔和的中性背景上，采用漫射自然光照明，展示了细腻的纹理和色彩对比，构图简洁、极具简约风格。',
            author: '@azed_ai',
            mode: 'generate'
        },
        {
            title: '“极其平凡”的iPhone自拍',
            previewImage:
                'https://camo.githubusercontent.com/a6b07bb2170ebd24d3de178a711d25442a1e5373b86895e934961f20519c2950/68747470733a2f2f626962696770742d617070732e636861747669642e61692f63686174696d672f67656d696e692d524566655f50666759667a363766356c6961664b752e706e673f763d31',
            prompt: '请画一张极其平凡无奇的iPhone 自拍照，没有明确的主体或构图感，就像是随手一拍的快照。照片略带运动模糊，阳光或店内灯光不均导致轻微曝光过度。角度尴尬、构图混乱，整体呈现出一种刻意的平庸感-就像是从口袋里拿手机时不小心拍到的一张自拍。主角是陈奕迅和谢霆锋，晚上，旁边是香港会展中心，在香港维多利亚港旁边。',
            author: '@jiamimaodashu',
            mode: 'generate'
        },
        {
            title: '玻璃材质重塑',
            previewImage:
                'https://camo.githubusercontent.com/f6ea76545847586388ceb6dc749054b2a91be35fe42c51eb9f2e3cdd31337ebc/68747470733a2f2f626962696770742d617070732e636861747669642e61692f63686174696d672f67656d696e692d72657472792d51436453414e324979696779485656706c7058474c2e706e673f763d31',
            prompt: 'retexture the image attached based on the json below:\n\n{\n  "style": "photorealistic",\n  "material": "glass",\n  "background": "plain white",\n  "object_position": "centered",\n  "lighting": "soft, diffused studio lighting",\n  "camera_angle": "eye-level, straight-on",\n  "resolution": "high",\n  "aspect_ratio": "2:3",\n  "details": {\n    "reflections": true,\n    "shadows": false,\n    "transparency": true\n  }\n}',
            author: '@egeberkina',
            mode: 'edit'
        },
        {
            title: '水晶球故事场景',
            previewImage:
                'https://camo.githubusercontent.com/1a623fc0c48774dd44d9ac8749b5ecc2eb91f3b1911eb47f2bc58e08f0442491/68747470733a2f2f626962696770742d617070732e636861747669642e61692f63686174696d672f67656d696e692d7463504a594a71576853694c42742d4b4d6e7579442e706e673f763d31',
            prompt: '一枚精致的水晶球静静摆放在窗户旁温暖柔和的桌面上，背景虚化而朦胧，暖色调的阳光轻柔地穿透水晶球，折射出点点金光，温暖地照亮了四周的微暗空间。水晶球内部自然地呈现出一个以 {嫦娥奔月} 为主题的迷你立体世界，细腻精美而梦幻的3D景观，人物与物体皆是可爱的Q版造型，精致而美观，彼此之间充满灵动的情感互动。整体氛围充满了东亚奇幻色彩，细节极为丰富，呈现出魔幻现实主义般的奇妙质感。整个场景如诗如梦，华美而典雅，散发着温馨柔和的光芒，仿佛在温暖的光影中被赋予了生命。',
            author: '@dotey',
            mode: 'generate'
        },
        {
            title: '怀旧动漫风格电影海报',
            previewImage:
                'https://github.com/JimmyLv/awesome-nano-banana/raw/main/cases/76/example_anime_nostalgic_poster.png',
            prompt: '{The Lord of the Rings} 风格的动漫电影海报，动漫画风为《恶魔高中 DXD（High School DXD）》风格。海报上可见明显的折痕痕迹，因长时间反复折叠，造成部分区域出现褶皱处的物理性损伤和擦痕，颜色也在某些地方出现了褪色。表面遍布无规律的折痕、翻折印记与划痕，这些都是在不断搬动过程中逐渐积累的微小损耗，如同熵增不可逆的过程在不断扩展。\\n然而，留存在我们心中的美好记忆却始终完整无缺。当你凝视这张充满怀旧氛围的海报时，所感受到的，正是那些随时间累积、变得无比珍贵的收藏品所承载的情感本质。',
            author: 'photis (Sora)',
            mode: 'generate'
        },
        {
            title: '社交媒体相框融合',
            previewImage:
                'https://camo.githubusercontent.com/fd39233256cad07cd22688a18d7d24d73c81ae825e4571c7d48faaa374bfe4a9/68747470733a2f2f626962696770742d617070732e636861747669642e61692f63686174696d672f67656d696e692d386b66617335364a63332d6631354f3839707a4b4e2e706e673f763d31',
            prompt: '根据所附照片创建一个风格化的3D Q版人物角色，准确保留人物的面部特征和服装细节。角色的左手比心（手指上方有红色爱心元素），姿势俏皮地坐在一个巨大的Instagram相框边缘，双腿悬挂在框外。相框顶部显示用户名『Beauty』，四周漂浮着社交媒体图标（点赞、评论、转发）。',
            author: '@dotey',
            mode: 'edit'
        },
        {
            title: '虚构推文截图',
            previewImage:
                'https://camo.githubusercontent.com/5b13e965a80e2d8ae3d5889ac3495276a76638dc1edb7d05f60c97841c78ef7f/68747470733a2f2f626962696770742d617070732e636861747669642e61692f63686174696d672f67656d696e692d72657472792d354e415041634d4e534c6c376a38507558356d6e742e706e673f763d31',
            prompt: '爱因斯坦刚刚完成相对论后发布的一条超写实风格的推文。包含一张自拍照，照片中清晰可见背景中的粉笔板和潦草的公式。推文下方显示尼古拉·特斯拉点赞了该内容。',
            author: '@egeberkina',
            mode: 'generate'
        },
        {
            title: 'Emoji 簇绒地毯',
            previewImage:
                'https://camo.githubusercontent.com/583b26fdf81dac240b845755312040fd0dae8e85e878bcf32b014ab59e125b4c/68747470733a2f2f626962696770742d617070732e636861747669642e61692f63686174696d672f67656d696e692d72657472792d673165446973306430696149454b4c6e6b555361612e706e673f763d31',
            prompt: '创建一张图像，展示一个彩色、手工簇绒的地毯，形状为 🦖 表情符号，铺设在一个简约的地板背景上。地毯设计大胆、俏皮，具有柔软蓬松的质感和粗线条的细节。从上方俯拍，使用自然光照，整体风格略带古怪的 DIY 美感。色彩鲜艳，轮廓卡通化，材质具触感且温馨舒适——类似于手工簇绒艺术地毯。',
            author: '@gizakdag',
            mode: 'generate'
        },
        {
            title: '彩色矢量艺术海报',
            previewImage:
                'https://camo.githubusercontent.com/4ffb81b3047df5f83649540ebaeb6cff34583c4b65c43819249b37610500bd77/68747470733a2f2f626962696770742d617070732e636861747669642e61692f63686174696d672f67656d696e692d72657472792d347a38794e2d45564852427468546e704342384b612e706e673f763d31',
            prompt: '地点是"英国伦敦"，生成一张夏季的彩色矢量艺术海报，顶部有大的"LONDON"标题，下方有较小的"UNITED KINGDOM"标题',
            author: '@michaelrabone',
            mode: 'generate'
        },
        {
            title: '云彩艺术',
            previewImage:
                'https://camo.githubusercontent.com/48ab315960b037955aaa2349972ef99a880c791d9bcc1ada88692691e7b85538/68747470733a2f2f626962696770742d617070732e636861747669642e61692f63686174696d672f67656d696e692d75664b5152552d307a58586c4143745f415f444e642e706e673f763d31',
            prompt: '生成一张照片：捕捉了白天的场景，天空中散落的云彩组成了 [主体/物体] 的形状，位于 [地点] 的上方。',
            author: '@umesh_ai',
            mode: 'generate'
        },
        {
            title: '8位像素图标',
            previewImage:
                'https://camo.githubusercontent.com/83e38ad7752cde79777020605aac1e000faec10e8b77ee4dc27a177f30032d6f/68747470733a2f2f626962696770742d617070732e636861747669642e61692f63686174696d672f67656d696e692d4830453845715131306a72626530643871373133372e706e673f763d31',
            prompt: '创建一个极简主义的 8 位像素风格的 [🍔] 标志，居中放置在纯白背景上。使用有限的复古调色板，搭配像素化细节、锐利边缘和干净的块状形态。标志应简洁、具有标志性，并能在像素艺术风格中清晰识别——灵感来自经典街机游戏美学。',
            author: '@egeberkina',
            mode: 'generate'
        },
        {
            title: 'Emoji 充气感靠垫',
            previewImage:
                'https://camo.githubusercontent.com/e5342b40860c8b46ad941a3c14813ea47cddc62c025a8776bc676ef09922574b/68747470733a2f2f626962696770742d617070732e636861747669642e61692f63686174696d672f67656d696e692d72657472792d30514e774a386f725854714c474e4e746f4d3255712e706e673f763d31',
            prompt: '创建一个高分辨率的 3D 渲染图，将 [🥹] 设计成一个充气、鼓胀的物体。形状应柔软、圆润、充满空气——类似于一个毛绒气球或充气玩具。使用光滑的哑光材质，带有细微的布料折痕和缝线，以强化充气效果。整体形态应略带不规则且柔软塌陷，搭配柔和阴影和软光照，以突出体积感与真实感。将其置于干净、简约的背景上（浅灰色或浅蓝色），整体风格应保持俏皮而具雕塑感。',
            author: '@gizakdag',
            mode: 'generate'
        },
        {
            title: '纸艺风格 Emoji 图标',
            previewImage:
                'https://camo.githubusercontent.com/b7a7c89709c5637e3dc6c5f53aa869c009d14009a01057e4862bf055495f18fa/68747470733a2f2f626962696770742d617070732e636861747669642e61692f63686174696d672f67656d696e692d72657472792d536f5a50325a773148435258474f4e46645a5344732e706e673f763d31',
            prompt: '一个纸艺风格的"🔥"图标，漂浮在纯白背景上。这个表情符号由彩色剪纸手工制作而成，具有可见的纸张纹理、折痕和分层形状。它在下方投下柔和的阴影，营造出轻盈感和立体感。整体设计简洁、有趣、干净，图像居中，周围留有大量留白。使用柔和的影棚光照以突出纸张的质感与边缘。',
            author: '@egeberkina',
            mode: 'generate'
        },
        {
            title: '护照入境印章',
            previewImage:
                'https://camo.githubusercontent.com/9c7ce999c65901c3b9777d79b8df5019e03aaa2ea9a6b7e2c9d2cec432d9fbab/68747470733a2f2f626962696770742d617070732e636861747669642e61692f63686174696d672f67656d696e692d72657472792d75766245316f334b396c38365a57314e31704e4d4c2e706e673f763d31',
            prompt: '创建一个逼真的护照页，并盖上[北京, 中国]的入境章。章面应以粗体英文写明"欢迎来到北京"，并设计成圆形或椭圆形，并带有装饰性边框。章面应包含"ARRIVAL"字样和一个虚构的日期，例如"2025年4月16日"。在章面中加入{故宫}的微妙轮廓作为背景细节。使用深蓝色或红色墨水并略加晕染，以增强真实感。章面应略微倾斜，如同手工压印。护照页应清晰可见纸张纹理和安全图案。',
            author: '@M_w14_',
            mode: 'generate'
        },
        {
            title: '物理破坏效果卡片',
            previewImage:
                'https://camo.githubusercontent.com/9d16d254ef57b11758a6d02d6afbbdf7aaa4a29bb15c934637494d5961df4d0f/68747470733a2f2f626962696770742d617070732e636861747669642e61692f63686174696d672f67656d696e692d72657472792d424c69697034377353314d5a327036526f55534a4e2e706e673f763d31',
            prompt: '一幅超写实、电影感的插画，描绘了劳拉·克劳馥动态地撞穿一张"考古探险"集换卡牌的边框。她正处于跳跃中或用绳索摆荡，穿着标志性的冒险装备，可能正在使用双枪射击，枪口的火焰帮助将卡牌古老的石雕边框震碎，在破口周围制造出可见的维度破裂效果，如能量裂纹和空间扭曲，使灰尘和碎片四散飞溅。她的身体充满活力地向前冲出，带有明显的运动深度，突破了卡牌的平面，卡牌内部（背景）描绘着茂密的丛林遗迹或布满陷阱的古墓内部。卡牌的碎屑与 crumbling 的石头、飞舞的藤蔓、古钱币碎片和用过的弹壳混合在一起。"考古探险"的标题和"劳拉·克劳馥"的名字（带有一个风格化的文物图标）在卡牌剩余的、布满裂纹和风化痕迹的部分上可见。充满冒险感的、动态的灯光突出了她的运动能力和危险的环境。',
            author: '@op7418',
            mode: 'generate'
        },
        {
            title: '时尚杂志封面风格',
            previewImage:
                'https://camo.githubusercontent.com/f06bcee6af14975b53382123ac726fe714fa531b3378e9838a316a62cee318e7/68747470733a2f2f626962696770742d617070732e636861747669642e61692f63686174696d672f67656d696e692d4b2d7a4d526c7a753379396245724a68356f4444652e706e673f763d31',
            prompt: '一位美丽的女子身穿粉色旗袍，头戴精致的花饰，秀发中点缀着色彩缤纷的花朵，颈间装饰着优雅的白色蕾丝领子。她的一只手轻托着几只大型蝴蝶。整体拍摄风格呈现高清细节质感，类似时尚杂志封面设计，照片上方中央位置标有文字「FASHION DESIGN」。画面背景采用简约的纯浅灰色，以突出人物主体。',
            author: '@dotey',
            mode: 'generate'
        },
        {
            title: '体素风格 3D 图标转换',
            previewImage:
                'https://camo.githubusercontent.com/812429b9b49df01b2df8d17fcc3e5a044eb441489da71bddf1bf499c434a4c94/68747470733a2f2f626962696770742d617070732e636861747669642e61692f63686174696d672f67656d696e692d72657472792d44655052456a4474336e7a366e78745153574374622e706e673f763d31',
            prompt: '将图片/描述/emoji转换为参考图一样的体素 3D 图标，Octane 渲染，8k',
            author: '@BrettFromDJ',
            mode: 'edit'
        },
        {
            title: 'RPG 风格角色卡片制作',
            previewImage:
                'https://camo.githubusercontent.com/8ff51afd35ba86f0e12ce304f0c651059f5b8ac1bb549150d1fa15bcef58fbcb/68747470733a2f2f63646e2e6a7364656c6976722e6e65742f67682f6a616d657a2d626f6e646f732f617765736f6d652d677074346f2d696d616765732f63617365732f34342f6578616d706c655f7270675f636172645f64657369676e65722e706e67',
            prompt: '创建一张 RPG 收藏风格的数字角色卡。角色设定为 {Programmer}，自信地站立，配有与其职业相关的工具或符号。以 3D 卡通风格呈现，采用柔和光照，展现鲜明的个性。添加技能条或属性数值，例如 [技能1 +x]、[技能2 +x]，如 Creativity +10、UI/UX +8。卡片顶部添加标题横幅，底部放置角色名牌。卡片边框应干净利落，如同真实的收藏公仔包装盒。背景需与职业主题相匹配。配色方面使用温暖的高光与符合职业特征的色调。',
            author: '@berryxia_ai',
            mode: 'generate'
        },
        {
            title: 'Q版可爱俄罗斯套娃',
            previewImage:
                'https://camo.githubusercontent.com/0a83915cad66e1b1f35aed3e0e0a65addaa92c82be9373b4df115ed458114b11/68747470733a2f2f63646e2e6a7364656c6976722e6e65742f67682f6a616d657a2d626f6e646f732f617765736f6d652d677074346f2d696d616765732f63617365732f34332f6578616d706c655f6d617472796f73686b615f706561726c5f65617272696e672e706e67',
            prompt: '把图片人物生成变成 Q 版可爱俄罗斯套娃🪆，大到小一共五个，放在精致的木桌上，横幅3:2比例',
            author: '@ZHO_ZHO_ZHO',
            mode: 'edit'
        },
        {
            title: '3D 全家福婚纱照',
            previewImage:
                'https://camo.githubusercontent.com/1f0fae059d027f42d34cf2832eb804d73431e1e98ec118a01395e4ba6f8817a8/68747470733a2f2f626962696770742d617070732e636861747669642e61692f63686174696d672f67656d696e692d5a6848674b6b727951655f653632674a794d706a382e706e673f763d31',
            prompt: '将照片里的转换成Q版 3D人物，父母婚礼服饰，孩子是美丽的花童。 父母，西式婚礼服饰，父亲礼服，母亲婚纱。孩子手捧鲜花。 背景是五彩鲜花做的拱门。 除了人物是3D Q版，环境其他都是写实。整体放在一个相框里。',
            author: '@balconychy',
            mode: 'edit'
        },
        {
            title: '3D Q版情侣水晶球',
            previewImage:
                'https://camo.githubusercontent.com/e99ef2df7acf4c797fadaba52718b901e2634460ac545482fe91b27f9fa62fec/68747470733a2f2f63646e2e6a7364656c6976722e6e65742f67682f6a616d657a2d626f6e646f732f617765736f6d652d677074346f2d696d616765732f63617365732f34322f6578616d706c655f33645f715f736e6f77676c6f62655f636f75706c652e706e67',
            prompt: '将附图中的人物转换成水晶球场景。整体环境：水晶球放在窗户旁桌面上，背景模糊，暖色调。阳光透过球体，洒下点点金光，照亮了周围的黑暗。水晶球内部：人物是可爱Q版3D造型，相互之间满眼的爱意。',
            author: '@balconychy',
            mode: 'edit'
        },
        {
            title: '微型立体场景（孙悟空三打白骨精）',
            previewImage:
                'https://github.com/JimmyLv/awesome-nano-banana/raw/main/cases/41/example_miniature_journey_west.png',
            prompt: '微型立体场景呈现，运用移轴摄影的技法，呈现出Q版【孙悟空三打白骨精】场景',
            author: '@dotey',
            mode: 'generate'
        },
        {
            title: '实物与手绘涂鸦创意广告',
            previewImage:
                'https://camo.githubusercontent.com/2b6307f6e906fced7e675614c25fbed6a5e49d47544a050e8e6793a7c2bf0543/68747470733a2f2f626962696770742d617070732e636861747669642e61692f63686174696d672f67656d696e692d4274303535695734374f557152444f682d4b30675a2e706e673f763d31',
            prompt: `一则简约且富有创意的广告，设置在纯白背景上。
一个真实的 [真实物体] 与手绘黑色墨水涂鸦相结合，线条松散而俏皮。涂鸦描绘了：[涂鸦概念及交互：以巧妙、富有想象力的方式与物体互动]。在顶部或中部加入粗体黑色 [广告文案] 文字。在底部清晰放置 [品牌标志]。视觉效果应简洁、有趣、高对比度且构思巧妙。`,
            author: '@azed_ai',
            mode: 'generate'
        },
        {
            title: '可爱温馨针织玩偶',
            previewImage:
                'https://camo.githubusercontent.com/3cc59f2a7296dd0f2e4a8d81e8bfb06dad2c9fb00f92a90589dae15c758d919c/68747470733a2f2f626962696770742d617070732e636861747669642e61692f63686174696d672f67656d696e692d467056545546574b3264686431475379734f4664682e706e673f763d31',
            prompt: '一张特写、构图专业的照片，展示一个手工钩织的毛线玩偶被双手轻柔地托着。玩偶造型圆润，【上传图片】人物得可爱Q版形象，色彩对比鲜明，细节丰富。持玩偶的双手自然、温柔，手指姿态清晰可见，皮肤质感与光影过渡自然，展现出温暖且真实的触感。背景轻微虚化，表现为室内环境，有温暖的木质桌面和从窗户洒入的自然光，营造出舒适、亲密的氛围。整体画面传达出精湛的工艺感与被珍视的温馨情绪。',
            author: '@ZHO_ZHO_ZHO',
            mode: 'edit'
        },
        {
            title: '日系双格漫画',
            previewImage:
                'https://camo.githubusercontent.com/f183d55c3ec78ff3aa0b8ad162592e76660fd6eded824c09ac32ec090e5d3222/68747470733a2f2f63646e2e6a7364656c6976722e6e65742f67682f6a616d657a2d626f6e646f732f617765736f6d652d677074346f2d696d616765732f63617365732f34302f6578616d706c655f74776f5f70616e656c5f6d616e67615f707265736964656e742e706e67',
            prompt: '创建一张日系萌系双格漫画，上下排列，主题：少女总统的工作日常。角色形象: 将上传的附件转换为日系萌系卡通女生形象的风格，保留原图所有细节，如服饰（西装）、发型（明亮的金黄色）、五官等。第一格:- 表情: 委屈巴巴，沮丧的表情，单手托腮- 文字框: "肿么办嘛！他不跟我通话！(；´д｀)"- 场景: 暖色调办公室，背后美国国旗，桌上放着一堆汉堡，一个复古红色转盘电话，人物在画面左边，电话在右边。第二格:- 表情: 咬牙切齿，暴怒，脸涨红- 动作: 猛拍桌子，汉堡震得跳起来- 文字泡: "哼！关税加倍！不理我是他们的损失！( `д´ )" - 场景: 和第一格相同，但一片狼藉。其他说明:- 文字采用简洁可爱的手写体，整体风格可爱而有趣。- 构图饱满生动，请保留足够空间用于文字显示，适当留白。- 图片比例 2:3。- 画面整体色彩鲜艳，突出卡通风格。',
            author: '@hellokaton',
            mode: 'edit'
        },
        {
            title: '奇幻卡通插画',
            previewImage:
                'https://camo.githubusercontent.com/d50b0d3392e3a7feb4acd0453f8543edaa8ce5823c8287b22980df1bd55b7305/68747470733a2f2f63646e2e6a7364656c6976722e6e65742f67682f6a616d657a2d626f6e646f732f617765736f6d652d677074346f2d696d616765732f63617365732f33392f6578616d706c655f66616e746173795f636f6d70757465725f686561645f706f7274616c2e706e67',
            prompt: '一个卡通风格的角色，头部是一个带笑脸的电脑显示器，穿着手套和靴子，正开心地跳跃穿过一个发光的蓝色圆形传送门，背景是一片郁郁葱葱的奇幻森林景观。森林中细节丰富，有高大的树木、蘑菇、鲜花、宁静的河流、漂浮的岛屿，以及一个充满氛围的星夜天空，天空中有多个月亮。整体采用明亮鲜艳的色彩搭配柔和光效，风格为奇幻插画风。',
            author: '@dotey',
            mode: 'generate'
        },
        {
            title: '手绘信息图卡片（IP版）',
            previewImage:
                'https://camo.githubusercontent.com/2c1ecd488ccc8f41ef612de8d22b7e4a38f159c8c8d49a8fee944c136c8b87eb/68747470733a2f2f63646e2e6a7364656c6976722e6e65742f67682f6a616d657a2d626f6e646f732f617765736f6d652d677074346f2d696d616765732f63617365732f33382f6578616d706c655f68616e645f647261776e5f696e666f677261706869632e706e67',
            prompt: '创作一张手绘风格的信息图卡片，比例为9:16竖版。卡片主题鲜明，背景为带有纸质肌理的米色或米白色，整体设计体现质朴、亲切的手绘美感。卡片上方以红黑相间、对比鲜明的大号毛笔草书字体突出标题，吸引视觉焦点。文字内容均采用中文草书，整体布局分为2至4个清晰的小节，每节以简短、精炼的中文短语表达核心要点。字体保持草书流畅的韵律感，既清晰可读又富有艺术气息。周边适当留白。卡片中点缀简单、有趣的手绘插画或图标，例如人物或象征符号，以增强视觉吸引力，引发读者思考与共鸣。整体布局注意视觉平衡，预留足够的空白空间，确保画面简洁明了，易于阅读和理解。"做 IP 是长期复利坚持每日更新，肯定会有结果，因为 99% 都坚持不了的！"',
            author: '@dotey',
            mode: 'generate'
        },
        {
            title: '柔和风格3D广告',
            previewImage:
                'https://camo.githubusercontent.com/d710da544912283c5f4da3e226e61b8ecd5b639442b98572a8df2593ee1decbb/68747470733a2f2f63646e2e6a7364656c6976722e6e65742f67682f6a616d657a2d626f6e646f732f617765736f6d652d677074346f2d696d616765732f63617365732f33372f70617374656c5f706f7765725f33645f6164732e706e67',
            prompt: '一个柔和的3D卡通风格[品牌产品]雕塑，由光滑的粘土般纹理和鲜艳的柔和色彩制成，放置在简约的等距场景中，该场景与产品特性相得益彰，构图简洁，光线柔和，阴影微妙，产品徽标和三个词的口号清晰显示在下方。',
            author: '@op7418',
            mode: 'generate'
        },
        {
            title: '极简主义3D插画',
            previewImage:
                'https://camo.githubusercontent.com/3652508db41807adb2fb9055856eb874eb67f8e82ad880ea1fbfb005d0e04340/68747470733a2f2f63646e2e6a7364656c6976722e6e65742f67682f6a616d657a2d626f6e646f732f617765736f6d652d677074346f2d696d616765732f63617365732f33362f6578616d706c655f6d696e696d616c6973745f33645f746f696c65745f7478742e706e67',
            prompt: '画一个马桶：## 艺术风格简介：极简主义3D插画（Minimalist 3D Illustration）### 🎨 视觉元素（Visual Elements）#### 🟢 造型语言（Shape Language）- 圆润的边缘、平滑柔和的外形，采用简化几何造型。#### 🎨 色彩（Colors）- **主色调：** 柔和米色、浅灰色、暖橙色。- **强调色：** 暖橙色用于焦点元素。- **明暗处理：** 柔和渐变，平滑过渡，避免强烈的阴影和高光。#### 💡 光照（Lighting）- **类型：** 柔和、漫反射光照。- **光源方向：** 上方稍偏右。- **阴影风格：** 微妙且漫射，无锐利或高对比度的阴影。#### 🧱 材质（Materials）- **表面纹理：** 哑光、平滑的表面，带有微妙的明暗变化。- **反射性：** 低或无，避免明显的光泽。#### 🖼️ 构图（Composition）- **对象呈现：** 单一、居中的物体，周围留出大量负空间。- **视角：** 轻微倾斜视角，呈现适度的三维感，但无明显的景深效果。- **背景：** 纯色、低饱和度，与主体协调且不干扰视线。#### ✒️ 字体排版（Typography）- **字体风格：** 极简、无衬线字体。- **文字位置：** 左下角，尺寸小巧且不突出。- **字体颜色：** 灰色，与背景形成低对比度。#### 🖥️ 渲染风格（Rendering Style）- **技术手法：** 3D渲染，采用简化的低多边形风格。- **细节程度：** 中等细节，以形状和色彩为主，避免复杂纹理和细节。### 🎯 风格目标（Purpose）> 创建干净、美观的视觉效果，强调简洁、亲和和现代感。',
            author: '@dotey',
            mode: 'generate'
        },
        {
            title: '毛茸茸emoji物体',
            previewImage:
                'https://camo.githubusercontent.com/add591fcb6adacc9f7250f90ab93e04dc7306ee90b82eab91906246856447465/68747470733a2f2f63646e2e6a7364656c6976722e6e65742f67682f6a616d657a2d626f6e646f732f617765736f6d652d677074346f2d696d616765732f63617365732f33352f6578616d706c655f666c756666795f70756d706b696e2e706e67',
            prompt: '将一个简单平面的矢量图标 [🎃] 转化为柔软、立体、毛茸茸的可爱物体。整体造型被浓密的毛发完全覆盖，毛发质感极其真实，带有柔和的阴影。物体居中悬浮于干净的浅灰色背景中，轻盈漂浮。整体风格超现实，富有触感和现代感，带来舒适和俏皮的视觉感受。采用摄影棚级灯光，高分辨率渲染，比例为1:1。',
            author: '@gizakdag',
            mode: 'generate'
        },
        {
            title: '手绘信息图卡片（认知版）',
            previewImage:
                'https://camo.githubusercontent.com/d3f1b68d9c2b7cfe363e360a7ef0310c214cad796cc15bb4c98ea32e7698ea6c/68747470733a2f2f63646e2e6a7364656c6976722e6e65742f67682f6a616d657a2d626f6e646f732f617765736f6d652d677074346f2d696d616765732f63617365732f33342f6578616d706c655f68616e645f647261776e5f696e666f677261706869635f636f676e6974696f6e2e706e67',
            prompt: `创作一张手绘风格的信息图卡片，比例为9:16竖版。卡片主题鲜明，背景为带有纸质肌理的米色或米白色，整体设计体现质朴、亲切的手绘美感。卡片上方以红黑相间、对比鲜明的大号毛笔草书字体突出标题，吸引视觉焦点。文字内容均采用中文草书，整体布局分为2至4个清晰的小节，每节以简短、精炼的中文短语表达核心要点。字体保持草书流畅的韵律感，既清晰可读又富有艺术气息。卡片中点缀简单、有趣的手绘插画或图标，例如人物或象征符号，以增强视觉吸引力，引发读者思考与共鸣。整体布局注意视觉平衡，预留足够的空白空间，确保画面简洁明了，易于阅读和理解。<h1><span style="color:red">「认知」</span>决定上限<span style="color:red">「圈子」</span>决定机会</h1>- 你赚不到「认知」以外的钱，- 也遇不到「圈子」以外的机会。`,
            author: '@dotey',
            mode: 'generate'
        },
        {
            title: '全家福婚纱照Q版转换',
            previewImage:
                'https://camo.githubusercontent.com/3fb5da55ac7d69ecaeb5ffb1c2faba189479a5f43b06dea7e42f0cdb16e8ed42/68747470733a2f2f63646e2e6a7364656c6976722e6e65742f67682f6a616d657a2d626f6e646f732f617765736f6d652d677074346f2d696d616765732f63617365732f33332f6578616d706c655f66616d696c795f77656464696e675f70686f746f5f712e706e67',
            prompt: '将照片里的转换成Q版 3D人物，父母婚礼服饰，孩子是美丽的花童。父母，西式婚礼服饰，父亲礼服，母亲婚纱。孩子手捧鲜花。背景是五彩鲜花做的拱门。除了人物是3D Q版，环境其他都是写实。整体放在一个相框里。',
            author: '@balconychy',
            mode: 'edit'
        },
        {
            title: '《泰坦尼克号》模仿',
            previewImage:
                'https://camo.githubusercontent.com/5d29d42b32f595ff9ae827149d4fc057e99488ec9e777dc2f78eefa761a04167/68747470733a2f2f626962696770742d617070732e636861747669642e61692f63686174696d672f67656d696e692d72657472792d70564470535231634c61366b376d6649626d6d4f352e706e673f763d31',
            prompt: `将附图中的人物转换成可爱Q版3D造型
场景：在豪华游轮最顶尖的船头，船头是尖的。
男士带着女士站在泰坦尼克号船头，男士双手搂着女士的腰，女士双臂伸展穿着连衣裙，迎着风，脸上洋溢着自由与畅快。
此时天色呈现出黄昏的暖色调，大海在船下延展。
除了人物用Q版3D造型以外，其他环境都是实物。`,
            author: '@balconychy',
            mode: 'edit'
        },
        {
            title: '折叠式纸雕立体绘本',
            previewImage:
                'https://camo.githubusercontent.com/8bb13880a0cd25a353c4765d6b8310c5bf348914a9d06634328c8e77a9a69a40/68747470733a2f2f63646e2e6a7364656c6976722e6e65742f67682f6a616d657a2d626f6e646f732f617765736f6d652d677074346f2d696d616765732f63617365732f33322f33645f706170657263726166745f706f7075705f626f6f6b2e706e67',
            prompt: '多层折叠式纸雕立体绘本，放在一张书桌上，背景纯净突出主题，绘本呈现出立体翻页书般的风格，比例为3:2横版。翻开的书页呈现【魔童版哪吒大战敖丙】的场景，所有元素皆可精细折叠组合，呈现出逼真细腻的纸张折叠质感；构图统一采用正面视角，整体视觉风格梦幻唯美，色彩缤纷绚丽，充满奇幻而生动的故事氛围。',
            author: '@dotey',
            mode: 'generate'
        },
        {
            title: '动漫贴纸集合',
            previewImage:
                'https://camo.githubusercontent.com/bbd003c3b5e1edffb792e0d7a8260362459d71788fc94beff3f84546ebb23f77/68747470733a2f2f63646e2e6a7364656c6976722e6e65742f67682f6a616d657a2d626f6e646f732f617765736f6d652d677074346f2d696d616765732f63617365732f33312f6578616d706c655f6e617275746f5f737469636b6572732e706e67',
            prompt: '创建一套动漫风格的贴纸集合，包含多个不同表情和姿势的卡通角色，每个贴纸都有白色边框，色彩鲜艳，风格统一。',
            author: '@richardchang',
            mode: 'generate'
        },
        {
            title: '35mm胶片风格飞岛',
            previewImage:
                'https://camo.githubusercontent.com/7d1e1876e70093cc7f306d54d1b034c442975d333584d174a8a5966b9b9673ca/68747470733a2f2f63646e2e6a7364656c6976722e6e65742f67682f6a616d657a2d626f6e646f732f617765736f6d652d677074346f2d696d616765732f63617365732f33302f6578616d706c655f33356d6d5f6d6f73636f775f666c79696e675f69736c616e642e706e67',
            prompt: '35 毫米胶片风格的照片：莫斯科漂浮在天空中的飞行岛屿上。',
            author: '@dotey',
            mode: 'generate'
        },
        {
            title: '名画人物OOTD',
            previewImage:
                'https://camo.githubusercontent.com/d6a72c9c6f8ef4b074b05edf851d91a6d3a6ee654fd7091305ab1d9e565cf4b5/68747470733a2f2f63646e2e6a7364656c6976722e6e65742f67682f6a616d657a2d626f6e646f732f617765736f6d652d677074346f2d696d616765732f63617365732f32392f6578616d706c655f706561726c5f65617272696e675f6f6f74642e706e67',
            prompt: '为图片人物生成不同职业风的OOTD，时尚穿搭和配饰，和人物色系一致的纯色背景，Q版 3d，c4d渲染，保持人脸特征，姿势都要保持一致，人物的比例腿很修长。构图：9:16。顶部文字：OOTD，左侧为人物ootd q版形象，右侧为穿搭的单件展示。先来第一个职业：时尚设计师',
            author: '@ZHO_ZHO_ZHO',
            mode: 'edit'
        },
        {
            title: '扁平贴纸设计',
            previewImage:
                'https://camo.githubusercontent.com/34be2f188d2d9b0d1f406d790ec7ad9fa1db2e095bb43cc3d34bd5886f25536e/68747470733a2f2f63646e2e6a7364656c6976722e6e65742f67682f6a616d657a2d626f6e646f732f617765736f6d652d677074346f2d696d616765732f63617365732f32382f6578616d706c655f666c61745f737469636b65725f706561726c5f65617272696e672e706e67',
            prompt: '把这张照片设计成一个极简扁平插画风格的Q版贴纸，厚白边，保留人物特征，风格要可爱一些，人物要超出圆形区域边框，圆形区域要为纯色不要3d感，透明背景。',
            author: '@ZHO_ZHO_ZHO',
            mode: 'edit'
        },
        {
            title: 'Q版表情包制作',
            previewImage:
                'https://camo.githubusercontent.com/7ac18e599a35eba0e9691633130e689c83ae6623d38baff293521fc4a85d2cc1/68747470733a2f2f626962696770742d617070732e636861747669642e61692f63686174696d672f67656d696e692d7a3156305a55566f386f6d626b2d4f443134496e4E2e706e673f763d31',
            prompt: '创作一套全新的 chibi sticker，共六个独特姿势，以用户形象为主角：\\n1. 双手比出剪刀手，俏皮地眨眼；\\n2. 泪眼汪汪、嘴唇微微颤动，呈现可爱哭泣的表情；\\n3. 张开双臂，做出热情的大大拥抱姿势；\\n4. 侧卧入睡，靠着迷你枕头，带着甜甜的微笑；\\n5. 自信满满地向前方伸手指，周围点缀闪亮特效；\\n6. 手势飞吻，周围飘散出爱心表情。\\n保留 chibi 美学风格：夸张有神的大眼睛、柔和的面部线条、活泼俏皮的短款黑色发型、配以大胆领口设计的白色服饰，背景使用充满活力的红色，并搭配星星或彩色纸屑元素进行装饰。周边适当留白。\\nAspect ratio: 9:16',
            author: '@dotey',
            mode: 'edit'
        },
        {
            title: '名画人物麦片广告',
            previewImage:
                'https://camo.githubusercontent.com/59fa9dc7aacd8eae0a665dd4788cab4e67fcded679534808e64b4316d073da12/68747470733a2f2f626962696770742d617070732e636861747669642e61692f63686174696d672f67656d696e692d417775655a65342d4b35546d7346546467574549562e706e673f763d31',
            prompt: '《大师麦片》：根据我上传的照片的人物特征判断，为他生成一个符合他特质的燕麦片搭配（比如蔬菜、水果、酸奶、粗粮等等）和包装设计，然后生成他作为麦片包装盒封面人物 加 相应麦片搭配的广告封面，人物要保持特征、可爱Q版3d、c4d渲染风格，麦片所放置的地方的风格也要符合设定，比如放在厨房、超市 极简主义的设计台上等等，先做好设定，再生成图像。',
            author: '@ZHO_ZHO_ZHO',
            mode: 'edit'
        },
        {
            title: '极简主义3D插画（JSON配置版）',
            previewImage:
                'https://camo.githubusercontent.com/2f92af00226c047c8a6af7d7fa71b7bffc866f30ae5678134b97fbf9a7bc4f60/68747470733a2f2f626962696770742d617070732e636861747669642e61692f63686174696d672f67656d696e692d466d6e58795f4649413374326f324a4d31416377372e706e673f763d31',
            prompt: `使用以下 JSON 配置文件生成一个马桶：
{
  "art_style_profile": {
    "style_name": "Minimalist 3D Illustration",
    "visual_elements": {
      "shape_language": "Rounded edges, smooth and soft forms with simplified geometry",
      "colors": {
        "primary_palette": ["Soft beige, light gray, warm orange"],
        "accent_colors": ["Warm orange for focal elements"],
        "shading": "Soft gradients with smooth transitions, avoiding harsh shadows or highlights"
      },
      "lighting": {
        "type": "Soft, diffused lighting",
        "source_direction": "Above and slightly to the right",
        "shadow_style": "Subtle and diffused, no sharp or high-contrast shadows"
      },
      "materials": {
        "surface_texture": "Matte, smooth surfaces with subtle shading",
        "reflectivity": "Low to none, avoiding glossiness"
      },
      "composition": {
        "object_presentation": "Single, central object displayed in isolation with ample negative space",
        "perspective": "Slightly angled, giving a three-dimensional feel without extreme depth",
        "background": "Solid, muted color that complements the object without distraction"
      },
      "typography": {
        "font_style": "Minimalistic, sans-serif",
        "text_placement": "Bottom-left corner with small, subtle text",
        "color": "Gray, low-contrast against the background"
      },
      "rendering_style": {
        "technique": "3D render with simplified, low-poly aesthetics",
        "detail_level": "Medium detail, focusing on form and color over texture or intricacy"
      }
    },
    "purpose": "To create clean, aesthetically pleasing visuals that emphasize simplicity, approachability, and modernity."
  }
}`,
            author: '@0xdlk',
            mode: 'generate'
        },
        {
            title: 'Funko Pop公仔制作',
            previewImage:
                'https://camo.githubusercontent.com/da84e6bb2aa563892aaf37d5c824abd5325d4224231f530dc78c025fb1f0ce02/68747470733a2f2f626962696770742d617070732e636861747669642e61692f63686174696d672f67656d696e692d72657472792d6a437534756d4b5f66356e586d49624a43586838552e706e673f763d31',
            prompt: '把照片中的人物变成 Funko Pop 公仔包装盒的风格，以等距视角（isometric）呈现，并在包装盒上标注标题为"JAMES BOND"。包装盒内展示的是照片中人物形象，旁边搭配有人物的必备物品（手枪、手表、西装、其他）同时，在包装盒旁边还应呈现该公仔本体的实物效果，采用逼真的、具有真实感的渲染风格。',
            author: '@dotey',
            mode: 'edit'
        },
        {
            title: '小红书封面设计',
            previewImage:
                'https://camo.githubusercontent.com/45b01396b09d1b97bab11b9d4b2c4e332c99365f452fef25d4b10c2fb706f5e9/68747470733a2f2f626962696770742d617070732e636861747669642e61692f63686174696d672f67656d696e692d72657472792d4a726f686e4e795552354e31496e4c525a36692d2d2e706e673f763d31',
            prompt: `画图：画一个小红书封面。
要求：
有足够的吸引力吸引用户点击；
字体醒目，选择有个性的字体；
文字大小按重要度分级，体现文案的逻辑结构；
标题是普通文字的至少2倍；
文字段落之间留白。
只对要强调的文字用醒目色吸引用户注意；
背景使用吸引眼球的图案（包括不限于纸张，记事本，微信聊天窗口，选择一种）
使用合适的图标或图片增加视觉层次，但要减少干扰。

文案：重磅！ChatGPT又变强了！
多任务处理更牛✨
编程能力更强💪
创造力爆表🎨
快来试试！

图像9:16比例`,
            author: '@balconychy',
            mode: 'generate'
        },
        {
            title: 'Q版角色表情包制作',
            previewImage:
                'https://camo.githubusercontent.com/22abf72726920d35002e4036762f2202ca332d2055564e76dade4d2e6eebc8b5/68747470733a2f2f626962696770742d617070732e636861747669642e61692f63686174696d672f67656d696e692d624f39614531575976686f397843385845466954582e706e673f763d31',
            prompt: `请创作一套以 [参考图片中的角色] 为主角的Q版表情包，共9个，排列成3x3网格。
设计要求：
- 透明背景。
- 1:1正方形构图。
- 统一的Q版吉卜力卡通风格，色彩鲜艳。
- 每个表情的动作、神态、内容各不相同，需要体现"骚、贱、萌、抓狂"等多样情绪，例如：翻白眼、捶地狂笑、灵魂出窍、原地石化、撒钱、干饭状态、社交恐惧发作等。可融入打工人和网络热梗元素。
- 每个表情形象完整，无残缺。
- 每个表情均带有统一的白色描边，呈现贴纸效果。
- 画面中无多余、分离的元素。
- 严格禁止出现任何文字，或确保文字内容准确无误（优先选择无文字）。`,
            author: '@leon_yuan2001',
            mode: 'edit'
        },
        {
            title: '手办真人同框合影',
            previewImage:
                'https://camo.githubusercontent.com/02ca170c19bd1e53e2042d9f64da3e8f0d60892087d0627aa411a6a19b57165d/68747470733a2f2f626962696770742d617070732e636861747669642e61692f63686174696d672f67656d696e692d72657472792d6254544e6171486d487a4d4d70773849594d4d34512e706e673f763d31',
            prompt: '以手机随手拍摄的日常风格，桌面上摆放着一款 【成龙】动漫手办，动作夸张帅气，装备齐全。同时，真实世界的对应人物也出现在镜头中，与手办摆出相似的姿势，形成手办与真实人物同框的有趣对比效果。整体构图和谐自然，传递温暖且富有生活气息的视觉体验。',
            author: '@dotey',
            mode: 'generate'
        },
        {
            title: '玩具盒中的国家立体模型',
            previewImage:
                'https://camo.githubusercontent.com/1215f2453257e121f2bfa0776ac7b3660740a279a05a0f2f117559939ab5ef5c/68747470733a2f2f626962696770742d617070732e636861747669642e61692f63686174696d672f67656d696e692d72657472792d727a4d546f3838353478763348533368565338384d2e706e673f763d31',
            prompt: '一张超写实的俯拍摄影作品，展示了一个米色纸板盒内的3D打印立体模型，盒盖由两只人手撑开。盒子内部展现了[国家名称]的微缩景观，包含标志性地标、地形、建筑、河流、植被以及大量微小精细的人物模型。该立体模型充满了鲜活且符合地理特征的元素，全部采用触感舒适、玩具般的风格，使用哑光3D打印纹理制作，并带有可见的打印层纹。在顶部，盒盖内侧用大号、色彩鲜艳的凸起塑料字母显示"[国家名称]"字样——每个字母颜色各异，均为亮色。光线温暖且具有电影感，突出了纹理和阴影，营造出一种真实感和魅力，仿佛观看者正在打开一个神奇的国家微缩版本。',
            author: '@TheRelianceAI',
            mode: 'generate'
        },
        {
            title: '复古CRT电脑启动屏幕',
            previewImage:
                'https://camo.githubusercontent.com/adae0abfb4da4e7ab95e1d34e8d2bd2fa8a82bd76da4a7fe1f1db110e31e1886/68747470733a2f2f626962696770742d617070732e636861747669642e61692f63686174696d672f67656d696e692d4b425365574a4a4231456574514e755641427367312e706e673f763d31',
            prompt: '复古CRT电脑启动屏幕，最终显示为[形状或标志]的ASCII艺术。',
            author: '@Gdgtify',
            mode: 'generate'
        },
        {
            title: '二次元风格徽章',
            previewImage:
                'https://camo.githubusercontent.com/09dc9c6a5bc182d9a4f1d38668afd09cb1fb100436a1e9d2c476b2ea163b34fb/68747470733a2f2f626962696770742d617070732e636861747669642e61692f63686174696d672f67656d696e692d72657472792d43612d35594a3436793461397373634e61785945752e706e673f763d31',
            prompt: `基于附件中的人物，生成一个二次元风格的徽章的照片，要求：
材质：流苏
形状：圆形
画面主体：一只手手持徽章`,
            author: '@Alittlefatwhale',
            mode: 'edit'
        },
        {
            title: '3D Q版中式婚礼图',
            previewImage:
                'https://camo.githubusercontent.com/7f61e4301bcbc9eb3a7dcbbe569ed2233690a754bf7c704116bee4a79447cf1d/68747470733a2f2f626962696770742d617070732e636861747669642e61692f63686174696d672f67656d696e692d784c734937614b347a7956576352774a34366132452e706e673f763d31',
            prompt: `将照片里的两个人转换成Q版 3D人物，中式古装婚礼，大红颜色，背景“囍”字剪纸风格图案。 服饰要求：写实，男士身着长袍马褂，主体为红色，上面以金色绣龙纹图案，彰显尊贵大气 ，胸前系着大红花，寓意喜庆吉祥。女士所穿是秀禾服，同样以红色为基调，饰有精美的金色花纹与凤凰刺绣，展现出典雅华丽之感 ，头上搭配花朵发饰，增添柔美温婉气质。二者皆为中式婚礼中经典着装，蕴含着对新人婚姻美满的祝福。 头饰要求： 男士：中式状元帽，主体红色，饰有金色纹样，帽顶有精致金饰，尽显传统儒雅庄重。 女士：凤冠造型，以红色花朵为中心，搭配金色立体装饰与垂坠流苏，华丽富贵，古典韵味十足。`,
            author: '@balconychy',
            mode: 'edit'
        },
        {
            title: '讽刺海报生成',
            previewImage:
                'https://camo.githubusercontent.com/8196596a8cd42fb558ff6d837c11acc9b045ed52950018f48aecd6f9baea1660/68747470733a2f2f626962696770742d617070732e636861747669642e61692f63686174696d672f67656d696e692d72657472792d78476d4e673168674a59307579467433727a32634b2e706e673f763d31',
            prompt: '为我生成讽刺海报：GPT 4o 狂卷，都别干图像AI了 还是送外卖吧',
            author: '@ZHO_ZHO_ZHO',
            mode: 'generate'
        },
        {
            title: '海贼王主题手办制作',
            previewImage:
                'https://camo.githubusercontent.com/45bd9478d1743c7da4b2e761686a955db15956203a12355a3a6ec32d1a4671fc/68747470733a2f2f626962696770742d617070732e636861747669642e61692f63686174696d672f67656d696e692d4e7643545151557130354f57366f4b4835717752712e706e673f763d31',
            prompt: '把照片中的人物变成《海贼王》（One Piece）动漫主题手办包装盒的风格，以等距视角（isometric）呈现。包装盒内展示的是基于照片人物的《海贼王》动漫画风设计的形象，旁边搭配有日常必备物品（手枪、手表、西装和皮鞋）同时，在包装盒旁边还应呈现该手办本体的实物效果，采用逼真的、具有真实感的渲染风格。',
            author: '@dotey',
            mode: 'edit'
        },
        {
            title: '3D Q版风格转换',
            previewImage:
                'https://camo.githubusercontent.com/b4bcf766d8e48c5bc7c4182b3139eb084bb7cec7acf2742456f94167dac6170c/68747470733a2f2f626962696770742d617070732e636861747669642e61692f63686174696d672f67656d696e692d44543877756b783266484863727858516f7361524C2e706e673f763d31',
            prompt: '将场景中的角色转化为3D Q版风格，同时保持原本的场景布置和服装造型不变。',
            author: '@dotey',
            mode: 'edit'
        },
        {
            title: '3D情侣珠宝盒摆件',
            previewImage:
                'https://camo.githubusercontent.com/df1beca498c52bcfa41327ebeb14c56763c588c716300d8613539074147d8ebf/68747470733a2f2f626962696770742d617070732e636861747669642e61692f63686174696d672f67656d696e692d72657472792d595758586c5344524d3956547a69512d49413257532e706e673f763d31',
            prompt: '根据照片上的内容打造一款细致精美、萌趣可爱的3D渲染收藏摆件，装置在柔和粉彩色调、温馨浪漫的展示盒中。展示盒为浅奶油色搭配柔和的金色装饰，形似精致的便携珠宝盒。打开盒盖，呈现出一幕温暖浪漫的场景：两位Q版角色正甜蜜相望。盒顶雕刻着"FOREVER TOGETHER"（永远在一起）的字样，周围点缀着小巧精致的星星与爱心图案。盒内站着照片上的女性，手中捧着一束小巧的白色花束。她的身旁是她的伴侣，照片上的男性。两人都拥有大而闪亮、充满表现力的眼睛，以及柔和、温暖的微笑，传递出浓浓的爱意和迷人的气质。他们身后有一扇圆形窗户，透过窗户能看到阳光明媚的中国古典小镇天际线和轻柔飘浮的云朵。盒内以温暖的柔和光线进行照明，背景中漂浮着花瓣点缀气氛。整个展示盒和角色的色调优雅和谐，营造出一个奢华而梦幻的迷你纪念品场景。尺寸：9:16',
            author: '@dotey',
            mode: 'edit'
        },
        {
            title: 'PS2游戏封面设计',
            previewImage:
                'https://camo.githubusercontent.com/3f248c16a8ae37a2dd3b180de503c25462acf9782d6461d1b0edf65542857969/68747470733a2f2f626962696770742d617070732e636861747669642e61692f63686174696d672f67656d696e692d71564b36666d2d66503861342d6772616e642e6a706567',
            prompt: '你能制作一个PS2游戏封面的图像吗？标题为《Grand Theft Auto: Far Far Away》。是一个设定在《怪物史瑞克》宇宙中的GTA风格游戏。',
            author: '@dotey',
            mode: 'generate'
        },
        {
            title: '讽刺漫画海报',
            previewImage:
                'https://camo.githubusercontent.com/b450db45bb2cffbb6e6f42516630155401b25208160f6af68336aa31f2719db3/68747470733a2f2f626962696770742d617070732e636861747669642e61692f63686174696d672f67656d696e692d72657472792d5a383347426f555433447763766f4e3573486d30732e706e673f763d31',
            prompt: '一幅讽刺漫画风格的插画，采用复古美式漫画风格，背景是一个多层货架，货架上都是一样的红色棒球帽，帽子正面印有大字标语"MAKE AMERICA GREAT AGAIN"，帽侧贴着白色标签写着"MADE IN CHINA"，特写视角聚焦其中一顶红色棒球帽。画面下方有价格牌，原价"$50.00"被粗黑线X划掉，改为"$77.00"，色调为怀旧的土黄与暗红色调，阴影处理带有90年代复古印刷质感。整体构图风格夸张讽刺，具讽刺政治消费主义的意味。',
            author: '@dotey',
            mode: 'generate'
        },
        {
            title: '极简未来主义海报',
            previewImage:
                'https://camo.githubusercontent.com/5d7cb4d2dcddebaf3c75181114572a68ed32d8b0f19ae8a307b8a64e8e8fdaed/68747470733a2f2f626962696770742d617070732e636861747669642e61692f63686174696d672f67656d696e692d44744c41687231316758524c4870723667657744772e706e673f763d31',
            prompt: '一张纵向（3∶4）4K 分辨率的极简未来主义展览海报，背景为超浅冷灰 #f4f4f4。海报中心有一枚流体 3D metaball，形态为【立体可口可乐经典汽水瓶】，材质磨砂玻璃并带细腻颗粒噪点。 流体渐变：Coca-Cola 红 #E41C23 → 珍珠白 #FFFFFF，呈现丝滑玻璃质感。高位 softbox 柔光照明，投射长而柔的彩色阴影与淡淡光晕。流体叠在文字之上，被遮挡的字母透过磨砂玻璃呈轻微高斯模糊。主标题 "Coca-Cola" 经典红色 logo 位于中部，被唯一的流体部分遮挡；被遮挡的字母透过磨砂玻璃呈轻微高斯模糊。副标题，Modern sans-serif 粗体全大写纯黑字体： "TASTE THE FEELING" 位于主标题下方，同样被流体局部覆盖并产生模糊，其余部分锐利。整体留白干净、构图平衡、焦点锐利、HDR 高动态范围。',
            author: '@ZHO_ZHO_ZHO',
            mode: 'generate'
        },
        {
            title: '未来主义 Logo 交易卡',
            previewImage:
                'https://camo.githubusercontent.com/0afc8cf29d0ba2c44d7c8fb4848e2daecad2716417bcf9d55e68b7de1177d440/68747470733a2f2f626962696770742d617070732e636861747669642e61692f63686174696d672f67656d696e692d51474351316a6a754e6f4b59677746446f363171572e706e673f763d31',
            prompt: `{
    "prompt": "A futuristic trading card with a dark, moody neon aesthetic and soft sci-fi lighting. The card features a semi-transparent, rounded rectangle with slightly muted glowing edges, appearing as if made of holographic glass. At the center is a large glowing logo of {{logo}}, with no additional text or label, illuminated with a smooth gradient of {{colors}}, but not overly bright. The reflections on the card surface should be subtle, with a slight glossy finish catching ambient light. The background is a dark carbon fiber texture or deep gradient with soft ambient glows bleeding into the edges. Add subtle light rays streaming down diagonally from the top, giving the scene a soft cinematic glow. Apply light motion blur to the edges and reflections to give the scene a sense of depth and energy, as if it's part of a high-end tech animation still. Below the card, include realistic floor reflections that mirror the neon edges and logo—slightly diffused for a grounded, futuristic look. Text elements are minimal and softly lit: top-left shows '{{ticker}}', top-right has a stylized signature, and the bottom displays '{{company_name}}' with a serial number '{{card_number}}', a revenue badge reading '{{revenue}}', and the year '{{year}}'. Typography should have a faint glow with slight blurring, and all elements should feel premium, elegant, and softly illuminated—like a high-end cyberpunk collectible card.",
    "style": {
        "lighting": "Neon glow, soft reflections",
        "font": "Modern sans-serif, clean and minimal",
        "layout": "Centered, structured like a digital collectible card",
        "materials": "Glass, holographic plastic, glowing metal edges"
    },
    "parameters": {
        "logo": "Tesla logo",
        "ticker": "TSLA",
        "company_name": "Tesla Inc.",
        "card_number": "#0006",
        "revenue": "$96.8B",
        "year": "2025",
        "colors": [
            "red",
            "white",
            "dark gray"
        ]
    },
    "medium": "3D render, high-resolution digital art",
    "size": "1080px by 1080px"
}`,
            author: '@hewarsaber',
            mode: 'generate'
        },
        {
            title: '乐高人偶收藏展示',
            previewImage:
                'https://camo.githubusercontent.com/cc9df32f0e08a8453b0b6868196e4ff16b75452235dadc8447b1a6b74b127ddf/68747470733a2f2f626962696770742d617070732e636861747669642e61692f63686174696d672f67656d696e692d2d4766547a64575162454d4c44694a69524c5a30542e706e673f763d31',
            prompt: '根据我上传的照片，生成一张纵向比例的照片，使用以下提示词：经典乐高人偶风格，一个微缩场景 —— 一只动物站在我身旁。这只动物的配色与我相匹配。请根据你对我的理解来创造这只动物（你可以选择任何你认为适合我的动物，不论是真实存在的，还是超现实的、幻想的，只要你觉得符合我的气质即可）。整个场景设定在一个透明玻璃立方体内，布景极简。微缩场景的底座是哑光黑色，配以银色装饰，风格简约且时尚。底座上有一块优雅雕刻的标签牌，字体为精致的衬线体，上面写着该动物的名称。底部设计中还巧妙融入了类似自然历史博物馆展示的生物学分类信息，以精细蚀刻的方式呈现。整体构图像是一件高端收藏艺术品：精心打造、策展般呈现、灯光细致。构图重在平衡。背景为渐变色，从深色到浅色过渡（颜色基于主色调进行选择）。',
            author: '@ZHO_ZHO_ZHO',
            mode: 'edit'
        },
        {
            title: '证件照',
            previewImage: 'https://i.mji.rip/2025/09/04/5258e0b792acebf8096aa4da3462a952.png',
            prompt: '截取图片人像头部，帮我做成 2 寸证件照，要求： 1、白底 2、职业正装 3、正脸 4、完全保持人物面部特征一致，仅改变姿态与构图，面部依旧保留原有神态，只在角度和光线中体现变化，局部捕捉颧骨、眉毛、眼神、鼻子、嘴唇的细节 5、保留面部皮肤轻微瑕疵，不要过度磨皮',
            author: 'LinuxDO@synbio',
            mode: 'edit'
        },
        {
            title: '个性化房间设计',
            previewImage:
                'https://camo.githubusercontent.com/f86750e53827b3ce50daf102593abaa544806ce443edccdc54e759ef06c05977/68747470733a2f2f626962696770742d617070732e636861747669642e61692f63686174696d672f67656d696e692d676a6577334e754467686a4364544e34684e6341642e706e673f763d31',
            prompt: '为我生成我的房间设计（床、书架、沙发、绿植、电脑桌和电脑），墙上挂着绘画，窗外是城市夜景。可爱 3d 风格，c4d 渲染，轴测图。',
            author: '@ZHO_ZHO_ZHO',
            mode: 'generate'
        },
        {
            title: '角色穿越传送门',
            previewImage:
                'https://camo.githubusercontent.com/297007cc08e969ba065b44308e454075552508bbcf677faf519d46619d4e8cd0/68747470733a2f2f626962696770742d617070732e636861747669642e61692f63686174696d672f67656d696e692d5f4e4b77475857726e766e326c6b547964394263572e706e673f763d31',
            prompt: '照片中的角色的 3D Q 版形象穿过传送门，牵着观众的手，在将观众拉向前时动态地回头一看。传送门外的背景是观众的现实世界，一个典型的程序员的书房，有书桌，显示器和笔记本电脑，传送门内是角色所处的3D Q 版世界，细节可以参考照片，整体呈蓝色调，和现实世界形成鲜明对比。传送门散发着神秘的蓝色和紫色色调，是两个世界之间的完美椭圆形框架处在画面中间。从第三人称视角拍摄的摄像机角度，显示观看者的手被拉入角色世界。2：3 的宽高比。',
            author: '@dotey',
            mode: 'edit'
        },
        {
            title: '键盘ESC键帽微型立体模型',
            previewImage:
                'https://camo.githubusercontent.com/9f0c33dd9099b066abdd4c0ac9576849e8e19aeef0abce2d7e7f68b0155d5f7f/68747470733a2f2f626962696770742d617070732e636861747669642e61692f63686174696d672f67656d696e692d4f6473416132526b67336555376162616b47664e5a2e706e673f763d31',
            prompt: '一个超写实的等距视角 3D 渲染图，展示了一个微型电脑工作空间，置于一个半透明的机械键盘键帽内，键帽特别放置在一块真实哑光表面的机械键盘的 ESC 键上。键帽内部，一个穿着舒适、有纹理连帽衫的小人坐在现代人体工学椅上，正专注地面对一块发光的超写实电脑屏幕工作。整个空间布满了逼真的微型科技配件：真实材质的台灯、带有反射效果的显示器、微小的扬声器格栅、缠绕的电缆以及陶瓷杯子。场景底部由土壤、岩石和苔藓构成，拥有照片级的材质质感和自然瑕疵。键帽内的光照模拟清晨自然阳光，投下柔和阴影与温暖光调；而键帽外部则受周围键盘环境的冷色调反射影响。"ESC"字样以微弱的磨砂玻璃效果蚀刻在半透明键帽顶部——根据视角不同，仅隐约可见。周围的按键如 F1、Q、Shift 和 CTRL 均清晰可见，拥有真实材质纹理与光照。整体画面仿佛由高端手机相机拍摄，具备浅景深、完美白平衡与电影感细节。',
            author: '@egeberkina',
            mode: 'generate'
        },
        {
            title: '超写实3D游戏',
            previewImage:
                'https://camo.githubusercontent.com/55783ce93783423b98d2172c6ef9effd875a9d09280f27ba1c0d690ebb9b56ae/68747470733a2f2f626962696770742d617070732e636861747669642e61692f63686174696d672f67656d696e692d726c7072726d7067725759787a6347464736634e352e706e673f763d31',
            prompt: `超写实的 3D 渲染画面，重现了2008年《命令与征服：红色警戒3》中娜塔莎的角色设计，完全依照原版建模。场景设定在一个昏暗杂乱的2008年代卧室里，角色正坐在地毯上，面对一台正在播放《命令与征服：红色警戒3》的老式电视和游戏机手柄。

整个房间充满了2008年代的怀旧氛围：零食包装袋、汽水罐、海报以及纠缠在一起的电线。娜塔莎·沃尔科娃在画面中被抓拍到转头的一瞬，回眸看向镜头，她那标志性的空灵美丽面容上带着一抹纯真的微笑。她的上半身微微扭转，动态自然，仿佛刚刚被闪光灯惊到而做出的反应。

闪光灯轻微地过曝了她的脸和衣服，使她的轮廓在昏暗的房间中更加突出。整张照片显得原始而自然，强烈的明暗对比在她身后投下深邃的阴影，画面充满触感，带有一种真实的2008年胶片快照的模拟质感。`,
            author: '@ZHO_ZHO_ZHO',
            mode: 'generate'
        },
        {
            title: '创意丝绸宇宙',
            previewImage:
                'https://github.com/JimmyLv/awesome-nano-banana/blob/main/cases/66/example_silk_creation_universe.png?raw=true',
            prompt: `将 {❄️} 变成一个柔软的 3D 丝绸质感物体。整个物体表面包裹着顺滑流动的丝绸面料，带有超现实的褶皱细节、柔和的高光与阴影。该物体轻轻漂浮在干净的浅灰色背景中央，营造出轻盈优雅的氛围。整体风格超现实、触感十足且现代，传递出舒适与精致趣味的感觉。工作室灯光，高分辨率渲染。`,
            author: '@ZHO_ZHO_ZHO',
            mode: 'generate'
        },
        {
            title: '奇幻水下场景冰棒',
            previewImage:
                'https://camo.githubusercontent.com/1aa5213feeea6cc3523485a64ad969460b11922621efc8983854ef0f3f19489a/68747470733a2f2f626962696770742d617070732e636861747669642e61692f63686174696d672f67656d696e692d736c654d554a47305f736d665968554a3078397a6b2e706e673f763d31',
            prompt: `倾斜的第一人称视角拍摄，一只手握着一支超现实的冰棒。冰棒有着透明的蓝色外壳，里面展现了一个水下场景：一个小潜水员、几条小鱼和漂浮的气泡，还有翻滚的海浪，一根绿色的冰棒棍贯穿中心。冰棒略微融化，底部是一根木棍，手正握着这根木棍。背景是柔焦的纽约街景，采用高端产品摄影风格。`,
            author: '@madpencil_',
            mode: 'generate'
        },
        {
            title: '蒸汽朋克机械鱼',
            previewImage:
                'https://camo.githubusercontent.com/32ff5cbbf59d055b08ba4e578d90692fb0f48c3cc8128177e63006a9179fd8aa/68747470733a2f2f626962696770742d617070732e636861747669642e61692f63686174696d672f67656d696e692d4e774b48536b6f62475a7551756154667a596e6b6b2e706e673f763d31',
            prompt: `一个蒸汽朋克风格的机械鱼，身体为黄铜风格，可以清楚的看到其动作时的机械齿轮结构。
能略微看到它的机械牙齿，整齐并且紧闭，上下牙齿都可以看到。每颗牙齿均呈三角状，材质为金刚石。
尾鳍为金属丝编织结构，其它部分的鱼鳍是半透明的琥珀色玻璃，其中有一些不太明显的气泡。
眼睛是多面红宝石，能清晰的看到它反射出来的光泽。
鱼有身上能清晰的看到"f-is-h"字样，其中字母全部为小写，并且注意横线位置。
图片是正方形的，整个画面中可以看到鱼的全身，在画面正中，鱼头向右，并且有一定的留白画面并不局促，画面的左右留出更多的空间。背景中有淡淡的蒸汽朋克风的齿轮纹理。
整个鱼看起非常炫酷。这是一张高清图片，整张照片的细节非常丰富，并且有独特的质感与美感。画面不要太暗。`,
            author: '@f-is-h',
            mode: 'generate'
        },
        {
            title: '拍立得照片出框效果',
            previewImage:
                'https://camo.githubusercontent.com/7f362f5b4cf2ada98d76ee033f5fa18226c5ab99c5a2188ae8c897039d654bfa/68747470733a2f2f626962696770742d617070732e636861747669642e61692f63686174696d672f67656d696e692d5f6372464d6f353774544a317474506b50437465312e706e673f763d31',
            prompt: '将场景中的角色转化为3D Q版风格，放在一张拍立得照片上，相纸被一只手拿着，照片中的角色正从拍立得照片中走出，呈现出突破二维相片边框、进入二维现实空间的视觉效果。',
            author: '@dotey',
            mode: 'edit'
        },
        {
            title: '3D 装修场景',
            previewImage: 'https://i.mji.rip/2025/09/04/bf081bdb4072953231fec5dd24bbf1b6.png',
            prompt: 'モダンな建築プレゼンの高度にリアルなイメージ。大きな白紙の上に詳細な2D白黒間取り図が平面で配置され、技術的な線と寸法が描かれている。その図面の上に、同じアパートの3Dレンダリングがホログラムのように半透明で浮かび、フォトリアリスティックに表現されている。3Dモデルはリビング、キッチン、ベッドルームを家具付きで示し、テクスチャや素材も明確。下の平面図と上の完成した3Dモデルのコントラストが、設計プロセス「図面から現実へ」を強調。柔らかな環境光、微妙な影、紙上の反射がリアルさを増す。超高解像度。フォトリアリスティックスタイル。建築ビジュアライゼーション。シネマティックな構図。エレガントで未来的なムード。',
            author: 'LinuxDO@freebsdfx',
            mode: 'edit'
        }
    ]

    function showModal() {
        if (!modal) {
            modal = createModal()
            document.body.appendChild(modal)
        }
        modal.style.display = 'flex'
        applyFilters() // Re-apply filters to reflect any state changes
    }

    function isMobile() {
        return window.innerWidth <= 768
    }

    function createModal() {
        const colors = getThemeColors(getCurrentTheme())
        const mobile = isMobile()

        const modal = document.createElement('div')
        modal.id = 'prompts-modal'
        modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 1000;'

        const container = document.createElement('div')
        container.style.cssText = `background: ${colors.background}; border-radius: ${mobile ? '12px 12px 0 0' : '8px'}; box-shadow: 0 8px 32px ${colors.shadow}; max-width: ${mobile ? '100%' : '900px'}; width: ${mobile ? '100%' : '90%'}; max-height: ${mobile ? '90vh' : '85vh'}; display: flex; flex-direction: column; ${mobile ? 'margin-top: auto;' : ''}`
        container.onclick = (e) => e.stopPropagation()

        const searchSection = document.createElement('div')
        searchSection.style.cssText = `padding: ${mobile ? '16px' : '20px 24px'}; border-bottom: 1px solid ${colors.border}; display: flex; ${mobile ? 'flex-direction: column; gap: 12px;' : 'align-items: center; gap: 16px;'}`

        const searchInput = document.createElement('input')
        searchInput.type = 'text'
        searchInput.id = 'prompt-search'
        searchInput.placeholder = '搜索提示...'
        searchInput.style.cssText = `${mobile ? 'width: 100%;' : 'flex: 1;'} padding: ${mobile ? '12px 16px' : '10px 16px'}; border: 1px solid ${colors.inputBorder}; border-radius: 12px; outline: none; font-size: ${mobile ? '16px' : '14px'}; background: ${colors.inputBg}; color: ${colors.text}; box-sizing: border-box;`

        searchInput.addEventListener('focus', () => {
            searchInput.style.borderColor = colors.primary
        })
        searchInput.addEventListener('blur', () => {
            const currentColors = getThemeColors(getCurrentTheme())
            searchInput.style.borderColor = currentColors.inputBorder
        })

        const filterContainer = document.createElement('div')
        filterContainer.style.cssText = `display: flex; gap: 8px; ${mobile ? 'justify-content: center; flex-wrap: wrap;' : ''}`

        const filters = [
            { key: 'favorite', label: '收藏', active: false },
            { key: 'generate', label: '生图', active: false },
            { key: 'edit', label: '编辑', active: false }
        ]

        filters.forEach(filter => {
            const btn = document.createElement('button')
            btn.id = `filter-${filter.key}`
            btn.textContent = filter.label
            btn.style.cssText = `padding: ${mobile ? '10px 16px' : '8px 16px'}; border: 1px solid ${colors.border}; border-radius: 16px; background: ${colors.surface}; color: ${colors.text}; font-size: ${mobile ? '14px' : '13px'}; cursor: pointer; transition: all 0.2s; white-space: nowrap; touch-action: manipulation;`
            btn.onclick = () => toggleFilter(filter.key)
            filterContainer.appendChild(btn)
        })

        searchSection.appendChild(searchInput)
        searchSection.appendChild(filterContainer)

        const content = document.createElement('div')
        content.style.cssText = `flex: 1; overflow-y: auto; padding: ${mobile ? '16px' : '20px 24px 32px 24px'}; -webkit-overflow-scrolling: touch;`

        const grid = document.createElement('div')
        grid.id = 'prompts-grid'
        grid.style.cssText = `display: grid; grid-template-columns: ${mobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)'}; gap: ${mobile ? '12px' : '16px'};`

        content.appendChild(grid)
        container.appendChild(searchSection)
        container.appendChild(content)
        modal.appendChild(container)

        modal.addEventListener('click', hideModal)

        if (mobile) {
            modal.addEventListener('touchstart', (e) => {
                if (e.target === modal) {
                    hideModal()
                }
            })
        }

        return modal
    }

    function hideModal() {
        if (modal) {
            modal.style.display = 'none'
        }
    }

    let activeFilters = new Set()

    function toggleFilter(filterKey) {
        const btn = document.getElementById(`filter-${filterKey}`)
        const colors = getThemeColors(getCurrentTheme())
        const mobile = isMobile()

        if (activeFilters.has(filterKey)) {
            activeFilters.delete(filterKey)
            btn.style.cssText = `padding: ${mobile ? '10px 16px' : '8px 16px'}; border: 1px solid ${colors.border}; border-radius: 16px; background: ${colors.surface}; color: ${colors.text}; font-size: ${mobile ? '14px' : '13px'}; cursor: pointer; transition: all 0.2s; white-space: nowrap; touch-action: manipulation;`
        } else {
            activeFilters.add(filterKey)
            btn.style.cssText = `padding: ${mobile ? '10px 16px' : '8px 16px'}; border: 1px solid ${colors.primary}; border-radius: 16px; background: ${colors.primary}; color: white; font-size: ${mobile ? '14px' : '13px'}; cursor: pointer; transition: all 0.2s; white-space: nowrap; touch-action: manipulation;`
        }

        applyFilters()
    }

    function applyFilters() {
        const searchInput = document.getElementById('prompt-search')
        const keyword = searchInput.value.toLowerCase()

        let filtered = quickPrompts.filter(prompt => {
            const matchesSearch = !keyword ||
                prompt.title.toLowerCase().includes(keyword) ||
                prompt.prompt.toLowerCase().includes(keyword) ||
                prompt.author.toLowerCase().includes(keyword)

            if (!matchesSearch) return false

            if (activeFilters.size === 0) return true

            const favorites = getFavorites()
            const promptId = `${prompt.title}-${prompt.author}`
            const isFavorite = favorites.includes(promptId)

            return Array.from(activeFilters).every(filter => {
                if (filter === 'favorite') return isFavorite
                if (filter === 'generate') return prompt.mode === 'generate'
                if (filter === 'edit') return prompt.mode === 'edit'
                return false
            })
        })

        renderPrompts(filtered)
    }

    function renderPrompts(prompts) {
        const grid = document.getElementById('prompts-grid')

        while (grid.firstChild) {
            grid.removeChild(grid.firstChild)
        }

        const favorites = getFavorites()
        const sortedPrompts = prompts.sort((a, b) => {
            const aId = `${a.title}-${a.author}`
            const bId = `${b.title}-${b.author}`
            const aIsFavorite = favorites.includes(aId)
            const bIsFavorite = favorites.includes(bId)

            if (aIsFavorite && !bIsFavorite) return -1
            if (!aIsFavorite && bIsFavorite) return 1
            return 0
        })

        sortedPrompts.forEach(prompt => {
            const card = createPromptCard(prompt)
            grid.appendChild(card)
        })
    }

    function createPromptCard(prompt) {
        const promptId = `${prompt.title}-${prompt.author}`
        const isFavorite = getFavorites().includes(promptId)
        const colors = getThemeColors(getCurrentTheme())
        const theme = getCurrentTheme()
        const mobile = isMobile()

        const card = document.createElement('div')
        card.className = 'prompt-card'
        card.style.cssText = `background: ${colors.surface}; border-radius: 8px; border: 1px solid ${colors.border}; cursor: pointer; overflow: hidden; transition: box-shadow 0.2s; aspect-ratio: 4/5; position: relative; touch-action: manipulation;`

        card.addEventListener('mouseenter', () => {
            if (!mobile) card.style.boxShadow = `0 2px 8px ${colors.shadow}`
        })
        card.addEventListener('mouseleave', () => {
            if (!mobile) card.style.boxShadow = 'none'
        })

        const img = document.createElement('img')
        img.src = prompt.previewImage
        img.alt = prompt.title
        img.style.cssText = 'width: 100%; height: 65%; object-fit: cover;'
        img.onclick = () => insertPrompt(prompt.prompt)

        const favoriteBtn = document.createElement('button')
        const favBtnBg = isFavorite
            ? 'rgba(255,193,7,0.9)'
            : theme === 'dark'
                ? 'rgba(48,49,52,0.9)'
                : 'rgba(255,255,255,0.9)'
        const favBtnColor = isFavorite
            ? '#000'
            : theme === 'dark'
                ? '#e8eaed'
                : '#5f6368'

        favoriteBtn.style.cssText = `position: absolute; top: 8px; right: 8px; width: ${mobile ? '32px' : '28px'}; height: ${mobile ? '32px' : '28px'}; border-radius: 50%; border: none; background: ${favBtnBg}; color: ${favBtnColor}; font-size: ${mobile ? '16px' : '14px'}; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; box-shadow: 0 2px 4px rgba(0,0,0,0.2); touch-action: manipulation;`
        favoriteBtn.textContent = isFavorite ? '⭐' : '☆'
        favoriteBtn.onclick = (e) => {
            e.stopPropagation()
            toggleFavorite(promptId)
        }

        if (!mobile) {
            favoriteBtn.addEventListener('mouseenter', () => {
                favoriteBtn.style.transform = 'scale(1.1)'
            })
            favoriteBtn.addEventListener('mouseleave', () => {
                favoriteBtn.style.transform = 'scale(1)'
            })
        }

        const content = document.createElement('div')
        content.style.cssText = 'padding: 12px; height: 35%; display: flex; flex-direction: column; justify-content: space-between;'

        const title = document.createElement('h3')
        title.style.cssText = `font-size: ${mobile ? '15px' : '14px'}; font-weight: 500; color: ${colors.text}; margin: 0; line-height: 1.4; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;`
        title.textContent = prompt.title
        title.onclick = () => insertPrompt(prompt.prompt)

        const bottomRow = document.createElement('div')
        bottomRow.style.cssText = 'display: flex; justify-content: space-between; align-items: center;'

        const author = document.createElement('span')
        author.style.cssText = `font-size: ${mobile ? '13px' : '12px'}; color: ${colors.textSecondary}; font-weight: 400;`
        author.textContent = prompt.author
        author.onclick = () => insertPrompt(prompt.prompt)

        const modeTag = document.createElement('span')
        modeTag.style.cssText = `background: ${prompt.mode === 'edit' ? '#e8f0fe' : '#e6f4ea'}; color: ${prompt.mode === 'edit' ? '#1967d2' : '#137333'}; padding: 4px 8px; border-radius: 12px; font-size: ${mobile ? '12px' : '11px'}; font-weight: 500;`
        modeTag.textContent = prompt.mode === 'edit' ? '编辑' : '生图'

        bottomRow.appendChild(author)
        bottomRow.appendChild(modeTag)
        content.appendChild(title)
        content.appendChild(bottomRow)
        card.appendChild(img)
        card.appendChild(favoriteBtn)
        card.appendChild(content)

        return card
    }

    function insertPrompt(promptText) {
        const textarea = findPromptInput()
        if (textarea) {
            textarea.value = promptText
            textarea.dispatchEvent(new Event('input', { bubbles: true }))
            hideModal()
        }
    }

    function getFavorites() {
        const favorites = localStorage.getItem('banana-favorites')
        return favorites ? JSON.parse(favorites) : []
    }

    function toggleFavorite(promptId) {
        const favorites = getFavorites()
        const index = favorites.indexOf(promptId)

        if (index > -1) {
            favorites.splice(index, 1)
        } else {
            favorites.push(promptId)
        }

        localStorage.setItem('banana-favorites', JSON.stringify(favorites))
        applyFilters()
    }

    window.addEventListener('load', function () {
        waitForElements()
    })

    window.addEventListener('popstate', function () {
        setTimeout(() => {
            const existingBtn = document.getElementById('banana-btn')
            const runBtn = findRunButton()

            if (!existingBtn && runBtn) {
                console.log('页面切换后重新添加香蕉按钮')
                initBananaButton(runBtn)
            }
        }, 1000)
    })
})()
