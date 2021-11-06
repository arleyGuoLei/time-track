# 时间打点

## 项目介绍

### 置顶公告

- 作者唯一微信/QQ：**34805850**，如有问题可以咨询 ~ 项目禁止二次售卖，可以自定义封装修改上线

作者更多的开源项目，单词对战、密码本等等，可以到我的 github 获取 ~

> 直接导入试用不成功的，可以直接扫码体验，部署搭建后效果一致，支持所有小程序平台

### 关于「时间打点」

- 介绍：一个简单的时间打点应用，没有社交，没有小组，只关注自己的每一天，轻松记录你和TA的小日常。
- 产品故事：之前住院期间，每天需要记录每次的尿量，没有特别好的记录软件，所以就选择了备忘录，记个时间，记个尿量，但还是太麻烦。有想过开发一个专门给患者们`记录尿量`的小程序；另外，平时生活重复，工作和家两点一线，有的时候会不记得上次什么时候`洗的澡`？有时候还想记录家里的`桶装水喝了几天`？每天`工作了多久`？上次`“开小会”`是什么时候？上次`和家里联系`是什么时候？这个副业带给我多少`收益`？想要记录下每天吃的`饭菜`等。综上需求，所以设计了该产品，`以时间和事件归类，来记录生活小日常`。
- 核心功能：`事件和打点的管理`。事件打点支持记录时间、位置、备注、上传图片等，事件可进行分类，可以查看每天打点日志，支持记录事件打点总和。

> 一个完整闭环业务的项目，可拓展性很高，难度适合毕业设计!!!

--------

