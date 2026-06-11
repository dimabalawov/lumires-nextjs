import CommunitySection from "@/components/sections/CommunitySection";
import { getCommunityReviews } from "@/lib/reviews/community";
import { createClient } from "@/lib/supabase/server";

interface CommunityReviewsSectionProps {
  title?: string;
  titleAccent?: string;
  uppercaseTitle?: boolean;
}

/**
 * "Reviews From The Community" backed by real, aggregated reviews. When logged
 * in we fetch per-user so each card's like state is accurate. If the API returns
 * nothing, CommunitySection falls back to its static demo threads.
 */
export default async function CommunityReviewsSection({
  title = "Reviews From The",
  titleAccent = "Community",
  uppercaseTitle = false,
}: CommunityReviewsSectionProps = {}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isAuthed = !!user;

  const threads = await getCommunityReviews(6, isAuthed);

  return (
    <CommunitySection
      title={title}
      titleAccent={titleAccent}
      uppercaseTitle={uppercaseTitle}
      threads={threads}
      isAuthed={isAuthed}
      showAllHref="/reviews"
    />
  );
}
