export const SITE = {
  name: "渭南IT技术服务",
  domain: "0913610.xyz",
  url: "https://www.0913610.xyz",
  region: "陕西省渭南市临渭区",
  serviceArea: "服务渭南市及临渭区",
  phone: process.env.NEXT_PUBLIC_CONTACT_PHONE ?? "",
  wechat: process.env.NEXT_PUBLIC_CONTACT_WECHAT ?? "",
  services: [
    {
      slug: "computer-repair",
      name: "电脑维修",
      desc: "渭南市临渭区上门电脑维修：系统重装、蓝屏死机排查、硬件更换升级、数据恢复。",
      details: ["台式机/笔记本故障诊断", "系统重装与驱动安装", "硬盘/内存/电源更换", "数据备份与恢复"]
    },
    {
      slug: "cctv",
      name: "监控安装与维修",
      desc: "临渭区商铺、家庭、厂区监控摄像头安装、调试、远程查看配置与故障维修。",
      details: ["摄像头选型与安装", "录像机(NVR)配置", "手机远程监控设置", "旧监控系统维修升级"]
    },
    {
      slug: "low-voltage",
      name: "弱电施工",
      desc: "渭南本地弱电工程施工：机房整理、综合布线、门禁与广播系统基础施工。",
      details: ["机房/弱电井整理", "综合布线施工", "线路标签与文档", "验收测试"]
    },
    {
      slug: "network-cabling",
      name: "网络布线",
      desc: "渭南市办公室、家庭网络布线，WiFi 全屋覆盖优化，交换机路由器调试。",
      details: ["网线布放与端接", "WiFi 覆盖优化", "路由器/交换机配置", "网络故障排查"]
    }
  ]
} as const;

export type ServiceItem = (typeof SITE.services)[number];