- 1分钟视频介绍演示项目：[https://www.bilibili.com/video/BV1w54y1b7JZ/](https://www.bilibili.com/video/BV1w54y1b7JZ/)
- 1分钟视频介绍演示项目：[https://www.bilibili.com/video/BV1w54y1b7JZ/](https://www.bilibili.com/video/BV1w54y1b7JZ/)
- 1分钟视频介绍演示项目：[https://www.bilibili.com/video/BV1w54y1b7JZ/](https://www.bilibili.com/video/BV1w54y1b7JZ/)

... 重要的事情说三遍

--------

### 自己的使用感受

这么半年来，我也是自己作品的深度用户，根据自己和市场上的使用需求反馈，也做了几次优化。我共打点了**235**次，有**77**天打了点。

现在打点比较常用的事件是，和家里打电话，吃大餐、理发、买大件、单词天天斗、看电影。

- 通过吃大餐记录自己平时**非正常**饮食
- 买大件记录了自己的奢侈消费
- 单词天天斗记录了该项目带给自己的副业收入
- 通过和家里打电话可以记录自己多久和家里联系了一次等等

自己使用下来感觉对自己的生活反思更多了，记录下来的东西也挺多，方便自己随时追溯回忆

### 在线体验

- **微信小程序**：时间打点丨小日常

![微信扫码体验](https://vkceyugu.cdn.bspapp.com/VKCEYUGU-5988d11f-2178-4757-82ed-80342d2c8132/4be9e8d3-32d1-46a9-8b94-b8f0bbcb1403.png)

- **QQ小程序**：小日常时间打卡

![QQ扫码体验](https://vkceyugu.cdn.bspapp.com/VKCEYUGU-5988d11f-2178-4757-82ed-80342d2c8132/685ef688-87ab-4d9b-a757-f07a9c95071d.png)

- **字节跳动小程序**：小番茄日常习惯打卡

![抖音扫码体验](https://vkceyugu.cdn.bspapp.com/VKCEYUGU-5988d11f-2178-4757-82ed-80342d2c8132/dd27f0e5-e6a5-484d-89ce-ec95a61fdb1b.png)

头条复制后进入：【小番茄日常习惯打卡小程序：时间打卡，记录生活小日常 ~】复制这条信息€8GuBq€3hPjHc€后打开👉今日头条👈

- **百度小程序**：小番茄日常习惯打卡

手机百度搜索：“小番茄日常习惯打卡”，进行体验

![手百搜索](https://vkceyugu.cdn.bspapp.com/VKCEYUGU-5988d11f-2178-4757-82ed-80342d2c8132/c90769c5-fdef-48bb-918c-6cf575ea5bb2.png)

### 设计

![完整设计稿](https://vkceyugu.cdn.bspapp.com/VKCEYUGU-5988d11f-2178-4757-82ed-80342d2c8132/d94321f3-1f96-413c-ac6d-8d2f8b439e8a.png)

![日志页设计稿](https://vkceyugu.cdn.bspapp.com/VKCEYUGU-5988d11f-2178-4757-82ed-80342d2c8132/970d245f-2701-4fdf-ab49-d91ec9478950.png)

### 后序计划

- 首页搜索事件、打点内容
- 主题色切换
- 顶部图片可自定义
- 事件归档
- 订阅打点、打点提醒
- 订阅VIP
- 日记生成
- 打点地图

### 项目时间线

- first-line-code: 2020年12月08日
- 上线第一版微信小程序：2021年03月05日
- 2021-03-20 完成小程序平台上线
  - 微信小程序：时间打点丨小日常
  - QQ小程序：小日常时间打卡
  - 百度小程序：小番茄日常习惯打卡
  - 字节跳动小程序：小番茄日常习惯打卡

## 部署教程

### 需改动文件

- QQ小程序、字节跳动小程序、百度小程序的 appid 和 秘钥配置：`uniCloud-aliyun/cloudfunctions/common/app-config/index.js`
- 微信小程序、支付宝小程序的 appid 和 秘钥配置：`uniCloud-aliyun/cloudfunctions/common/uni-id/config.json`
- 各个小程序的appid：`src/manifest.json`
- 云开发的环境配置 (开发环境和生产环境)：`src/utils/config.ts`

### 部署

按照自己的信息改动上述三个文件后，执行以下操作：

- 创建服务空间，详情参考创建和绑定服务空间
- 插件市场点击导入插件
- 安装项目依赖，执行`npm install`
- 再HBuildX右键项目根目录uniCloud文件夹 -> 运行云服务空间初始化向导，按照步骤完成部署
- 右键uniCloud/database/db_init.json->初始化云数据库
- 运行即可体验

### 数据库说明

```text
├── app.schema.json # 字节跳动小程序实现了上传图片的自动识别 (色情、违法图片识别，禁止上传)
├── db_init.json # 默认的一些图标 和 图标颜色配置，可以自己添加和修改
├── dots.schema.json # 打点数据
├── events.schema.json # 事件管理
├── icon_colors.schema.json # 图标颜色数据
├── icon_images.schema.json # 图标图片
├── tags.schema.json # 标签分类数据
├── uni-id-users.schema.json # 用户表，基于 uni-id
```

### 代码目录参考

```text
├── JS_SDK # fork 了 uni-id 修改了一下，导出了部分函数，实现各种小程序的登录
|  ├── README.md
|  └── uni-id
├── README.md
├── babel.config.js
├── db
|  ├── icon_colors.json
|  └── icon_images.json
├── design.sketch # 设计稿正式版
├── design_协作草稿.sketch # 设计稿草稿
├── icons # 图标
├── package-lock.json
├── package.json
├── postcss.config.js
├── public
|  └── index.html
├── scripts
|  ├── gen_iconColor.js
|  └── gen_iconSrc.js
├── src
|  ├── App.vue
|  ├── components
|  |  ├── cHeader.vue # 全局头部组件
|  |  ├── cInput.vue # 全局输入框组件
|  |  ├── cList.vue # 全局列表组件
|  |  ├── cLoading.vue # 全局加载组件
|  |  ├── cSelect.vue # 选择组件
|  |  ├── cTitle.vue # 标题组件
|  |  ├── link.vue # router link
|  |  └── uni-clientdb.vue
|  ├── main.ts
|  ├── manifest.json
|  ├── models
|  |  ├── dotsModel.ts # 打点数据库操作
|  |  ├── eventsModel.ts # 事件的数据库操作
|  |  ├── iconColorsModel.ts # 图标颜色数据操作
|  |  ├── iconImagesModel.ts # 图标图片数据操作
|  |  ├── index.ts
|  |  ├── tagsModel.ts # 标签
|  |  └── userModel.ts # 用户表操作
|  ├── pages
|  |  ├── addDot # 增加打点
|  |  ├── addEvent # 增加事件
|  |  ├── editTags # 编辑标签
|  |  ├── eventDetail # 事件详情
|  |  ├── home # 首页
|  |  ├── mine # 我的
|  |  ├── mpLogin # 小程序登录页
|  |  └── record # 日志页
|  ├── pages.json
|  ├── plugins
|  |  ├── loading.ts # 封装全局加载
|  |  ├── onScroll.mixin.ts # 滚动 mixin
|  |  ├── report.ts # 打点
|  |  ├── shareAppMessage.mixin.ts # 分享 mixin
|  |  ├── thumbnailFilter.ts # 缩图 filter
|  |  └── timeFilter.ts # 时间处理 filter
|  ├── sfc.d.ts
|  ├── static # 图片静态资源
|  ├── style
|  |  └── common.css
|  ├── uni.scss
|  └── utils
|     ├── SOtime.js
|     ├── ad.ts # 广告封装
|     ├── cloud.ts # 云开发封装
|     ├── config.ts # 配置
|     ├── constant.ts # 常量
|     ├── router.ts # 路由配置
|     ├── uCharts.js
|     ├── upload.js # 上传封装，可以高度复用
|     └── utils.ts # 工具函数
├── tsconfig.json
├── uniCloud-aliyun # 云开发相关
|  ├── cloudfunctions # 云函数
|  |  ├── censor_image # 图片识别 (检测违规图片上传)
|  |  ├── common # 公共依赖
|  |  ├── uni-clientDB-actions
|  |  └── user_login_mp # 小程序登录模块
|  └── database # 数据表
|     ├── app.schema.json
|     ├── db_init.json
|     ├── dots.schema.json
|     ├── events.schema.json
|     ├── icon_colors.schema.json
|     ├── icon_images.schema.json
|     ├── tags.schema.json
|     ├── uni-id-users.schema.json
|     └── validateFunction
```

### 本项目使用的插件

- [uni-simple-router](https://hhyang.cn/v2/start/quickstart.html)：类似 vue-router 的 uniapp 路由管理，api一致
- [dayjs](https://day.js.org/docs/en/display/format)：时间库
- [uni-id](https://uniapp.dcloud.io/uniCloud/uni-id)：uni-id为uniCloud开发者提供了简单、统一、可扩展的用户管理能力封装。

### 咨询与售后

作者QQ/微信：**34805850**

- 如您已购买本插件，可添加我获得部署与上架指导，技术指导不限于本插件

|  标题  | 价格/元 | 场景 |
|  ----  | ----  | ---- |
| 套餐一：完整源码 + 部署文档 (不可上线) | 99 | 源码学习、毕业设计，不上线 |
| 套餐二：“套餐一” + 部署视频教程 (不可上线) | 199 | 对于不知道怎么部署的，可以提供部署视频教程 |
| 套餐三：“套餐二” (可上线) | 498 | 完整未加密源码，可以上线运营 |

### 请作者喝咖啡

![微信扫码赞赏](https://i.loli.net/2020/08/01/sYbEd2S1wjLuUvk.png)


## 其他鸡汤

### 独立开发给我带来了什么

我至今的话，已经有过至少20个能称为项目的作品了，目前长期在维护和迭代的有几款小程序，时间打点就是其中一款
这些作品中，有的项目让我的经济走在了大部分同龄同学的前面，从初二开始通过项目盈利
让我热爱上了编程这个职业，我是真的因为喜欢通过编码来解决生活中的实际问题和需求，才选择了当前的职业，也希望这个方向，未来能成就自己的事业
通过这些项目，获得比较多的还有就是成就感，看到自己的作品用户量慢慢上涨，社区评价，用户反馈等等，还有不少网友，通过我的作品联系到我，也成为了比较好的朋友，平时也会有一些生活发展上的交流
当前时间打点，一切都是为爱发电，全部功能都是免费开放使用，核心功能是实现业务闭环的，当然，也是为了满足自己的记录需求
总结一下，独立开发给我带来了**成就感**、**职业方向**、**额外的收入**等等

### 怎么从头到尾做一款自己的APP

经常有朋友私信问我这个问题，我趁这个视频给大家分享一下我的经验
我的项目灵感来源都大多是自己的生活，当自己遇到什么问题了，有的时候市场上的软件不太符合自己的需求点，且发现大部分人有一样的需求痛点时，就会通过自己来开发来满足市场。
在开发前，我会先把整套系统的核心功能想清楚，实现使用上的闭环，输出需求文档，画整套项目的原型设计稿。
当设计稿上能完整体现出整个项目之后，我会通过设计稿询问几个好朋友，进行开发前的最后改进。
然后就可以进入开发阶段了，我会根据设计稿像素级还原项目，所以这就体现了设计稿完善的重要性。
开发完之后，就是推广和运营，大部分流量其实还是得靠搜索赋能。
总结一下，也就是**产品** → **设计** → **开发** → **运营**，其实和企业里的工作流是一样的，只是需要自己身兼数职。
技术和编程只是一个工具，更重要的是如何通过这些工具解决问题。

### 更多参考链接

- 我的独立开发者之旅 (内有更多自己的独立开发作品): [https://mp.weixin.qq.com/s/p5GBhvNyfnxBY8Ie3cxX-g](https://mp.weixin.qq.com/s/p5GBhvNyfnxBY8Ie3cxX-g)
- 我的github (内含更多开源作品，欢迎探索): [https://github.com/arleyGuoLei](https://github.com/arleyGuoLei)

### 时间打点更多截图

![1](https://vkceyugu.cdn.bspapp.com/VKCEYUGU-5988d11f-2178-4757-82ed-80342d2c8132/69766252-5875-4389-ab0e-2f8a39ad05ab.jpg)

![2](https://vkceyugu.cdn.bspapp.com/VKCEYUGU-5988d11f-2178-4757-82ed-80342d2c8132/86ff0cc8-f50e-414d-b838-629129ca37b6.jpg)

![3](https://vkceyugu.cdn.bspapp.com/VKCEYUGU-5988d11f-2178-4757-82ed-80342d2c8132/f22fdd2c-a2e2-495e-acd2-3d0ff6d70e71.jpg)

![4](https://vkceyugu.cdn.bspapp.com/VKCEYUGU-5988d11f-2178-4757-82ed-80342d2c8132/737c0318-697b-4599-a036-7c213a946893.jpg)

![5](https://vkceyugu.cdn.bspapp.com/VKCEYUGU-5988d11f-2178-4757-82ed-80342d2c8132/9af328c1-eb34-4dae-b2b7-95705e4d018a.jpg)

![6](https://vkceyugu.cdn.bspapp.com/VKCEYUGU-5988d11f-2178-4757-82ed-80342d2c8132/e8872d17-098b-467c-982e-8e0499aff990.jpg)

![7](https://vkceyugu.cdn.bspapp.com/VKCEYUGU-5988d11f-2178-4757-82ed-80342d2c8132/067ff7c2-85aa-43d3-99d3-ddc00cdcad94.jpg)

![8](https://vkceyugu.cdn.bspapp.com/VKCEYUGU-5988d11f-2178-4757-82ed-80342d2c8132/69766252-5875-4389-ab0e-2f8a39ad05ab.jpg)
