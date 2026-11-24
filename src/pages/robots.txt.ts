import type { APIRoute } from "astro";
import { indexingEnabled, siteUrl } from "../config/features";

export const GET: APIRoute = () => {
  const origin = siteUrl();
  const body = indexingEnabled() && origin
    ? `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`
    : "User-agent: *\nDisallow: /\n";
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
