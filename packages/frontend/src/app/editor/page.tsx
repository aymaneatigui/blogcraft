import { getSession } from "@/lib/session";
import { BlogEditor } from "./_components/BlogEditor";

export default async function EditorPage({
  searchParams,
}: {
  searchParams: Promise<{ template?: string }>;
}) {
  const session = await getSession();
  const { template } = await searchParams;

  const ownerEmail = (process.env.OWNER_EMAIL ?? "").trim().toLowerCase();
  const isOwner = !!session && session.email.trim().toLowerCase() === ownerEmail;

  return <BlogEditor isLoggedIn={!!session} isOwner={isOwner} selectedTemplateId={template} />;
}
