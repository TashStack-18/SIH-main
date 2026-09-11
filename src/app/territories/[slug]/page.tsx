import { redirect } from "next/navigation";

export default async function TerritoryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }> | { slug: string };
}) {
  const resolved = await params;
  const slug = resolved?.slug ? encodeURIComponent(resolved.slug) : "";
  redirect(slug ? `/destinations?ut=${slug}` : "/destinations");
}
