import { notFound } from "next/navigation";
import { getPostById } from "../../actions";
import { BlogEditor } from "@/app/editor/_components/BlogEditor";

export const dynamic = "force-dynamic";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getPostById(id);
  if (!post) notFound();

  return (
    <BlogEditor
      isLoggedIn={true}
      initialData={{
        id: post.id,
        title: post.title,
        description: post.description,
        body: post.body,
        tags: post.tags,
      }}
    />
  );
}
