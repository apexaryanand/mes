import { redirect } from "next/navigation";

export default async function SchoolSlugRedirectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  redirect(`/houses/${slug}`);
}
