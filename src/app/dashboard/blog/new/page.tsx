import { BlogEditorPage } from "@/components/dashboard/blog-editor-page";
import { QueryProvider } from "@/components/query-provider";
import { requireAdmin } from "@/services/authorization";

export const metadata = { title: "New Blog Post" };

export default async function NewBlogPostPage() {
  await requireAdmin();
  return (
    <QueryProvider>
      <BlogEditorPage post={null} />
    </QueryProvider>
  );
}
