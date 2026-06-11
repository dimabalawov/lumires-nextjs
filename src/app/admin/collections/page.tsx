import { getFeaturedCollectionRows } from "@/lib/collections/featured";
import FeaturedCollectionsManager from "./FeaturedCollectionsManager";

export const metadata = { title: "Collections · Admin" };

export default async function AdminCollectionsPage() {
  const rows = await getFeaturedCollectionRows();

  return (
    <div>
      <h1 className="mb-2 font-manrope font-light text-brand-light text-[28px] lg:text-[40px] tracking-[0.06em]">
        Collections Created By <span className="text-brand-gold">Film Lovers</span>
      </h1>
      <p className="font-manrope text-[14px] text-brand-muted mb-10">
        Curate the lists shown in the &ldquo;Collections Created By Film Lovers&rdquo; section on
        the Lists page. Featured lists appear in the order added.
      </p>

      <FeaturedCollectionsManager initialRows={rows} />
    </div>
  );
}
