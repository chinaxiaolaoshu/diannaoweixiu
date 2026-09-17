// 站点单一信息源（NAP / 文案 / 结构化数据共用，严禁在各页面硬编码业务信息）
export const SITE = {
  name: "渭南电脑维修服务",
  domain: "0913610.xyz",
  url: "https://www.0913610.xyz",
  region: "陕西省渭南市临渭区",
  serviceArea: "服务渭南市及临渭区",
  phone: process.env.NEXT_PUBLIC_CONTACT_PHONE ?? "",
  wechat: process.env.NEXT_PUBLIC_CONTACT_WECHAT ?? "",

  // —— NAP：营业时间 / 价格区间（JSON-LD 与页面展示共用，保持一致）——
  openingHours: {
    label: "周一至周日 08:00 – 21:00",
    opens: "08:00",
    closes: "21:00",
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
  },
  priceRange: "50-500元",
  // 百度/Google 结构化数据要求 ISO 星期；中文星期用于页面展示
  openingHoursLabel: "全年无休 08:00–21:00",

  // —— 服务区域：临渭区主覆盖（真实覆盖），周边仅咨询 ——
  serviceAreas: [
    {
      name: "临渭区",
      isPrimary: true,
      response: "2 小时内响应上门",
      desc: "渭南市临渭区全域上门，含城区各街道、开发区及下辖乡镇，农村、家庭、商铺、办公室均可服务。",
      places: [
        "站南街道", "向阳街道", "解放街道", "杜桥街道", "双王街道", "良田街道", "信义街道",
        "龙背街道", "辛市街道", "三张镇", "崇凝镇", "桥南镇", "阳郭镇", "下邽镇",
        "固市镇", "官道镇", "官底镇", "蔺店镇", "交斜镇", "故市镇", "丰原镇", "闫村镇",
      ],
    },
    {
      name: "华州区",
      isPrimary: false,
      response: "电话/微信咨询",
      desc: "暂不提供华州区上门服务，可电话或微信免费咨询，简单故障远程指导解决；如确需现场，可协商介绍临渭区周边师傅。",
      places: ["华州街道", "杏林镇", "赤水镇", "高塘镇", "大明镇", "瓜坡镇"],
    },
    {
      name: "渭南高新区",
      isPrimary: true,
      response: "2 小时内响应上门",
      desc: "渭南高新技术产业开发区属临渭区服务范围，企业办公网络、监控与电脑维护正常上门。",
      places: ["新区东路", "崇业路", "朝阳大街", "新盛路"],
    },
  ],

  // —— 价格参考区间（页面与 Service 结构化数据共用，真实透明）——
  priceTable: [
    { item: "电脑系统重装", price: "80–150元", note: "Win10/11 系统重装，含驱动与常用软件安装" },
    { item: "电脑清灰换硅脂", price: "80–120元", note: "解决散热卡顿、风扇噪音大" },
    { item: "台式机硬件升级", price: "100–400元", note: "加固态硬盘/内存，含系统迁移" },
    { item: "笔记本维修", price: "100–500元", note: "屏幕、键盘、主板芯片级维修" },
    { item: "数据恢复", price: "100–500元", note: "误删、格式化、硬盘异响恢复" },
    { item: "监控摄像头安装", price: "150–300元/个", note: "含布线、固定、调试与手机远程配置" },
    { item: "监控维修", price: "80–300元/次", note: "无画面、无录像、手机连不上、夜视失效" },
    { item: "网络布线（信息点）", price: "120–260元/点", note: "含网线、水晶头、测通与标签标识" },
    { item: "WiFi 全屋覆盖", price: "200–600元", note: "按户型与 AP/面板数量计费" },
  ],

  services: [
    {
      slug: "computer-repair",
      name: "电脑维修",
      desc: "渭南市临渭区上门电脑维修：系统重装、蓝屏死机排查、硬件更换升级、数据恢复。",
      details: ["台式机/笔记本故障诊断", "系统重装与驱动安装", "硬盘/内存/电源更换", "数据备份与恢复"],
      symptoms: ["开机无反应或反复重启", "蓝屏/黑屏/死机频繁", "运行缓慢、卡顿严重", "重要文件误删或丢失"],
      preparation: ["提前备份重要数据（如可操作）", "记录故障出现时的提示信息", "准备好购买凭证或保修卡"],
      quoteFactors: ["故障类型与复杂度", "需更换配件的品牌型号", "是否涉及数据恢复"],
      acceptance: ["故障现象消除", "系统稳定运行30分钟以上", "数据完整可访问（如涉及）"]
    },
    {
      slug: "cctv",
      name: "监控安装与维修",
      desc: "临渭区商铺、家庭、厂区监控摄像头安装、调试、远程查看配置与故障维修。",
      details: ["摄像头选型与安装", "录像机(NVR)配置", "手机远程监控设置", "旧监控系统维修升级"],
      symptoms: ["画面模糊/偏色/夜视失效", "录像丢失或无法回放", "手机远程无法连接", "设备离线或频繁断线"],
      preparation: ["确认安装位置与覆盖范围", "预留电源插座与网线通道", "提供现有设备品牌型号信息"],
      quoteFactors: ["摄像头数量与分辨率", "布线距离与施工难度", "存储时长要求"],
      acceptance: ["所有通道画面清晰正常", "录像连续完整无丢帧", "手机端可流畅预览回放"]
    },
    {
      slug: "low-voltage",
      name: "弱电施工",
      desc: "渭南本地弱电工程施工：机房整理、综合布线、门禁与广播系统基础施工。",
      details: ["机房/弱电井整理", "综合布线施工", "线路标签与文档", "验收测试"],
      symptoms: ["线缆杂乱难以维护", "网络/电话端口不通", "门禁刷卡失灵", "广播杂音或无声"],
      preparation: ["提供建筑平面图或点位表", "确认强弱电分离要求", "协调其他工种进场时间"],
      quoteFactors: ["点位数量与分布密度", "桥架/管材规格与长度", "是否需要重新穿管"],
      acceptance: ["所有点位测试通过", "标签清晰对应图纸", "现场整洁无遗留废料"]
    },
    {
      slug: "network-cabling",
      name: "网络布线",
      desc: "渭南市办公室、家庭网络布线，WiFi 全屋覆盖优化，交换机路由器调试。",
      details: ["网线布放与端接", "WiFi 覆盖优化", "路由器/交换机配置", "网络故障排查"],
      symptoms: ["部分房间WiFi信号弱", "有线网络时通时断", "多设备同时上网卡顿", "新装修未预埋网线"],
      preparation: ["标注各房间用途与设备数量", "确认光猫/路由器摆放位置", "准备户型图便于规划走线"],
      quoteFactors: ["房屋面积与结构复杂度", "所需AP/面板数量", "是否利用原有管线"],
      acceptance: ["全屋WiFi信号≥-65dBm", "有线测速达标且稳定", "漫游切换无缝不中断"]
    }
  ]
} as const;

export type ServiceItem = (typeof SITE.services)[number];
export type PriceItem = (typeof SITE.priceTable)[number];
export type ServiceArea = (typeof SITE.serviceAreas)[number];
