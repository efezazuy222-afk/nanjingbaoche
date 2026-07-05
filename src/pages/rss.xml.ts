import { getCollection } from "astro:content";

const base = "https://nanjingbaoche.com";
const escapeXml = (value: string) => value
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&apos;");

export async function GET() {
  const posts = (await getCollection("blog"))
    .sort((a, b) => b.data.date.localeCompare(a.data.date))
    .slice(0, 30);
  const items = posts.map((post) => {
    const link = `${base}/blogs/${post.id}/`;
    const published = new Date(`${post.data.date}T00:00:00+08:00`).toUTCString();
    return `<item><title>${escapeXml(post.data.title)}</title><link>${link}</link><guid isPermaLink="true">${link}</guid><pubDate>${published}</pubDate><description>${escapeXml(post.data.description)}</description></item>`;
  }).join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>澜青旅行社南京包车攻略</title><link>${base}/blogs/</link><description>南京包车路线、接送与家庭出行指南</description><language>zh-CN</language>${items}</channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
