import { notFound } from "next/navigation";
import { getProfile } from "@/lib/api/users";
import UserListsSection from "@/components/sections/UserListsSection";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ListsPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const sp = await searchParams;

  const profile = await getProfile(slug); 
  if (!profile) notFound();

  return (
    <UserListsSection
      userId={profile.id}
      username={profile.username}
      searchParams={sp}
      isAuthed={true}
    />
  );
}