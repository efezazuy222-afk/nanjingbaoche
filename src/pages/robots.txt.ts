export function GET() {
  return new Response("User-agent: *\nAllow: /\nSitemap: https://nanjingbaoche.com/sitemap.xml\n", {
    headers: { "Content-Type": "text/plain" },
  });
}
