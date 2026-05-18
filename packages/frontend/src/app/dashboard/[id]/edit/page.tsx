import { notFound } from "next/navigation";
import { getPostById } from "../../actions";
import { getSession } from "@/lib/session";
import { BlogEditor } from "@/app/editor/_components/BlogEditor";

export const dynamic = "force-dynamic";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [post, session] = await Promise.all([getPostById(id), getSession()]);
  if (!post) notFound();

  const ownerEmail = (process.env.OWNER_EMAIL ?? "").trim().toLowerCase();
  const isOwner = !!session && session.email.trim().toLowerCase() === ownerEmail;

  return (
    <BlogEditor
      isLoggedIn={true}
      isOwner={isOwner}
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
