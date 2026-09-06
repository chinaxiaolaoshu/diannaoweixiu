import { desc } from "drizzle-orm";
import { db, media } from "@repo/db";
import UploadForm from "./upload-form";

export default async function MediaPage() {
  const rows = await db.select().from(media).orderBy(desc(media.createdAt));
  return (
    <section>
      <h1 className="text-xl font-bold mb-4">媒体管理</h1>
      <UploadForm />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {rows.map((m) => (
          <figure key={m.id} className="bg-white border rounded p-2 text-xs">
            <img src={m.url} alt={m.alt} width={m.width} height={m.height} loading="lazy" className="w-full h-32 object-cover rounded" />
            <figcaption className="mt-1">
              <p className="truncate" title={m.url}>{m.url}</p>
              <p className="text-gray-500">alt: {m.alt} · {m.width}x{m.height}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
