const postgres = require('postgres');
const sql = postgres(process.env.DATABASE_URL);

const articles = [
  {
    title: '渭南电脑蓝屏死机怎么办？常见原因与排查方法',
    slug: 'weinan-computer-blue-screen-fix',
    excerpt: '电脑频繁蓝屏死机？本文总结临渭区上门维修中最常见的蓝屏原因及自助排查步骤，帮您快速定位问题。',
    content: '<h2>蓝屏的常见原因</h2><p>在渭南本地维修实践中，蓝屏死机主要由以下几类问题引起：</p><ul><li><strong>内存故障</strong>：内存条松动、氧化或损坏是最常见的硬件原因</li><li><strong>硬盘坏道</strong>：系统文件所在扇区损坏导致读写失败</li><li><strong>驱动冲突</strong>：显卡、网卡驱动不兼容或版本过旧</li><li><strong>过热保护</strong>：CPU/GPU温度过高触发自动关机</li><li><strong>系统文件损坏</strong>：Windows更新中断或病毒破坏</li></ul><h2>自助排查步骤</h2><ol><li>记录蓝屏代码（如CRITICAL_PROCESS_DIED、MEMORY_MANAGEMENT）</li><li>进入安全模式，卸载最近安装的软件或驱动</li><li>运行<code>sfc /scannow</code>修复系统文件</li><li>使用Windows内存诊断工具检测内存</li><li>检查硬盘健康状态（CrystalDiskInfo）</li></ol><h2>何时需要专业维修</h2><p>如果以上步骤无法解决，或蓝屏伴随异响、焦味，建议立即断电并联系专业人员。我们在临渭区提供2小时内上门检测服务，先报价后维修。</p>',
    seo_title: '渭南电脑蓝屏死机维修_临渭区上门排查 - 渭南IT技术服务',
    seo_description: '电脑蓝屏死机？总结渭南本地维修经验，教您自助排查内存、硬盘、驱动等常见蓝屏原因。临渭区2小时上门，先报价后维修。',
  },
  {
    title: '家庭监控安装指南：摄像头选型与布线注意事项',
    slug: 'home-cctv-installation-guide',
    excerpt: '想在渭南家里装监控？从摄像头分辨率选择到布线走管，这篇指南帮您避开常见坑，确保监控效果清晰稳定。',
    content: '<h2>摄像头怎么选</h2><p>家用监控建议选择以下参数：</p><ul><li><strong>分辨率</strong>：至少200万像素（1080P），推荐400万（2K）</li><li><strong>夜视</strong>：红外夜视距离≥30米，全彩夜视更佳</li><li><strong>存储</strong>：NVR录像机+硬盘，支持手机远程回放</li><li><strong>品牌</strong>：海康威视、大华等主流品牌售后有保障</li></ul><h2>布线注意事项</h2><ul><li>网线优先用超五类或六类线，避免信号衰减</li><li>室外线路必须穿管防水，接头处做好密封</li><li>电源线和网线分开走管，减少干扰</li><li>NVR放置在通风干燥处，远离热源</li></ul><h2>常见问题</h2><p><strong>Q: 手机看监控卡顿？</strong><br>A: 检查上行带宽，建议≥10Mbps；或使用子码流预览。</p><p><strong>Q: 录像能保存多久？</strong><br>A: 4路200万像素H.265编码，2TB硬盘约存30天。</p><p>如需临渭区上门安装调试，欢迎致电咨询，免费提供方案报价。</p>',
    seo_title: '渭南家庭监控安装_摄像头选型布线指南 - 渭南IT技术服务',
    seo_description: '渭南家庭监控安装指南：摄像头分辨率选择、布线走管注意事项、存储计算。临渭区上门安装，免费方案报价。',
  },
  {
    title: '办公室网络布线方案：WiFi全覆盖与有线组网',
    slug: 'office-network-cabling-solution',
    excerpt: '渭南办公室网络总是卡顿掉线？合理的布线方案和AP部署是关键。本文分享中小办公室网络改造实战经验。',
    content: '<h2>网络卡顿的常见原因</h2><ul><li>路由器性能不足，带机量超限</li><li>WiFi信号盲区多，角落无覆盖</li><li>网线老化或水晶头接触不良</li><li>没有划分VLAN，广播风暴影响性能</li></ul><h2>推荐方案</h2><p><strong>小型办公室（≤20人）</strong>：企业级路由+2-3个AP面板，Mesh组网实现无缝漫游。</p><p><strong>中型办公室（20-50人）</strong>：AC控制器+吸顶AP，POE交换机统一供电，划分办公/访客VLAN。</p><h2>布线规范</h2><ul><li>每个工位预留2个网口（电脑+电话/IP电话）</li><li>主干用六类线，汇聚到机房配线架</li><li>标签对应图纸，方便后期维护</li><li>测试报告包含每条链路的衰减、串扰数据</li></ul><p>我们已为渭南多家企业提供网络改造服务，欢迎预约现场勘查。</p>',
    seo_title: '渭南办公室网络布线_WiFi全覆盖方案 - 渭南IT技术服务',
    seo_description: '渭南办公室网络布线方案：WiFi全覆盖、有线组网、VLAN划分。中小办公室网络改造实战经验，预约现场勘查。',
  },
  {
    title: '电脑清灰换硅脂：散热不良导致卡顿的解决办法',
    slug: 'computer-dust-cleaning-thermal-paste',
    excerpt: '电脑用久了越来越卡、风扇狂转？很可能是散热问题。了解清灰换硅脂的正确流程和注意事项。',
    content: '<h2>散热不良的症状</h2><ul><li>开机后风扇持续高速运转，噪音大</li><li>运行大型程序时明显卡顿、降频</li><li>笔记本键盘面烫手，底部发热严重</li><li>无故自动关机或重启</li></ul><h2>清灰换硅脂流程</h2><ol><li>拆机前释放静电，断开电池/电源</li><li>用软毛刷和气吹清除风扇、散热片积灰</li><li>擦除旧硅脂，涂抹新硅脂（薄而均匀）</li><li>重新组装，开机监测温度</li></ol><h2>注意事项</h2><p>不建议自行操作的情况：保修期内设备、不熟悉拆机的用户、一体机/超薄本。不当拆装可能导致排线断裂、主板短路。</p><p>我们在临渭区提供上门清灰服务，台式机/笔记本均可，当场完成，价格透明。</p>',
    seo_title: '渭南电脑清灰换硅脂_散热不良维修 - 渭南IT技术服务',
    seo_description: '电脑卡顿风扇响？散热不良清灰换硅脂指南。渭南临渭区上门清灰服务，当场完成，价格透明。',
  },
  {
    title: '弱电工程验收要点：综合布线质量检测标准',
    slug: 'low-voltage-project-acceptance-checklist',
    excerpt: '弱电工程完工后如何验收？从线缆测试到文档交付，列出关键验收节点，避免后期返工纠纷。',
    content: '<h2>验收前准备</h2><ul><li>施工方提供完整的点位图、配线表、测试报告</li><li>核对实际点位数量与合同一致</li><li>确认所有标签清晰、与图纸对应</li></ul><h2>关键测试项目</h2><ul><li><strong>连通性测试</strong>：每条链路通断正常，线序正确（T568B）</li><li><strong>长度测试</strong>：永久链路≤90米，信道≤100米</li><li><strong>衰减/串扰</strong>：符合Cat5e/Cat6标准要求</li><li><strong>光纤测试</strong>：OTDR曲线正常，接头损耗≤0.3dB</li></ul><h2>文档交付清单</h2><ol><li>竣工图纸（含变更标注）</li><li>每条链路的测试报告</li><li>设备清单及序列号</li><li>质保承诺书</li></ol><p>规范的验收是工程质量的保障。我们在渭南承接弱电工程，严格按标准施工、提供完整验收资料。</p>',
    seo_title: '渭南弱电工程验收_综合布线检测标准 - 渭南IT技术服务',
    seo_description: '弱电工程验收要点：线缆测试、文档交付、质量标准。渭南弱电工程施工，严格验收，提供完整资料。',
  },
];

(async () => {
  const admin = await sql`SELECT id FROM users WHERE role='admin' LIMIT 1`;
  if (!admin.length) { console.error('No admin user found'); process.exit(1); }
  const authorId = admin[0].id;

  for (const a of articles) {
    try {
      await sql`INSERT INTO articles (title, slug, excerpt, content, status, published_at, seo_title, seo_description, noindex, author_id) VALUES (${a.title}, ${a.slug}, ${a.excerpt}, ${a.content}, 'published', NOW(), ${a.seo_title}, ${a.seo_description}, false, ${authorId}) ON CONFLICT (slug) DO NOTHING`;
      console.log('OK:', a.slug);
    } catch (e) {
      console.error('FAIL:', a.slug, e.message);
    }
  }
  await sql.end();
})();
