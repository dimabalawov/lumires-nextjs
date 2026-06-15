import { getProfile } from "@/lib/api/users";
import { notFound } from "next/navigation";
import UserReviewsSection from "@/components/sections/UserReviewsSection";
import { getReviews } from "@/lib/api";

interface PageProps {
    params: { slug: string };
    searchParams: Record<string, string | undefined>;
}

export default async function ReviewsPage({ params, searchParams }: PageProps) {
    const { slug } = await params;

    const profile = await getProfile(slug);
    if (!profile) notFound();

    const data = await getReviews(profile.id, {
        category: searchParams.category ? Number(searchParams.category) : undefined,
        filter: searchParams.filter ? Number(searchParams.filter) : undefined,
        sortBy: searchParams.sortBy ? Number(searchParams.sortBy) : undefined,
        page: Number(searchParams.page ?? 1),
        authed: true,
    });

    return (
        <>
            {data && (
                <UserReviewsSection
                    username={slug}
                    reviews={data.results}
                    page={data.page}
                    totalPages={data.totalPages}
                />
            )}
        </>
    );
}
