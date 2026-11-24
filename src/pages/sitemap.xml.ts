import type { APIRoute } from "astro";
import { indexingEnabled, siteUrl } from "../config/features";
import { routes } from "../config/site";

export const GET: APIRoute = () => {
  const origin = siteUrl();
  if (!indexingEnabled() || !origin) {
    return new Response("Not found", { status: 404, headers: { "Content-Type": "text/plain; charset=utf-8" } });
  }
  const urls = routes
    .map((route) => `  <url><loc>${origin}${route.path}</loc></url>`)
    .join("\n");
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  return new Response(body, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};
