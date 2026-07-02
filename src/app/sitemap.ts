import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();
  const baseUrl = "https://coastalretreat.vn";

  const [{ data: rooms }, { data: blogs }, { data: events }] = await Promise.all([
    supabase.from("rooms").select("id, created_at").eq("is_available", true),
    supabase.from("blogs").select("slug, published_at").eq("is_published", true),
    supabase.from("events").select("id, created_at"),
  ]);

  const static_routes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/homestay`, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/cafe`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/bakery`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/events`, changeFrequency: "daily", priority: 0.85 },
    { url: `${baseUrl}/blog`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/contact`, changeFrequency: "monthly", priority: 0.5 },
  ];

  const room_routes: MetadataRoute.Sitemap = (rooms ?? []).map((r) => ({
    url: `${baseUrl}/homestay/${r.id}`,
    lastModified: new Date(r.created_at),
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  const blog_routes: MetadataRoute.Sitemap = (blogs ?? []).map((b) => ({
    url: `${baseUrl}/blog/${b.slug}`,
    lastModified: b.published_at ? new Date(b.published_at) : new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const event_routes: MetadataRoute.Sitemap = (events ?? []).map((e) => ({
    url: `${baseUrl}/events/${e.id}`,
    lastModified: new Date(e.created_at),
    changeFrequency: "weekly",
    priority: 0.75,
  }));

  return [...static_routes, ...room_routes, ...blog_routes, ...event_routes];
}
