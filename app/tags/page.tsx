import Link from "@/components/Link";
import Tag from "@/components/Tag";
import { slug } from "github-slugger";
import tagData from "app/tag-data.json";
import { genPageMetadata } from "app/seo";

export const metadata = genPageMetadata({
  title: "Tags",
  description: "Things I blog about",
});

export default async function Page() {
  const tagCounts = tagData as Record<string, number>;
  const tagKeys = Object.keys(tagCounts);
  const sortedTags = tagKeys.sort((a, b) => a.localeCompare(b, "fr"));
  return (
    <>
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h1 className="mb-2 text-4xl font-extrabold text-white">
            Tous les tags
          </h1>
          <p className="text-lg text-gray-400">
            Explorez les thématiques abordées sur le blog. Cliquez sur un tag
            pour découvrir tous les articles associés.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-2 rounded-xl border border-[#8ac13c] bg-black py-6">
          {sortedTags.length === 0 && (
            <div className="text-center text-gray-400">Aucun tag trouvé.</div>
          )}
          {sortedTags.map((t) => (
            <Link
              key={t}
              href={`/tags/${slug(t).toLowerCase()}`}
              className="rounded-full border border-[#8ac13c] bg-black px-3 py-1 text-sm font-semibold text-white transition-colors duration-150 hover:bg-[#8ac13c] hover:text-black"
              aria-label={`Voir les articles tagués ${t}`}
            >
              {t.split("-").join(" ")}
              <span className="ml-1 text-xs font-normal text-gray-400">
                ({tagCounts[t]})
              </span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
