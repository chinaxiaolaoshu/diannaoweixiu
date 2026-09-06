import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "服务流程",
  description: "渭南IT技术服务流程：电话沟通、上门检测、报价确认、施工维修、验收售后，服务渭南市及临渭区。",
  path: "/process",
});

const STEPS = [
  { t: "1. 电话/微信沟通", d: "描述故障或需求，初步判断问题与大致费用。" },
  { t: "2. 上门检测", d: "渭南市及临渭区范围内预约上门，现场检测确认故障。" },
  { t: "3. 报价确认", d: "明确报价，您确认后才开始施工，无隐藏收费。" },
  { t: "4. 施工/维修", d: "现场完成维修、安装或布线，重要数据先备份。" },
  { t: "5. 验收与售后", d: "验收合格后结算，同一问题约定期内免费返修。" },
];

export default function ProcessPage() {
  return (
    <section>
      <h1 className="text-2xl font-bold">服务流程</h1>
      <ol className="mt-4 space-y-4">
        {STEPS.map((s) => (
          <li key={s.t} className="border rounded p-4">
            <h2 className="font-bold">{s.t}</h2>
            <p className="text-sm text-gray-600 mt-1">{s.d}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
