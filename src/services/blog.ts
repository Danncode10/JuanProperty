"use server";

import { createAdminClient, createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import type { Tables } from "@/types/supabase";
import { requireAdmin } from "@/services/authorization";

export type BlogPost = Tables<"blog_posts">;

export type BlogPostInput = {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  cover_image_url?: string;
  seo_title?: string;
  seo_description?: string;
};

export interface BlogListResult {
  data: BlogPost[];
  total: number;
}

export async function listBlogPosts(opts: {
  page?: number;
  pageSize?: number;
  publishedOnly?: boolean;
}): Promise<BlogListResult> {
  const { page = 1, pageSize = 20, publishedOnly = false } = opts;
  if (!publishedOnly) await requireAdmin();
  const supabase = publishedOnly ? createAdminClient() : await createClient();
  const offset = (page - 1) * pageSize;

  let query = supabase
    .from("blog_posts")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + pageSize - 1);

  if (publishedOnly) query = query.eq("is_published", true);

  const { data, error, count } = await query;
  if (error) throw error;
  return { data: (data ?? []) as BlogPost[], total: count ?? 0 };
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  await requireAdmin();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error && error.code !== "PGRST116") throw error;
  return data ?? null;
}

export async function getBlogPostById(id: string): Promise<BlogPost | null> {
  await requireAdmin();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

// Public reads use the admin client (no cookies, bypasses RLS).
// Safe because we return published posts only.

export async function getPublishedBlogPost(
  slug: string,
): Promise<BlogPost | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (error && error.code !== "PGRST116") throw error;
  return data ?? null;
}

export async function getLatestPublishedPosts(limit = 3): Promise<BlogPost[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as BlogPost[];
}

// Safe to call from generateStaticParams at build time (no cookies).
export async function getAllPublishedSlugs(): Promise<string[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("slug")
    .eq("is_published", true);

  if (error) throw error;
  return (data ?? []).map((r) => r.slug);
}

export async function createBlogPost(input: BlogPostInput): Promise<BlogPost> {
  await requireAdmin();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .insert({
      ...input,
    })
    .select()
    .single();

  if (error) throw error;
  revalidatePath("/blog");
  return data as BlogPost;
}

export async function updateBlogPost(
  id: string,
  input: Partial<BlogPostInput>,
): Promise<BlogPost> {
  await requireAdmin();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .update(input)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  revalidatePath("/blog");
  if ((data as BlogPost).slug)
    revalidatePath(`/blog/${(data as BlogPost).slug}`);
  return data as BlogPost;
}

export async function publishBlogPost(id: string): Promise<BlogPost> {
  await requireAdmin();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .update({ is_published: true, published_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  revalidatePath("/blog");
  revalidatePath(`/blog/${(data as BlogPost).slug}`);
  revalidatePath("/");
  return data as BlogPost;
}

export async function unpublishBlogPost(id: string): Promise<BlogPost> {
  await requireAdmin();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .update({ is_published: false })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  revalidatePath("/blog");
  revalidatePath(`/blog/${(data as BlogPost).slug}`);
  revalidatePath("/");
  return data as BlogPost;
}

export async function deleteBlogPost(id: string): Promise<void> {
  await requireAdmin();
  const supabase = await createClient();
  const { data, error: lookupError } = await supabase
    .from("blog_posts")
    .select("slug")
    .eq("id", id)
    .single();
  if (lookupError) throw lookupError;

  const { error } = await supabase.from("blog_posts").delete().eq("id", id);

  if (error) throw error;

  revalidatePath("/blog");
  if (data?.slug) revalidatePath(`/blog/${data.slug}`);
  revalidatePath("/");
}
