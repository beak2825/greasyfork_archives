// ==UserScript==
// @name         🌟 超星学习通AI自动化助手｜📀 自动刷章节视频｜📚 章节测验自动提交｜🤖 智能作业答题｜💎 极致简洁​​
// @namespace    http://tampermonkey.net/
// @version      2.6.4
// @description  集成DeepSeek大模型，题目识别精准，作答快速。自动完成所有任务点，界面简洁，稳定可靠，为用户提供一站式自动化学习方案。
// @author       aroe
// @match        *://*.chaoxing.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @connect      api.116611.xyz
// @resource     typrMd5Lib https://116611.xyz/typr-md5.js
// @resource     fontTableData https://116611.xyz/table.json
// @license CC-BY-NC-ND-4.0
// @antifeature  payment  脚本存在第三方答题接口付费功能
// @icon         data:image/x-icon;base64,AAABAAEAgIAAAAEAIAAoCAEAFgAAACgAAACAAAAAAAEAAAEAIAAAAAAAAAABAMMOAADDDgAAAAAAAAAAAAD//P////v/////+P////T///7///39+/////b/+P79/9jf+f+fn+P/aGTX/0U95v8vJOb/Jxvn/yYc7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JRzu/yQb7f8mHe//Oy3t/1tR4f+IiuP/x873//H4///+/////f34//799f////z///7///39///6/f//+/7///7+9f///vz///v///38/v/6/v7//////9vX+/9/c+r/RDXU/ysb2P8lFOX/JBXr/yYa7v8mG+v/JRvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yMa7P8kG+3/JBvt/yMa7P8nHeP/Jhji/yMS5/80JOT/ZV3h/7y88v/5/v///v/7//7++P////r/+//+//n+///6/f///f3z////+f/7+f7/9vn+//P8//+hneb/PirW/x4S3v8kGOv/JBn2/yEY+f8gGfb/IBzt/yIe6P8kG+z/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yUW+P8jGPf/IB7v/x0Z8f8bD+r/Kx7T/3h04f/n5v///v/9//f7+f/2/PT/+/7+//39///++///+/j///j/+//t9/7/eHfZ/yIS2P8mGu3/JCLl/yEg6P8eHev/HRzu/x4c7/8gHO7/Ihzt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/Ix3p/yEe6P8dHur/HB/p/yEj6P8nIeX/IhDk/1FE3v/X1/X/9vz///j9+v////r///7////8/P/6/vj/9Pf//3Rq2f8hENr/Ix35/xsb8P8mGPL/JRrw/yIc7P8hHev/Ixzs/yUb7v8nGe//JRvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7v8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8mG+3/Jhzq/yUd6f8kHO7/JBnz/yQX8f8pHvD/IBfc/0pD0v/Y2Pn////9//799/////z/+/n5//X/+/+Cf+r/JxTW/y4f7P8dG+z/HCHm/ycZ8f8nGu//Jhzr/yUd6f8mHen/Jx3q/ycc6/8mGu3/JRru/yUa7v8lGu7/JRru/yUa7v8lGu7/JBzr/yUb7P8mGu//KBru/yga7v8oGfD/KBvt/yYc6/8kG+3/JRvu/yUb7f8kG+3/Ihzs/yEh5P8iIuL/JRvu/yUa7v8lGu7/JRru/yUa7v8lGu7/JRru/yUa7v8lGu7/JRru/yUa7v8lGu7/JRru/yUa7v8mGvD/KB/l/yce5v8oFvb/Jxjy/yUf5f8jGvH/Jhjy/ygZ7/8mG+3/JB7o/yMa8P8jHer/IyHi/yQd6f8lGu7/JRru/yUa7v8lGu7/JRru/yUa7v8lGu7/JRru/yUa7v8lGu7/JRru/yUa7v8lGu7/JRvt/yQf5v8kHuj/JRnw/yYY8/8mGu//JRvt/yMZ8v8jGPT/Ixnz/yQa8P8lHer/Jh7m/yYd6P8mGu7/JRnx/yQb7f8kHuj/JR/n/ycc6/8oGe//Kxjx/yoZ7/8mGu7/JRru/yUa7v8lGu7/JRru/yUa7v8lGu7/JRnx/yUZ8P8kG+7/Ixzs/yMd6/8iHer/Ixzr/ygX8/8rFvX/Kxnu/ysa7P8qGfD/Jxnz/yMa8f8mHfP/HxjX/1ZP1//o6f7//f/9///8/P//////sr3v/yEa2/8mIOb/KB3p/yUZ8/8hHur/Ix3q/yMc6/8kHOv/JBzr/yQc6/8jHOv/Ixzr/yQc6/8kHOv/JBzr/yQc6/8kHOv/JBzr/yQd6/8jIOX/IyDm/yQe6f8lHer/Jhvu/ycZ8f8oGu7/Jhvt/yQa7/8lHOz/JR3q/yQc7P8iGvH/IBzv/yAe6v8jHOv/JBzr/yQc6/8kHOv/JBzr/yQc6/8kHOv/JBzr/yQc6/8kHOv/JBzr/yQc6/8kHOv/JBzr/yEc7v8hH+f/Ix7q/yUX9f8mHer/JiTb/yYd6f8oGPH/KRnv/yYa7/8jHOv/IR3r/yEe6v8iHO3/JBrw/yMc6/8kHOv/JBzr/yQc6/8kHOv/JBzr/yQc6/8kHOv/JBzr/yQc6/8kHOv/JBzr/yQc6/8kHOv/IB3t/yEd6/8kHOz/JRvt/yUd6f8kHuj/IRvu/yIc7P8iHer/JBzs/yUc6v8lHen/JRzr/yYZ8f8lF/X/JBrw/yMd6v8jHen/Ixvu/yQa8P8mHer/Jh/m/yQd6/8kHOv/JBzr/yQc6/8kHOv/JBzr/yQc6/8pG+3/KRrt/ygb7f8nHOv/Jxzq/ycc6/8nHOv/IiHk/yEf6P8kGPT/Jxj0/ycb7f8lHen/IRzu/yEY9P8oIez/HRbT/4KA4P/9/////fr+//T3/f9ZTN3/IBHt/yQa8/8mGvH/KBj0/yYZ9f8kHe7/JB3t/yQd7v8kHe3/JB3t/yQd7f8kHe3/JB3u/yQd7v8kHe7/JB3u/yQd7v8kHe3/JB3u/yMX+v8iF/r/IRv0/yEa9P8hGPT/IRrw/yEd6/8jGu//JRnx/yQd6v8jHun/Ixzs/yUZ9P8lFP7/JBX8/yQd7v8kHe3/JB3u/yQd7v8kHe7/JB3u/yQd7v8kHe7/JB3u/yQd7v8kHe7/JB3u/yQd7f8kHe7/HR3x/xoZ+v8cFv7/Hxn1/yId6v8nHen/KRrt/ygZ8f8lHer/Ixnx/yAX9v8fIeP/Ih7s/yYU//8mGPf/Ix3t/yQd7v8kHe7/JB3u/yQd7v8kHe7/JB3u/yQd7v8kHe7/JB3u/yQd7v8kHe7/JB3t/yQd7v8gGvb/IBb9/yQa8/8mIeX/Jh/p/yUb8P8hH+b/IiTd/yQh4v8jHev/Ihny/yIZ8/8hGvH/Ihzt/yMd6/8kHer/JB7r/yMc8v8gGfj/Hhn5/xse8P8cIOr/Ix3t/yQd7v8kHe3/JB3u/yQd7f8kHe7/JB3t/yUf6f8mH+r/Jxzv/yca8/8oGfT/KBrz/ygb8f8dHfD/GR3y/x4c9P8iHfD/JB/q/yMf5/8iHuf/JBnz/yQZ8/8nI+D/MyHV/87M+P//////rars/y4X4P8mGPj/IBX7/yQb7P8oHd7/KB/R/yYY3/8mF+D/Jhjg/yYX4P8mF+D/Jhfg/yYX4P8mF+D/Jhfg/yYX4P8mF+D/Jhfg/yYY4P8mF+D/JRTn/yMa2/8hHdj/IRro/yMZ8f8jHO3/Ih3q/yQa8P8lGfH/Ixzs/yIb7/8kHen/Ix/X/yYd1f8oGN3/Jhjg/yYX4P8mF+D/Jhfg/yYX4P8mF+D/Jhfg/yYX4P8mF+D/Jhfg/yYX4P8mF+D/Jhfg/yYY4P8kHNj/IiDS/x0c2f8hHOv/Ihf0/yUX9f8oGPH/Jhnw/yMe6v8gHO//Hxj1/yIf7P8iHOb/Ixnc/yce1P8mGOD/Jhfg/yYX4P8mF+D/Jhfg/yYX4P8mF+D/Jhfg/yYX4P8mF+D/Jhfg/yYX4P8mF+D/Jhjg/yIa3P8iF+H/JRTn/yYW5P8lGN7/Ixjj/ycc7P8mGfD/JRjz/yIa8f8hGvH/Hxny/yAc7/8hIeX/Ih3q/ycc9P8kHOX/IBjb/yIa3v8iGd//IBvc/yEb2/8lGN//Jhfg/yYX4P8mF+D/Jhjg/yYX4P8lGN//Gh3a/xgd3P8bGeH/HBfj/x4Y4/8dGd//HB3a/yAZ3/8jFuL/Ihbg/yEX3f8gGdv/Ix3h/ycg6f8lGe//Ihf1/yMg6v8hDer/enDj//r///9eVt3/KRXk/yUe7P8eGfP/Ihrs/31/7f+vuej/q67q/6yv6/+sr+r/rK/q/6yv6v+sr+r/rK/q/6yv6v+sr+r/rK/q/6yv6v+sr+r/rK/q/62v6/+tsen/qLjh/6q86f9sbun/JBrd/ykf6P8oGfD/Jxf0/yUb7P8jGvD/Ihb4/ygi3/+Ejun/q7bq/6ut6f+sr+r/rK/q/6yv6v+sr+r/rK/q/6yv6v+sr+r/rK/q/6yv6v+sr+r/rK/q/6yv6v+sr+r/ra/r/7Kr6v+ts+L/p7fo/09N5f8dE+3/Ih/q/yMh4/8iHuf/Ih3u/x8d6f8jH+v/IBPs/0Q83P+iquz/qbLo/6yv6v+sr+r/rK/q/6yv6v+sr+r/rK/q/6yv6v+sr+r/rK/q/6yv6v+sr+r/rK/q/6yv6v+sr+v/qrLo/6q14/+qser/panw/6Gw6/+ktPH/VlHu/yMP9/8mFvn/Ih3q/yAg6P8gHe//IRjy/yUb8f8nGfT/IA/o/zQt0/+Iiej/rbDu/6+u6/+yruv/sK/q/6yv6v+sr+r/rK/q/6yv6v+sr+r/ra/q/6yv6v+lsen/pbHq/6mw6/+qr+r/q7Hq/6az5v+kt+b/rbLl/7Gu5/+ur+v/r7rt/6S16/+Klu//Wln4/yof6/8kGe//IBzx/yAW7v9CMd7/2+X2/zAo0P8tHOj/JiHk/yEf6/8iFev/sLru///////9/P7////////////////////////////////////////////////////////////////////////////5/f3//f///4R/4v8jEt7/LCDo/yga7v8nF/T/JR3q/yIc7v8iFPb/ODPX/9no+f/+//////7//////////////////////////////////////////////////////////////////////////////vz////////S2fj/OTDc/yET+f8gHe3/IB3r/yIe6f8gGu3/Ihzv/yYj4P8sItL/trX1//3////8/f3///////////////////////////////////////////////////////////////////////////////////////r+///0//3/5/r//4GI6v8pId//KBrw/yUd6v8hI9//ICLi/yIb7/8pGvf/KBXu/ykcz/9qatb/y9L5//n////+//z////+/////////////////////////////////////////////////////////////////////////////////////////////////+jx//+yuPb/dHPl/0I+4P8rJtr/KSDh/ygb7P8eG/D/IB/s/yoY4v+tsO3/LSXf/y0a7P8lG+b/JB70/yAU2P+iodz///////r6+v/9/fz//f38//39/P/9/fz//f38//39/P/9/fz//f38//39/P/9/fz//f38//39+//9/fz//fj9//n69//x9///a1vl/yMN7v8lH+3/IB7q/yMY9P8kHer/IyHn/x4T6P9bVuP/6vb///v99P/9+fr//f38//39+//9/fz//f38//39/P/9/fz//f38//39/P/9/fz//f38//39/P/9/fz//f38//39+//1+vb/9fv//3Vx3f8bDeP/Ihn9/x8b7/8kGfL/JBzq/yIc7f8mFvv/HRPX/32C2v/4////+vr3//379v/9/fz//f38//39/P/9/fz//f38//39/P/9/fz//f38//39/P/9/fz//f38//39/P/8/fz//f38//z5+v/69/n/+//8/+Lr+/9kZNb/GRDb/xsd7P8iHen/Jh3p/yIf5/8hHe7/JRr1/yMY3v86N8//oqjq//f8/v/9//z/+fr0//z79v/9/Pv/+v39//j9/P/9/fv//f38//39/P/9/fz//f38//39+//9/fz/+/3///v8+//7/PX/+vrz//39+///////7vD8/7jE8f92ft7/PzjZ/x8U3/8aEd7/Ihvi/yYb6/8rF+//LBvr/x0e6v8cHfH/IxXh/4V42/8mHOf/Jxrt/yca6/8nHPj/GhbW/5qT4////////fz+///+/////v////7////+/////v////7////+/////v////7////+/////v////7////+///+/vr//v/v/+31//9VTen/HxLq/yYd7v8fHez/IRnz/yIb6/8kJOj/GxHf/4OA3f///////Pr4///4/////v////7////+/////v////7////+/////v////7////+/v///v7//v////z+///8/P///fz8//r/9v/Gy/f/MybY/yIb7P8hHur/Ixzs/ycc6v8mG+z/KB3v/yQR8f9JQNv/4O38//r//P/++/z///3+///+/////v////7////+/////v////7////+//////7///7///3+///9//7////9///9////+////fD//////v/Y4/f/VEra/yMO6P8kGvX/GRzz/x0b8f8kHO3/Ixzw/yMW9f8jFdz/ZWHZ/9Ld+f/6/////fz+//36/P///P7///z////9///6//7/+v/8///+/////v7////7//3/+v/9/v7///3////9///6/fv/+P75//v//f/5////2OX7/5yg6/9XVNX/Jhvf/xgN6v8gGur/IB7q/yIf7/8iGPP/JBX4/ykV+P8qG+z/IR/m/yAa9v8jF+L/Z1fh/yMb7/8gHez/KBzr/yce7f8QFN7/hYbq///////9/f7///////////////////////////////////////////////////////////////////////v++v////n/6e7//0E/6P8cGeX/LRzt/yUa7/8hG+7/Ixzt/x4e7P8gFeD/p6Xq///////8+/f//Pv////////////////////////////////////+/////v/////8////+//8//7/+P3///n8///8/fv/+v///3t24P8fD+b/JSHs/yMg5f8mF/T/JRzs/yQb7f8mF/H/Kx3X/6+y7P///////fn+//79/v/9//v////////////////////////////////////9////+v/+/f//+/z///v/+P/8/vb///v///35+v//////0db0/z1EyP8ZE+b/Jxz0/ycb7P8iGvH/Hh/n/yMg7v8hEfP/MiPd/5aW6v/z+v///v/8//37+v///v////7////////////////+/////f////z///79/////P///fv/+/z7//r9+//9/vr/+/v7///++//9/v//1dj7/4GG5P88Pdb/HRbX/yET6f8mG/D/Jh7v/yUc7f8kG+3/JBvt/yQb7f8kG+z/JBvu/yUb7f8nHuf/JRrx/yMW5/9ZT+T/Ixrx/yAd7P8pG+v/KB7v/xQX4P91duv///////3+/v///////////////////////////////////////////////////////////////////////P78/////v/l6Pn/MS3a/x8a6/8sGu7/JBrw/yEb7f8kHO3/HRzs/yUb3P/ExPb///////z8+P/8+/////////////////////////////////////////////////7////+///+///9/v///P78/////P/X3/n/OjTO/yEU8P8gHev/IyDl/yYY8/8lGu//JCLm/xwR6f9iXd//8vz///v+/v///v7//f79//v/9//////////////////////////////////+/////P/+///7/////f7////5///8/f/59/7////9/87Y9f8/O9L/HRTp/yUd9P8nGPP/Kxzo/ygg4/8oI+f/HhHh/0Q05f+7vfn/+f/9//b9+v/6+P///fj////+/////v////////////////7////+//7//P/7//z//vr////5////+/3/+/v8//v8/v/9/v//0dP7/4B74v85Ldb/HQ3q/x8Q+v8iGvX/ISDl/yIe5/8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+7/JRvt/yYe5/8lG/L/Ixbm/1pQ5P8iGfP/IBzu/yoa6/8oHu//FBfl/2Zm5//9/////v/////////////////////////////////////////////////////////////////////////7/f3//////9rb+f8uKN7/IBru/ywZ8P8kGfH/Ihzt/yQb7v8dHOv/NS3e/9rc+f////3//v35//39///////////////////////////////////////////+///+//////////z////+/f/9/fP//////5GS6P8fGNr/IRf5/x8d7f8kIOb/Jxjx/yUa8P8eHuf/JyPa/73D+P////3//f38////+//9//3//P/8//////////////////////////////////7////6/P///v39////9P///P3/+/r+//n//v/K0fr/OjrW/xwT7f8iHfT/IRzs/ycW9f8pG+7/KiDn/yMR5f9cUuH/1t/7//3/+f/6/PX//fv8//r6/P/8/f7//////////////////////////////////v7///z9///++v///vr///7++v/+//7/1tr4/4Fz7P81K+D/Hxjb/yMf5v8hH+7/Hh3w/x4c8P8fG+//Ihvu/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7v8lHOz/Jh7n/yUb8v8jFub/WlDk/yEY9P8gG+7/Kxvq/ygd7v8TFen/UFHb//f8//////////////////////////////////////////////////////////////////////////////r8/v//////0tL5/ysk3/8hGfD/LBnw/yQa7/8iHez/Jh3y/xoW5/9GQOP/5+z//////P/+/vz//P7//////////////////////////////////////v////z//P3///3/////+v////r4//7/8v/v9P//Tkne/xsT7f8eGvn/Hhzs/yQd5/8oGvD/Jh7x/xkS5v9pb+D/+P////z6/P///v7////7//7+/P///P///////////////////////////////////f3///n7///9//P////z//35/v/7////1OP6/0Y+2v8eEuz/JBvz/yUZ8/8jG+3/JB/o/yYe7f8cE+D/b2zp/+Ts///4//r/+vvz///9/////v3//v/5//3//f/////////////////+/v7//f39//7+/v/+/v3//vz8//38/f//////6e39/5GQ5/82MNT/GRLh/yEa7f8jH+v/ISDn/x8h4/8gIeP/Ih/m/yQe6v8kHOz/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvu/yUc7P8mHuf/JRvx/yMW5v9aUOT/IBnz/yEc7P8sHOn/KBvw/xYX8f86Otj/6O3+///////+/v//////////////////////////////////////////////////////////////////+/3+///////T0/n/LCTg/yEZ8P8sGfD/JBvt/yAf6f8lGvP/GhTn/1NP4P/x9//////8//7+///8/v/////////////////////////////////////+///++//7/f//+//9///5///++vn////5/7u/9P8nHeD/IRn1/x4b8P8iHev/KBvq/yoc7/8hHOz/KCLc/77G8////////vn+//7+///6//7//v39///5///////////////////////////////////+/v//+v37//3/8v/9+///+v/9/+Tv+/9RStr/HhHq/ygg7P8oH+T/KRjw/ygc7/8lIej/IBbe/3x/7P/t+/3/9f35//j5/v/++/3///3////7//////r//v/2/////v////7///////39/f/9/f7//fz+//v8/f/8//v/+f3//7Kt7f9QPOD/IQvp/x4X8f8bJOb/Ih7r/yQb7/8jG+7/JBvu/yUb7v8mG+7/KBrs/yYb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+7/JRzt/yYe5/8lG/L/Ixbm/1pQ5P8gGvH/IR3q/y0c6P8oG/D/FRX0/zMw3v/W2vb///////7+///////////////////////////////////////////////////////////////////7/f3//////9PT+f8rJOD/IRnw/ywa7v8kHer/Hx/l/yUa9P8YEuf/ZGLe//r//v/+/vn//v3///v///////////////////////////////////////7///77//n8///3//n///v///34+//9//3/en3r/xwO6/8kHu//ISDm/yUc6f8tG+//KRvr/xUU5f9dY9v/9/v///v7+f///fj/9/////P////+/v////z//////////////////////////////////////////v7//P36//b7/f/w+f//bWra/x4P5f8hHfX/IBzp/yge5v8qH+X/Jx7q/x0a1v+Jiuz/+/3///v99P/9/fv//f3+//7//f/+/v///vr////+/f////f////9/////v///////f39//z6/f/9+/3//////8/b+v9qZ+D/JBbe/x8T7v8jHvD/IBzs/yQb8P8jGfD/Jhrw/yYa8P8mGfD/JRrw/yUZ8f8kGfL/JBvu/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQa7/8lG+3/Jh7n/yUb8v8jFub/WlDk/yEb7v8iH+f/Kx3o/ycZ8v8aF/f/JSTX/8HF7P///////Pv+//3///////7////+/////////v////////////////////////////////////////n9+/////7/09P5/ysk4P8fGu7/Khvs/yQd6v8gIOb/Jh30/xgQ5v9sbNf///////38+v/+/f//+////////////////////////////////////////v///v3/+f7///j/+v/+/Pz///39/+z2//9JSuT/HBHt/yUe7P8jIOT/KB3q/yka7P8pHO//GRjb/6m38P///////Pj5//7/8f/1//7/8/////7+/v////r////+///9/////////v/7/////f////////79///7/v/4+vz/9//+/42M6P8jDuP/Jhzz/x4d7f8dHPH/IRzr/yod7P8iGNj/hZHq//f/////+vr///f////8/f/9/vz/+v3+//r//v/8//j///79//79///+//3////+///+///6+v7//P7+//v8//+spu7/Ny3f/xoV3P8hIuz/Gh/n/x4g5/8nHez/LBfy/yYd6v8kHen/JBrv/yQZ8/8iGfH/IR3s/yAg5v8iHer/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvu/yUb7f8mHuf/JRvy/yMW5v9aUOT/JB3q/yQg5f8kHOv/JBb3/ycc8/8XG9L/lp/q///////6+P7/+v3+//7/+v////r////+//78/////v//////////////////////////////////9v36/////v/Tz/n/KyPh/xoc7P8lHev/JBvu/yEe6f8jHO//HBPo/3qA2v///////vn+//7+/v/7//7///////////////////////////////////7///79/v/6/v7//fz+//7+9f////n/xsf3/yUl2f8hH+f/Jhjy/yUa8P8jHO3/IiHo/yMT8P9JQdn/6vH7///////+/v/////+//7////+////////////+v///vr///j///79/v/9//T//f/7//7//////vv/+/j9//3///+yvu//KCHU/yQZ9P8lFvn/Jhru/x0e6/8jH+//JBXc/4aD5f/2////9/v+//77//////f////5///9///+/P///f7///3/+/////z//v3///38///+/P//+/r8//3////h7P3/bG/g/yEY2P8jGez/Jh3u/yQc7P8kHO3/Ixrs/yQb7f8lG+3/JBvs/yQb7P8kG+3/JBvt/yQb7f8kG+3/Ixzs/yQb7P8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+7/JRvt/yYe5/8lG/L/Ixbm/1pQ5P8kHOz/JB/m/yQe6v8lGfP/JRvw/xkY3P94fez///////v9/v/8/f/////+/////P////7///3////+///////////////////////////////////4/fz////+/9bT+P8sJN7/Gx3s/yUc7P8lG+//IR7n/yQd8P8ZEOT/hYvl///////++f///v79//v//v///////////////////////////////////////f7///z+///+/f7//fz4/////v+enPL/GxfY/yQh6f8mGfH/JRzr/yIc7P8lH+//IRDn/4F+6f/+/////v3+///////////////////////////////7///++///+/////79////+///+/////r///7++//4//r/3OP7/0Q51/8iHN//ISHo/yIb7f8kHuf/Ih3x/x0P6/91dd3/8/7///f4///9/P3//v/7///9/v////3////7////+v////3///7////7////+/3///v9//z6/f////7/xtHw/0lE1f8aEeP/IiLo/yQd7P8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7v8lG+3/Jh7n/yUb8v8jFub/WlDk/yQa7/8kHuf/JB/n/yIa7P8nHfH/GhPn/1VV3f/6////+v/6//79/v///P/////////+/////v////////////////////////////////////////j+/v//////4uH4/y4q2P8aHOv/Jxvu/yYa7v8iH+j/JR7x/xoR5v+Gi+T///////75///+/v3/+//+///////////////////////////////////////9//7//v7+/////P/8/fv//P///3Jt4/8YEt7/JR/t/yYb7v8lH+X/Ih3r/yUb9v8sHNz/usD1//3////+/f////////////////////////////////7//v7//////v////z///3////4////+v//+//2//D//P9zaur/IQvq/yQi6v8cHev/HyLg/yYf7P8fDu3/WVXd/+jz/P/5//r//vn/////9v/6/vn//Pn////9//////b////y////+////P////z////9+f/+/fb//f///6ys8f82LdH/Hhfh/yIf8v8eGPb/JBvu/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvu/yUc7P8mHuf/JRvy/yMW5v9aUOT/JBnx/yQd6f8kH+b/Ixzp/yUc8P8fFPD/PTji/9zn/P/8//f//vv7///7///8/////f7//////v////7/////////////////////////////////+f3+/////f/q6/n/NTHW/xkb6f8nG/D/Jhrv/yIf5/8lHvD/GhLm/4SK4////////vn+//7+/f/7//7//////////////////////////////////v/+//3//P///f3///74//7////p8v7/Tkjf/x4X6f8jHez/Jhzs/yUf5f8jHev/IRTv/0k/3P/k7fr//P/5///+//////////////////////////////79///+/P/////7////+P///v7//vv+//z7+v////v/prXt/yYT5/8nHPP/HR/n/x4Y+f8iHu3/Ixbs/0M33P/V4fr/+v/8//z3/v///vj////1//r9///6+/////7/////+P///vj//fz8//78/f/8/vX/9/70//P///+TlOj/Kxfh/yMT9f8jIOv/JBzt/yUY8f8lG+7/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+7/JRzs/yYe5/8lG/H/Ixbm/1pQ5P8kGvD/JBzr/yQd6f8kHer/JBzs/yQZ9P8mHd7/usLx//z/+v/++vj///z///v//P/7/f/////9/////v/////////////////////////////////5/P/////7/+/y/P9DQt//GRrm/yga8v8nGfD/Ih7n/yQd7/8aEeb/hozl///////++f///v79//v//v/////////////////////////////////+/////P/+///+/v///vv//v/+/9Lc+P8yKtj/IBju/yUd7f8mG+v/JBzr/yQf7P8fE+T/dHDe//v//v/8/ff//////////////////////////////////v3///77//////z////6////+v/7/vb/9//6/+Xv+/9GSNf/IRLw/yIe6P8gIOj/Ixr0/ygU/P8rItb/t73u//z////6+v3///z/////+v///f3/+/3///v//f/+//7///7////9///9+/z/+fz8//b++f/t/P//d4Hp/x8W1f8kG+v/Ihvw/yQa8P8qHOn/Kxzp/yQb7P8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7v8lHOz/Jh7n/yUb8v8jFub/WlDk/yQc7P8kG+7/JBvu/yQc6/8kHer/Jh3v/x0S4/+NkPH////7//74+v//+/7/+f/3//n9/v///v3////+//////////////////////////////////r8//////j/9vn+/1FR5v8XGOP/Kxn0/ygZ8P8iH+b/JB3w/xkQ5f97gdr///////74/v/+/v3/+//+//////////////////////////////////7////7//7///79//76/v/+//n/sbv5/yQc3/8jHe7/JB3q/yUb7f8kF/b/JSDs/yAY1v+hou////////38/P/////////////////////////////////+/v///v7//////v///v///f/5//P98//4////l5Pn/x8V3v8mH+7/IRvr/yMf5/8pHer/JBHh/36G4f//////+/f9//78/f/+//b//v3+///6///+/vv//f/2///+/v//+/////3+//r+9//z+/3/8/j//4F/7P8XFdr/JSLn/yQe7f8jHOn/JBzs/yUa7v8lHer/JBvs/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBrv/yUb7f8mHuf/JRvy/yMW5v9aUOT/JB3q/yQa8P8kGvH/JBzs/yQe6f8mIOv/GxDn/2Fg4//6//3//vn6//78+v/4//X/+f3////+/P////7/////////////////////////////////+vv///7++P/7//7/YWDl/xUW4f8pGvT/KBnv/yQf5v8mH/H/GA/k/2500P///////fn+//7+/v/8//7//////////////////////////////////v7///v+/v///vv//vj+////+f+aofj/HxXk/yUg7f8jHOr/JRrw/yQV+/8iHOr/KybS/8TK8v///////vv////////////////////////////////////////+//z///79///8///7/fz/9P/7/9nf/f9HONf/JRfs/yQc7v8jGfL/Jh7o/ykX5v9QTNL/3PD7//79////+f/////5//v/9//6/f///vz/////9/////f//v3////7///+/vn/9v/y//L9//+If+f/JhXU/yQf7P8kHOv/Jxry/yQZ8f8iHez/Hh3r/x0c7v8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+7/JRvt/yYe5/8lG/L/Ixbm/1pQ5P8kG+z/JBvt/yQb7f8kG+3/JBzs/yUd7P8gFu7/Ojza/97n+f///vr////z//z+/v/8+v/////5/////f/////////////////////////////////9/P///Pr8/////v+AeOD/FxbZ/x8e8f8lG+3/KR7m/yQc7v8ZEer/Y2XZ//r////+/vj///3+//7//f/////////////////////////////////+/////f///////f/9/Pj//////4mD6f8cDOT/JSDs/yUb7v8qFvT/Ixzu/xcZ6/9DO93/6ej5///////8/f///////////////////////////////////f////r//f/+/f////75//z9+P/8////jozr/yAS3P8yHPD/Ihnw/xoc8v8hHO7/LhvY/7q37//+/////Pr+///+//////3//v/+//7////////////+//j//v/5/f3///z5//z7+//1////hpXn/x4S4P8pGvT/JBzr/yUb7/8kG+7/JBru/yQb7f8iHOz/Ihvu/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7v8lG+3/Jh7n/yUb8v8jFub/WlDk/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQd7v8jINT/uLvz/////v/+/fX//v/8///6/////vr////9///////////////////////////////////+///9+v7////+/56Z7/8dGdz/HCDt/yQb7f8pHej/JBzv/xoT6f9TUt3/8Pn/////+v/+/v7//v/9//////////////////////////////////7////9//7////9//799//+////e3Pp/x8O5/8kH+v/JBvt/ysY8f8lH+v/ERXo/1VP3//8+v///v7+//z////////////////////////////////////+/////P/+//79/////fn//v/2/+fr/v9IP9b/Ixfp/y4b7f8iH+f/HCHs/xsS5/9tZt//+Pv///j5/f////7/////////////////////////////////+f79//r8/P/99/3//////6iv7f8lINT/JRzp/yUZ8v8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBrv/yUb7f8mHuf/JRvy/yMW5v9aUOT/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+7/JSDp/xwS4P+Ef+n///////z7+v////X///v////+/v////7//////////////////////////////////f/9//77/v//////uLr2/yMb3P8eIOn/Ixrv/ykb7P8kG/D/Gxfn/0hE4//n7//////+//7+/P/+//////////////////////////////////////////3//v///v7//v76//f///9rZeb/IBDo/yMe6/8jG+z/KRrt/yUg6/8RFOP/bmrk///////7/Pz//P/+/////////////////////////////////////v////7///3///38/v////3/qavs/yMW2v8lHPH/Jxru/yIi4/8fH+b/LSTc/8bN9v/7/////fz7/////f/////////////////////////////////+/fz/+/r7///////Izvj/NSjb/yQX7P8pHuv/Jxnu/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+7/JRzs/yYe5/8lG/L/Ixbm/1pQ5P8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7v8kHur/IBPr/1NI4//r9f3//P//////9v///v3///7////////////////////////////////////////8//r//fv+///////X3ff/MSfc/x4f5v8kHPD/KRjv/yYa8f8dG+r/NC3e/9zj+v///////v74//7+/////////////////////////////////////////v/+///+/v/+//3/8v/+/2Nf4v8hEuz/Ix7r/yEc7P8oHOn/Jh/s/xQV4f+FhfD///////v7+//8//z//////////////////////////////////v/9///+/f///P7//fv+//L///9lZeD/HQ7w/yMc8/8jGu//Ix/t/x0U4f9xb+P/9/////v8/f////n////9//////////////////////////////////79+//9//3/5PP8/1FL4f8fEPL/JCDs/yYb7P8oGPH/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7v8lHOz/Jh7n/yUb8f8jFub/WlDk/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7v8kG+//LR/d/8DF+v///////v37/////P/9/v////7///////////////////////////////////z//v/+/P/////9/+70//9NR+D/HBni/yQd7/8oGPH/JRvv/yAd7f8mHN7/xMj2///////+/fj///3////////////////////////////////////////+//////7///3////t+/3/VlPa/yAR7f8lHu3/IBzt/yce5v8nHu7/FhTg/5SW8P///////Pr8//3//f/////////////////////////////////9//z//f38//77/v//////ztvy/y8u1P8fE/n/Ihvx/yIc7/8jF/T/LR7e/8LI8f///////vr+/////P////7//////////////////////////////////f39//z///+AheT/GhLf/yMd8v8jH+b/Jhnw/yYa7v8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvu/yUc7P8mHuf/JRvy/yMW5v9aUOT/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/Ixru/yMe7P8dEeT/hoPv///////9+v3///79//z//v/+////////////////////////////////////+/7///7+///+/vv//v///21s3f8ZEuT/Ix3t/ygZ8f8lHOz/Hh3w/yEX5P+qqvH///////39+P///f///////////////////////////////////////////////f///P///+v6/f9VU9v/IRLv/yUe7P8fG+//Jh/m/ycd8f8YFOD/oqTt/////f/7+fz//f/9//////////////////////////////////z//f/7/v3//vv9//////+doe3/Gxje/yAd8f8kG+3/JB3v/yES6v9eVt//9Pv///7+/v///f7//f7///7///////////////////////////////39/v//////wMbw/yoh3P8fGvP/ISLj/yYa7/8mG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+7/JRvt/yYe5/8lG/L/Ixbm/1pQ5P8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JCDr/x0U6f9ORt7/7/b5///9+//++////P/8//7////////////////////////////////////7/P///v79//79+f//////lpnx/xwS6P8iH+z/Jxnw/yYc6v8gHfP/GxHi/42K2v///////Pv5//77///////////////////////////////////////////////9///7////6vr9/1NS3P8eEO7/JR3t/x8a8v8mHub/KBvz/xoT4f+kp+3///////33/v/+////////////////////////////////////+v/9//j+/v/+/P3//v///2lj5v8WEuj/IiXm/yYd5/8oHfP/Ihfb/6Cj6P///////f33////9v/8/f///f7////////////////////////+/v////////T3//9eWdX/Hhbl/x4Y+P8jG/D/KB3o/yQc6/8hGvH/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7v8lG+3/Jh7n/yUb8v8jFub/WlDk/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8iHej/IyHt/yUd2P+8we7///////v79//3/fn//v/////////////////////////////////////9///8/v///P37/////f/Gw/b/IRvo/yEi6v8kG+z/Jxrv/yke7P8UE+b/XV/k//z//v//+P3//P3+///////////////////////////////////+/////f///P/9//v9///2/v//YGHg/xYP7P8mH+z/JBvu/yka7/8pGfb/GBXe/6Cl7f////3//fj+//79///////////////////////////////////8////+vv9//7/+f/f7f3/Pjvk/yIX5/8oI+X/HR3t/x4Y8/88L9f/297z///////8/vr//v/7///8/v/9/v//+//7//3//v///P////38//v89/////7/pqb2/yAZ2v8jHub/Ihzt/yQZ8f8mHen/JBvu/yMa7/8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvu/yUb7f8mHuf/JRvy/yMW5v9aUOT/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/Jhvu/yUc7P8hH/D/GRTe/3Nx2//7////+fz5//v9/P////////////////////////////////////////////r+///7/v7////4/+vq//87O+L/Ghfo/yQf6/8nGfH/Kx3q/xcZ6v86O+L/7O/7///9///9/f7///////////////////////////////////7////8/v/7//z/+/z///3+//9lZ97/FBLt/ycf7f8mHOz/KRjx/yga9f8WFtz/n6Xu////+//9+f3//vz///////////////////////////////////7//v/9+/7////9/7zL8/8kIt3/Khvs/ygf5f8aHvH/FRLp/2db5v/9/f///f38//v//f/8//////3///79///7//j//v3+///8/////P3//P/0//H2+/9STeH/GxXm/ych6f8kHen/JBzq/yQb7v8kG+7/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kGu//JRvt/yYe5/8lG/L/Ixbm/1pQ5P8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8mG+v/Jxru/x4Y9P8dHen/Ni3a/9XY+//+/////vv5/////v////////////////////////////////////3//P/+//39/////fv//f///2xv5P8aD+r/JB/r/yYa7/8oGfD/Hx7s/yUg3P/Gxvb////9//z7/f///////////////////////////////////v////3+//z//P/8/P7//////3Fz5f8VEez/Jx3x/yYc7P8pGu3/Jxvz/xYW3f+fpO/////8//z7/f/9/v///////////////////////////////////v/8//36/P//////oanz/xsW4P8qGvP/KR/l/x4g7f8WF93/jYnu///////9/Pv//P/9//3//////P////z+////+P//+v////3///z5/f/+//v/s7fu/ygc1/8kH+r/JB7p/yIb6P8lHez/JBvt/yQb7v8kG+7/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7v8lHO3/Jh7n/yUb8v8jFub/WlDk/yQb7f8kG+3/JBvt/yQb7f8kG+3/Ixvt/ycd6/8nGur/IBrz/x4f8v8bEef/jY7r///////+/Pn//////////////////////////////////////////P/+//3//vv///38/f//////qq7z/yMV5/8jHuv/JBvt/yQY8/8kIOz/HBHk/5WU6P////3//fr+/////////////////////////////////////////v7/+//8//v6/v//////goTj/xIN5v8oHPT/JBzs/ygc6v8nHe//FRbe/5uf8P////7/+/z8//z////////////////////////////////////+//z/+/n7//////+Ehuv/FxDp/yoY+P8qHuf/Hh/o/yEi1f+6vfD///////7++f/8//7//f/////9/////f////7+///9////+v///Pr9//H/+/9oZ9//HxDo/yYg6/8lHuv/JBzq/yQb6/8kG+3/JBvt/yQb7v8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvu/yUc7P8mHuf/JRvx/yMW5v9aUOT/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/Jh3q/yge5/8iHOv/HRvz/xgW6f9IRNv/6fD9/////P///v///////////////////////////////////v/9/////f///f///P3/////+v/f4Pr/OzLb/x8b6v8jHO7/Ihrv/ygf6/8dDez/XF3p//H/////+v7//////////////////////////////////////////v/6//3//Pr+//////+ZnOr/GBTk/ykc8v8kG+3/Jxzq/yUe7v8UFeL/iovy///////6+/v/+//9//////////////////////////////////3//f/7+vv//////2xq5v8TDez/KBn3/ysc6v8eHOf/NTba/9Xd+/////v//v75//3////9//////3////+/v//+/7////6//75///+////0N/3/zUt2/8hFfL/JR3q/yQb6/8kHOz/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+7/JRzs/yYe5/8lG/L/Ixbm/1pQ5P8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kHOv/JB/m/yYc6/8iGfL/ICDp/yEa3P+nqO////////39/v/////////////////////////////////8//////7///7//v/6/////Pv6//////9qa9v/GBTl/yMd8f8hIOb/KR3p/yQW9f8sL9//1uL5///9///+/v///////////////////////////////////v////r//v/8+////////7G2+f8eHd3/Jhvr/yQb7v8mHOr/JR7v/xMS5f98eur///////z8/f/8//z//////////////////////////////////P7///39///4/P//XFrk/xMR7f8oHPD/LBvu/xwW6P9GRtr/6vb/////+P///fn//f3///3//////v/////9///8/v////n//fr+//////+gouv/HRPi/yMd8f8lG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7v8lG+3/Jh7n/yUb8v8jFub/WlDk/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yIc7P8iHO3/KRf0/ykZ7/8kIOr/HRbm/1lO4P/y+v///f/////+//////////////////////////////v//////P///v/4//f//v/89////////6a08P8WEub/IRzy/x4l3P8rHOn/JRnz/xMZ3/+lq+f///////z9/v/////////////////////////////////9////+f////38/v////r/yND3/yQn1f8mHuf/JBrv/yUc6/8kHfD/ExHp/2Nf2v///////Pn9//z//f/////////////////////////////////8/f///f7///L0/f9SUtz/ExTs/ygf6f8uGvL/GxHp/11b6f/1/////v73///9+f/9/P///f/////+///+/////f/7//7+/f/9/vz//f/9/3Bj4/8aEuf/IiDq/yUb7/8kG+7/JBvu/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBrv/yUb7f8mHuf/JRvy/yMW5v9aUOT/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/Ixvt/yMb7v8nGu//Jxvs/yQa8v8nHfP/IxvZ/6m08f///////fr9//z/9//7+/3//vz//////v////z//v7+///8//////r/+/79//v4/v///f//4+r6/0M54/8fEfj/JCbc/ycc6P8mG/f/FxTl/2ps2//8////+/39///+/P///v7//f////r/+//+//v///7///3//v/7/v///vz9////+f/k6vv/QD3f/xwb5P8iHe7/Jhru/yUd7f8dFez/Tkvc/+zw////+/7//v/8//////////////////////////////////7+/v/8////5u/5/0dE1/8aFO7/JCHl/ysb8f8bD+n/bnHw///////9/Pz//f39///9///9///////9//7//f/7//z//f7+////+f/m6/v/QTvZ/x4Z6P8kHuz/JBvu/yQb7f8kG+7/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+7/JRvt/yYe5/8lG/L/Ixbm/1pQ5P8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+7/JBvt/yQf5v8kHen/JBf0/yYZ9v8dHN//Tlbd//X1///8/fz/+//1//z8/v/++//////+////+f///v7///7///////////3/+vz+//b4////////hH3m/x0N6v8rI+X/JB/q/yAZ9f8jFfD/OTPV/9Lk9////////vv9///++v/7//3/+P/9//z/+v///v7//v/8//3+/////f3//v76//r///9mYOb/ExTk/yEe7v8nGfH/Jx3q/yMY6/83NNf/09/2///////+/vn///////////////////////////////////79//z////g8Pj/RkDc/yAU8f8hIeb/Jx3w/xwP6P92fu7///////v6/f/7/v////7+//3////+//v////6//r////8/fz////6/8nL/P8jJ9v/IB3o/ygb8f8kG+z/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQa7/8lG+3/Jh7n/yUb8v8jFub/WlDk/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQa7/8kGfH/JB3p/yQe6P8jGe//JRr0/yUf6f8hH9D/s67x//r//v/5/Pn////6///9/f///f///P/9//7+/////v/////+/////P/9/v3/+fv+///////GzfT/KyfQ/ycc7f8hHev/IBrw/yYZ9/8iFtz/naLq///////89v///v7y//7/9//6/f///f7+/////P/+//z//f/9///9///9/P3//////46P6v8YEub/Ix3x/yUa7/8kHOz/JBzv/yMd0P+1vu////////78+////////////////////////////////////v7//P///+Px+v9JRNz/HxPx/yIg6f8oHPL/Gw/n/3yF7v////7/+/z9//v+//////3//f7///7/+/////r/+v////v9/P//////srLu/xoZ2f8jHe//Jhnw/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvu/yUb7f8mHuf/JRvy/yMW5v9aUOT/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBrw/yQY9P8kHer/JB/m/yQc7P8jGPD/Jh3w/x8X4/9RSdv/5vP///f/+f/+/vf///78//7+///3//7//f3////+//////7////8//3/+v/8/vz/+/z+//H///9jZdj/IA7s/yAd7v8gHu3/Jhv0/yES7P9YUeH/9/j///39/f///fj////8//z9///9/P/////7//7//P/9//r///z///36/f////n/u8Xu/yQZ3v8lG/H/JBvt/yQb7f8jHe//HhXf/4+R7P///////fz+///////////////////////////////////+///9/f//6fb8/1JN3/8eEe//Ih/s/ygb8/8bEOb/govu/////P/7/Pv/+v/+/////f/9/v7//v/8/////P/6////+v39//////+amez/FxPf/yIa8v8mGfH/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+7/JRzs/yYe5/8lG/L/Ixbm/1pQ5P8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kGu//JBjz/yQb7f8kHuj/JB3q/yQa7/8kGfH/Jxzz/yEY2v+ane7/+f////z7/f///f3//v/7//j+///8/f////7//////v////z////8//7//P/7/P3//////7Gy8v8oF+b/IB7t/yAe6f8mG+3/JRzv/yod4P/Ew/P////3//75+///+v///v/8//39/////v7//v/+//3/+v///P///vr9//3/8v/g7vf/Qjjd/yIV7P8lHuv/Ihzs/yEd8P8bEej/ZWDj//T////7/v7///////////////////////////////////7///79///u/P//Wlfg/x8R6/8iH+z/Jxvz/xoR5P92fu3////+//v8+//7//7////8//3+/v/+//7////9//r////5/f3//////4iG5f8XEuf/JRz0/yca8P8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7v8lHOz/Jh7n/yUb8v8jFub/WlDk/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7v8kGvD/JBvu/yQc7P8kHer/JBzs/yQa8P8lG/L/Hhjn/z013f/c4/v//P7///78/P////z//f7///7+/////////////////v////7////+///+///+//r/8PH//1NQ3v8bGuD/Jh/r/ykb6/8mIej/Gw/p/3Jt5v/1//3/+vj7///4//////r////8///9/////v///f/9///9////+/z//f32//f///9ybuD/HhDl/yYg6v8iHun/HRzx/x4Y8v8+Mt3/2+D5//3////+/v///////////////////////////////v///Pz9//f///9paN//HBHl/yMf7f8nHPL/GxLk/3N48P////3/+/z+//v///////z//f7+//7//v////7/+v7///j9/f//////g4Hn/xYS6/8lHvD/Jxvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvu/yUc7f8mHuf/JRvy/yMW5v9aUOT/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvs/yQc7P8kGvD/JBnx/yQb7v8kHer/JBzr/yMb7v8kHvD/HxHd/4R+4//7////+/76///7/////fz////8//////////////7////+/////v////7///76/f////7/nKvt/xod1P8qHO//Lhfx/yUg5f8dGPL/MCjd/8vX9f/8//j//vj9///8/v////X///v+///9///9//////7////9/P/7+Pz/+////6et7v8gEuX/JSHp/yEg5f8bGvP/IR70/ykW4P+zrPf///////38///////////////////////////////9/v/7+vr//f///3+A5/8aEOH/JCDs/ycd8P8cFeP/YWPh/////v/6+/7/+v///////f/9/v7//v/+///+/v/5/v//9/78//////96eeT/FBHo/yYg7P8nHOr/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kGu//JRvt/yYe5/8lG/L/Ixbm/1pQ5P8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kHOz/JBzr/yQa7/8kGvH/JBvu/yQd6v8kHer/Ixvu/yAc7f8mHOn/MyPc/8LM9P/6//7//Pn////9+v/+//r//P/9//3////+//7//v/9//7//v///f////v9//7/9v/k8///TEzf/yAV5v8pG/P/Jh7p/yUd7v8bDeX/dnnk//j/+P/7+fj///j/////9v/+/f7//v7///7+//////////79//z4/v/7//7/3+T7/z4s7f8fG+P/ICDq/xsc7f8hHfD/IhDl/3Vy5f/5/////vv9//78/////v7///7///3//P////////7+//z5+P/9////m572/yAY3v8iIev/JR7r/x8U6P9LTNr/+/z+//74///9/f///v/7//z+/f/+/v///v7+//z+///6/P3//////4KG5/8WDuz/JSHq/yce6P8kG+7/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7v8lG+3/Jh7n/yUb8v8jFub/WlDk/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8jGu3/IRzr/yQd7f8hEuj/WFfc/+X2///2//n///z9//7+/f/7//3//P////z//f/8//r//v/6///+//////7//fv7//////+trfD/HhzZ/xse7v8hHOj/LB7p/ycX9v8tKdf/xdrx/////v//+P7//vv///j//v/+/////////////////////v7+//39/v//////eWzr/x4V4P8fHfL/HCDo/yUb8P8mFur/NjnT/9fm+////v///vr+///9/P/9/P//+v/5//7+/////vz//fj6//7///+6xPL/JiDX/xwc7P8hIOf/JRPz/zo44//d7Pr///r///75///6//v/+f79///9///7//z//v7+//75////////hJHj/x0M8v8kH+7/JB/n/yQb7v8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBru/yUb7f8mHuf/JRvy/yMW5v9aUOT/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb6/8nG+7/JBrv/yck5P8iGNj/lZrr//v//v/8+/z///3///79////+/////z////+//////3////7///+/////vj/+vz6/+34//9ZWN//HBbo/yIg6/8kHPD/Jh7x/x8W3v94deP//v////35/P//+f//+//6//7//v/////////////////+/v7//f3+//////+7wvH/Jxza/yIe7f8fHe//JBnv/ywa8/8fF9v/oqPv///////8/fX///38//77///7//7//v/9/////v/++v7/+v///9fm9/86Md//Hxfx/yIe5/8nGPT/JyDc/8XO7P///////vv+//r////6///////+//z/+v/+/v7//fn+//////+Youj/Hgzo/yQc8f8jHej/JBvu/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+7/JRvt/yYe5/8lG/L/Ixbm/1pQ5P8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/Jhzu/yoY7P8mHOr/IB7q/yAY7v81L9L/zdX1///////++/7///7////8////+/////v////+///9//r//P39//39+v/7/PT//v/9/77D8v8rHtf/IBvv/x0a9/8eHuf/JRvs/zYf5v/JzfX///////38/P/+//v////+///////////////////////+/v7//v/+/+38/f9aUOP/IRPr/yAa8P8kHer/Kxn2/yAQ8P9cUuT/8fr8//n/7v/+/fz//vz///v9/v/+//v///////76///5/Pz/7//9/15V6P8cD+z/Ix7p/yUa8v8dE+L/n6Hu////9//9/Pr//P3///v+///+//v//P/6///+/v/9+v7//////7e+7v8oFt//Ixn1/yId7P8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7v8lHOz/Jh7n/yUb8v8jFub/WlDk/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8lGu7/LBrq/ycd6f8dFvn/Hh7y/yAX4P9jXNn/7vT///r+/P/+/vb////3///+/P//+/////z///z//f/7/v3//v7///79+//7+fz//f///3t04f8cD+v/HBz2/x4f5/8mIOr/Iw3t/2tk4//v//z/+f/z///9/v///v/////////////////////////////9/f3////8/6Wi8P8lDuv/JR3u/yUi4/8nGPL/JRX3/yse3f+9x/H/+f/6//z6/f///P///f3+//3/+v///v7//v3///z8/P////v/kYvy/yAR4f8mIOz/Ihvw/xsQ7f9wa+n/+P/6//r9+P//+////f3+//z/+f/+//v///7///78/v/+////1dn6/zws2v8gFfP/Ih3u/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvu/yUc7P8mHuf/JRvx/yMW5v9aUOT/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yUc7P8qHen/Jhnx/x8X9/8dHO7/JyHq/yUT3v+Nkeb/+f////b89//8/u7//v/0///9////+////P7///3//f///v////r///75//////j/3eL7/z0v4/8dHeT/IR/s/yQf5f8oHO7/JRjh/6q67f/7//3//fn+///+//////////////////////////////7+//////7/5+n//0w86P8gG9z/JiLj/yYa7/8mHPL/HBPj/2xw3f/0////+vr+///+///9/v7//v/7//7+///9/v7//v38/////f/Gx/T/LiTT/yQd6P8hG/D/Hhbw/0I44f/f6/v//P/7///7/v/+/P//+v/6//7/+////v///f3+//z/+//x9P3/V0vU/x0T7/8hHu7/JRvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+7/JRzs/yYe5/8lG/L/Ixbm/1pQ5P8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBzr/yQc6/8iF/X/Ih3q/yIe5v8lG+z/Jhfx/ygn0f/Ax/P/+v////T79v/8//P///7+///9///9//7//v/5/////f/8/P///v77//39+v/+////m5/q/xsaz/8kHfH/JR3o/yUf6/8bFOz/REjW/+br/f//+v7//v7///////////////////////////////////37+///////lJrn/x4cz/8nHPH/JBvu/yMe6f8fGu//KyTY/8/P9////////vz+//7/+f/9//3//P////z/+v///vr///3//+z2//9RT9b/Hxji/yAb8P8iHvD/JRnf/7Oy9f////3//vv7//78///5//v//v/8//7+///8/v3/+/33//////9/d+X/FxDm/yEg7v8lG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQa7/8lG+3/Jh7n/yUb8v8jFub/WlDk/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8jG+3/IRvu/yIa8P8kH+f/JSDi/yYZ9P8kHe3/Gxfk/0pE1P/e5P3/9f/+//n79f///f7///v///r/+//9//X///7+//v//P/9//X///38//r7///t/P7/YV3k/xsP6v8pHPH/Ihzq/yAg6f8dEef/jYfo/////v/7/fn///7////9///+//7//P/+//3//P///v7///v6//38/v/d8Pz/QkLZ/x8S8f8kHfD/Ih3p/yIc8/8eEuj/eHDc//v////9/f3///74//3//f/6/////f/5///++f/9+P///v///4uN6P8eFd7/Ix30/yQg7P8bEOX/dG7r//7//v/9/P3//f3///n/+////v7//f7///r//f/7/fn//////62q8v8cGOL/IB7v/yUb7f8kHOv/JRvs/yYa7/8lGu//Ixvu/yMb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvu/yUb7f8mHuf/JRvy/yMW5v9aUOT/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8jG+3/JBvt/yQb7P8kHOz/JBvt/yQc7P8mHvD/Fw7p/2Jr3v/w/f///f37///6////+f//9f76//j/+f///////v/+/////v///////Pz+///////X1vr/Myvd/yYX7v8mIeT/IyTe/ycS+v8uItz/tczu//z/9v/99v3///j+//z++f/1//n/+P/4///6/v//+P///Pr9//////+houv/IBnb/yAc8v8mG+//JR3n/yIb7f8pI9j/vszy/////v/++v3//f78//n////9/////v/4//7++///////1tf3/zYr3f8iGPH/LBzp/xkZ8P8wMdf/3eD3//j+///x+/7//P/4///9/f/8//f/9f/6//v7////////4uj5/zU31/8eFPb/JB3t/yIg5P8mHOr/Kxb0/ykX8/8gG+//Hxzt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+7/JRvt/yYe5/8lG/L/Ixbm/1pQ5P8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7P8iHu3/IRbd/5KS4///////+/v6////+P/8/f///P3////////////////////////+/v///fv9//////+dp+r/KBrX/yUe5f8fG+7/JBv2/yEU5/9PTN7/5/H///z7////+f7//v3+//z/+f/9/P7///75//7++v/9+v7//P77/+z6+v9TUN//GxDu/yUh6v8mH+f/JRvz/x0W4f9lYOD/9f3///z/8//++/7//Pv///3//v/+//r////9//z8/v/6/v//aWra/xwV4v8oHu3/IR/u/x0X3v+SlOz/+v/8//f4+//++/////3///v/+P/3//z//Pr///76+v/8////c3fi/xwS5P8lHfD/IB/n/yMe6P8qG+z/Khru/yEd6/8fHur/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7/8lG+3/Jh7n/yUb8v8jFub/WlDk/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQc7v8oGPP/LRvc/62z7f/7////+f31///9+///+////////////////////v7+//7+/v///v//+f73//X/+/90a+L/Hw7q/x8d8f8dHe//Ix3u/yEP6f+Cf+n/9/////v6/v///P////3////9/v////T//P/2//7+/f/9/Pf//v/5/7a/8f8oGeL/Ihrx/yYg6P8kGe3/Ixvy/yQS6P+qrfT//P/y//v4+v//+v///v/7//3+/P/+/v///fv+//z///+4x+7/JR7X/yEb8/8qH+7/IBHv/z9A3P/k8Pn///39//35/////v///P/7//r+/v/++v///vz6//7////BxfP/LCbS/yIa8f8eG/H/Hx7q/yYf5v8oHOr/Ix3q/yAe6f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvu/yUc7P8mHuf/JRvy/yMW5v9aUOT/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JRrv/yYc7/8kFu//NjPU/8LS8v/5/////Pz3////+f/////////////////+/v7//v7+///////+/fz////9/+Lg/v9IPN//HBfk/x4f6/8hG/L/JBzr/yke2/+stPH/+//+//v7+f///P////78//7+/P/8//z//v/6///9/v/8+/v/+P/5/3x27P8aDer/Jx7w/yUd5/8hGvD/HRHw/0RA3v/f7/z//f/6//75///+//v//P37//78/////f//9v7z/+//+P9hXeb/Fg/x/y4a8f8pG/f/FRna/5qb6///////+fv5//7+///+//7//f7////7/////vv/+/35//b6//9jYNb/GxPl/x8X+f8dG+//Ix7m/ygb7v8kG+7/Ihzr/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+7/JRzs/yYe5/8lG/H/Ixbm/1pQ5P8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8mHOv/JBzr/yMh6f8eFen/RUDW/9fh+v/8//z/+/34///////////////////////////////////+///9+v7//f///8LM9f8xKtH/JRjw/yIZ9P8jIej/IBXq/zkw3v/P3Pf//f/7//77/f/+9////Pv+//3+/f////z///n///75/P/+//j/3OT7/0M72v8iE+//JR/n/yMg5P8jHu7/HBTg/36D4//7/////Pf+/////f/8/v3//P3////9/v/6/e7//v/2/7e49v8kHN//MBf0/yYc7f8XHuT/PjXg/+Pj+//+//n//v3+//////////////7////9/f/8/fv//////7e67f8nIM7/Ixb3/x8Z8v8jHuj/Jxjy/yUY9P8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7v8lHOz/Jh7n/yUb8v8jFub/WlDk/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/ygb7P8mHej/IR3q/yQd8v8hD+v/WlXW/+Lt+//7/v///v7///////////////////////////////7///78+f/4/PH/+//9/6Sj7f8qFtv/KR/s/x8Y7v8mHPH/HhPp/1NU3f/l8/7/+/v///35/P/7/f7//v3///7//f/6/f///Pz+//r4+v/+//3/ra/t/yMa1/8iHuz/KSHk/yUd6f8hGfD/KR/c/7vA8P///////fv+//z//P/8/f////3+////9f/5+/v/9f7//2pt2v8jEOX/KiDv/yAj5f8VEen/foHp///////9+/7///7//////f////7//P7///v9///9/vz/9v///2pp2P8gEuf/Ix3w/yIg5P8mGPP/JRjz/yQd6v8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBrv/yUb7f8mHuf/JRvy/yMW5v9aUOT/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/KBru/yYb7f8iG+7/Ihrx/ykb8v8mFNn/ZWTU//H2/////////P3///7////+//7////////////+/P7//Pn9//79+P/5/Pf//f///4mE4v8fFNj/JR7x/yYd6/8lI+r/GhTi/3ly6//5/f3/+//v//r7/f///P///f/9//f/9f/7/f///vr7//b78v/2////a3Pl/xgV4v8uG/H/Jxrs/yUd9f8hE+z/TULY/+jt+v//////+f76//z9/f///P3///75//34///8//j/ydX0/zAl4v8kGO//Ix/m/xYc8P8lJNr/zcn2///////9/P/////6//3/+v/4/v//+P3///39/P/9//v/xsv2/zEk3f8iHef/IyLj/yUZ8f8mGu7/JR7m/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+7/JRvt/yYe5/8lG/L/Ixbm/1pQ5P8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8lG+3/JBvu/yQb7f8kG+7/JRzt/ycc7P8dFOH/dHPc//f7///y+P//9fz///v/+/////z///3///7//f/9/f3///r///77/v////v/8vj//2dm2v8bE97/KB7y/yAd6P8iG/P/Ixff/5aa5f/7////+/r8////+//9/v///f78//7/+P/+/vv//fr+//7//v/g7P7/S0rU/ycR6/8oG/P/IB7l/yci7P8dEeX/dHLk//f////0+v7//Pz9///9/v////f//f78//n8/P//////iYfo/xcV3f8lG/X/KBrz/yIU6f9QUuH/7Pj///37/v/++/v///75//n//f/4//j///79//37+v//////i4fq/xsV3f8fHfL/IBf0/ysb6/8rHef/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7v8lG+3/Jh7n/yUb8v8jFub/WlDk/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBzt/yYd8f8jF97/fX/f//L+///5/fj//fz9///+/v/8//3/+f3///7+/v//+/////3+//3+9f/4//z/3eP+/1NP1/8fFOX/JCDo/yIc8P8lGPL/Lh7Y/6+x7P/+////+fz9///+/////v/////4////+v///f///vn///n////Dyfj/NibZ/yUW8P8hHuz/IB7p/yQe7v8mGdb/oqTo//j////1+Pz///3////8/v/9//3/+/7+//7+/v/n7v//Tk3Y/x8Y4v8pGvb/Jx/s/xgZ2P+LjOf///////r6+f///fz//f/8//v+/v///v7///39//z7/v/k8v//UlLb/x8T6/8jHPL/JBrp/ycc7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBrv/yUb7f8mHuf/JRvy/yMW5v9aUOT/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8lHO7/JBvs/x8c8f8YEeb/gYDj//r//P///vn///v///v9///4//7///z////+//////z//P/4//X8/P/3/f7/3OD7/0VA2/8gFuH/JRv1/yIY9P8nG+r/NynT/7zD8//+/////P37/////P///P////z+/////f///f//+Pr7//v//v+ipu3/IxTh/yIX+P8gHen/JR7r/yYZ6v8xKNv/u8b1//r////8/Pz///f////6/v/8//H/9vr6//7////GyvD/LyjO/x0a8P8cH+r/JRzs/y0g2f+3ufX/+//9//r79v///v////r////+/f/+/Pv/+Pb+//j////H1fL/NyrT/yYY7f8gHPT/Hxzt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+7/JRzs/yYe5/8lG/L/Ixbm/1pQ5P8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/Ixrs/yMa7P8kG+3/Hxvw/yAd8v8iEuD/gH7k//X////6/f///fz7//7/+P///f///v/7//v/+//5/v7//P7///r69/////X/ydb6/0M05v8jEuz/JSLo/yMe7f8iF+r/OTXb/9DR+f////3/+f30///6/v//9/////78////9v///vv/+/z0//T//f9+gOz/Gwrr/yYe7/8nIOj/JRr5/xoT7v9COuD/2OL6/////f/9+f////z9//z/8f/6/fz//Pr7/////f+SkOn/Fhbf/x0f8P8oGvT/IRbr/z853f/X3fz//f/4//37/f//+//////8//7++v///v//+Pn6//3/+/+rqur/KRPi/yAc9f8bG+//JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7v8lHOz/Jh7n/yUb8f8jFub/WlDk/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8lGu3/JR/j/yIh5v8WDun/b3vo/+v+///8/fn//vz5///////9//r/+v/9//r8///9+v////79//z98P/4//f/w8n3/z0u2P8lF+j/JBv0/yUg8P8cGOP/RjrY/9DU+v/2//f/9frw///9/v///v7////6///7/f//+v3/9P/x/+j4//9nYej/IA/h/ywd8v8gGvD/HR3x/yIT6f9eWdn/6vX9//n//v/6/fj//fv+//39/f/+/vf///v///H2//9dYuL/GhLn/ycd7f8lIOr/HhTm/1lY3f/o9P7/+//8//35///9/Pr//P/6//7//f///P7//f38//v///95c+T/GhHi/yQf8v8kG+z/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvu/yUc7P8mHuf/JRvy/yMW5v9aUOT/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yke6P8nG+n/HyDo/xsg7f8XD+v/bnLf/+72/f/9+f///f3+//7//v/8/////P7///39///+/f////7+//r98v/8//n/wsf0/zwq4f8lFe3/IyDm/yQh7f8hE+n/Qj3V/8vX9//6//v/+v32///+/v///f////r///78/f/7/fn/9//7/+Lv+v9XTeD/IA/m/yYk5f8gHOv/JSDo/yET4f9rauL/6/r///b5/v/8+f////7+/////P/++f///v///9rj+/9EO93/IRze/ygh5P8mHO7/GhPi/29y4P/0/v//+fj+//v7+//5//z//f/+////+//++P///f/9/+Pv/v9QStj/IRjf/yYd7v8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+7/JRvt/yYe5/8lG/L/Ixbm/1pQ5P8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/Ixrv/yMb8v8fGev/JR/n/ywg6/8mE9z/ZmXZ/9/n/f///////fv+///+///+//v//f/5//r//v/8+v////L///r49f/4//j/ucP5/zgw2v8gFer/JBr0/yEg9P8cFef/RDjX/9HR+f//////+/z9//7//f/4/vj/+P36///7///9/Pf//P/5/9Tg/P9EQ9v/HhLp/yoe7v8iHuj/Ix/x/x0S4f97deb/+vr/////9v/+/vr/+vz///r//f/9/Pf//////8DJ8/8nKdn/Kxjt/ycb7f8gG/n/HhLd/4qG4f/+////+Pv5//n9///7//////3+///9+f/6/ff/9////8DG9f8zKtX/Ixrt/yUc7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQa7v8lG+3/Jh7n/yUb8v8jFub/WlDk/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8iGvD/Ihru/yQc7f8nG+7/KB7o/yse7P8dE+L/UFTY/9nk+P/6////+vf+///8/f///fv//P/9//n8+///9f///vz9//r99v/8//7/yMP5/0M62/8UE+z/Hx7x/yIc+P8cEu7/RDvV/9bS+P//////+fv1//n/8v/5/fj///7+///++//6+/X/+//8/9LU/f8+MOT/GhHv/ygd6v8lHuf/JR70/x4P6/+FhOv/+f/7///89P/69v//9vz6//7+9v/++/r//v///6Os8/8eF+P/Ihfz/yUc8P8kGfX/IBfd/46V6P/3////9/n9//v8/f////b///74//X9/f/s/P7//////6CT7v8gGdX/IiXi/x0a9f8jGu//KRvr/yca7f8jGvH/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvu/yUb7f8mHuf/JRvy/yMW5v9aUOT/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8jG+7/JBvt/yYd8f8eE+L/R0HW/8TL9f/9//n/+/v2///5///+/Pz//P76////+//9/v///f7+//389f////r/0db3/z1D0/8WEen/Jx7y/yoi5f8kGN7/PzfY/8TH9f////7//Pv6///8/v/+/f3/+//6//r/+//39/7///7//8/V+P86Otf/JBjn/yQi5/8iHe//KRzy/ycc1v+Qkev///////r3/f/48f3//fr7//7++v/29/7//P///4qU7P8eHc7/JB/s/yAc8/8iG+3/KBnZ/4+R6f/2////+/35//7+9v//+f//+fz///T/9//+/vn/+vf//2hl3/8aF97/GyDr/yAd6v8pHOr/KRnx/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kGu//JRvt/yYe5/8lG/L/Ixbm/1pQ5P8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvs/ykc8v8mEO//Oiva/6y17v/3//r/9v3y//34/f//+/7//f/6//j9///4/P///v/4//z97//+//3/3N36/1BR2/8fFdX/Mh/w/ycd8/8bFuz/Mirc/7u58P///////fn+//n7///2////9f7///r8///8/PX////4/8/V9P85PNP/FBTv/yQd8P8uHOb/Kx3m/x4Z4P+Plub//f/////3/P//+v3/+P78//j8/f/++/z////9/4WJ4P8SFtf/HSLo/ywb8v8xGez/IhvZ/4uS6//3/////Pv+//75/P///vr////1//78+P//////2N/8/z433P8cHeD/ISHp/yQa7v8oHOr/Jhzq/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7v8lHO3/Jh7n/yUb8v8jFub/WlDk/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBrv/yYc7/8kGOz/Jxfk/42T8//v//n/+/72//34/v///P///f7+//z//v/9/P///vf+//z4/P////z/6Oz8/2Vi4P8TDuf/Gxj9/yYZ+P8oGOX/KCfQ/5yg7P/6////8/35//r++P/9//v//v/4//79/P/99/3//////8nU9v8/POL/HAzv/ykd8f8lHev/ICDq/x4a2v+KiOj/+v7+//z+8P/7/fr//v77//79+P///vv/+fr//3t95/8aFdr/Jx/r/yYe7P8gGfb/HBfX/31+4v/y9//////3//799v///P7///3///v7/f/9////srvw/ygg3P8hGPT/IR3s/yYe5v8pGu//JBrt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8jGuz/JBvu/yUc7P8mHuf/JRvx/yMW5v9aUOT/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7v8kHen/IR/m/yEe7v8iG+7/IxXj/3Ru6f/n7f7//v/9//z7+v///vX////2//z7/f/7+v///f3///7+9v/9//z/6fb//3eB6P8dFeb/Ihjs/ykm5f8dFvH/HRji/4KL5f/0/f7////x//798v//+/3/9/v///b8/v/5+f3//////9nd+/9JStr/FRPm/yUe8v8pG+z/KB3v/xwT4P94f+n/8vr////99v/++/X/+f38//v8/v///fz/+vf//4B56v8ZGtn/HCDt/yQe8f8iGPf/Gxfb/2tw2v/o7v///v////78///6/f//+v7///v89//5//z/h4Pw/x8O6/8kIOz/Ixvr/ycZ7v8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7P8kG+3/JBvt/yUc7v8jGu3/JRzs/yYe5/8lG/L/Ixbm/1pQ5P8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQd6v8kHuf/IR3r/yEf6v8mHuv/IxDi/1JL2P/J1/T///////z7+f/+/ff//v/2//n/+v/5//v////7//b8/v/3/fr//v/9/56d6f8nJ9b/GBri/yoh8P8hGe//GhXg/3Bo5P/r6v7////4//n6+//1/P7/9P/9//r++v/++/f////6/9zt+v9UX9f/HQ/k/zEY+/8oH+j/ISLq/xcM7f9xZfD/8vL+//3/+f/x+/7/9//9//7+8v///fb/+fn//3t+6f8ZG9T/JR3m/yUh7f8iHvX/Fw7c/3163//9/////f75//v//f/5/////fz8//z//v/u8v//W1be/xwT4/8kIOv/Ixru/yQb7v8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8lHO3/JRzt/yce7v8kHO3/JRzt/yMa7v8lHO3/Jh7n/yUb8v8jFub/WlDk/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+z/Jhnx/ykZ7/8nHub/Jhnw/yUY9P8oHvD/Hxbh/zAu1f+gpez/+fn/////+//+/Pf//Pz9//z8/v///v7//v/8//78+//7+vn//f///7m/9P8/Otj/GhPi/yUf7v8mG+//HhTg/01M2f/G0Pr/+f////v7+P/++/n//v39//3/9P/7+vr//v3//+z2/P9tc+H/GBPg/yEb8P8lIen/Jx3v/x8T3/9eXd7/3+T+/////f/2+fz/+v73//3+9v/++////P///42S4v8cGt3/IR3n/yce8f8aEev/b3Pc//v////+/vb///39//z9///8/f///vr8//7/+//N2Pf/MzXW/x4Z7P8jHPL/Ixvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvs/yQc7P8kHOz/JBvs/yQb7f8lG+3/JRzt/yYc7v8nHu7/Jh3u/yEY7v8dFOz/Fwzp/yEX7/8kG+3/Ixrv/yUb7f8mHuf/JRvy/yMW5v9aUOT/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8lGu7/Jxnw/yca7v8nHOv/Jhn0/yMX8v8lHvD/IBfw/yAa1/90cuD/5Or8///////6+f7//vf////8/v////P///76//38///6+v3//////9rc/P9aWt//HhPb/ycd6v8jIfH/FhTu/ywr4f+kp/P//f////z6/P/79vz//P/y//z5/f/+8/////36//b+/v+HkOn/HyLU/ycV7f8uI+b/ICjg/w8R6P9GQeP/0NH2///////3+/3/+P34//7++P///PX/+//+/5Wd9v8mIN3/Ixjv/xYT4v97hdf///////38+//+/v///P7///3+/////fr//Pz3//3///+jquz/IRrd/yIZ9f8oHO7/Jxnu/ygb7v8mHOn/JR3o/yUc7P8kGfP/Ihb2/yEX9f8kHPL/Ix/v/yIg7P8dGun/GRbp/xQP6v8eFeP/OS3W/1RN3P99g/H/ZGr1/yIY5f8mHOz/JRzt/yYe5/8lG/L/Ixbm/1pQ5P8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+z/JBvt/yQb7f8kHe3/Ih/s/x4W3P9KQt3/t7n3//n+///7/vb//Pz4//79/P/+/fz////9///++P/5+/j/+fz9//L0/v+Ki+T/JRza/x4V7v8iI/D/HRvp/yQY3v98fuP/5vP6///////5/fP//v72///6///++vz//vz6//////+qr+v/Mina/xwU6f8eI+r/Ih/y/x0X5v8vMNT/t7X3/////f/8/PP//vj7//36/P/2+/3/+//+/7G58v80Mtz/FQzg/46R6f///////vz+//z+/v/6//v///7////+//////n//P34//j7//92dt//Gxba/ycf7P8lHO//Ihnu/yQc7v8jHer/JCHp/yUj6P8jI+H/Ixzm/x0P7f8dDOz/IxXj/zYx2v9OUdn/coLs/6ey9v/a2vn/9P39/9ns/f9CR9f/Ixbs/ycY9v8lHOz/Jh7n/yUb8v8jFub/WlDk/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQc6/8jH+X/KB7v/yQN9/8tFub/hYLn/+jy+//7//z//Pv9///4///+/v7/+v/1//f8+f/59v///vv7//n//v+yu/H/RD7U/xwW1f8nIev/KR7v/x8U1f9ZT9z/y8z2//z////3+fn//Pn9///9/f/7/P//9/f+///////F0fj/Q0jc/x4M7v8wGfT/KiPp/xYb5/8iINz/k5Lr//n7///6/P7/8/n///X/9//8/fD////3/8nK/f9IPsv/mqDg///////9+/7//v3+//z/+f/9//7//f3//////f/8/fT/9/z8/+Hp/v9LU8j/Exvg/xwe9f8fHPn/HRvw/x4b5v8ZFOT/GhDo/yYa2P89Mtj/XlbY/4uG6P+4tvH/3d37//X3/f/+//////78//7//P/z/v//Y2Ld/xwR4/8kH+7/Ixnz/yUb7P8mHuf/JRvy/yMW5v9aUOT/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvu/yUX8/8jHe3/HiDn/yEc8v8eDen/Ukbh/7vB9P/8/////f79//n9+v/9/f///vz+///++v///vn/+vz1//3//f/d5vz/cW7j/yMW3v8jFe//Kh39/yAT7P8wJtz/kZLs/+zy////////+/32//z/8//7/vz//Pv7///////r7P3/dnHn/xwS4/8dFfL/JyHv/yIc7P8YF9T/X2nh/9fm/f///////Pz6///8/f/8+fj///3+/+Dl9v/T4O3//f/////9/v///P///v/9//r//P/6/f///v3///799v/6+fH//P/+/8PO9v8jJt7/FxXh/x0U5P8kGd3/OjPb/1hY2P+Ch+r/s7j3/9jd/P/z+v///v////////////v///78//32+//89vv//////5iO8f8mDuz/Jxz0/yId6/8jGu//JRzs/yYe5/8lG/L/Ixbm/1pQ5P8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+7/Jxfz/yIc7v8aJN//FiTe/yAc9P8jEe//Lh7Z/3d54//X5vz////6//779P/+9/v//fr8//b9/P/7/f3//vz9//7////z/v//oq3t/zoz2v8dEeL/IR3y/xkd8/8dFOL/YFbe/8/S9f///////fr9//36/P/+//j//vn9///9/f/y//r/lK3n/zEv3P8jEeb/JSDs/xwg8v8REun/RTvj/8W9+f//////+Pv8//36/f/++/z//v78//v//P/7//7///7////9///+//r/+v/3//j+///9+/////3+//7++f/9/vv//P///5qe7v9cWcv/jojg/7i28//d4vn/9fz///////////////////z+///7+////fr///77///++///+/z4//z/+v+7ye//LSHc/yUV9/8lHur/Jxvt/yYb7f8lG+z/Jh7n/yUb8v8jFub/WlDk/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQa7/8mF/T/Ihzs/x4d7P8cHe7/HiHj/yYj4v8pGfH/GRPj/z482v+rq+3/+vv8////+v/4+Pz/8Pn///n+/////v7//v39//r6/v/4////0+b3/3Fv2v8lHdf/FRrm/yYf9v8hFOL/OijZ/5yO7v/v8f/////9//78+P/5/P3/9Pv9//f5/P//////0Nf1/1pa2/8VF97/Ihfy/zEc9f8lF+H/KCLZ/4iM6v/v+P///v/6//v3/f/99P///Pn+/////////P////78////8v/9//j/+f////v9/////f////7////+///8/v7/9/75//n8/f////////7////+/////f3//vz4//76/f/++/////78/////P/8//3/+f7///f8///0////2O37/0FG2/8aGOT/IyLl/yce5/8pH+X/Jh/l/yUb7f8mHuf/JRvy/yMW5v9aUOT/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBzs/yQd6v8lHer/Jxjx/ycX8/8nHej/JSDj/yUd6/8nHu//Ihbv/yQY4P9eYNz/wsz3//z//////f3//Pr///3++f////n///n///r1/f/9//3/9/v//7Cy8P9HRtT/HxLe/yYc9P8kHuz/HxPf/1JO2/+6x/T/+v////b//P/3+vz//fT///z1/P////7/7fj//42Y7P80K9X/JRTi/ykl6v8dIOT/GxTf/11Z3v/M1/n/+v////z6/P/++vv///z////6//////3////4///+/v/6////+f/+//7//P///v7///3///3+///8+/v//vn9//z3/v/9+/v//v31//7++f/+/P////79////+v////n///73//3/+f/7//3/+/7+//j+//90c9z/GhLh/yIc9v8lHen/KRfz/yUa8P8iGfL/JRzs/yYe5/8lG/L/Ixbm/1pQ5P8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7v8kHen/IyLf/yYa7v8pF/T/Khzq/ykc6f8mGvD/Ixrw/ycd5/8nHuz/Hxj5/xYQ8f8oJ9P/gIPb/97b+//9/f//+//9//37/P//+v////z9//7+9P/5+/v//////+jo/P+Hger/KSjc/xEa3f8fJ+n/HRfm/ycb4/92eOX/2+T6/////P/+/f3/+/r5//v98//+/Pz////+/8jQ+f9ZWOr/HBDl/yUT9/8qHvf/FRPu/y0t4P+Xn+7/6vX3//3+8//++/3///v///v8///8/P////3///z//v/6//z//f/6/////P/+/////P///////P/+/fz//f39//3//f/7//r/+v/7//v//v/+//z//f/+//3+/f/+/P7///z9//z5/v//////qaTt/yoa1P8oHev/Ihrw/ycY8v8oHuf/Ihvv/yAa8v8lHOz/Jh7n/yUb8v8jFub/WlDk/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JB3q/yQc7P8jGfH/Jxz0/yQd6f8YGNH/LjTW/4mQ7f/k6v7///////39+v/9+fr//vv+//r8/v/4/Pz//v78//3////E0Pf/Ymnb/yEe1/8eFuz/JBr1/xsN7v85N9T/l5/o/+nx/v/+/////Pv8//37+v/8+vj////+//L2//+iovD/Pzfa/xoU4f8WF+z/ExDl/yclxf+Zn9z/+//////++f///v//+Pz///n9///////////////////////////////////////////////////////////////////////////////+///8//z/+f/3//7/+P/++/r//f///8rR9P80Mdv/Ixnv/yQb6/8kG+3/JBvt/yQb7f8kG+z/JBrv/yUb7f8mHuf/JRvy/yMW5v9aUOT/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kHer/JBzr/yQa7/8lGvH/JBnv/ycg7v8hHOX/IBbc/0U92P+cpev/5/b7//z//f/8/f7//fr6//z9+//1+/7/+vz8/////f/7+P//tK/1/1BK5f8aE+f/GRH1/yAX9v8eFt3/TEnX/6qv8P/w9v7////+//79/P/9+/z/+P31//r//P/Y4vn/enjV/19i0f+ZnO3/0dL6//Dz/v/7+/3///z+///8//////z//v/6//////////////////////////////////////////////////////////////////////////////7+//7/+//9/v///v39///+/v/s8v//V1fV/yAW4f8mHe//JRzu/yQb7f8kG+3/JBvt/yQb7f8kG+7/JRvt/yYe5/8lG/L/Ixbm/1pQ5P8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kGvD/Ixjy/yQX9P8kHPH/Hhnm/x4b1/9ISNr/n6Xv/+jw/P///////v76//z9+v/++f///ff8//z79f////v/7O///6Oi8P9CSNT/GRfY/x8W+P8dEPj/JBbh/2Bb3f+3tfP/9fL7////+f/7/fn/9/b+//n2///9/v7/9vz9/////v////v//v73//38+v//+/////v/////+P////b//////////////////////////////////////////////////////////////////////////v////n///3////7///8/P3//f///4R+6v8cFt7/JCDq/yQb7f8kG+3/Ixrs/yQb7f8kG+3/JBvt/yQb7v8lHOz/Jh7n/yUb8v8jFub/WlDk/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBnx/yQZ8f8kHOz/JB3p/yMd6P8kHOz/JBvv/yQX8/8mG/T/Ih7t/xwZ5P8fF9v/T0fd/6Kl6v/q8Pz///////7+///7/fj//P31//z8/P/+/vz////8/+br/f+anOf/Qz3e/x0T5v8fEuv/Hg/U/0E1yP+wqN3/+vr///n9/f/6+f7//fr9//3++P///P3//fv7//7/9v////b/+//8//v+///+/P////7+/////f/////////////////////////////////////////////////////////////////////////+//7+9//+/Pz//Pj9//////+zt+7/KBre/x0Z8P8hHuv/JRvt/yMb7P8kG+3/JBvt/yQb7f8kG+3/JBvu/yUc7P8mHuf/JRvx/yMW5v9aUOT/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kGfL/JBny/yQb7f8kHen/JB/m/yQf5f8kH+b/KB3o/yob6v8kGu//Ihj4/yEY9/8gGef/HxrR/0dB3f+Vk+//3uX6/////////P///ff+//f6+P/2/Pb///39///////j8fv/kp3j/2tt2P+jre7/0ub6/+/3/f/09///9vz+//n/9f/9//b///7+///9/v//+/////v///3+///5//3/9//+//n////9/P////z//////////////////////////////////////////////////////////////////////////////Pz5//n2+f/9//3/1938/z812/8gHeL/IR/u/yEY8v8kHOz/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+7/JRzs/yYe5/8lG/L/Ixbm/1pQ5P8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvv/yQa7/8kG+3/JBzr/yQd6f8mHub/KB7n/yca7v8mGPL/JRj4/yMX9v8mHPL/HRjo/xcS4f88L+X/iH3q/9PR9//4+v//+v////X8/v/8+P7//Pn7//v7/v/5////+/////v////5//r/9/75//r8///6/f3/+v/y//z/9f/9/v///f/+//7+///++////f3///3//v/8//v//f/9//79/////f///////////////////////////////////////////////////////////////////////////v/+/Pz/+vj+//T6/v9kX9//GhPo/yEh6v8oGu3/KBrv/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQa7/8lG+3/Jh7n/yUb8v8jFub/WlDk/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JB7p/yQd6f8kGu//JBj0/yQX9f8kGPP/JBrw/yMY9P8jGfL/Jh/m/ykg4v8pHej/Jxnv/yQZ8P8mHe//JBvw/xwT8f8WEOj/KynZ/2dp1P++ve7/9vP////////+////+vv8//r4+P/9/Pz//fv9//73/////vr//f73//78/v/+9////vv///3//f/8/v//+/79//z//f/+/f////z//////v////n////4/////P////////////////////////////////////////////////////////////////////////////v8/f//////l43m/yIZ1v8dHPD/Hxf2/y0Z7P8qHOv/Ixvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvu/yUb7f8mHuf/JRvy/yMW5v9aUOT/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+z/JBvs/yQb7f8kG+7/JBru/yQb7v8kG+3/JBrv/yQb7v8kHOz/JRzr/yUc7P8lG+z/JBvt/yQb7f8kG+7/JBvw/yUd8v8iGuz/Gxbc/yIe2f9PTOP/op/l/9zg+//6/v///v/8//v+9v/9+vv//vb+//37/v/8/vr////6//77/P//+/////v////7/f/+/vv//v/9//38///8+////P7///3/+//+//f//v/6///////////////////////////////////////////////////////////////////////9/f7//P///7e/7f8rJ9D/JRvw/ygV+P8pH+b/JBzs/yMX9P8kHOz/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+7/JRvt/yYe5/8lG/L/Ixbm/1pQ5P8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+7/JBvt/yUc7f8mIOz/JCDo/x4W5P8gDuj/OS3g/3Nx4v+8w/b/7/j9////+//9//b/+/b8//75/////vj////5/////v/+//z/+//y//7/9/////7////+//7//f/9//3//f7///37///++/////////////////////////////////////////////////////////////////////////39/f//////rrHl/yUe0f8jG/L/JR3q/yUd6f8hHev/Ihzt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQa7/8lG+3/Jh7n/yUb8v8jFub/WlDk/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+z/JBzq/yQc7P8kG+z/Jh3v/yQc6/8lHun/JCHp/xkj6P8ZG+//GQ3t/ygX4v9bUOH/nZ/q/9vl+P/8//7///////z9/P/7+vr//v39//7//v/8//7//vz////7//////7////5////+f////3//P3+//39/v////////////////////////////////////////////////////////////////////////////36+//3/P//amvj/xkO7v8iIen/IR7o/yIa7/8jHOr/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvu/yUc7P8mHuf/JRvy/yMW5v9aUOT/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQc7P8kHer/JB3q/yQc6/8jGuv/JRzu/yUc7v8iHOn/HSLj/x4g6f8iHO//Jhrx/yMU5/8jFdz/PTDj/3x16/+9wfX/6/f9//v////8/v///fn///78/f///P7//vz+///+/f///fz///79/////P/8//P//P/1/////////////////////////////////////////////////////////////////////////////vv9//v//v/P3/n/Mirj/x4W8v8gH+j/JBrz/yQa7/8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+7/JRzs/yYe5/8lG/H/Ixbm/1pQ5P8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQc6/8kHOv/JBzr/yQc6/8kG+3/JBvu/yYa8P8rGPD/Khru/ygc7P8lHev/JR3u/yId8f8cF/H/Gw/l/ykg2v9UU9z/nKLv/93l+f/8///////9//j++P/4/vf//P3y//77+v//+f////r///3++v/+//j//////////////////////////////////////////////////////////////////////////v///vb/+fr5//z//f+Xm+7/HhPi/yQb+P8kGvH/Jhzu/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7v8lHOz/Jh7n/yUb8v8jFub/WlDk/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+7/JBrw/yQb7v8kHOv/JB3q/yQc7P8kG+7/JRrw/ywZ7v8rGu3/KBrt/yUc7P8jHOz/IB3r/x8e7P8iHu7/IRzs/x0V5f8gFNz/QDTd/3x64//AyfH/7ff///r////6//v//f75///6////9////vr///7+/////////////////////////////////////////////////////////////////////////v/9//z/9P//+v///fz6//H6/f9aWdn/HhDs/yge8P8kG+n/JBvu/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBru/yUb7f8mHuf/JRvy/yMW5v9aUOT/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7/8kGfH/JBrv/yQc7P8kHer/JBzr/yQb7f8jG+//Ihrx/yIb7/8jHOv/Ih3p/yMe6f8kHer/JBzs/yUY9P8jGfL/IBzu/yEc8/8dFfH/GxTl/yYi3P9aUd//qKDp/+fq/P/9//r///75///9/////f/////+//////////////////////////7////////////////////////////////////////////9////+f/9//77/v/+8/3////8/8PL8v8tKNP/JBvs/yUd7v8kG+3/JBvu/yQb7f8lG+z/JBvt/yQb7f8kG+//JRvt/yYe5/8lG/L/Ixbm/1pQ5P8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7v8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8iG+7/Ihvu/yMb7f8kG+3/JBzs/yQc7P8lHOz/JBvt/yQa8P8jGvH/Ihru/yId7f8kHu//JBry/xwW5v8aEND/kpTi///////8/fr///79//7+///+//3///7////8/////v/////6//7/+f/7/v//+/v////+//////7////8/////P/9//7//P////v+///7//3/+f7+//r8///8/fb//////4yI3v8UFeH/IiHt/yQc6f8fFvf/Ixvr/ygg4/8oHOv/Ihvv/yEb7v8lG+3/Jh7n/yUb8v8jFub/WlDk/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvs/yQb7P8kG+3/JRvt/yQb7f8lHOz/IiDv/xwU5P+Ii+T//f////z9/v///v3//v3///7//P////3///7////+/////v7///7+//79///9/P//+v7///v////8//7////9/////v///v////z+///9///5////9v////38/v////z/5un+/0BG2f8cFOn/Jh/q/x8e7P8hGfL/KBzp/ykb7P8iG+//IRzs/yUb7f8mHuf/JRvy/yMW5v9aUOT/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8gHu3/GxPh/4qN5P/9/////P39///+/f/+/f///v/9/////P/+//v//P/+//z8///++v////3+//7++v/7/Pr//P3+//78////+////v7///3//P/9//j///v///7/+//5/v3//fj///v49v////v/s7Xt/yoY4/8lH+3/HSPg/x8Y9v8mF/b/KBvt/yMc7P8iHO3/JRvs/yYe5/8lG/L/Ixbm/1pQ5P8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yAe7f8bE+H/iozk//3////8/f3///79//7+///+//////7+//7/+P/5//z/+fz///37/////vr//v7x////+v////r//v38//38/v/7/v//+P7///j9/////f7////5//r+/v/8+////fz3//v99P///P//dmzj/x0U4f8gH+n/Hhvw/yMW9/8nHen/JR3p/yMY8/8lHOz/Jh7n/yUb8v8jFub/WlDk/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/IB7t/xsT4f+KjOT//f////z9/f///v3//v7///7+/////f///v/8//z/+v/4/fv/9vz9//z//v/r7fb/vbnz/+bn/v/6///////9////+f/9/P3//PX////9+//+/vr/+/7+//3//v////3//f39///////Z3Pj/OzPb/yIY7/8hIej/Ihrx/yYe5v8mHen/JBb4/yUc7P8mHuf/JRvy/yMW5v9aUOT/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8gHu3/GxPh/4qM5P/9/////P39///+/f/+/f///P/+//3+/////f/////7//v+9v/x+vz/8fj//3h63P8VFdr/ODjf/2xu5f+ur/T/5+X5///+/v////7//fz///r7/v/7/Pr//P36/////v///v///vv+//v///+cnez/IhrT/yQh6f8hG+3/Jh3o/ycc6/8lGPT/JRzs/yYe5/8lG/L/Ixbm/1pQ5P8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yAe7f8bE+L/iozl//3////8/f3///79///9///7//v/+//8///7/////P7//P33//n///+NkOn/HhvV/yIi6P8hG+//GQ3p/yIV4/89N9n/a3Lg/56r8v/a2vn//f3+////+////////f79//n99f/9/P3/9/n9/+z6/v9ZXdT/HBHs/yQd7v8mG+3/Jhru/yUd6f8lG+3/Jh7n/yUb8v8jFub/WlDk/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBzw/x8Q5f+LjOX//f////z9+v///vz///3///r/+//6//r///v///z8+v/3//3/oan0/yQe2/8kHOv/Jh3q/yYd6/8mHu7/JR7u/x4Z6v8VEuP/GBbk/zQv4f9nZ+T/pKnv/9jb+P/2+//////////////6+Pv/+//9/8fH9f8yI9n/JBvr/yMe6v8pHuj/KBzo/yUb7f8mHuf/JRvy/yMW5v9aUOT/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8lHPH/IBDl/4uM5f/8////+/36///++////f//+/78//v+/f/9+/v////9/77G9f8uLtT/Hhfn/ycd8P8jG+3/JBvt/yQb7f8kG+3/JRzt/ycd7/8mHe3/Gxzm/xYU4/8eFOP/OCzj/2Vc4f+goOb/09z1//b8///9/f7//P///4WN3v8bFNr/Ixf7/yYW8P8oGu7/JRzt/yYe5/8lG/L/Ixbm/1pQ5P8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yIe7f8cE+L/iovl//3////8/f3////8/////f/+/vz/+fn+/////P/Y2vv/RDfc/x8W5P8mIuf/JRfx/yUb7v8kG+3/JBvt/yQb7f8kG+3/JBvt/yQc7f8mHOz/Jxvv/ykb9P8jFu7/HxTj/x0Y1f8vL9v/XFbm/5WY5//H3/L/1e/+/0xR3f8cDvb/Jhf6/yQb7P8lG+3/Jh7n/yUb8v8jFub/WlDk/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/IB/r/xoV4P+IjOX//f////z8/v///v3////8//z8+v/6/v7/5+/9/1pS3P8gD+v/JBv1/yIZ7f8nG+7/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yYb8P8mHez/JB/m/yIg5P8iIOv/IRz2/xoT+f8XEez/HBLe/zIl2v9fWuf/VVLw/x8Y7v8iIeX/JSPi/yUb7f8mHuf/JRvx/yMW5v9aUOT/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8gH+z/GRXg/4mM5f/+/////Pz+///9/P/9/f7/9/78//L7//9wc9T/IBXa/yYc9/8iG+//JBvv/yUb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+z/Ih/o/yEe6f8iHOz/Ixvv/yUb7f8mHOv/KB/p/x0k5f8eG/f/KRD//yUR6P8iGOH/Ixvw/yEZ9P8iG+//JRzs/yYe5/8lG/L/Ixbm/1pQ5P8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yAe7v8bE+L/i4zk///////9/f3//fz///b2/v/2////hovk/yEY1v8iH+//Ihzv/yYc6v8kH+f/IRrw/yQb7v8kG+3/JBvt/yQb7f8kG+3/JBvt/yMb7f8gGvH/IBn0/yMY9f8lGPP/KBnv/ysc6v8tHuT/Hx7p/x4b8P8pG+z/KyLi/yYk4P8hHev/Ihf3/yUX9f8lHOz/Jh7n/yUb8f8jFub/WVDk/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/Ihzy/x0Q5v+NjeT///////38+//59/7//f///6Wq6P8iHdT/HRnz/xwa9P8kHOr/LB3o/yMc7P8dG/H/Ixvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yMc7f8iHO3/Ihvu/yIb7v8iG+7/Ixzs/yMd6/8jHOz/Jx7n/yoc6f8nF/T/IBry/x8g5f8mHuf/KBnv/yUb7P8mHuf/JRry/yMW5/9aUOT/Ixru/ycd6v8nHOv/Ixzq/yId6/8jG+7/JBvv/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8hHe3/HxLo/4+J5v//////9/j7//z///+8wfP/MSnP/yEY7f8fHfH/Hhj0/yYd6/8pHOn/JBnx/x8b7/8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JRzr/yQd6f8jH+b/IiDl/yEf5/8fHez/Hxvw/yQa7/8oHOn/KBvs/yUX9v8gGvH/IR7o/yYZ8P8nGPP/JRzt/ycb7P8lHO//IBri/1dP5v8kGvL/KB3o/yke6P8kHOz/IB3r/yEb7v8kGvD/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yIh6/8eEuP/jobo//7////5//z/0Nn3/zg21v8eFuv/Jh3u/yQb7P8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yMd6f8lHOz/Jxny/yMc7v8cHN//Uk7m/yMa7v8mGvL/JB7n/yIa8v8gG+7/Ih/n/yQa8f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/Ixzy/x8T5P+Kj+L/+v///+Pp+f9YRt7/IBHr/yMk5P8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/Ixvv/yId6v8kG+//JBr2/xsV5f9iYtz/Jx7i/yMX+P8gH+f/IRj3/yMZ8P8jIeL/Ixny/yQb7v8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7P8lG/j/HBLi/4OT1//r////Z1zg/ycQ5P8mHfj/Hhzr/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7P8jGfP/IR7p/yAc7P8iF/v/HxLm/4SI2v85MdT/Ixbz/x0g6v8hGPb/Jxnx/yQg4v8iGfH/JBvu/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvs/yUb9P8aEt//gI/m/3+D7f8iCer/KyDp/x8g5f8fGvH/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvs/yQZ9P8gHOr/IB7r/yMY+P8sHtr/tLrt/3Fp2f8jFeT/Hh/t/yIa7v8qGfD/JR7o/yAc7v8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/Ixzr/yQg5f87Peb/KB3s/yYV+P8kH+X/ISDm/yIe6f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBnx/yQc7/8gHun/Ixjq/0xBz//m7Pr/wLju/ykc3P8fHPH/Jh/l/ywa7f8lGvD/Hh3r/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8iHuj/IRvs/x8d5f8gGfD/IRrz/yMh4v8mG+7/JRnw/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8kG+3/JBvt/yQb7f8nGu3/Jxjy/yIf7P8bEtn/iobd///////99P//Zlbp/xsW4f8oJt7/KRjv/yUW9/8gH+X/Ixvu/yQa7/8kGu//JBrv/yQa7/8jGu//Ihvv/yQb7v8lG+7/JRvu/yUb7v8lG+7/JRvu/yUb7v8lG+7/JRvu/yUb7v8lG+7/JRvu/yUb7v8lG+7/JRvu/yUb7v8lG+7/JRvu/yUb7v8lG+7/JRvu/yUb7v8lG+7/JRvu/yUb7v8lG+7/JRvu/yUb7v8lG+7/JRvu/yUb7v8lG+7/JRvu/yUb7v8lG+7/JRvu/yUb7v8lG+7/JRvu/yUb7v8lG+7/JRvu/yUb7v8lG+7/JRvu/yUb7v8lG+7/JRvu/yUb7v8lG+7/JRvu/yUb7v8lG+7/JRvu/yUb7v8lG+7/JRvu/yUb7v8lG+7/JRvu/yUb7v8lG+7/JRvu/yUb7v8lG+7/JRvu/yUb7v8lG+7/JRvu/yUb7v8lG+7/JBru/yQc6/8iF/b/IiDo/yAe6P8iGPb/JCHi/yga7/8oE/v/JBvt/yUb7v8lG+7/JRvu/yUb7v8lG+7/JRvu/yUb7v8lG+7/JRvu/yUb7v8lG+7/JRvu/yUb7v8lG+7/JRvu/yUb7v8lG+7/JRvu/yUb7v8lG+7/JBvv/yQb7v8kHOz/Ix3q/yMd6v8kHOv/JBzr/yUd6f8lGfP/Ixrq/zsw1f/Y2Pv////////////OyPr/Ni7P/yQe5/8iFvf/Jhnv/ycf5f8hHOz/JBvt/yca7/8oGu//JRrv/yEb7/8gG/D/JRru/yYa7v8mGu7/Jhru/yYa7v8mGu7/Jhru/yYa7v8mGu7/Jhru/yYa7v8mGu7/Jhru/yYa7v8mGu7/Jhru/yYa7v8mGu7/Jhru/yYa7v8mGu7/Jhru/yYa7v8mGu7/Jhru/yYa7v8mGu7/Jhru/yYa7v8mGu7/Jhru/yYa7v8mGu7/Jhru/yYa7v8mGu7/Jhru/yYa7v8mGu7/Jhru/yYa7v8mGu7/Jhru/yYa7v8mGu7/Jhru/yYa7v8mGu7/Jhru/yYa7v8mGu7/Jhru/yYa7v8mGu7/Jhru/yYa7v8mGu7/Jhru/yYa7v8mGu7/Jhru/yYa7v8mGu7/Jhru/yYa7v8mGu7/Jhru/yYa7v8mGu7/Jhru/yYa7v8mGu7/JRru/yUa7v8mG+7/JRvu/yUa7v8lGu7/Jhru/yYa7/8mGu7/Jhru/yYa7v8mGu7/Jhru/yYa7v8mGu7/Jhru/yYa7v8mGu7/Jhru/yYa7v8mGu7/Jhru/yYa7v8mGu7/Jhru/yYa7v8mGu7/Jhru/yYa7v8nGu//Jxvs/yMd6v8hHev/Ihvu/yMa7/8mG+3/Hxrs/yMf9f8mFtX/opfm///////9/fz/+/z3//z///+dm+3/Jg/j/ysc8f8lIOX/Ihfy/yEd7f8jHuf/Jx/l/ykf4/8pHuf/Jxvs/yUa7/8jHOz/Ixzr/yMc6/8jHOv/Ixzr/yMc6/8jHOv/Ixzr/yMc6/8jHOv/Ixzr/yMc6/8jHOv/Ixzr/yMc6/8jHOv/Ixzr/yMc6/8jHOv/Ixzr/yMc6/8jHOv/Ixzr/yMc6/8jHOv/Ixzr/yMc6/8jHOv/Ixzr/yMc6/8jHOv/Ixzr/yMc6/8jHOv/Ixzr/yMc6/8jHOv/Ixzr/yMc6/8jHOv/Ixzr/yMc6/8jHOv/Ixzr/yMc6/8jHOv/Ixzr/yMc6/8jHOv/Ixzr/yMc6/8jHOv/Ixzr/yMc6/8jHOv/Ixzr/yMc6/8jHOv/Ixzr/yMc6/8jHOv/Ixzr/yMc6/8jHOv/Ixzr/yMc6/8jHOv/Ixzr/yMc6/8jHOv/Ixzr/yMc6/8jHOv/Ixzr/yMc6/8jHOv/Ixzr/yMc6/8jHOv/Ixzr/yMc6/8jHOv/Ixzr/yMc6/8jHOv/Ixzr/yMc6/8jHOv/Ixzr/yMc6/8jHOv/Ixzr/yMc6/8jHOv/Ixzr/yMc6/8jHOv/Ixzr/yMc6/8jHOv/Ixzr/ygZ8f8oGu7/JR3o/yIa8P8iFP3/JRP9/yca7v8qHfX/HA7c/3Bt1P/1+f///P39/////f/9/Pn/+Pv5//f///+Ni+D/JhXO/ycY9f8hHPL/HR3r/yAc7/8jGPP/Jhf0/ycZ8f8oHOv/KB7n/yMc7P8iHO3/Ihzt/yIc7f8iHO3/Ihzt/yIc7f8iHO3/Ihzt/yIc7f8iHO3/Ihzt/yIc7f8iHO3/Ihzt/yIc7f8iHO3/Ihzt/yIc7f8iHO3/Ihzt/yIc7f8iHO3/Ihzt/yIc7f8iHO3/Ihzt/yIc7f8iHO3/Ihzt/yIc7f8iHO3/Ihzt/yIc7f8iHO3/Ihzt/yIc7f8iHO3/Ihzt/yIc7f8iHO3/Ihzt/yIc7f8iHO3/Ihzt/yIc7f8iHO3/Ihzt/yIc7f8iHO3/Ihzt/yIc7f8iHO3/Ihzt/yIc7f8iHO3/Ihzt/yIc7f8iHO3/Ihzt/yIc7f8iHO3/Ihzt/yIc7f8iHO3/Ihzt/yIc7f8iHO3/Ihzt/yIc7f8iHO3/Ihzt/yIc7f8iHO3/Ihzt/yIc7f8iHO3/Ihzt/yIc7f8iHO3/Ihzt/yIc7f8iHO3/Ihzt/yIc7f8iHO3/Ihzt/yIc7f8iHO3/Ihzt/yIc7f8iHO3/Ihzt/yIc7f8iHO3/Ihzt/yIc7f8iHO3/Ihzt/yIc7P8iHO3/JRnx/yYZ8v8iHOz/IR7p/yIe6f8lHun/KSDr/yMQ3/9gU9z/5O78//n/+f/+/v3///7///77/v/+/fv//P76//f//v+UleP/LR7Z/x4Y4f8iIuz/IB7w/x8Z8/8hGPP/Ihvu/yIg5P8lI+D/Ixzu/yIa8f8iGvD/Ihrw/yIa8P8iGvD/Ihrw/yIa8P8iGvD/Ihrw/yIa8P8iGvD/Ihrw/yIa8P8iGvD/Ihrw/yIa8P8iGvD/Ihrw/yIa8P8iGvD/Ihrw/yIa8P8iGvD/Ihrw/yIa8P8iGvD/Ihrw/yIa8P8iGvD/Ihrw/yIa8P8iGvD/Ihrw/yIa8P8iGvD/Ihrw/yIa8P8iGvD/Ihrw/yIa8P8iGvD/Ihrw/yIa8P8iGvD/Ihrw/yIa8P8iGvD/Ihrw/yIa8P8iGvD/Ihrw/yIa8P8iGvD/Ihrw/yIa8P8iGvD/Ihrw/yIa8P8iGvD/Ihrw/yIa8P8iGvD/Ihrw/yIa8P8iGvD/Ihrw/yIa8P8iGvD/Ihrw/yIa8P8iGvD/Ihrw/yIa8P8iGvD/Ihrw/yIa8P8iGvD/Ihrw/yIa8P8iGvD/Ihrw/yIa8P8iGvD/Ihrw/yIa8P8iGvD/Ihrw/yIa8P8iGvD/Ihrw/yIa8P8iGvD/Ihrw/yIa8P8iGvD/Ihrw/yIa8f8iGvD/Ihrw/yIa8f8hHuv/Hx/m/yAg6P8gIOr/IyHo/yQe4f8dFtv/bGPj/+rq///3//j/+v31///8/////v3///3+///9/////P3/+fn8//f///+5v/P/UETb/yAS5P8iF+T/JR7o/yQf6v8iHe7/Ixv1/yIX9v8jGvD/JBvv/yQb8P8kG/D/JBvw/yQb8P8kG/D/JBvw/yQb8P8kG/D/JBvw/yQb8P8kG/D/JBvw/yQb8P8kG/D/JBvw/yQb8P8kG/D/JBvw/yQb8P8kG/D/JBvw/yQb8P8kG/D/JBvw/yQb8P8kG/D/JBvw/yQb8P8kG/D/JBvw/yQb8P8kG/D/JBvw/yQb8P8kG/D/JBvw/yQb8P8kG/D/JBvw/yQb8P8kG/D/JBvw/yQb8P8kG/D/JBvw/yQb8P8kG/D/JBvw/yQb8P8kG/D/JBvw/yQb8P8kG/D/JBvw/yQb8P8kG/D/JBvw/yQb8P8kG/D/JBvw/yQb8P8kG/D/JBvw/yQb8P8kG/D/JBvw/yQb8P8kG/D/JBvw/yQb8P8kG/D/JBvw/yQb8P8kG/D/JBvw/yQb8P8kG/D/JBvw/yQb8P8kG/D/JBvw/yQb8P8kG/D/JBvw/yQb8P8kG/D/JBvw/yQb8P8kG/D/JBvw/yQb8P8kG/D/JBvw/yQb8P8kG/D/JBrv/yQb8P8lHPH/JRzx/yMa9f8jHPP/Ix3s/yAU7v8dC+f/OS3Z/5CX7P/s9////f/2//r+9f///f7///v//////v/+/fz///n////8////+/7/+Pr7/////v/s6P//oJjr/11Q1f80Itf/JhLo/yQR7v8iFuj/JBzj/yQb4/8kGuT/JBvk/yQb5P8kG+T/JBvk/yQb5P8kG+T/JBvk/yQb5P8kG+T/JBvk/yQb5P8kG+T/JBvk/yQb5P8kG+T/JBvk/yQb5P8kG+T/JBvk/yQb5P8kG+T/JBvk/yQb5P8kG+T/JBvk/yQb5P8kG+T/JBvk/yQb5P8kG+T/JBvk/yQb5P8kG+T/JBvk/yQb5P8kG+T/JBvk/yQb5P8kG+T/JBvk/yQb5P8kG+T/JBvk/yQb5P8kG+T/JBvk/yQb5P8kG+T/JBvk/yQb5P8kG+T/JBvk/yQb5P8kG+T/JBvk/yQb5P8kG+T/JBvk/yQb5P8kG+T/JBvk/yQb5P8kG+T/JBvk/yQb5P8kG+T/JBvk/yQb5P8kG+T/JBvk/yQb5P8kG+T/JBvk/yQb5P8kG+T/JBvk/yQb5P8kG+T/JBvk/yQb5P8kG+T/JBvk/yQb5P8kG+T/JBvk/yQb5P8kG+T/JBvk/yQb5P8kG+T/JBvk/yQb5P8kG+T/JBvk/yQa5P8kG+T/JRvl/yQb5f8jGeX/Ixrf/yQV3/8sGOP/SDff/4mD4v/a3fr/+/////r+9//9/vT///7+//7+/v///vz///////z+/v/+/v7////+////8//+/ff//vv8//7+9v//////8PH9/7/B9P+KieD/ZmLe/1JM4/9AOuT/OTLr/zoy7f86Muz/OjLt/zoy7f86Mu3/OjLt/zoy7f86Mu3/OjLt/zoy7f86Mu3/OjLt/zoy7f86Mu3/OjLt/zoy7f86Mu3/OjLt/zoy7f86Mu3/OjLt/zoy7f86Mu3/OjLt/zoy7f86Mu3/OjLt/zoy7f86Mu3/OjLt/zoy7f86Mu3/OjLt/zoy7f86Mu3/OjLt/zoy7f86Mu3/OjLt/zoy7f86Mu3/OjLt/zoy7f86Mu3/OjLt/zoy7f86Mu3/OjLt/zoy7f86Mu3/OjLt/zoy7f86Mu3/OjLt/zoy7f86Mu3/OjLt/zoy7f86Mu3/OjLt/zoy7f86Mu3/OjLt/zoy7f86Mu3/OjLt/zoy7f86Mu3/OjLt/zoy7f86Mu3/OjLt/zoy7f86Mu3/OjLt/zoy7f86Mu3/OjLt/zoy7f86Mu3/OjLt/zoy7f86Mu3/OjLt/zoy7f86Mu3/OjLt/zoy7f86Mu3/OjLt/zoy7f86Mu3/OjLt/zoy7f86Mu3/OTLt/zoz7f86M+3/OzTt/0Y/7f9eVeP/fnva/6217//e6fz//P/////9///+/fb///73///6///++f///P71//3/8v///v//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=
// @downloadURL https://update.greasyfork.org/scripts/553822/%F0%9F%8C%9F%20%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9AAI%E8%87%AA%E5%8A%A8%E5%8C%96%E5%8A%A9%E6%89%8B%EF%BD%9C%F0%9F%93%80%20%E8%87%AA%E5%8A%A8%E5%88%B7%E7%AB%A0%E8%8A%82%E8%A7%86%E9%A2%91%EF%BD%9C%F0%9F%93%9A%20%E7%AB%A0%E8%8A%82%E6%B5%8B%E9%AA%8C%E8%87%AA%E5%8A%A8%E6%8F%90%E4%BA%A4%EF%BD%9C%F0%9F%A4%96%20%E6%99%BA%E8%83%BD%E4%BD%9C%E4%B8%9A%E7%AD%94%E9%A2%98%EF%BD%9C%F0%9F%92%8E%20%E6%9E%81%E8%87%B4%E7%AE%80%E6%B4%81.user.js
// @updateURL https://update.greasyfork.org/scripts/553822/%F0%9F%8C%9F%20%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9AAI%E8%87%AA%E5%8A%A8%E5%8C%96%E5%8A%A9%E6%89%8B%EF%BD%9C%F0%9F%93%80%20%E8%87%AA%E5%8A%A8%E5%88%B7%E7%AB%A0%E8%8A%82%E8%A7%86%E9%A2%91%EF%BD%9C%F0%9F%93%9A%20%E7%AB%A0%E8%8A%82%E6%B5%8B%E9%AA%8C%E8%87%AA%E5%8A%A8%E6%8F%90%E4%BA%A4%EF%BD%9C%F0%9F%A4%96%20%E6%99%BA%E8%83%BD%E4%BD%9C%E4%B8%9A%E7%AD%94%E9%A2%98%EF%BD%9C%F0%9F%92%8E%20%E6%9E%81%E8%87%B4%E7%AE%80%E6%B4%81.meta.js
// ==/UserScript==




     const systemConfig = {
        buildTime: new Date().toISOString(),
        environment: 'production'
    };
    class Logger {
        constructor(prefix) {
            this.prefix = prefix || 'System';
            this.levels = ['DEBUG', 'INFO', 'WARN', 'ERROR'];
        }

        log(level, message) {
            if (this.levels.includes(level)) {
                const timestamp = new Date().toISOString();
            }
        }

        debug(msg) { this.log('DEBUG', msg); }
        info(msg) { this.log('INFO', msg); }
        warn(msg) { this.log('WARN', msg); }
        error(msg) { this.log('ERROR', msg); }
    }


    const logger = new Logger('CXHelper');

    const browserCheck = {
        isChrome: () => /Chrome/.test(navigator.userAgent),
        isFirefox: () => /Firefox/.test(navigator.userAgent),
        isEdge: () => /Edge/.test(navigator.userAgent),
        isSafari: () => /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent)
    };


    class PerformanceMonitor {
        constructor() {
            this.metrics = new Map();
            this.startTimes = new Map();
        }

        start(name) {
            this.startTimes.set(name, performance.now());
        }

        end(name) {
            const startTime = this.startTimes.get(name);
            if (startTime) {
                const duration = performance.now() - startTime;
                this.metrics.set(name, duration);
                this.startTimes.delete(name);
                return duration;
            }
            return 0;
        }

        getMetric(name) {
            return this.metrics.get(name) || 0;
        }
    }


    const perfMonitor = new PerformanceMonitor();


    const utils = {

        generateId: (length = 8) => {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let result = '';
            for (let i = 0; i < length; i++) {
                result += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return result;
        },


        deepClone: (obj) => {
            if (obj === null || typeof obj !== 'object') return obj;
            if (obj instanceof Date) return new Date(obj.getTime());
            if (obj instanceof Array) return obj.map(item => utils.deepClone(item));
            if (typeof obj === 'object') {
                const cloned = {};
                Object.keys(obj).forEach(key => {
                    cloned[key] = utils.deepClone(obj[key]);
                });
                return cloned;
            }
        },


        debounce: (func, wait) => {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },


        throttle: (func, limit) => {
            let inThrottle;
            return function() {
                const args = arguments;
                const context = this;
                if (!inThrottle) {
                    func.apply(context, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            }
        }
    };

    class CacheManager {
        constructor(maxSize = 100) {
            this.cache = new Map();
            this.maxSize = maxSize;
        }

        set(key, value, ttl = 300000) { // 默认5分钟过期
            if (this.cache.size >= this.maxSize) {
                const firstKey = this.cache.keys().next().value;
                this.cache.delete(firstKey);
            }

            const item = {
                value: value,
                expiry: Date.now() + ttl
            };
            this.cache.set(key, item);
        }

        get(key) {
            const item = this.cache.get(key);
            if (!item) return null;

            if (Date.now() > item.expiry) {
                this.cache.delete(key);
                return null;
            }

            return item.value;
        }

        clear() {
            this.cache.clear();
        }
    }

    const cacheManager = new CacheManager();


    logger.info('System initialization completed');

(function() {
    'use strict';


(function(){
    function _b64ToBytes(b64){ const bin = atob(b64); const out = new Uint8Array(bin.length); for(let i=0;i<bin.length;i++) out[i] = bin.charCodeAt(i); return out; }
    function _bytesToStr(arr){ let s=''; for(let i=0;i<arr.length;i++) s += String.fromCharCode(arr[i]); return s; }
    function _strToBytes(s){ const out = new Uint8Array(s.length); for(let i=0;i<s.length;i++) out[i] = s.charCodeAt(i); return out; }
    function _xor(a,b){ const out=new Uint8Array(a.length); for(let i=0;i<a.length;i++) out[i] = a[i] ^ b[i % b.length]; return out; }
    const __S = [100, 121, 96, 105, 102, 109, 113, 102, 115, 96, 116, 98, 109, 117, 96, 51, 49, 51, 54].map(c=>c-1);
    const __SALT = String.fromCharCode.apply(null, __S);
    const __ENC = "idiM9YBNCEBSu80fAcWJtglB3UgCOQSNSUCG2EFbmlWW7AyIJkSb/kgNWgCHsoEA";
    function __getDSK(){
        try {
            const step1 = __ENC.split('').reverse().join('');
            const xored = _b64ToBytes(step1);
            const plainB64Bytes = _xor(xored, _strToBytes(__SALT));
            const plainB64 = _bytesToStr(plainB64Bytes);
            return atob(plainB64);
        } catch (e) { return ''; }
    }
    window.__getDeepseekKey = __getDSK;
})();


const DEEPSEEK_PROXY_BASE = 'https://api.116611.xyz';

const DEEPSEEK_MODEL = 'deepseek-chat';
const DEEPSEEK_API_URL = `${DEEPSEEK_PROXY_BASE}/v1/chat/completions`;

function deepseekChat(messages, options = {}) {
    return new Promise((resolve, reject) => {
        try {
            GM_xmlhttpRequest({
                method: 'POST',
                url: DEEPSEEK_API_URL,
                headers: {
                    'Content-Type': 'application/json',
                    'X-App-Token': __getDSAuth()
                },
                data: JSON.stringify({ model: DEEPSEEK_MODEL, messages, ...options }),
                timeout: 60000,
                onload: (r) => {
                    if (r.status >= 200 && r.status < 300) {
                        try { resolve(JSON.parse(r.responseText)); } catch (e) { reject(e); }
                    } else {
                        reject(new Error(`HTTP ${r.status}: ${String(r.responseText || '').slice(0,200)}`));
                    }
                },
                onerror: () => reject(new Error('Network error')),
                ontimeout: () => reject(new Error('Timeout'))
            });
        } catch (err) {
            reject(err);
        }
    });
}
    let isAnswering = false;
    let isStudyingChapters = false;
    let studyIntervalId = null;
    const STUDY_PERSIST_KEY = 'cx_helper_study_on_v2';

    const PANEL_REG_KEY = 'cx_helper_active_panel_v2';
    const PANEL_INSTANCE_ID = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const FRAME_DEPTH = (() => { let d = 0; try { let w = window; while (w !== w.top) { d++; w = w.parent; } } catch { d = 999; } return d; })();
    let isActiveOwner = false;
    let createdPanelEl = null;
    const HEARTBEAT_INTERVAL_MS = 2000;
    const STALE_MS = 7000;
    let heartbeatTimerId = null;
    let lastAutoSkipTs = 0;
    let emptyChecksCount = 0;
    let lastEmptySectionKey = '';
    let recoveryTimerId = null;


    const API_BASE = 'https://116611.xyz';
    const MONEY_YUAN = (() => {
        try {
            const b64 = 'NS4wMA==';
            return atob(b64);
        } catch {
            return '5.00';
        }
    })();
    const PAY_NAME = 'XHelper 解锁/赞助';
    const DEFAULT_PAY = 'wxpay';
    const LS_KEY_DEV_ID = 'cxhelper_device_id';
    const LS_KEY_FREE = 'cxhelper_free_used';
    const LS_KEY_LICENSED = 'cxhelper_licensed';
    const POLL_MS_PAY = 3000;
    const POLL_MAX_PAY = 100;


    const getFreeLimit = (() => {
        let cached = null;
        return function() {
            if (cached != null) return cached;
            try {

                const b64 = 'JDEw';
                const decoded = atob(b64);
                const n = parseInt(decoded.replace(/\D/g, ''), 10);
                cached = Number.isFinite(n) ? n : 10;
            } catch {
                cached = 10;
            }
            return cached;
        };
    })();

    function getDeviceIdPaid() {
        try {
            let id = localStorage.getItem(LS_KEY_DEV_ID);
            if (!id) {
                id = ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));
                localStorage.setItem(LS_KEY_DEV_ID, id);
            }
            return id;
        } catch { return 'dev_' + Math.random().toString(36).slice(2); }
    }
    const DEVICE_ID_PAID = getDeviceIdPaid();

    function getCookie(key) {
        try {
            const name = key + '=';
            const parts = document.cookie.split(';');
            for (let part of parts) {
                const s = part.trim();
                if (s.indexOf(name) === 0) return decodeURIComponent(s.substring(name.length));
            }
            return '';
        } catch { return ''; }
    }
    function setCookie(key, value, days, domain) {
        try {
            const d = new Date();
            d.setTime(d.getTime() + ((days || 365) * 24 * 60 * 60 * 1000));
            const expires = 'expires=' + d.toUTCString();
            const dm = domain ? ';domain=' + domain : '';
            document.cookie = key + '=' + encodeURIComponent(value) + ';path=/' + ';' + expires + dm;
        } catch {}
    }
    function isLocallyLicensed() {
        try {
            // 优先从跨子域Cookie读取，保障不同页面一致
            const c = getCookie(LS_KEY_LICENSED);
            if (c === '1') return true;
            return localStorage.getItem(LS_KEY_LICENSED) === '1';
        } catch { return false; }
    }
    function setLocallyLicensed() {
        try { localStorage.setItem(LS_KEY_LICENSED, '1'); } catch {}
        // 写入跨子域Cookie，统一所有 *.chaoxing.com 页面状态
        try { setCookie(LS_KEY_LICENSED, '1', 365, '.chaoxing.com'); } catch {}
    }
    function getFreeUsedCount() {
        try { return parseInt(localStorage.getItem(LS_KEY_FREE) || '0', 10) || 0; } catch { return 0; }
    }
    function incFreeUsedCount() {
        try { const n = getFreeUsedCount() + 1; localStorage.setItem(LS_KEY_FREE, String(n)); return n; } catch { return 0; }
    }

    async function checkLicensePaid() {
        if (isLocallyLicensed()) return true;
        try {
            const r = await fetch(`${API_BASE}/api/license/status?deviceId=${encodeURIComponent(DEVICE_ID_PAID)}`, { credentials: 'omit' });
            const ct = (r.headers.get('content-type') || '').toLowerCase();
            const data = ct.includes('application/json') ? await r.json() : await r.text();
            const ok = !!(data && data.licensed);
            if (ok) setLocallyLicensed();
            try { updateTrialBadge(); } catch {}
            return ok;
        } catch { return false; }
    }

    async function startPaymentPaid(payType) {
        const win = window.open('', '_blank');
        try {
            const resp = await fetch(`${API_BASE}/api/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: PAY_NAME,
                    money: MONEY_YUAN,
                    type: payType || DEFAULT_PAY,
                    param: DEVICE_ID_PAID
                })
            });
            const html = await resp.text();
            win.document.open();
            win.document.write(html);
            win.document.close();
            return true;
        } catch (e) {
            if (win) win.close();
            alert('发起支付失败：' + e.message);
            return false;
        }
    }

    async function pollUntilLicensedPaid(onProgress) {
        for (let i = 0; i < POLL_MAX_PAY; i++) {
            if (onProgress) { try { onProgress(i); } catch {} }
            const ok = await checkLicensePaid();
            if (ok) { setLocallyLicensed(); return true; }
            await new Promise(r => setTimeout(r, POLL_MS_PAY));
        }
        return false;
    }

    function showPayModalPaid(messageText) {
        return new Promise(resolve => {
            const mask = document.createElement('div');
            mask.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:999998;';
            const box = document.createElement('div');
            box.style.cssText = 'position:fixed;left:50%;top:120px;transform:translateX(-50%);width:420px;background:#fff;border-radius:12px;box-shadow:0 12px 40px rgba(0,0,0,.2);overflow:hidden;z-index:999999;font-family:system-ui,Segoe UI,Arial;';
            const msg = messageText || '试用已用完，打赏5元永久解锁哦';
            box.innerHTML = (
                '<div style="padding:14px 16px;border-bottom:1px solid #f0f0f0;font-weight:600;font-size:13px;">解锁全部功能（永久）</div>' +
                '<div style="padding:16px;">' +
                    '<div style="margin-bottom:12px;font-size:12px;">' + msg + '</div>' +
                    '<div style="margin-bottom:12px;">' +
                        '<label style="margin-right:14px;cursor:pointer;font-size:12px;"><input type="radio" name="cx_pay" value="wxpay" checked> 微信</label>' +
                        '<label style="margin-right:14px;cursor:pointer;font-size:12px;"><input type="radio" name="cx_pay" value="alipay"> 支付宝</label>' +
                        '<div style="color:#888;font-size:12px;margin-top:6px;">若支付方式不可用请尝试其他支付方式</div>' +
                    '</div>' +
                    '<div id="cx_tip_paid" style="color:#555;font-size:12px;">点击"去支付"将打开收银台，完成后此处会自动检测。</div>' +
                '</div>' +
                '<div style="padding:12px 16px;border-top:1px solid #f0f0f0;text-align:right;">' +
                    '<button id="cx_cancel_paid" style="padding:8px 14px;border-radius:8px;border:1px solid #ddd;background:#fff;color:#333;margin-right:8px;cursor:pointer;font-size:13px;">取消</button>' +
                    '<button id="cx_go_pay" style="padding:8px 14px;border-radius:8px;border:none;background:#4f46e5;color:#fff;cursor:pointer;font-size:13px;">去支付</button>' +
                '</div>'
            );
            document.body.appendChild(mask);
            document.body.appendChild(box);

            const tip = box.querySelector('#cx_tip_paid');
            const btnPay = box.querySelector('#cx_go_pay');
            const btnCancel = box.querySelector('#cx_cancel_paid');

            function close() { try { box.remove(); mask.remove(); } catch {} }

            btnCancel.onclick = () => { close(); resolve(false); };
            btnPay.onclick = async () => {
                btnPay.disabled = true;
                btnPay.textContent = '打开收银台...';
                const payType = (box.querySelector('input[name="cx_pay"]:checked') || {}).value || DEFAULT_PAY;
                const ok = await startPaymentPaid(payType);
                if (!ok) { btnPay.disabled = false; btnPay.textContent = '去支付'; return; }
                btnPay.textContent = '检测支付中...';
                if (tip) tip.innerHTML = '已打开收银台，请完成支付，完成后此处会自动解锁...<br><span style="color:#ff6b35;font-size:12px;margin-top:4px;display:block;">💡 若无法打开支付页面请尝试连接手机热点网络</span>';
                const done = await pollUntilLicensedPaid();
                if (done) {
                    if (tip) tip.textContent = '支付成功，正在解锁...';
                    setLocallyLicensed();
                    try { updateTrialBadge(); } catch {}
                    setTimeout(() => { close(); resolve(true); }, 500);
                } else {
                    btnPay.disabled = false;
                    btnPay.textContent = '去支付';
                    if (tip) tip.textContent = '未检测到支付完成，可重试或稍后再次打开本面板。';
                }
            };
        });
    }

    function showFeedbackModal() {
        const mask = document.createElement('div');
        mask.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:999998;';
        const box = document.createElement('div');
        box.style.cssText = 'position:fixed;left:50%;top:120px;transform:translateX(-50%);width:400px;background:#fff;border-radius:12px;box-shadow:0 12px 40px rgba(0,0,0,.2);overflow:hidden;z-index:999999;font-family:system-ui,Segoe UI,Arial;';
        box.innerHTML = (
            '<div style="padding:16px 20px;border-bottom:1px solid #f0f0f0;font-weight:600;font-size:16px;color:#333;">意见反馈</div>' +
            '<div style="padding:24px 20px;text-align:center;">' +
                '<div style="margin-bottom:16px;font-size:14px;color:#555;line-height:1.6;">' +
                    '如果您在使用过程中遇到问题或有任何建议，欢迎通过以下方式联系我们：' +
                '</div>' +
                '<div style="background:#f8f9fa;border:1px solid #e9ecef;border-radius:8px;padding:16px;margin:16px 0;">' +
                    '<div style="font-size:16px;font-weight:600;color:#1677ff;margin-bottom:8px;">联系邮箱</div>' +
                    '<div style="font-size:18px;font-weight:bold;color:#333;cursor:pointer;" onclick="navigator.clipboard.writeText(\'2036470448@qq.com\')" title="点击复制">2036470448@qq.com</div>' +
                    '<div style="font-size:12px;color:#666;margin-top:4px;">点击邮箱地址即可复制</div>' +
                '</div>' +
                '<div style="font-size:13px;color:#888;margin-top:12px;line-height:1.5;">我们将会认真对待每一条反馈，并且尽快回复您的问题。您的建议是我们改进产品的重要动力！</div>' +
            '</div>' +
            '<div style="padding:12px 20px;border-top:1px solid #f0f0f0;text-align:right;">' +
                '<button id="feedback-close" style="padding:8px 16px;border-radius:8px;border:none;background:#1677ff;color:#fff;cursor:pointer;font-size:14px;">关闭</button>' +
            '</div>'
        );
        document.body.appendChild(mask);
        document.body.appendChild(box);

        const closeBtn = box.querySelector('#feedback-close');
        function close() {
            try {
                box.remove();
                mask.remove();
            } catch {}
        }

        closeBtn.onclick = close;
        mask.onclick = close;


        const emailDiv = box.querySelector('[onclick*="clipboard"]');
        if (emailDiv) {
            emailDiv.addEventListener('click', function() {
                const originalText = this.innerHTML;
                this.innerHTML = '✅ 已复制到剪贴板';
                this.style.color = '#52c41a';
                setTimeout(() => {
                    this.innerHTML = originalText;
                    this.style.color = '#333';
                }, 2000);
            });
        }
    }

    async function ensureAccessAllowed() {
        if (await checkLicensePaid()) return true;
        const used = getFreeUsedCount();
        if (used < getFreeLimit()) { incFreeUsedCount(); try { updateTrialBadge(); } catch {} return true; }
        const ok = await showPayModalPaid();
        if (ok) { setLocallyLicensed(); try { updateTrialBadge(); } catch {} return true; }
        throw new Error('试用已用完，请解锁后继续使用');
    }

    function getActivePanelRecord() {
        try { const raw = localStorage.getItem(PANEL_REG_KEY); return raw ? JSON.parse(raw) : null; } catch { return null; }
    }
    function setActivePanelRecord(rec) {
        try { localStorage.setItem(PANEL_REG_KEY, JSON.stringify(rec)); } catch {}
    }
    function clearActivePanelRecordIfOwner() {
        try {
            const cur = getActivePanelRecord();
            if (cur && cur.id === PANEL_INSTANCE_ID) {
                localStorage.removeItem(PANEL_REG_KEY);
            }
        } catch {}
    }
    function shouldWeOwn(current) {
        const nowTs = Date.now();
        if (!current) return { own: true, ts: nowTs };

        if (!current.aliveTs || nowTs - current.aliveTs > STALE_MS) return { own: true, ts: nowTs };

        try { if (current.url && current.url !== location.href) return { own: true, ts: nowTs }; } catch {}

        if (FRAME_DEPTH > (current.depth || 0)) return { own: true, ts: nowTs };
        if (FRAME_DEPTH === (current.depth || 0) && nowTs > (current.ts || 0)) return { own: true, ts: nowTs };
        return { own: false, ts: nowTs };
    }
    function claimOwnership() {
        const cur = getActivePanelRecord();
        const decision = shouldWeOwn(cur);
        if (decision.own) {
            setActivePanelRecord({ id: PANEL_INSTANCE_ID, depth: FRAME_DEPTH, ts: decision.ts, aliveTs: Date.now(), url: location.href });
            isActiveOwner = true;
        } else {
            isActiveOwner = false;
        }
        return isActiveOwner;
    }
    function startHeartbeat() {
        if (heartbeatTimerId) return;
        heartbeatTimerId = setInterval(() => {
            if (!isActiveOwner) return;
            const cur = getActivePanelRecord();

            if (!cur || cur.id !== PANEL_INSTANCE_ID) { stopHeartbeat(); return; }
            cur.aliveTs = Date.now();
            try { cur.url = location.href; } catch {}
            setActivePanelRecord(cur);
        }, HEARTBEAT_INTERVAL_MS);
    }
    function stopHeartbeat() { if (heartbeatTimerId) { clearInterval(heartbeatTimerId); heartbeatTimerId = null; } }
    const cleanupOwnership = () => {
        stopHeartbeat();
        clearActivePanelRecordIfOwner();
    };
    window.addEventListener('beforeunload', cleanupOwnership);
    window.addEventListener('pagehide', cleanupOwnership);

    function destroyPanelAndStop() {
        try {
            if (studyIntervalId) { clearInterval(studyIntervalId); studyIntervalId = null; }
            isStudyingChapters = false;
            isAnswering = false;
            stopHeartbeat();
            const panel = document.getElementById('answer-helper-panel');
            if (panel && panel.parentNode) panel.parentNode.removeChild(panel);
            createdPanelEl = null;
        } catch {}
    }
    window.addEventListener('storage', (e) => {
        if (e.key !== PANEL_REG_KEY) return;
        const rec = getActivePanelRecord();
        if (!rec) return;
        if (rec.id === PANEL_INSTANCE_ID) {

            if (!createdPanelEl) {
                try { createdPanelEl = createPanel(); bindPanelEvents(); } catch {}
            }
            isActiveOwner = true;
            startHeartbeat();
        } else {

            isActiveOwner = false;
            destroyPanelAndStop();
        }
    });


    GM_addStyle(`
        /* Panel: Dark Glass Theme */
        #answer-helper-panel {
            position: fixed;
            top: 24px;
            left: 24px;
            width: 520px;
            min-width: 420px;
            /* backdrop-filter removed for white theme */
            background: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            padding: 0;
            z-index: 9999;
            box-shadow: 0 6px 20px rgba(0,0,0,0.12);
            font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            color: #333;
            user-select: none;
            overflow: hidden;
        }

        /* Header */
        #answer-helper-header {
            cursor: move;
            height: 44px;
            padding: 0 16px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: #f7f8fa;
            border-bottom: 1px solid #e5e7eb;
            font-size: 15px;
            letter-spacing: 0.2px;
            color: #333;
        }
        #answer-helper-header .title {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            font-weight: 600;
            color: #333;
        }
        #answer-helper-header .title .accent {
            display: inline-block;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: radial-gradient(circle, #4cc9f0 0%, #4361ee 65%, transparent 66%);
            box-shadow: 0 0 12px #3a86ff70;
        }
        #answer-helper-header .right {
            display: inline-flex;
            align-items: center;
            gap: 8px;
        }
        #answer-helper-header .collapse-btn {
            width: 30px;
            height: 30px;
            border-radius: 30px;
            background: #edf2f7;
            border: 1px solid #e5e7eb;
            cursor: pointer;
            color: #4a5568;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: transform .15s ease, background .15s ease, color .15s ease;
        }
        #answer-helper-header .collapse-btn:hover {
            background: #e2e8f0;
            color: #2d3748;
            transform: scale(1.04);
        }
        .collapse-btn-inner { width: 16px; height: 16px; position: relative; }
        .collapse-icon-bar.horizontal { width: 14px; height: 2px; background: currentColor; border-radius: 2px; position: absolute; left: 1px; top: 7px; }
        .collapse-icon-bar.vertical { width: 2px; height: 14px; background: currentColor; border-radius: 2px; position: absolute; left: 7px; top: 1px; }

        /* Content */
        #answer-helper-content { padding: 10px 14px; }
        #answer-helper-panel.collapsed #answer-helper-content { display: none; }
        #answer-helper-panel.collapsed { width: 220px; min-width: 180px; }

        /* Two-column body: main + right actions column */
        #answer-helper-content .panel-body {
            display: grid;
            grid-template-columns: 1fr 100px;
            gap: 10px;
            align-items: start;
        }
        .panel-main { min-width: 0; }
        .panel-actions.panel-column { display: flex; flex-direction: column; gap: 8px; }
        .panel-actions.panel-column .ah-btn { flex: unset; min-height: 48px; padding: 8px 6px; flex-direction: column; align-items: center; justify-content: center; gap: 6px; }
        .panel-actions.panel-column .button-icon { font-size: 18px; }
        .panel-actions.panel-column .button-text { font-size: 11px; }

        /* Toast */
        #no-task-toast {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ffffff;
            border: 1px solid #e5e7eb;
            color: #333;
            padding: 10px 16px;
            border-radius: 10px;
            font-size: 13px;
            z-index: 10000;
            animation: fadeInOut 3s ease-in-out forwards;
            font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        }
        @keyframes fadeInOut {
            0% { opacity: 0; transform: translateY(-10px); }
            10% { opacity: 1; transform: translateY(0); }
            90% { opacity: 1; transform: translateY(0); }
            100% { opacity: 0; transform: translateY(-10px); }
        }

        /* Terminal Log */
        #answer-log {
            height: 160px;
            overflow-y: auto;
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            padding: 8px 10px 8px 12px;
            margin: 8px 0 10px;
            font-size: 12.5px;
            line-height: 1.55;
            font-family: SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace;
            background: #f8f9fa;
            color: #333;
        }
        #answer-log::-webkit-scrollbar { width: 8px; height: 8px; }
        #answer-log::-webkit-scrollbar-track { background: #edf2f7; border-radius: 10px; }
        #answer-log::-webkit-scrollbar-thumb { background: #cbd5e0; border-radius: 10px; }
        .log-item { margin-bottom: 8px; padding: 8px 10px; border-radius: 8px; background: #ffffff; }
        .success { color: #2e7d32; border-left: 3px solid #36c06a; }
        .error { color: #c62828; border-left: 3px solid #ef4444; }
        .debug { color: #1e40af; border-left: 3px solid #3a86ff; }
        .info { color: #4b5563; border-left: 3px solid #9aa0a6; }

        /* Button Grid */
        /* (previous grid tile layout removed for right-side column design) */
        .ah-btn {
            flex: 1;
            padding: 10px 12px;
            border: 1px solid #e5e7eb;
            border-radius: 10px;
            font-size: 13px;
            font-weight: 600;
            letter-spacing: 0.2px;
            cursor: pointer;
            transition: all .18s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            color: #333;
            background: #f5f7fa;
        }
        .ah-btn:hover { transform: translateY(-1px); background: #edf2f7; border-color: #cbd5e0; }
        .ah-primary { background: #2563eb; color: #fff; border-color: #1d4ed8; }
        .ah-primary:hover { background: #1d4ed8; }
        .ah-danger { background: #ef4444; color: #fff; border-color: #dc2626; }
        .ah-danger:hover { background: #dc2626; }
        .ah-secondary { background: #f5f7fa; color: #333; }
        .ah-success { background: #10b981; color: #fff; border-color: #059669; }
        .ah-success:hover { background: #059669; }
        .button-icon { font-size: 14px; line-height: 1; }

        /* Speed buttons state */
        .speed-button { transition: all .15s ease; }
        .speed-active { background: #2563eb; color: #fff; }
        #playback-speed-controls.segmented { display: flex; gap: 8px; justify-content: flex-end; margin-top: 10px; }
        #playback-speed-controls.segmented .ah-btn { min-width: 72px; padding: 8px 10px; }

        /* Misc */
        #debug-page{ display:none !important; }
        #answer-helper-panel .cx-trial-badge{ position: absolute; left: 12px; bottom: 8px; color: #666; font-size: 12px; pointer-events: none; }
        #answer-helper-content { padding-bottom: 18px; }
    `);


    function createPanel() {
        const panel = document.createElement('div');
        panel.id = 'answer-helper-panel';
        panel.innerHTML = `
            <div id="answer-helper-header">
                <span class="title"><span class="accent"></span>研习助手 · CX</span>
                <div class="right">
                    <button id="feedback-btn" class="ah-btn ah-secondary" style="min-width:auto; width:30px; height:30px; padding:0; border-radius:10px;">
                        <span class="button-icon" style="margin:0; font-size:14px;">💬</span>
                    </button>
                    <button class="collapse-btn" title="折叠/展开">
                      <span class="collapse-btn-inner">
                        <span class="collapse-icon-bar horizontal"></span>
                      </span>
                    </button>
                </div>
            </div>
            <div id="answer-helper-content">
                <div class="panel-body">
                    <div class="panel-main">
                        <div id="answer-log"></div>
                        <div id="playback-speed-controls" class="segmented" style="display:none;">
                            <button id="speed-1x" class="ah-btn ah-secondary speed-button speed-active"><span class="button-icon">1×</span></button>
                            <button id="speed-1.5x" class="ah-btn ah-secondary speed-button"><span class="button-icon">1.5×</span></button>
                            <button id="speed-2x" class="ah-btn ah-secondary speed-button"><span class="button-icon">2×</span></button>
                        </div>
                    </div>
                    <div class="panel-actions panel-column">
                        <button id="start-answer" class="ah-btn ah-primary">
                            <span class="button-icon">▶</span>
                            <span class="button-text">开始答题</span>
                        </button>
                        <button id="pause-answer" class="ah-btn ah-danger" style="display:none;">
                            <span class="button-icon">⏸</span>
                            <span class="button-text">暂停答题</span>
                        </button>
                        <button id="start-study" class="ah-btn ah-success">
                            <span class="button-icon">⏯</span>
                            <span class="button-text">开始刷章节（章节答题）</span>
                        </button>
                        <button id="pause-study" class="ah-btn ah-danger" style="display:none;">
                            <span class="button-icon">■</span>
                            <span class="button-text">暂停刷章节</span>
                        </button>
                        <button id="buy-license" class="ah-btn ah-secondary">
                            <span class="button-icon">💳</span>
                            <span class="button-text">购买授权</span>
                        </button>
                        <button id="debug-page" class="ah-btn ah-secondary">
                            <span class="button-icon">🔍</span>
                            <span class="button-text">调试页面</span>
                        </button>
                    </div>
                </div>
            </div>
            <div id="cx_trial_badge" class="cx-trial-badge">检测中...</div>
        `;
        document.body.appendChild(panel);


        let isDragging = false, offsetX = 0, offsetY = 0;
        const header = panel.querySelector('#answer-helper-header');
        header.addEventListener('mousedown', function(e) {
            if (e.target.classList.contains('collapse-btn')) return;
            isDragging = true;
            const rect = panel.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
            document.body.style.userSelect = 'none';
        });
        document.addEventListener('mousemove', function(e) {
            if (!isDragging) return;
            panel.style.left = (e.clientX - offsetX) + 'px';
            panel.style.top = (e.clientY - offsetY) + 'px';
            panel.style.right = 'auto';
        });
        document.addEventListener('mouseup', function() {
            isDragging = false;
            document.body.style.userSelect = '';
        });


        const collapseBtn = panel.querySelector('.collapse-btn');
        const collapseBtnInner = collapseBtn.querySelector('.collapse-btn-inner');
        collapseBtn.addEventListener('click', function() {
            panel.classList.toggle('collapsed');
            collapseBtnInner.innerHTML = '';
            if (panel.classList.contains('collapsed')) {

                const h = document.createElement('span');
                h.className = 'collapse-icon-bar horizontal';
                const v = document.createElement('span');
                v.className = 'collapse-icon-bar vertical';
                collapseBtnInner.appendChild(h);
                collapseBtnInner.appendChild(v);
            } else {

                const h = document.createElement('span');
                h.className = 'collapse-icon-bar horizontal';
                collapseBtnInner.appendChild(h);
            }
        });
        return panel;
    }

    function bindPanelEvents() {
        document.getElementById('start-answer')?.addEventListener('click', () => {
            addLog('本助手仅供学习研究，请遵守课程与平台规则。', 'info');
            addLog('开始自动答题...');
            autoAnswer();
        });
        document.getElementById('pause-answer')?.addEventListener('click', () => {
            isAnswering = false;
            addLog('正在暂停自动答题...', 'info');
        });
        const startStudyBtn = document.getElementById('start-study');
        const pauseStudyBtn = document.getElementById('pause-study');
        if (startStudyBtn && pauseStudyBtn) {
            startStudyBtn.addEventListener('click', () => {
                addLog('本助手仅供学习研究，请遵守课程与平台规则。', 'info');
                startStudyChapters();
            });
            pauseStudyBtn.addEventListener('click', () => { stopStudyChapters(); });
        }


        document.getElementById('speed-1x')?.addEventListener('click', () => {
            setVideoPlaybackSpeed(1.0);
        });
        document.getElementById('speed-1.5x')?.addEventListener('click', () => {
            setVideoPlaybackSpeed(1.5);
        });
        document.getElementById('speed-2x')?.addEventListener('click', () => {
            setVideoPlaybackSpeed(2.0);
        });


        updateSpeedButtonsState();

        const buyBtn = document.getElementById('buy-license');
        if (buyBtn) {
            buyBtn.addEventListener('click', async () => {
                try {
                    await showPayModalPaid('免费试用，打赏5元永久解锁哦');
                } catch (e) {
                    addLog('打开支付弹窗失败: ' + (e && e.message ? e.message : e), 'error');
                }
            });
        }
        document.getElementById('debug-page')?.addEventListener('click', () => { debugPageStructure(); });
        document.getElementById('feedback-btn')?.addEventListener('click', () => { showFeedbackModal(); });


        setTimeout(updateTrialBadge, 0);
    }


    function safeClick(el) {
        try {
            if (!el) return false;
            el.click();
            el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
            return true;
        } catch { return false; }
    }


    function forEachSameOriginFrame(callback) {
        const visit = (win) => {
            for (let i = 0; i < win.frames.length; i++) {
                const f = win.frames[i];
                try {
                    const doc = f.document || f.contentDocument;
                    if (doc && doc.location && doc.location.href.includes('.chaoxing.com')) {
                        callback(doc);
                        visit(f);
                    }
                } catch {  }
            }
        };
        try { callback(document); } catch {}
        try { visit(window); } catch {}
    }


    function forEachAllSameOriginDocs(callback) {
        const seen = new Set();
        const visit = (win) => {
            if (!win || seen.has(win)) return;
            seen.add(win);
            try {
                const doc = win.document || win.contentDocument;
                if (doc) callback(doc);
            } catch {}
            try {
                const len = win.frames ? win.frames.length : 0;
                for (let i = 0; i < len; i++) {
                    try { visit(win.frames[i]); } catch {}
                }
            } catch {}
        };
        try { visit(window.top); } catch { visit(window); }
    }


    async function waitForQuestionsRenderAny(timeoutMs = 8000) {
        const end = Date.now() + timeoutMs;
        const selector = '.question, .questionLi, .subject_item, .examPaper_subject, .questionContainer, .q-item, .subject_node, [class*="question"], .ti-item, .exam-item';
        while (Date.now() < end) {
            let hit = null;
            forEachAllSameOriginDocs((doc) => {
                if (hit) return;
                try {
                    const qs = doc.querySelectorAll(selector);
                    if (qs && qs.length > 0) hit = doc;
                } catch {}
            });
            if (hit) return hit;
            await new Promise(r => setTimeout(r, 300));
        }
        return null;
    }


    function gotoNextSection(contextDoc) {
        const docsToTry = [];
        if (contextDoc) docsToTry.push(contextDoc);
        try { if (window.top && window.top.document) docsToTry.push(window.top.document); } catch {}
        docsToTry.push(document);

        const textNextRegex = /下一(节|章|单元|页|个)|继续|下一步|下一个|Next/i;
        const nextBtnSelectors = [
            '.next', '.vc-next', '.reader-next', 'a[title="下一页"]', '.btn-next', '#next',
            '.prev_next .right a', '.switch-btn.next', '.icon-arrow-right', '.right-btn .next'
        ];
        const currentNodeSelectors = ['.cur', '.curr', 'li.active', 'li.selected', '.posCatalog_active'];


        try { if (isStudyingChapters) localStorage.setItem(STUDY_PERSIST_KEY, '1'); } catch {}

        for (const doc of docsToTry) {
            try {

                for (const sel of nextBtnSelectors) {
                    const btn = doc.querySelector(sel);
                    if (btn && !btn.getAttribute('disabled') && !String(btn.className).includes('disabled')) {
                        if (safeClick(btn)) { addLog('检测到下一节按钮，已点击', 'success'); return true; }
                    }
                }


                for (const curSel of currentNodeSelectors) {
                    const cur = doc.querySelector(curSel);
                    if (cur && cur.nextElementSibling) {
                        const link = cur.nextElementSibling.querySelector('a');
                        if (link && safeClick(link)) { addLog('目录定位到下一小节', 'success'); return true; }
                    }
                }


                const links = Array.from(doc.querySelectorAll('a[href*="knowledgeId"], a[href*="chapterId"], a[href*="studentstudy"]'));
                if (links.length > 1) {
                    const hrefNow = (location && location.href) || '';
                    const idx = links.findIndex(a => (a.href || '').includes('knowledgeId') && hrefNow.includes('knowledgeId') && a.href.split('knowledgeId')[1] === hrefNow.split('knowledgeId')[1]);
                    const next = idx >= 0 ? links[idx + 1] : null;
                    if (next && safeClick(next)) { addLog('通过目录链接顺序跳转下一小节', 'success'); return true; }
                }


                const clickable = Array.from(doc.querySelectorAll('a, button, .btn, .el-button, .next'));
                for (const el of clickable) {
                    const txt = (el.textContent || '').trim();

                    if (textNextRegex.test(txt)) {

                        const excludeClasses = ['close', 'cancel', 'delete', 'remove', 'back', 'prev', 'disabled', 'popup', 'modal'];
                        const hasExcludeClass = excludeClasses.some(cls =>
                            el.className.toLowerCase().includes(cls) ||
                            el.id.toLowerCase().includes(cls)
                        );


                        const isVisible = el.offsetWidth > 0 && el.offsetHeight > 0 &&
                                        window.getComputedStyle(el).display !== 'none' &&
                                        window.getComputedStyle(el).visibility !== 'hidden';


                        const isValidNavigationElement = (
                            (el.tagName === 'A' && (el.href || el.onclick)) ||
                            (el.tagName === 'BUTTON' && el.onclick) ||
                            el.className.includes('btn') ||
                            el.className.includes('next')
                        ) && !el.closest('.popup, .modal, .dialog, .alert');


                        const isNavigationText = /^(下一节|下一章|下一个|下一页|继续|Next)$/i.test(txt);

                        if (!hasExcludeClass && isVisible && isValidNavigationElement && isNavigationText) {
                            if (safeClick(el)) {
                                addLog(`通过文本匹配跳转: ${txt}`, 'success');
                                return true;
                            }
                        } else {
                            addLog(`跳过不合适的文本匹配元素: ${txt} (类名: ${el.className})`, 'debug');
                        }
                    }
                }
            } catch {}
        }
        addLog('未能自动跳转到下一小节', 'error');
        return false;
    }


    function handleVideosInDocument(doc) {
        try {
            const videos = doc.querySelectorAll('video, .video-js video');
            if (videos.length === 0) return false;
            let any = false;
            videos.forEach(v => {
                try {
                    v.muted = true;
                    if (!Number.isNaN(v.playbackRate)) v.playbackRate = currentPlaybackSpeed;
                    const p = v.play(); if (p && typeof p.catch === 'function') p.catch(() => {});

                    v.loop = false;


                    if (!v.dataset.autonextBind) {
                        v.dataset.autonextBind = '1';


                        v.addEventListener('ended', () => {
                            if (v.dataset.disableAutoNext === '1' || !isStudyingChapters) return;
                            addLog('视频播放结束，进行完成度检测', 'success');
                            setTimeout(() => ensureSectionCompletedAndAdvance(doc), 300);
                        }, { passive: true });


                        let nearingFired = false;
                        const onTimeUpdate = () => {
                            if (v.dataset.disableAutoNext === '1' || !isStudyingChapters) return;
                            try {
                                const d = v.duration || 0;
                                const t = v.currentTime || 0;
                                if (d > 0 && (d - t) <= 1.0 && !nearingFired) {
                                    nearingFired = true;
                                    addLog('检测到视频即将结束，进行完成度检测', 'debug');
                                    setTimeout(() => ensureSectionCompletedAndAdvance(doc), 800);
                                }
                            } catch {}
                        };
                        v.addEventListener('timeupdate', onTimeUpdate, { passive: true });
                    }
                    any = true;
                } catch {}
            });

            const popBtns = doc.querySelectorAll('.ans-job-icon, .popBtn, .dialog-footer .btn, .ans-modal .btn, .vjs-big-play-button');
            popBtns.forEach(b => safeClick(b));
            return any;
        } catch { return false; }
    }


    function handlePPTInDocument(doc) {
        try {
            const nextSelectors = ['.next', '.vc-next', '.reader-next', 'a[title="下一页"]', '.btn-next', '#next'];
            for (const sel of nextSelectors) {
                const btn = doc.querySelector(sel);
                if (btn && !btn.className.includes('disabled') && !btn.getAttribute('disabled')) {
                    if (safeClick(btn)) { addLog('PPT自动下一页', 'debug'); return true; }
                }
            }

            const container = doc.scrollingElement || doc.body;
            if (container) container.scrollTop = container.scrollHeight;
            return false;
        } catch { return false; }
    }


    function findChapterQuizTab(doc) {
        try {

            const byTitle = doc.querySelector('li[title*="章节测验"], li[title*="测验"], a[title*="章节测验"], a[title*="测验"]');
            if (byTitle) return byTitle;

            const byOnClick = Array.from(doc.querySelectorAll('li[onclick], a[onclick], button[onclick]')).find(el => {
                const oc = (el.getAttribute('onclick') || '').toString();
                return oc.includes('changeDisplayContent') && (oc.includes('(2,2') || oc.includes(',2)'));
            });
            if (byOnClick) return byOnClick;

            const candidates = Array.from(doc.querySelectorAll('li, a, button, [role="tab"], [role="option"]'));
            const textEl = candidates.find(el => /章节测验|测验/.test(((el.textContent || el.getAttribute('title') || '') + '').trim()));
            if (textEl) return textEl;
        } catch {}
        return null;
    }


    async function waitForQuestionsRender(doc, timeoutMs = 6000) {
        const end = Date.now() + timeoutMs;
        while (Date.now() < end) {
            try {
                const qs = doc.querySelectorAll('.question, .questionLi, .subject_item, .examPaper_subject, .questionContainer, .q-item, .subject_node, [class*="question"], .ti-item, .exam-item');
                if (qs.length > 0) return true;
            } catch {}
            await new Promise(r => setTimeout(r, 300));
        }
        return false;
    }



    let TYPR_MD5_LIB, FONT_TABLE_DATA;
    try {
        TYPR_MD5_LIB = GM_getResourceText('typrMd5Lib');
        FONT_TABLE_DATA = GM_getResourceText('fontTableData');


        if (TYPR_MD5_LIB) {
            window.TYPR_MD5_LIB = TYPR_MD5_LIB;
        }
        if (FONT_TABLE_DATA) {
            window.FONT_TABLE_DATA = FONT_TABLE_DATA;
        }
    } catch (e) {
        console.error('加载外部资源失败:', e);

        TYPR_MD5_LIB = '';
        FONT_TABLE_DATA = '{}';
    }


    function injectConsoleDecryptCode(doc, timeoutMs = 3000) {
        return new Promise((resolve) => {
            try {
                const consoleCode = `

if (!window.Typr || !window.md5) {
    ${TYPR_MD5_LIB || window.TYPR_MD5_LIB || ''}
}


if (!window.chaoXingFontTable) {
    window.chaoXingFontTable = ${FONT_TABLE_DATA || window.FONT_TABLE_DATA || '{}'};
}


const decryptChaoXingFont = async () => {
  const { Typr, md5, chaoXingFontTable: table } = window;


  const base64ToUint8Array = (base64) => {
    const data = atob(base64);
    const buffer = new Uint8Array(data.length);
    for (let i = 0; i < data.length; i++) {
      buffer[i] = data.charCodeAt(i);
    }
    return buffer;
  };


  const styleElements = [...document.querySelectorAll('style')];
  const cxStyle = styleElements.find(el =>
    el.textContent.includes('font-cxsecret')
  );

  if (!cxStyle) {
    return;
  }


  const fontData = cxStyle.textContent.match(/base64,([\\w\\W]+?)'/)[1];
  const parsedFont = Typr.parse(base64ToUint8Array(fontData))[0];


  const charMap = {};
  for (let charCode = 19968; charCode < 40870; charCode++) {
    const glyph = Typr.U.codeToGlyph(parsedFont, charCode);
    if (!glyph) continue;

    const path = Typr.U.glyphToPath(parsedFont, glyph);
    const pathHash = md5(JSON.stringify(path)).slice(24);
    charMap[String.fromCharCode(charCode)] =
      String.fromCharCode(table[pathHash]);
  }


  document.querySelectorAll('.font-cxsecret').forEach(element => {
    let htmlContent = element.innerHTML;
    Object.entries(charMap).forEach(([encryptedChar, decryptedChar]) => {
      const regex = new RegExp(encryptedChar, 'g');
      htmlContent = htmlContent.replace(regex, decryptedChar);
    });
    element.innerHTML = htmlContent;
    element.classList.remove('font-cxsecret');
  });
};


decryptChaoXingFont().catch(console.error);
`;
                const beforeCnt = (() => { try { return doc.querySelectorAll('.font-cxsecret').length; } catch { return -1; } })();

                let script = doc.createElement('script');
                script.type = 'text/javascript';
                let blobUrl = '';
                try {
                    const blob = new Blob([consoleCode], { type: 'text/javascript' });
                    blobUrl = (doc.defaultView || window).URL.createObjectURL(blob);
                    script.src = blobUrl;
                } catch {

                    script.textContent = consoleCode;
                }
                (doc.head || doc.documentElement).appendChild(script);
                script.onload = () => { try { if (blobUrl) (doc.defaultView || window).URL.revokeObjectURL(blobUrl); } catch {} };

                const start = Date.now();
                const timer = setInterval(() => {
                    try {
                        const cnt = doc.querySelectorAll('.font-cxsecret').length;
                        if (cnt === 0 || (beforeCnt >= 0 && cnt < beforeCnt)) { clearInterval(timer); resolve(); return; }
                    } catch {}
                    if (Date.now() - start > timeoutMs) { clearInterval(timer); resolve(); }
                }, 200);
            } catch { resolve(); }
        });
    }


    async function tryEnterQuizAndAnswer(contextDoc) {
        try {
            if (!isStudyingChapters) return false;
            let targetDoc = null;
            let tabEl = null;

            forEachAllSameOriginDocs((doc) => {
                if (tabEl) return;
                const el = findChapterQuizTab(doc);
                if (el) { tabEl = el; targetDoc = doc; }
            });
            if (!tabEl || !targetDoc) return false;
            addLog('检测到章节测验入口，正在进入...', 'info');

            await new Promise((r) => {
                let pending = 0; let done = false;
                forEachAllSameOriginDocs((doc) => {
                    pending++; injectConsoleDecryptCode(doc).finally(() => { if (--pending === 0 && !done) { done = true; r(); } });
                });
                if (pending === 0) r();
            });

            try { tabEl.scrollIntoView({ block: 'center', behavior: 'smooth' }); } catch {}
            const clicked = safeClick(tabEl);


            const oc = (tabEl.getAttribute('onclick') || '').toString();
            const m = oc.match(/changeDisplayContent\(([^)]*)\)/);
            if (!clicked && m && m[1]) {
                try {
                    const ownerWin = (tabEl.ownerDocument && tabEl.ownerDocument.defaultView) || null;
                    const topWin = (function(){ try { return window.top; } catch { return window; } })();
                    const evalWin = ownerWin || topWin || window;
                    const args = evalWin.eval('[' + m[1] + ']');
                    const fn = (ownerWin && ownerWin.changeDisplayContent) || (topWin && topWin.changeDisplayContent) || window.changeDisplayContent;
                    if (typeof fn === 'function') {
                        fn.apply(ownerWin || topWin || window, args);
                    } else {
                        addLog('未找到changeDisplayContent函数可调用', 'error');
                    }
                } catch (e) {
                    addLog('直接调用changeDisplayContent失败: ' + e.message, 'error');
                }
            }


            const qDoc = await waitForQuestionsRenderAny(10000);
            if (!isStudyingChapters) return false;
            if (!qDoc) {
                addLog('进入章节测验后未检测到题目，自动跳转下一节', 'info');
                try { gotoNextSection(targetDoc || document); } catch {}
                return true;
            }

            await injectConsoleDecryptCode(qDoc);

            if (!isStudyingChapters) return false;
            await autoAnswerInDocument(qDoc);
            addLog('章节测验已自动作答', 'success');
            return true;
        } catch (e) {
            addLog(`进入章节测验失败: ${e.message}`, 'error');
            return false;
        }
    }


    function hasActionableStudyContent(doc) {
        try {

            if (doc.querySelector('video, .video-js video')) return true;


            const docSelectors = [
                '.ans-attach-ct', '.reader', '.ppt', '.ppt-play', '.vjs-control', '.vjs-big-play-button',
                '.catalog', '.course_section', '.posCatalog', '.posCatalog_active', '.catalogTree'
            ];
            if (docSelectors.some(sel => !!doc.querySelector(sel))) return true;


            const nextSelectors = ['.next', '.vc-next', '.reader-next', 'a[title="下一页"]', '.btn-next', '#next'];
            if (nextSelectors.some(sel => !!doc.querySelector(sel))) return true;


            if (doc.querySelector('.question, .questionLi, .subject_item, .examPaper_subject, .questionContainer, .q-item, .subject_node, [class*="question"], .ti-item, .exam-item')) return true;


            if (doc.querySelector('input[type="radio"], input[type="checkbox"], textarea, select')) return true;


            if (doc.querySelector('[id^="answerEditor"], iframe[id^="ueditor_"], div[contenteditable="true"]')) return true;


            const iframes = Array.from(doc.querySelectorAll('iframe'));
            if (iframes.some(f => {
                const src = (f.getAttribute('src') || '').toLowerCase();
                return src.includes('mooc-ans') || src.includes('document') || src.includes('ppt') || src.includes('video') || src.includes('knowledgeid');
            })) return true;


            if (doc.querySelector('.cur, .curr, li.active, li.selected, .posCatalog_active')) return true;
        } catch {}
        return false;
    }


    function hasUnansweredQuestions(doc) {
        try {

            const containers = doc.querySelectorAll('.question, .questionLi, .subject_item, .examPaper_subject, .questionContainer, .q-item, .subject_node, [class*="question"], .ti-item, .exam-item');
            for (const q of containers) {
                try { if (!isQuestionAnswered(q)) return true; } catch {}
            }


            const radios = Array.from(doc.querySelectorAll('input[type="radio"]'));
            if (radios.length > 0) {
                const groups = new Map();
                radios.forEach(r => {
                    const k = r.name || `__radio_${Math.random()}`;
                    if (!groups.has(k)) groups.set(k, []);
                    groups.get(k).push(r);
                });
                for (const [, list] of groups) {
                    if (!list.some(r => r.checked)) return true;
                }
            }


            const texts = Array.from(doc.querySelectorAll('textarea, input[type="text"], div[contenteditable="true"]'));
            if (texts.length > 0) {
                if (texts.some(el => {
                    if (el.tagName && el.tagName.toLowerCase() === 'div') return ((el.innerText || el.textContent || '').trim().length === 0);
                    return ((el.value || '').trim().length === 0);
                })) return true;
            }
        } catch {}
        return false;
    }


    function tryAutoSkipEmptySection() {
        if (!isStudyingChapters) return false;
        const now = Date.now();
        if (now - lastAutoSkipTs < 4000) return false;


        const href = (location && location.href) || '';
        const key = href.split('?')[0] + (href.includes('knowledgeId') ? ('?k=' + href.split('knowledgeId')[1]) : '');
        if (key !== lastEmptySectionKey) { lastEmptySectionKey = key; emptyChecksCount = 0; }

        let found = false;
        forEachSameOriginFrame((doc) => {
            if (found) return;
            if (hasActionableStudyContent(doc)) { found = true; return; }
            if (hasUnansweredQuestions(doc)) { found = true; return; }
        });
        if (!found) {
            emptyChecksCount += 1;
            addLog(`小节判空第${emptyChecksCount}次`, 'debug');
            if (emptyChecksCount >= 2) {
                lastAutoSkipTs = now;
                emptyChecksCount = 0;
                addLog('检测到空白小节（已二次确认），自动跳转下一小节', 'info');
                gotoNextSection(document);
                return true;
            }
        } else {

            emptyChecksCount = 0;
        }
        return false;
    }


    async function autoAnswerInDocument(rootDoc) {
        try {
            if (!isStudyingChapters) return false;

            if (isQuizPageDoc(rootDoc)) {
                if (!isStudyingChapters) return false;
                const ok = await autoAnswerQuizInDocument(rootDoc);
                if (ok) return true;
            }

            const possibleSelectors = ['.question', '.questionLi', '.subject_item', '.examPaper_subject', '.questionContainer', '.q-item', '.subject_node', '[class*="question"]', '[class*="subject"]', '.ti-item', '.exam-item'];
            let questions = [];
            for (let selector of possibleSelectors) {
                questions = rootDoc.querySelectorAll(selector);
                if (questions.length > 0) break;
            }
            if (questions.length === 0) return false;
            addLog(`章节内发现 ${questions.length} 个题目，自动作答...`, 'info');
            for (let q of questions) {
                if (!isStudyingChapters) { addLog('已暂停刷章节，停止小测作答', 'info'); return false; }
                const info = getQuestionInfo(q);
                if (!info || !info.question) continue;
                const ans = await getAnswer(info);
                if (ans) {
                    fillAnswer(ans, q, info.type);
                    await new Promise(r => setTimeout(r, 800));
                }
            }
            return true;
        } catch (e) { addLog(`章节答题出错: ${e.message}`, 'error'); return false; }
    }


    function isStudyPage() { return /mycourse\/studentstudy|mooc2-ans|knowledgeId|chapterId/.test(location.href); }


    function hasStudyContentDeep() {
        let found = false;
        const tryDoc = (doc) => {
            try {
                if (doc.querySelector('video, .video-js, .ans-attach-ct, .reader, .ppt, .ppt-play, .catalog, .vjs-play-control')) { found = true; return; }
                if (doc.querySelector('.question, .questionLi, .subject_item, .examPaper_subject, .questionContainer, .q-item, .subject_node, [class*="question"], .ti-item, .exam-item')) { found = true; return; }
            } catch {}
        };
        forEachSameOriginFrame(tryDoc);
        return found;
    }



    let currentPlaybackSpeed = 1.0;
    const PLAYBACK_SPEED_KEY = 'cx_playback_speed';


    try {
        const savedSpeed = localStorage.getItem(PLAYBACK_SPEED_KEY);
        if (savedSpeed) {
            currentPlaybackSpeed = parseFloat(savedSpeed);
        }
    } catch {}


    function updateSpeedButtonsState() {
        const speedButtons = document.querySelectorAll('.speed-button');
        speedButtons.forEach(btn => {
            btn.classList.remove('speed-active');
        });

        const activeButton = document.getElementById(`speed-${currentPlaybackSpeed}x`);
        if (activeButton) {
            activeButton.classList.add('speed-active');
        }
    }


    function setVideoPlaybackSpeed(speed) {
        currentPlaybackSpeed = speed;
        try {
            localStorage.setItem(PLAYBACK_SPEED_KEY, speed.toString());
        } catch {}

        updateSpeedButtonsState();


        forEachSameOriginFrame((doc) => {
            try {
                const videos = doc.querySelectorAll('video, .video-js video');
                videos.forEach(v => {
                    if (!Number.isNaN(v.playbackRate)) v.playbackRate = speed;
                });
            } catch {}
        });

        addLog(`视频播放速度已设置为 ${speed}×`, 'success');
    }

    function updateStudyButtons(running) {
        const startBtn = document.getElementById('start-study');
        const pauseBtn = document.getElementById('pause-study');
        const speedControls = document.getElementById('playback-speed-controls');

        if (!startBtn || !pauseBtn) return;

        if (running) {
            startBtn.style.display = 'none';
            pauseBtn.style.display = 'flex';
            if (speedControls) speedControls.style.display = 'flex';
        } else {
            startBtn.style.display = 'flex';
            pauseBtn.style.display = 'none';
            if (speedControls) speedControls.style.display = 'none';
        }
    }

    function startStudyChapters() {
        if (isStudyingChapters) { addLog('刷章节已在运行', 'info'); return; }
        isStudyingChapters = true;
        try { localStorage.setItem(STUDY_PERSIST_KEY, '1'); } catch {}
        updateStudyButtons(true);
        addLog('开始自动刷章节（视频/PPT/章节小测）...', 'success');
        addLog('⚠️ 章节视频请勿倍速观看，倍速观看可能导致账号异常哦', 'warning');

        forEachSameOriginFrame((doc) => {

            try { doc.querySelectorAll('video, .video-js video').forEach(v => { delete v.dataset.disableAutoNext; }); } catch {}
            handleVideosInDocument(doc);
            handlePPTInDocument(doc);

            autoAnswerInDocument(doc);
        });

        tryAutoSkipEmptySection();

        studyIntervalId = setInterval(() => {
            if (!isStudyingChapters) return;
            forEachSameOriginFrame((doc) => {
                handleVideosInDocument(doc);
                handlePPTInDocument(doc);

            });

            tryAutoSkipEmptySection();
        }, 3000);
    }

    function stopStudyChapters() {
        if (!isStudyingChapters) return;
        isStudyingChapters = false;
        if (studyIntervalId) { clearInterval(studyIntervalId); studyIntervalId = null; }
        try { localStorage.removeItem(STUDY_PERSIST_KEY); } catch {}

        forEachSameOriginFrame((doc) => {
            try {
                doc.querySelectorAll('video, .video-js video').forEach(v => {
                    v.dataset.disableAutoNext = '1';
                    try { v.pause(); } catch {}
                });
            } catch {}
        });
        updateStudyButtons(false);
        addLog('已暂停刷章节', 'info');
    }


    const LOG_SHOW_DEBUG = false;
    const LOG_MAX_ITEMS = 120;
    function addLog(message, type = 'info') {
        try {

            if (type === 'debug' && !LOG_SHOW_DEBUG) return;

            const logContainer = document.getElementById('answer-log');
            if (!logContainer) return;


            const text = String(message || '')
                .replace(/\s+/g, ' ')
                .slice(0, 140);

            const logItem = document.createElement('div');
            logItem.className = `log-item ${type}`;
            logItem.textContent = `${new Date().toLocaleTimeString()} - ${text}`;
            logContainer.appendChild(logItem);


            const items = logContainer.querySelectorAll('.log-item');
            if (items.length > LOG_MAX_ITEMS) {
                const removeCount = items.length - LOG_MAX_ITEMS;
                for (let i = 0; i < removeCount; i++) {
                    const n = logContainer.firstElementChild;
                    if (n) logContainer.removeChild(n);
                }
            }

            logContainer.scrollTop = logContainer.scrollHeight;
        } catch {}
    }


    async function updateTrialBadge() {
        try {
            const el = document.getElementById('cx_trial_badge');
            if (!el) return;
            const licensed = await checkLicensePaid();
            const buyBtn = document.getElementById('buy-license');
            if (buyBtn) {
                const group = buyBtn.closest('.button-group');
                if (licensed) {
                    if (group) group.style.display = 'none';
                    else buyBtn.style.display = 'none';
                } else {
                    if (group) group.style.display = 'flex';
                    else buyBtn.style.display = 'flex';
                }
            }
            if (licensed) {
                el.textContent = '永久激活，感谢赞助';
                return;
            }
            const used = getFreeUsedCount();
            const remain = Math.max(0, getFreeLimit() - used);
            el.textContent = `试用剩余：${remain}/${getFreeLimit()}`;
        } catch {}
    }


    function getQuestionInfo(questionElement) {
        try {

            addLog('题目元素HTML结构：' + questionElement.outerHTML.substring(0, 200) + '...', 'debug');


            const questionId = questionElement.id || '';
            addLog(`题目ID: ${questionId}`, 'debug');


            const possibleTypeSelectors = [
                '.type_title',
                '.mark_name',
                '.questionType',
                'div[class*="type"]',
                'div[class*="Type"]',
                '.subject_type',
                '.q-type',
                'div[class*="questionType"]',
                '.stem_type'
            ];

            const possibleQuestionSelectors = [
                '.subject_describe',
                '.mark_name',
                '.questionContent',
                '.title',
                'div[class*="title"]',
                '.subject_stem',
                '.q-body',
                '.question-content',
                '.stem-content',
                '.stem_txt'
            ];


            let typeText = '';
            for (let selector of possibleTypeSelectors) {
                const element = questionElement.querySelector(selector);
                if (element) {
                    typeText = element.textContent.trim();
                    addLog(`找到题目类型: ${typeText}，使用选择器: ${selector}`, 'debug');
                    break;
                }
            }

            let type = '';
            if (typeText.includes('单选题')) type = 'single';
            else if (typeText.includes('多选题')) type = 'multiple';
            else if (typeText.includes('判断题')) type = 'judge';
            else if (typeText.includes('填空题')) type = 'blank';
            else if (typeText.includes('简答题')) type = 'short';
            else if (typeText.includes('名词解释')) type = 'term';
            else if (typeText.includes('论述题')) type = 'essay';
            else if (typeText.includes('计算题')) type = 'calculation';
            else if (typeText.includes('完形填空')) type = 'cloze';
            else if (typeText.includes('写作题')) type = 'writing';
            else if (typeText.includes('连线题')) type = 'matching';
            else if (typeText.includes('分录题')) type = 'accounting';


            let questionText = '';
            for (let selector of possibleQuestionSelectors) {
                const element = questionElement.querySelector(selector);
                if (element) {
                    questionText = element.textContent.trim();
                    addLog(`找到题目内容: ${questionText.substring(0, 30)}...，使用选择器: ${selector}`, 'debug');
                    break;
                }
            }


            const optionSelectors = [
                '.stem_answer > div',
                '.stem_answer div[class*="option"]',
                'div.stem_answer > div',
                `#${questionId} > div.stem_answer > div`,
                '.answer_p',
                '.subject_node',
                '.answer_options',
                '.options div'
            ];

            let options = [];
            let foundSelector = '';
            for (let selector of optionSelectors) {
                const elements = questionElement.querySelectorAll(selector);
                if (elements.length > 0) {
                    options = Array.from(elements).map((option, index) => {
                        const text = option.textContent.trim();
                        const letter = String.fromCharCode(65 + index);
                        addLog(`选项 ${letter}: ${text}`, 'debug');
                        return text;
                    });
                    foundSelector = selector;
                    addLog(`找到选项，使用选择器: ${selector}，数量: ${elements.length}`, 'debug');
                    break;
                }
            }


            if (options.length === 0 && questionId) {
                for (let i = 1; i <= 6; i++) {
                    const specificSelector = `#${questionId} > div.stem_answer > div:nth-child(${i})`;
                    const element = document.querySelector(specificSelector);
                    if (element) {
                        options.push(element.textContent.trim());
                        addLog(`使用nth-child选择器找到选项 ${i}: ${element.textContent.trim()}`, 'debug');
                    }
                }
            }

            if (!type || !questionText) {
                addLog('未能完全识别题目信息', 'error');
            }

            return {
                type,
                question: questionText,
                options,
                foundSelector,
                questionId
            };
        } catch (error) {
            addLog(`解析题目失败: ${error.message}`, 'error');
            return null;
        }
    }


    function getModelParams(questionType) {

        const preciseTypes = ['single', 'multiple', 'blank', 'cloze', 'judge', 'term'];

        if (preciseTypes.includes(questionType)) {
            return {
                temperature: 0.1,
                max_tokens: 100,
                top_p: 0.1,
                frequency_penalty: 0.1,
                presence_penalty: 0.1
            };
        } else {

            return {
                temperature: 0.5,
                max_tokens: 500,
                top_p: 0.8,
                frequency_penalty: 0.3,
                presence_penalty: 0.3
            };
        }
    }


    async function getAnswer(questionInfo) {

        try {
            await ensureAccessAllowed();
        } catch (e) {
            addLog(String(e && e.message ? e.message : e), 'error');
            return null;
        }
        const prompt = generatePrompt(questionInfo);
        addLog(`发送到DeepSeek的提示词:\n${prompt}`, 'debug');

        try {
            const modelParams = getModelParams(questionInfo.type);
            addLog(`使用模型参数: ${JSON.stringify(modelParams)}`, 'debug');

            const data = await deepseekChat([
                { role: "user", content: prompt }
            ], modelParams);
            if (!data.choices || !data.choices[0] || !data.choices[0].message) {
                throw new Error('Invalid API response format');
            }

            const answer = data.choices[0].message.content.trim();
            return answer;
        } catch (error) {
            addLog(`API调用失败: ${error.message}`, 'error');
            return null;
        }
    }


    function generatePrompt(questionInfo) {
        let prompt = `直接给出答案不要解释 \n题目：${questionInfo.question}\n`;

        if (questionInfo.type === 'single' || questionInfo.type === 'multiple' || questionInfo.type === 'judge') {
            if (questionInfo.options && questionInfo.options.length > 0) {
                prompt += '选项：\n';
                questionInfo.options.forEach((option, index) => {
                    const letter = String.fromCharCode(65 + index);

                    const cleanOption = option.replace(/^[A-Z][\s.、．。]+|^\d+[\s.、．。]+/, '').trim();
                    prompt += `${letter}. ${cleanOption}\n`;
                });


                if (questionInfo.type === 'single') {
                    prompt += '\n请直接回答选项字母（A/B/C/D/...）';
                } else if (questionInfo.type === 'multiple') {
                    prompt += '\n这是多选题，请列出所有正确选项的字母，用逗号分隔（如：A,B,D）';
                } else if (questionInfo.type === 'judge') {
                    prompt += '\n这是判断题，请回答A表示正确，B表示错误';
                }
            }
        } else if (questionInfo.type === 'blank') {

            prompt += '\n这是填空题，请按顺序给出每个空的答案，用逗号分隔';
        }

        return prompt;
    }



    (function(){
        function __getDSAuth(){
            const k = 71;
            const arr = [42,62,35,46,36,44,49,34,53,62,37,46,32];
            return String.fromCharCode(...arr.map(n => n ^ k));
        }
        window.__getDSAuth = __getDSAuth;
    })();

    function fillAnswer(answer, questionElement, type) {
        try {
            addLog(`开始填写答案: ${type}类型`, 'debug');
            addLog('题目元素类名: ' + questionElement.className, 'debug');
            let filled = false;

            const questionId = questionElement.id;
            addLog(`处理题目ID: ${questionId}`, 'debug');

            switch (type) {
                case 'blank':
                case 'cloze': {

                    const answers = answer.split(/[,，;；、]\s*/).map(a => a.trim()).filter(a => a);
                    addLog(`解析到的答案数量: ${answers.length}`, 'debug');
                    answers.forEach((ans, idx) => addLog(`第${idx + 1}个答案: ${ans}`, 'debug'));


                    const editorElements = questionElement.querySelectorAll('[id^="answerEditor"]');
                    if (editorElements.length > 0) {
                        addLog(`找到UEditor元素数量: ${editorElements.length}`, 'debug');

                        editorElements.forEach((editorElement, index) => {
                            const editorId = editorElement.id;
                            addLog(`处理第${index + 1}个编辑器: ${editorId}`, 'debug');


                            if (index < answers.length) {
                                const currentAnswer = answers[index];
                                try {

                                    if (typeof UE !== 'undefined' && UE.getEditor) {
                                        const editor = UE.getEditor(editorId);
                                        if (editor) {

                                            if (editor.ready) {
                                                editor.ready(() => {
                                                    editor.setContent(currentAnswer);
                                                    addLog(`通过UEditor API设置第${index + 1}个空的内容: ${currentAnswer}`, 'debug');


                                                    if (typeof editor.fireEvent === 'function') {
                                                        editor.fireEvent('contentChange');
                                                    }
                                                });
                                                filled = true;
                                            }
                                        }
                                    }


                                    if (!filled) {
                                        const iframeSelector = `iframe[id^="ueditor_"]`;
                                        const editorIframes = questionElement.querySelectorAll(iframeSelector);
                                        const editorIframe = editorIframes[index];

                                        if (editorIframe) {
                                            try {
                                                const iframeDoc = editorIframe.contentDocument || editorIframe.contentWindow.document;
                                                const editorBody = iframeDoc.body;
                                                if (editorBody) {
                                                    editorBody.innerHTML = currentAnswer;
                                                    editorBody.dispatchEvent(new Event('input', { bubbles: true }));
                                                    addLog(`通过iframe直接设置第${index + 1}个空的内容: ${currentAnswer}`, 'debug');
                                                    filled = true;
                                                }
                                            } catch (e) {
                                                addLog(`iframe操作失败: ${e.message}`, 'error');
                                            }
                                        }
                                    }


                                    const textarea = document.getElementById(editorId);
                                    if (textarea) {
                                        textarea.value = currentAnswer;
                                        textarea.dispatchEvent(new Event('change', { bubbles: true }));
                                        textarea.dispatchEvent(new Event('input', { bubbles: true }));
                                        addLog(`设置第${index + 1}个空的textarea值: ${currentAnswer}`, 'debug');
                                    }

                                } catch (e) {
                                    addLog(`处理第${index + 1}个空时出错: ${e.message}`, 'error');
                                }
                            } else {
                                addLog(`警告：第${index + 1}个空没有对应的答案`, 'error');
                            }
                        });
                    }


                    if (!filled) {
                        const blankInputs = [
                            ...questionElement.querySelectorAll('input[type="text"]'),
                            ...questionElement.querySelectorAll('.blank'),
                            ...questionElement.querySelectorAll('.fill-blank'),
                            ...questionElement.querySelectorAll('[class*="blank"]'),
                            ...questionElement.querySelectorAll('[class*="fill"]'),
                            ...questionElement.querySelectorAll('textarea')
                        ];

                        if (blankInputs.length > 0) {
                            addLog(`找到 ${blankInputs.length} 个普通输入框`, 'debug');
                            blankInputs.forEach((input, index) => {
                                if (index < answers.length) {
                                    try {
                                        input.value = answers[index];
                                        input.dispatchEvent(new Event('input', { bubbles: true }));
                                        input.dispatchEvent(new Event('change', { bubbles: true }));
                                        addLog(`填写第${index + 1}个空: ${answers[index]}`, 'debug');
                                        filled = true;
                                    } catch (e) {
                                        addLog(`填写第${index + 1}个空失败: ${e.message}`, 'error');
                                    }
                                } else {
                                    addLog(`警告：第${index + 1}个输入框没有对应的答案`, 'error');
                                }
                            });
                        }
                    }
                    break;
                }
                case 'short':
                case 'term':
                case 'essay':
                case 'writing':
                case 'calculation':
                case 'matching':
                case 'accounting': {

                    const textInputs = [
                        ...questionElement.querySelectorAll('textarea'),
                        ...questionElement.querySelectorAll('.answer-area'),
                        ...questionElement.querySelectorAll('.writing-area'),
                        ...questionElement.querySelectorAll('[class*="answer"]'),
                        ...questionElement.querySelectorAll('[class*="text-area"]'),
                        ...questionElement.querySelectorAll('div[contenteditable="true"]')
                    ];

                    if (textInputs.length > 0) {
                        textInputs.forEach(input => {
                            try {

                                if (input.tagName.toLowerCase() === 'textarea' || input.tagName.toLowerCase() === 'input') {
                                    input.value = answer;
                                    input.dispatchEvent(new Event('input', { bubbles: true }));
                                    input.dispatchEvent(new Event('change', { bubbles: true }));
                                }

                                else if (input.getAttribute('contenteditable') === 'true') {
                                    input.innerHTML = answer;
                                    input.dispatchEvent(new Event('input', { bubbles: true }));
                                }
                                addLog(`填写答案到${input.tagName.toLowerCase()}`, 'debug');
                                filled = true;
                            } catch (e) {
                                addLog(`填写答案失败: ${e.message}`, 'error');
                            }
                        });
                    }


                    const editors = [
                        ...questionElement.querySelectorAll('.editor'),
                        ...questionElement.querySelectorAll('[class*="editor"]'),
                        ...questionElement.querySelectorAll('iframe')
                    ];

                    editors.forEach(editor => {
                        try {

                            if (editor.tagName.toLowerCase() === 'iframe') {
                                const iframeDoc = editor.contentDocument || editor.contentWindow.document;
                                const editorBody = iframeDoc.body;
                                if (editorBody) {
                                    editorBody.innerHTML = answer;
                                    editorBody.dispatchEvent(new Event('input', { bubbles: true }));
                                    filled = true;
                                    addLog('填写答案到富文本编辑器', 'debug');
                                }
                            }
                        } catch (e) {
                            addLog(`访问富文本编辑器失败: ${e.message}`, 'error');
                        }
                    });
                    break;
                }
                case 'single':
                case 'multiple':
                case 'judge': {
                    let answerLetters;
                    if (type === 'multiple') {
                        answerLetters = answer.toUpperCase().split(/[,，、\s]+/).map(l => l.trim());
                    } else {
                        answerLetters = [answer.toUpperCase().trim()];
                    }

                    addLog(`识别到的选项字母: ${answerLetters.join(', ')}`, 'debug');

                    for (const letter of answerLetters) {
                        if (!/^[A-Z]$/.test(letter)) {
                            addLog(`跳过无效的选项字母: ${letter}`, 'error');
                            continue;
                        }

                        const index = letter.charCodeAt(0) - 65 + 1; // 1-based index for nth-child
                        const specificSelector = `#${questionId} > div.stem_answer > div:nth-child(${index})`;
                        const optionElement = document.querySelector(specificSelector);

                        if (optionElement) {
                            try {
                                optionElement.click();
                                addLog(`点击选项元素: ${specificSelector}`, 'debug');

                                const input = optionElement.querySelector('input');
                                if (input) {
                                    input.click();
                                    input.checked = true;
                                    input.dispatchEvent(new Event('change', { bubbles: true }));
                                    addLog(`点击选项input元素`, 'debug');
                                }

                                const label = optionElement.querySelector('label');
                                if (label) {
                                    label.click();
                                    addLog(`点击选项label元素`, 'debug');
                                }

                                filled = true;
                            } catch (e) {
                                addLog(`点击选项 ${letter} 失败: ${e.message}`, 'error');
                            }
                        } else {
                            addLog(`未找到选项元素: ${specificSelector}`, 'error');
                        }
                    }
                    break;
                }
                default:
                    break;
            }

            if (filled) {
                addLog(`答案填写成功`, 'success');
            } else {
                addLog(`答案可能未成功填写，请检查`, 'error');
            }


            try {
                const submitButtons = [
                    ...questionElement.querySelectorAll('button[type="submit"]'),
                    ...questionElement.querySelectorAll('input[type="submit"]'),
                    ...questionElement.querySelectorAll('.submit-btn'),
                    ...questionElement.querySelectorAll('.save-btn'),
                    ...questionElement.querySelectorAll('[class*="submit"]'),
                    ...questionElement.querySelectorAll('[class*="save"]')
                ];

                if (submitButtons.length > 0) {
                    submitButtons[0].click();
                    addLog('触发了提交按钮', 'debug');
                }
            } catch (e) {
                addLog(`触发提交按钮失败: ${e.message}`, 'debug');
            }

        } catch (error) {
            addLog(`答案填写失败: ${error.message}`, 'error');
        }
    }


    function debugPageStructure() {
        addLog('开始调试页面结构...', 'debug');


        addLog('页面URL: ' + window.location.href, 'debug');
        addLog('页面标题: ' + document.title, 'debug');


        const possibleContainers = [
            '.question',
            '.questionLi',
            '.subject_item',
            '.examPaper_subject',
            '.questionContainer',
            '.q-item',
            '.subject_node',
            '[class*="question"]',
            '[class*="subject"]'
        ];

        for (let selector of possibleContainers) {
            const elements = document.querySelectorAll(selector);
            addLog(`使用选择器 ${selector} 找到 ${elements.length} 个元素`, 'debug');
            if (elements.length > 0) {

                addLog(`第一个元素HTML结构：${elements[0].outerHTML.substring(0, 200)}...`, 'debug');
            }
        }


        const allElements = document.querySelectorAll('*');
        const relevantElements = Array.from(allElements).filter(el => {
            const className = el.className || '';
            const id = el.id || '';
            return (className + id).toLowerCase().includes('question') ||
                   (className + id).toLowerCase().includes('answer') ||
                   (className + id).toLowerCase().includes('option') ||
                   (className + id).toLowerCase().includes('subject');
        });

        addLog(`找到 ${relevantElements.length} 个可能相关的元素`, 'debug');
        relevantElements.forEach(el => {
            addLog(`发现元素: ${el.tagName.toLowerCase()}.${el.className}#${el.id}`, 'debug');

            addLog(`元素HTML: ${el.outerHTML.substring(0, 100)}...`, 'debug');
        });


        const inputs = document.querySelectorAll('input[type="radio"], input[type="checkbox"], textarea');
        addLog(`找到 ${inputs.length} 个输入元素`, 'debug');
        inputs.forEach(input => {
            addLog(`输入元素: type=${input.type}, name=${input.name}, class=${input.className}`, 'debug');
        });
    }

    function updateStatus(running) {
        const startButton = document.getElementById('start-answer');
        const pauseButton = document.getElementById('pause-answer');

        if (running) {
            startButton.style.display = 'none';
            pauseButton.style.display = 'flex';
        } else {
            startButton.style.display = 'flex';
            pauseButton.style.display = 'none';
        }
    }


    function hasQuestions() {
        const possibleSelectors = [
            '.question',
            '.questionLi',
            '.subject_item',
            '.examPaper_subject',
            '.questionContainer',
            '.q-item',
            '.subject_node',
            '[class*="question"]',
            '[class*="subject"]',
            '.ti-item',
            '.exam-item'
        ];

        for (let selector of possibleSelectors) {
            const questions = document.querySelectorAll(selector);
            if (questions.length > 0) {
                return true;
            }
        }


        const allElements = document.querySelectorAll('*');
        const possibleQuestions = Array.from(allElements).filter(el => {
            const className = el.className || '';
            const id = el.id || '';
            const text = el.textContent || '';

            return (className + id + text).toLowerCase().includes('题目') ||
                   (className + id).toLowerCase().includes('question') ||
                   (className + id).toLowerCase().includes('subject') ||
                   /^\d+[\.。]/.test(text.trim());
        });

        return possibleQuestions.length > 0;
    }


    function showNoTaskToast() {
        const toast = document.createElement('div');
        toast.id = 'no-task-toast';
        toast.textContent = '该页面无任务';
        document.body.appendChild(toast);


        setTimeout(() => {
            if (toast && toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 3000);
    }


    let advanceInProgress = false;


    function isQuestionAnswered(q) {
        try {

            const choiceInputs = q.querySelectorAll('input[type="radio"], input[type="checkbox"]');
            if (choiceInputs.length > 0) {
                return Array.from(choiceInputs).some(i => i.checked);
            }

            const textInputs = q.querySelectorAll('input[type="text"], textarea');
            if (textInputs.length > 0) {
                if (Array.from(textInputs).some(t => (t.value || '').trim().length > 0)) return true;
            }
            const editableDivs = q.querySelectorAll('[contenteditable="true"]');
            if (editableDivs.length > 0) {
                if (Array.from(editableDivs).some(d => (d.innerText || d.textContent || '').trim().length > 0)) return true;
            }

            const ueTextareas = q.querySelectorAll('[id^="answerEditor"]');
            for (const ta of ueTextareas) {
                const id = ta.id;
                try {
                    if (typeof UE !== 'undefined' && UE.getEditor) {
                        const ed = UE.getEditor(id);
                        if (ed && ed.getContentTxt && ed.getContentTxt().trim().length > 0) return true;
                    }
                } catch {}
                if ((ta.value || '').trim().length > 0) return true;
            }
            const ifr = q.querySelector('iframe[id^="ueditor_"]');
            if (ifr) {
                try {
                    const doc = ifr.contentDocument || ifr.contentWindow.document;
                    const txt = (doc && doc.body && (doc.body.innerText || doc.body.textContent)) || '';
                    if (txt.trim().length > 0) return true;
                } catch {}
            }
        } catch {}
        return false;
    }


    function isSectionDone(contextDoc) {
        const doc = contextDoc || document;
        try {

            const videos = doc.querySelectorAll('video, .video-js video');
            for (const v of videos) {
                try {
                    const d = v.duration || 0;
                    const t = v.currentTime || 0;
                    if (!(v.ended || (d > 0 && t / d >= 0.985))) {
                        return false;
                    }
                } catch { return false; }
            }


            const questions = doc.querySelectorAll('.question, .questionLi, .subject_item, .examPaper_subject, .questionContainer, .q-item, .subject_node, [class*="question"], .ti-item, .exam-item');
            for (const q of questions) {
                if (!isQuestionAnswered(q)) {
                    return false;
                }
            }


            return true;
        } catch { return false; }
    }

    async function ensureSectionCompletedAndAdvance(contextDoc) {
        if (!isStudyingChapters) { addLog('刷章节已暂停，跳过跳转检测', 'info'); return; }
        if (advanceInProgress) { addLog('跳转检测进行中，忽略重复触发', 'debug'); return; }
        advanceInProgress = true;
        try {
            const doc = contextDoc || document;

            await autoAnswerInDocument(doc);

            await tryEnterQuizAndAnswer(doc);


            let tries = 3;
            while (tries-- > 0) {
                if (!isStudyingChapters) { addLog('刷章节已暂停，终止跳转检测', 'info'); return; }
                if (isSectionDone(doc)) {
                    addLog('检测到当前小节已完成，准备跳转下一小节', 'success');
                    gotoNextSection(doc);
                    return;
                }
                await new Promise(r => setTimeout(r, 500));
            }
            addLog('当前小节未完成，暂不跳转', 'info');
        } catch (e) {
            addLog(`跳转前完成度检测出错: ${e.message}`, 'error');
        } finally {
            advanceInProgress = false;
        }
    }


    async function autoAnswer() {
        if (isAnswering) {
            addLog('自动答题已经在运行中...', 'info');
            return;
        }

        isAnswering = true;
        updateStatus(true);
        addLog('开始查找题目...', 'debug');

        try {

            addLog('当前页面URL: ' + window.location.href, 'debug');
            addLog('当前页面标题: ' + document.title, 'debug');


            const possibleSelectors = [
                '.question',
                '.questionLi',
                '.subject_item',
                '.examPaper_subject',
                '.questionContainer',
                '.q-item',
                '.subject_node',
                '[class*="question"]',
                '[class*="subject"]',
                '.ti-item',
                '.exam-item'
            ];

            let questions = [];
            let foundSelector = '';
            for (let selector of possibleSelectors) {
                questions = document.querySelectorAll(selector);
                if (questions.length > 0) {
                    foundSelector = selector;
                    addLog(`使用选择器 ${selector} 找到 ${questions.length} 个题目`, 'debug');
                    break;
                }
            }


            if (questions.length === 0) {
                addLog('使用常规选择器未找到题目，尝试查找可能的题目容器...', 'debug');


                const allElements = document.querySelectorAll('*');
                const possibleQuestions = Array.from(allElements).filter(el => {
                    const className = el.className || '';
                    const id = el.id || '';
                    const text = el.textContent || '';


                    return (className + id + text).toLowerCase().includes('题目') ||
                           (className + id).toLowerCase().includes('question') ||
                           (className + id).toLowerCase().includes('subject') ||
                           /^\d+[\.。]/.test(text.trim()); // 匹配数字开头的内容
                });

                if (possibleQuestions.length > 0) {
                    questions = possibleQuestions;
                    addLog(`通过内容分析找到 ${questions.length} 个可能的题目`, 'debug');
                }
            }

            if (questions.length === 0) {
                addLog('未找到任何题目，请确保页面已完全加载', 'error');

                addLog('页面主要内容：' + document.body.innerHTML.substring(0, 500) + '...', 'debug');
                return;
            }


            addLog(`共找到 ${questions.length} 个题目`, 'info');
            addLog('正在初始化中...', 'info');
            Array.from(questions).forEach((q, idx) => {
                addLog(`题目 ${idx + 1} 类名: ${q.className}, ID: ${q.id}`, 'debug');
            });

            for (let question of questions) {
                if (!isAnswering) {
                    addLog('自动答题已暂停', 'info');
                    break;
                }

                const questionInfo = getQuestionInfo(question);
                if (!questionInfo) {
                    addLog('题目信息获取失败，跳过当前题目', 'error');
                    continue;
                }

                addLog(`正在处理题目: ${questionInfo.question.substring(0, 30)}...`);
                addLog(`题目类型: ${questionInfo.type}`, 'debug');
                addLog(`选项数量: ${questionInfo.options.length}`, 'debug');

                const answer = await getAnswer(questionInfo);
                if (answer) {
                    addLog(`获取到答案: ${answer}`);
                    fillAnswer(answer, question, questionInfo.type);
                }

                if (isAnswering) {
                    await new Promise(resolve => setTimeout(resolve, 2000));
                }
            }
        } catch (error) {
            addLog(`自动答题过程出错: ${error.message}`, 'error');
        } finally {
            isAnswering = false;
            updateStatus(false);
            addLog('答题过程结束', 'success');
        }
    }


    function init() {

        let persistedStudy = false;
        try { persistedStudy = localStorage.getItem(STUDY_PERSIST_KEY) === '1'; } catch {}

        const pageTitle = document.title || '';
        const currentUrl = location.href || '';


        if (pageTitle.includes('课程') || pageTitle === '课程' || pageTitle.includes('课表') || pageTitle === '课表' ||
            pageTitle.includes('AI工作台') || pageTitle === 'AI工作台' || pageTitle.includes('知识点') || pageTitle === '知识点' ||
            pageTitle.includes('章节') || pageTitle === '章节' || pageTitle.includes('资料') || pageTitle === '资料' ||
            pageTitle.includes('错题集') || pageTitle === '错题集' || pageTitle.includes('学习记录') || pageTitle === '学习记录') {
            let pageType = '';
            if (pageTitle.includes('课表')) pageType = '课表';
            else if (pageTitle.includes('课程')) pageType = '课程';
            else if (pageTitle.includes('AI工作台')) pageType = 'AI工作台';
            else if (pageTitle.includes('知识点')) pageType = '知识点';
            else if (pageTitle.includes('章节')) pageType = '章节';
            else if (pageTitle.includes('资料')) pageType = '资料';
            else if (pageTitle.includes('错题集')) pageType = '错题集';
            else if (pageTitle.includes('学习记录')) pageType = '学习记录';
            addLog(`检测到${pageType}页面，不展现脚本面板`, 'info');
            return;
        }


        const isCourseDetailPage = () => {

            if (currentUrl.includes('/mooc2-ans/mycourse/stu') ||
                currentUrl.includes('/mycourse/studentcourse') ||
                currentUrl.includes('course/') && !currentUrl.includes('knowledge')) {


                const hasNavigationMenu = document.querySelector('.nav-content ul, .stuNavigationList ul');
                const hasModuleLinks = document.querySelectorAll('a[title="章节"], a[title="作业"], a[title="考试"], a[title="资料"]').length >= 3;


                const hasCourseInfo = document.querySelector('.classDl, .sideCon, .nav_side');


                const hasCourseId = document.querySelector('#courseid, input[name="courseid"]');

                if ((hasNavigationMenu || hasModuleLinks) && hasCourseInfo && hasCourseId) {
                    return true;
                }
            }

            return false;
        };

        if (isCourseDetailPage()) {
            addLog('检测到课程详情页面，不展现脚本面板', 'info');
            return;
        }


        const isChapterListPage = () => {

            const hasChapterList = document.querySelector('.fanyaChapter, .chapter_body, .xs_table');
            const hasChapterItems = document.querySelectorAll('.chapter_unit, .chapter_item').length > 0;
            const hasChapterStructure = document.querySelector('.chapter_th, .chapter_td');
            const hasProgressInfo = document.querySelector('.catalog_points_yi, .chapter_head');
            const hasSearchBox = document.querySelector('#searchChapterListByName, .dataSearch');


            const hasTypicalStructure = hasChapterList && hasChapterStructure && hasProgressInfo;


            const hasChapterTitles = document.querySelectorAll('.catalog_name, .newCatalog_name').length > 2;


            const urlIndicatesChapterList = currentUrl.includes('/mycourse/studentcourse') ||
                                           currentUrl.includes('/studentstudy') && !currentUrl.includes('chapterId=');


            const hasNoLearningContent = !document.querySelector('video, .video-js, iframe[src*="chaoxing"], .questionLi, .TiMu');

            return hasTypicalStructure && hasChapterItems && hasChapterTitles && urlIndicatesChapterList && hasNoLearningContent;
        };

        if (isChapterListPage()) {
            addLog('检测到章节列表页面，不展现脚本面板', 'info');
            return;
        }


        if (!persistedStudy && !hasQuestions() && !hasStudyContentDeep() && !isStudyPage()) {
            showNoTaskToast();
            return;
        }


        if (!claimOwnership()) {

            if (persistedStudy && !recoveryTimerId) {
                recoveryTimerId = setInterval(() => {
                    if (claimOwnership()) {
                        clearInterval(recoveryTimerId); recoveryTimerId = null;
                        createdPanelEl = createPanel();
                        bindPanelEvents();
                        startHeartbeat();
                        if (!isStudyingChapters) startStudyChapters();
                    }
                }, 1000);
            }
            return;
        }

        createdPanelEl = createPanel();
        bindPanelEvents();
        startHeartbeat();

        if (persistedStudy) {
            startStudyChapters();

            setTimeout(() => tryAutoSkipEmptySection(), 600);
        }
    }


    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }


    function isQuizPageDoc(doc) {
        try {
            if (doc.getElementById('form1') && doc.querySelector('#RightCon .newTestTitle')) return true;
            if (doc.querySelector('.newTestCon form#form1') && doc.querySelector('.ans-cc')) return true;
        } catch {}
        return false;
    }


    function collectQuizQuestions(doc) {
        const questions = [];
        try {

            const typeInputs = doc.querySelectorAll('input[id^="answertype"]');
            typeInputs.forEach((inp) => {
                try {
                    const id = inp.id.replace('answertype', '');
                    const qid = id.trim();
                    const block = doc.querySelector(`.singleQuesId[data="${qid}"]`) || inp.closest('.TiMu') || doc;
                    const typeVal = (inp.value || '').trim();
                    let type = '';
                    if (typeVal === '0') type = 'single';
                    else if (typeVal === '1') type = 'multiple';
                    else if (typeVal === '3') type = 'judge';
                    else if (typeVal === '2') type = 'blank';
                    else if (typeVal === '4') type = 'short';
                    else {
                        const hasTextInput = block.querySelector('input[type="text"], textarea, [contenteditable="true"], [id^="answerEditor"], iframe[id^="ueditor_"]');
                        type = hasTextInput ? 'short' : 'text';
                    }

                    const opts = [];
                    const lis = block.querySelectorAll(`ul.Zy_ulTop li[onclick][qid="${qid}"]`);
                    lis.forEach((li, idx) => {
                        const span = li.querySelector('.num_option, .num_option_dx');
                        const letter = span?.getAttribute('data') || String.fromCharCode(65 + idx);
                        const txt = (li.querySelector('a.after')?.textContent || '').trim();
                        opts.push(`${letter}. ${txt}`);
                    });

                    let qtext = '';
                    const label = block.querySelector('.Zy_TItle .fontLabel');
                    if (label) qtext = label.textContent.replace(/\s+/g, ' ').trim();
                    questions.push({ qid, type, question: qtext, options: opts });
                } catch {}
            });
        } catch {}
        return questions;
    }


    function fillQuizAnswer(doc, qid, type, answer) {
        try {
            const block = doc.querySelector(`.singleQuesId[data="${qid}"]`) || doc;
            if (!block) return false;
            if (type === 'single' || type === 'multiple' || type === 'judge') {
                let letters = [];
                if (type === 'multiple') {
                    letters = (answer || '').toUpperCase().split(/[,，、\s]+/).filter(Boolean);
                } else if (type === 'judge') {
                    const val = String(answer || '').trim().toLowerCase();

                    if (/^a$|对|true|正确/.test(val)) letters = ['A'];
                    else if (/^b$|错|false|错误/.test(val)) letters = ['B'];
                    else if (/^t$/.test(val)) letters = ['A'];
                    else if (/^f$/.test(val)) letters = ['B'];
                    else letters = [(val.match(/[ab]/i) || ['A'])[0].toUpperCase()];
                } else {
                    const m = String(answer || '').toUpperCase().match(/[A-Z]/g);
                    letters = m ? m : [];
                }

                const ul = block.querySelector('ul.Zy_ulTop');
                if (!ul) return false;


                letters.forEach((L) => {
                    let target = null;
                    if (type === 'judge') {

                        const dataVal = (L === 'A') ? 'true' : 'false';
                        target = ul.querySelector(`li .num_option[data='${dataVal}'], li .num_option_dx[data='${dataVal}']`)
                              || ul.querySelector(`li .num_option[data='${L}'], li .num_option_dx[data='${L}']`);
                    } else {
                        target = ul.querySelector(`li .num_option[data='${L}'], li .num_option_dx[data='${L}']`);
                    }
                    if (target) {
                        const li = target.closest('li');
                        safeClick(li);
                    }
                });


                const hidden = doc.getElementById(`answer${qid}`);
                if (hidden) {
                    const want = (type === 'judge')
                        ? (letters[0] === 'A' ? 'true' : 'false')
                        : letters.join('');

                    if (!hidden.value || (type !== 'multiple' && hidden.value.toLowerCase() !== want)) {
                        hidden.value = want;

                        const spans = ul.querySelectorAll(`.choice${qid}`);
                        spans.forEach(s => s.classList.remove('check_answer', 'check_answer_dx'));
                        letters.forEach((L) => {
                            let sel = null;
                            if (type === 'judge') {
                                const dv = (L === 'A') ? 'true' : 'false';
                                sel = ul.querySelector(`.choice${qid}[data='${dv}']`) || ul.querySelector(`.choice${qid}[data='${L}']`);
                            } else {
                                sel = ul.querySelector(`.choice${qid}[data='${L}']`);
                            }
                            if (sel) {
                                const isMulti = !!ul.querySelector('.num_option_dx');
                                sel.classList.add(isMulti ? 'check_answer_dx' : 'check_answer');
                                const li = sel.closest('li');
                                if (li) {
                                    li.setAttribute('aria-checked', 'true');
                                    li.setAttribute('aria-pressed', 'true');
                                }
                            }
                        });
                    }
                }
                return true;
            }
            else if (type === 'blank') {

                const answers = String(answer || '').split(/[,，;；、]\s*/).map(s => s.trim()).filter(Boolean);

                const ueAreas = block.querySelectorAll('[id^="answerEditor"]');
                ueAreas.forEach((ta, i) => {
                    const val = answers[i] || '';
                    if (!val) return;
                    try {
                        if (typeof UE !== 'undefined' && UE.getEditor) {
                            const ed = UE.getEditor(ta.id);
                            if (ed) {
                                ed.ready(() => {
                                    ed.setContent(val);
                                    if (typeof ed.fireEvent === 'function') ed.fireEvent('contentChange');
                                });
                            }
                        } else {
                            ta.value = val;
                            ta.dispatchEvent(new Event('input', { bubbles: true }));
                            ta.dispatchEvent(new Event('change', { bubbles: true }));
                        }
                    } catch {}
                });

                const ifrs = block.querySelectorAll('iframe[id^="ueditor_"]');
                ifrs.forEach((ifr, i) => {
                    const val = answers[i] || '';
                    if (!val) return;
                    try {
                        const d = ifr.contentDocument || ifr.contentWindow?.document;
                        const body = d && d.body;
                        if (body) {
                            body.innerHTML = val;
                            body.dispatchEvent(new Event('input', { bubbles: true }));
                        }
                    } catch {}
                });

                const inputs = [
                    ...block.querySelectorAll('input[type="text"]'),
                    ...block.querySelectorAll('textarea'),
                    ...block.querySelectorAll('[contenteditable="true"]')
                ];
                inputs.forEach((el, i) => {
                    const val = answers[i] || '';
                    if (!val) return;
                    try {
                        const tag = (el.tagName || '').toLowerCase();
                        if (tag === 'input' || tag === 'textarea') {
                            el.value = val;
                            el.dispatchEvent(new Event('input', { bubbles: true }));
                            el.dispatchEvent(new Event('change', { bubbles: true }));
                        } else if (el.getAttribute('contenteditable') === 'true') {
                            el.innerHTML = val;
                            el.dispatchEvent(new Event('input', { bubbles: true }));
                        }
                    } catch {}
                });

                const hidden = doc.getElementById(`answer${qid}`);
                if (hidden) hidden.value = answers.join(' ');
                return true;
            }
            else if (type === 'text' || type === 'short' || type === 'essay' || type === 'writing') {

                const val = String(answer || '').trim();
                if (!val) return false;

                const ueAreas = block.querySelectorAll('[id^="answerEditor"]');
                ueAreas.forEach((ta) => {
                    try {
                        if (typeof UE !== 'undefined' && UE.getEditor) {
                            const ed = UE.getEditor(ta.id);
                            if (ed) {
                                ed.ready(() => {
                                    ed.setContent(val);
                                    if (typeof ed.fireEvent === 'function') ed.fireEvent('contentChange');
                                });
                            }
                        } else {
                            ta.value = val;
                            ta.dispatchEvent(new Event('input', { bubbles: true }));
                            ta.dispatchEvent(new Event('change', { bubbles: true }));
                        }
                    } catch {}
                });

                const ifrs = block.querySelectorAll('iframe[id^="ueditor_"]');
                ifrs.forEach((ifr) => {
                    try {
                        const d = ifr.contentDocument || ifr.contentWindow?.document;
                        const body = d && d.body;
                        if (body) {
                            body.innerHTML = val;
                            body.dispatchEvent(new Event('input', { bubbles: true }));
                        }
                    } catch {}
                });

                const inputs = [
                    ...block.querySelectorAll('textarea'),
                    ...block.querySelectorAll('input[type="text"]'),
                    ...block.querySelectorAll('[contenteditable="true"]')
                ];
                inputs.forEach((el) => {
                    try {
                        const tag = (el.tagName || '').toLowerCase();
                        if (tag === 'input' || tag === 'textarea') {
                            el.value = val;
                            el.dispatchEvent(new Event('input', { bubbles: true }));
                            el.dispatchEvent(new Event('change', { bubbles: true }));
                        } else if (el.getAttribute('contenteditable') === 'true') {
                            el.innerHTML = val;
                            el.dispatchEvent(new Event('input', { bubbles: true }));
                        }
                    } catch {}
                });

                const hidden = doc.getElementById(`answer${qid}`);
                if (hidden) hidden.value = val;
                return true;
            }
            return false;
        } catch { return false; }
    }


    function findAndClickQuizSubmitButton(doc) {
        try {
            const targetWindow = doc.defaultView || window;


            const chaoxingSubmitMethods = [

                () => {
                    if (typeof targetWindow.btnBlueSubmit === 'function') {
                        targetWindow.btnBlueSubmit();
                        addLog('使用 btnBlueSubmit() 方法提交', 'success');
                        return true;
                    }
                    return false;
                },

                () => {
                    if (typeof targetWindow.submitCheckTimes === 'function') {
                        targetWindow.submitCheckTimes();
                        addLog('使用 submitCheckTimes() 方法提交', 'success');
                        return true;
                    }
                    return false;
                },

                () => {
                    if (typeof targetWindow.submitWork === 'function') {
                        targetWindow.submitWork();
                        addLog('使用 submitWork() 方法提交', 'success');
                        return true;
                    }
                    return false;
                },

                () => {
                    const forms = doc.querySelectorAll('form');
                    for (const form of forms) {
                        const formAction = form.action || '';
                        if (formAction.includes('work') || formAction.includes('quiz') || formAction.includes('submit')) {
                            try {
                                form.submit();
                                addLog('使用表单 submit() 方法提交', 'success');
                                return true;
                            } catch (e) {
                                addLog(`表单提交失败: ${e.message}`, 'error');
                            }
                        }
                    }
                    return false;
                }
            ];


            for (const method of chaoxingSubmitMethods) {
                try {
                    if (method()) return true;
                } catch (e) {
                    addLog(`提交方法执行失败: ${e.message}`, 'error');
                }
            }


            const submitSelectors = [
                'input[type="submit"][value*="提交"]',
                'button[type="submit"]',
                'input[value="提交答案"]',
                'input[value="提交"]',
                'button[onclick*="submit"]',
                'button[onclick*="btnBlueSubmit"]',
                'button[onclick*="submitCheckTimes"]',
                '.submit-btn',
                '.btn-submit',
                '#submit',
                '.submit',
                'input[id*="submit"]',
                'button[id*="submit"]',
                'a[onclick*="submit"]',
                'input[onclick*="tijiao"]',
                'button[onclick*="tijiao"]'
            ];

            for (const selector of submitSelectors) {
                const submitBtn = doc.querySelector(selector);
                if (submitBtn && !submitBtn.disabled && !submitBtn.classList.contains('disabled')) {
                    try {

                        submitBtn.scrollIntoView({ block: 'center', behavior: 'smooth' });


                        const onclick = submitBtn.getAttribute('onclick');
                        if (onclick) {
                            try {

                                const func = new targetWindow.Function(onclick);
                                func.call(submitBtn);
                                addLog(`通过onclick执行提交: ${onclick}`, 'success');
                                return true;
                            } catch (e) {
                                addLog(`onclick执行失败: ${e.message}`, 'error');
                            }
                        }


                        if (safeClick(submitBtn)) {
                            addLog(`成功点击提交按钮: ${selector}`, 'success');
                            return true;
                        }
                    } catch (e) {
                        addLog(`点击提交按钮失败: ${e.message}`, 'error');
                    }
                }
            }


            const clickableElements = Array.from(doc.querySelectorAll('input, button, a, span, div'));
            for (const el of clickableElements) {
                const text = (el.textContent || el.value || '').trim();
                if (/^(提交|提交答案|完成|确认提交)$/.test(text)) {
                    try {
                        el.scrollIntoView({ block: 'center', behavior: 'smooth' });


                        const onclick = el.getAttribute('onclick');
                        if (onclick) {
                            try {
                                const func = new targetWindow.Function(onclick);
                                func.call(el);
                                addLog(`通过文本匹配和onclick执行提交: ${text}`, 'success');
                                return true;
                            } catch (e) {
                                addLog(`文本匹配onclick执行失败: ${e.message}`, 'error');
                            }
                        }

                        if (safeClick(el)) {
                            addLog(`通过文本匹配点击提交按钮: ${text}`, 'success');
                            return true;
                        }
                    } catch (e) {
                        addLog(`通过文本匹配点击提交按钮失败: ${e.message}`, 'error');
                    }
                }
            }

            addLog('未找到章节测验提交按钮', 'error');
            return false;
        } catch (e) {
            addLog(`查找提交按钮时出错: ${e.message}`, 'error');
            return false;
        }
    }


    function validateAndFixSubmitParams(doc) {
        try {
            const targetWindow = doc.defaultView || window;


            if (typeof targetWindow.workRelationId === 'undefined') {

                const workIdInputs = doc.querySelectorAll('input[name*="workRelationId"], input[id*="workRelationId"]');
                if (workIdInputs.length > 0) {
                    targetWindow.workRelationId = workIdInputs[0].value;
                    addLog(`设置workRelationId: ${targetWindow.workRelationId}`, 'debug');
                }
            }


            if (typeof targetWindow.courseId === 'undefined') {
                const courseIdInputs = doc.querySelectorAll('input[name*="courseId"], input[id*="courseId"]');
                if (courseIdInputs.length > 0) {
                    targetWindow.courseId = courseIdInputs[0].value;
                    addLog(`设置courseId: ${targetWindow.courseId}`, 'debug');
                }
            }


            if (typeof targetWindow.classId === 'undefined') {
                const classIdInputs = doc.querySelectorAll('input[name*="classId"], input[id*="classId"]');
                if (classIdInputs.length > 0) {
                    targetWindow.classId = classIdInputs[0].value;
                    addLog(`设置classId: ${targetWindow.classId}`, 'debug');
                }
            }


            const questions = doc.querySelectorAll('[class*="TiMu"], [class*="timu"]');
            questions.forEach((q, index) => {
                const qid = q.getAttribute('id') || `question_${index}`;
                let answerInput = doc.querySelector(`input[name="answer${qid}"], input[id="answer${qid}"]`);

                if (!answerInput) {

                    answerInput = doc.createElement('input');
                    answerInput.type = 'hidden';
                    answerInput.name = `answer${qid}`;
                    answerInput.id = `answer${qid}`;
                    q.appendChild(answerInput);
                    addLog(`为题目${qid}创建答案input`, 'debug');
                }
            });

            addLog('提交参数验证完成', 'debug');
            return true;
        } catch (e) {
            addLog(`提交参数验证失败: ${e.message}`, 'error');
            return false;
        }
    }


    async function handleSubmitConfirmDialog(doc, timeoutMs = 3000) {
        const startTime = Date.now();

        while (Date.now() - startTime < timeoutMs) {
            try {

                const confirmDialogSelectors = [
                    '.popDiv', '.modal', '.dialog', '.alert',
                    '.layui-layer', '.confirm-dialog', '.submit-confirm',
                    '[class*="confirm"]', '[class*="dialog"]', '[class*="modal"]'
                ];

                for (const selector of confirmDialogSelectors) {
                    const dialog = doc.querySelector(selector);
                    if (dialog && dialog.style.display !== 'none' &&
                        (dialog.textContent.includes('确认提交') ||
                         dialog.textContent.includes('提交') ||
                         dialog.textContent.includes('确定'))) {

                        addLog('检测到提交确认弹窗', 'info');


                        const confirmButtonSelectors = [
                            'button[onclick*="submit"]', 'button[value*="提交"]',
                            'button[value*="确定"]', 'button[value*="确认"]',
                            'input[type="button"][value*="提交"]',
                            'input[type="button"][value*="确定"]',
                            'input[type="button"][value*="确认"]',
                            '.confirm-btn', '.submit-btn', '.ok-btn',
                            'button:contains("提交")', 'button:contains("确定")',
                            'button:contains("确认")', 'a[onclick*="submit"]'
                        ];


                        for (const btnSelector of confirmButtonSelectors) {
                            const confirmBtn = dialog.querySelector(btnSelector) ||
                                             doc.querySelector(`${selector} ${btnSelector}`);

                            if (confirmBtn && !confirmBtn.disabled) {
                                try {

                                    const onclick = confirmBtn.getAttribute('onclick');
                                    if (onclick) {
                                        const targetWindow = doc.defaultView || window;
                                        const func = new targetWindow.Function(onclick);
                                        func.call(confirmBtn);
                                        addLog(`通过onclick执行确认提交: ${onclick}`, 'success');
                                        return true;
                                    }


                                    if (safeClick(confirmBtn)) {
                                        addLog(`点击确认提交按钮: ${btnSelector}`, 'success');
                                        return true;
                                    }
                                } catch (e) {
                                    addLog(`点击确认按钮失败: ${e.message}`, 'error');
                                }
                            }
                        }


                        const allButtons = dialog.querySelectorAll('button, input[type="button"], a');
                        for (const btn of allButtons) {
                            const text = (btn.textContent || btn.value || '').trim();
                            if (/^(提交|确定|确认|OK)$/.test(text)) {
                                try {
                                    if (safeClick(btn)) {
                                        addLog(`通过文本匹配点击确认按钮: ${text}`, 'success');
                                        return true;
                                    }
                                } catch (e) {
                                    addLog(`文本匹配点击确认按钮失败: ${e.message}`, 'error');
                                }
                            }
                        }
                    }
                }
            } catch (e) {

            }

            await new Promise(r => setTimeout(r, 200));
        }

        return false;
    }


    async function waitForQuizSubmitCompletion(doc, timeoutMs = 5000) {
        const startTime = Date.now();
        const originalUrl = doc.location.href;

        while (Date.now() - startTime < timeoutMs) {
            try {

                const successIndicators = [
                    '.success', '.alert-success', '.msg-success',
                    '[class*="success"]', '[class*="complete"]',
                    '*[text()*="提交成功"]', '*[text()*="完成"]'
                ];

                for (const selector of successIndicators) {
                    const indicator = doc.querySelector(selector);
                    if (indicator && indicator.textContent.includes('成功')) {
                        addLog('检测到提交成功提示', 'success');
                        return true;
                    }
                }


                if (doc.location.href !== originalUrl) {
                    addLog('检测到页面跳转，提交可能已完成', 'info');
                    return true;
                }


                const nextStepSelectors = [
                    'button[onclick*="next"]', 'a[onclick*="next"]',
                    'input[value*="下一"]', 'button[value*="下一"]',
                    '.next-btn', '.btn-next', '#next'
                ];

                for (const selector of nextStepSelectors) {
                    if (doc.querySelector(selector)) {
                        addLog('检测到下一步按钮，提交可能已完成', 'info');
                        return true;
                    }
                }

            } catch (e) {

            }

            await new Promise(r => setTimeout(r, 200));
        }

        addLog('等待提交完成超时', 'error');
        return false;
    }


    async function autoAnswerQuizInDocument(doc) {
        try {
            if (!isStudyingChapters) return false;
            if (!isQuizPageDoc(doc)) return false;

            await injectConsoleDecryptCode(doc);
            const qs = collectQuizQuestions(doc);
            if (!qs || qs.length === 0) return false;
            addLog(`检测到章节测验，共 ${qs.length} 题，开始作答...`, 'info');


            for (const q of qs) {
                if (!isStudyingChapters) { addLog('已暂停刷章节，停止测验作答', 'info'); return false; }
                const promptInfo = { type: q.type, question: q.question || `题目 ${q.qid}`, options: q.options || [] };
                const ans = await getAnswer(promptInfo);
                if (ans) {
                    fillQuizAnswer(doc, q.qid, q.type, ans);
                }
                await new Promise(r => setTimeout(r, 500));
            }

            addLog('章节测验答题完成，准备提交...', 'success');


            await new Promise(r => setTimeout(r, 1000));


            addLog('验证提交参数...', 'info');
            validateAndFixSubmitParams(doc);


            let submitSuccess = false;
            const targetWindow = doc.defaultView || window;


            try {

                const originalAlert = targetWindow.alert;
                targetWindow.alert = function(msg) {
                    addLog(`阻止弹窗: ${msg}`, 'debug');
                    if (msg && msg.includes('code-1')) {
                        addLog('检测到code-1错误，尝试其他提交方式', 'info');
                        return;
                    }
                    return originalAlert.call(this, msg);
                };


                if (typeof targetWindow.btnBlueSubmit === 'function') {
                    addLog('使用学习通标准提交流程', 'info');


                    targetWindow.btnBlueSubmit();
                    await new Promise(r => setTimeout(r, 1000));


                    if (typeof targetWindow.submitCheckTimes === 'function') {
                        targetWindow.submitCheckTimes();
                        addLog('执行submitCheckTimes完成', 'success');
                    }


                    if (typeof targetWindow.noSubmit === 'function') {
                        addLog('检测到noSubmit函数，跳过自动提交以避免错误', 'info');
                    }

                    submitSuccess = true;
                    addLog('学习通标准提交流程执行完成', 'success');
                } else if (typeof targetWindow.submitWork === 'function') {

                    addLog('使用submitWork提交', 'info');
                    targetWindow.submitWork();
                    submitSuccess = true;
                } else {

                    submitSuccess = findAndClickQuizSubmitButton(doc);
                }

                // 恢复原始alert targetWindow.alert = originalAlert;
            } catch (e) {
                addLog(`提交流程执行失败: ${e.message}`, 'error');

                submitSuccess = findAndClickQuizSubmitButton(doc);
            }

            if (submitSuccess) {
                addLog('已执行提交操作，等待确认弹窗...', 'info');

                await new Promise(r => setTimeout(r, 500));


                const confirmHandled = await handleSubmitConfirmDialog(doc, 3000);
                if (confirmHandled) {
                    addLog('已处理提交确认弹窗', 'success');
                } else {
                    addLog('未检测到确认弹窗或处理失败', 'info');
                }

                const submitCompleted = await waitForQuizSubmitCompletion(doc, 8000);
                if (submitCompleted) {
                    addLog('章节测验提交完成，准备跳转下一节...', 'success');


                    await new Promise(r => setTimeout(r, 2000));


                    if (isStudyingChapters) {
                        const jumpSuccess = gotoNextSection(doc);
                        if (jumpSuccess) {
                            addLog('已自动跳转到下一节', 'success');
                        } else {
                            addLog('自动跳转失败，请手动切换到下一节', 'error');
                        }
                    }
                } else {
                    addLog('等待提交完成超时，但将继续尝试跳转', 'info');

                    await new Promise(r => setTimeout(r, 1500));
                    if (isStudyingChapters) gotoNextSection(doc);
                }
            } else {
                addLog('未找到提交按钮，跳过提交直接尝试跳转', 'info');

                await new Promise(r => setTimeout(r, 1000));
                if (isStudyingChapters) gotoNextSection(doc);
            }

            return true;
        } catch (e) {
            addLog(`章节测验自动作答失败: ${e.message}`, 'error');
            return false;
        }
    }
})();