import { notFound } from "next/navigation";
import { BlogEditorPage } from "@/components/dashboard/blog-editor-page";
import { QueryProvider } from "@/components/query-provider";
import { getBlogPostById } from "@/services/blog";

export const metadata = { title: "Edit Blog Post" };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditBlogPostPage({ params }: Props) {
  const { id } = await params;
  const post = await getBlogPostById(id);
  if (!post) notFound();

  return (
    <QueryProvider>
      <BlogEditorPage post={post} />
    </QueryProvider>
  );
}
