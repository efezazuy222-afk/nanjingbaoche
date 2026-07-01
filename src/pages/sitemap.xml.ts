import { getCollection } from "astro:content";

export async function GET() {
  const base = "https://nanjingbaoche.com";
  const staticPages = ["", "/tours/", "/blogs/", "/about/", "/contact/", "/faqs/", "/privacy/", "/terms/"];
  const tours = await getCollection("tours");
  const posts = await getCollection("blog");
  const urls = [
    ...staticPages.map((path) => `${base}${path}`),
    ...tours.map((item) => `${base}/tours/${item.id}/`),
    ...posts.map((item) => `${base}/blogs/${item.id}/`),
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map((url) => `<url><loc>${url}</loc></url>`).join("")}</urlset>`;
  return new Response(xml, { headers: { "Content-Type": "application/xml" } });
}
