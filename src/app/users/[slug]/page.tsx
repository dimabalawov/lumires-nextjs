import { FavouriteFilms } from "@/components/sections/FavouriteFilmsSection";
import PopularListsSection from "@/components/sections/PopularListsSection";
import PopularReviewCard from "@/components/sections/PopularReviewCard";
import { AccentTitle } from "@/components/ui/AccentTitle";
import { EditFavouritesButton } from "@/components/ui/EditFavouritesButton";
import { getFavouriteFilms, getUserFeaturedReview, getUserPopularLists } from "@/lib/api/users";

export default async function ProfilePage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const favResponse = await getFavouriteFilms(slug);
  const featuredReview = await getUserFeaturedReview(slug);
  const popularLists = await getUserPopularLists(slug);

  return (
    <>
      <section className="section-container flex flex-col gap-12 py-10">

        {favResponse && favResponse.favouriteFilms && favResponse.favouriteFilms.length > 0 && (
          <>
            <div className="flex justify-between">
              <AccentTitle text="Favourite" accent="Films" />
              <EditFavouritesButton />
            </div>
            <FavouriteFilms films={favResponse.favouriteFilms} />
          </>
        )}

        {featuredReview && (
          <>
            <div className="flex justify-between">
              <AccentTitle text="Featured" accent="Review" />
            </div>

            <PopularReviewCard review={featuredReview} />
          </>
        )}

      </section>

      {popularLists && popularLists.lists.length > 0 && (
        <PopularListsSection lists={popularLists.lists} />
      )}
    </>
  );
}
