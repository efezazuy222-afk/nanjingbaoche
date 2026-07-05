import { getCollection } from "astro:content";

export async function GET() {
  const base = "https://nanjingbaoche.com";
  const staticPages = ["", "/tours/", "/blogs/", "/about/", "/contact/", "/faqs/", "/privacy/", "/terms/"];
  const tours = await getCollection("tours");
  const posts = await getCollection("blog");
  const urls = [
    ...staticPages.map((path) => ({ loc: `${base}${path}` })),
    ...tours.map((item) => ({ loc: `${base}/tours/${item.id}/` })),
    ...posts.map((item) => ({ loc: `${base}/blogs/${item.id}/`, lastmod: item.data.date })),
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(({ loc, lastmod }) => `  <url><loc>${loc}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}</url>`).join("\n")}\n</urlset>`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}
