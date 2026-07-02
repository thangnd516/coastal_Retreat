import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/staff", "/account", "/checkout", "/login"],
      },
    ],
    sitemap: "https://coastalretreat.vn/sitemap.xml",
  };
}
