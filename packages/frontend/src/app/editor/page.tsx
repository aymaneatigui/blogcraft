import { getSession } from "@/lib/session";
import { BlogEditor } from "./_components/BlogEditor";

export default async function EditorPage({
  searchParams,
}: {
  searchParams: Promise<{ template?: string }>;
}) {
  const session = await getSession();
  const { template } = await searchParams;

  return <BlogEditor isLoggedIn={!!session} selectedTemplateId={template} />;
}
