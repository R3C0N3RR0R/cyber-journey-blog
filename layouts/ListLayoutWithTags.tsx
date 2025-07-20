"use client";

import { usePathname } from "next/navigation";
import { slug } from "github-slugger";
import { formatDate } from "pliny/utils/formatDate";
import { CoreContent } from "pliny/utils/contentlayer";
import type { Blog } from "contentlayer/generated";
import Link from "@/components/Link";
import Tag from "@/components/Tag";
import siteMetadata from "@/data/siteMetadata";
import tagData from "app/tag-data.json";
import Image from "next/image";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
}
interface ListLayoutProps {
  posts: CoreContent<Blog>[];
  title: string;
  initialDisplayPosts?: CoreContent<Blog>[];
  pagination?: PaginationProps;
}

function Pagination({ totalPages, currentPage }: PaginationProps) {
  const pathname = usePathname();
  const segments = pathname.split("/");
  const lastSegment = segments[segments.length - 1];
  const basePath = pathname
    .replace(/^\//, "") // Remove leading slash
    .replace(/\/page\/\d+\/?$/, "") // Remove any trailing /page
    .replace(/\/$/, ""); // Remove trailing slash
  const prevPage = currentPage - 1 > 0;
  const nextPage = currentPage + 1 <= totalPages;

  return (
    <div className="space-y-2 pt-6 pb-8 md:space-y-5">
      <nav className="flex justify-between">
        {!prevPage && (
          <button
            className="cursor-auto disabled:opacity-50"
            disabled={!prevPage}
          >
            Précédent
          </button>
        )}
        {prevPage && (
          <Link
            href={
              currentPage - 1 === 1
                ? `/${basePath}/`
                : `/${basePath}/page/${currentPage - 1}`
            }
            rel="prev"
          >
            Précédent
          </Link>
        )}
        <span>
          {currentPage} of {totalPages}
        </span>
        {!nextPage && (
          <button
            className="cursor-auto disabled:opacity-50"
            disabled={!nextPage}
          >
            Suivant
          </button>
        )}
        {nextPage && (
          <Link href={`/${basePath}/page/${currentPage + 1}`} rel="next">
            Suivant
          </Link>
        )}
      </nav>
    </div>
  );
}

export default function ListLayoutWithTags({
  posts,
  title,
  initialDisplayPosts = [],
  pagination,
}: ListLayoutProps) {
  const pathname = usePathname();
  const tagCounts = tagData as Record<string, number>;
  const tagKeys = Object.keys(tagCounts);
  const sortedTags = tagKeys.sort((a, b) => tagCounts[b] - tagCounts[a]);

  const displayPosts =
    initialDisplayPosts.length > 0 ? initialDisplayPosts : posts;

  return (
    <>
      <div>
        <div className="pt-6 pb-6">
          {pathname.startsWith("/blog") ? (
            <div className="flex items-center gap-4">
              <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-gray-800 via-gray-600 to-gray-900 border-4 border-white shadow-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 48 48"
                  className="w-10 h-10"
                  fill="none"
                >
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    fill="#fff"
                    fillOpacity="0.12"
                  />
                  <rect
                    x="12"
                    y="18"
                    width="24"
                    height="12"
                    rx="4"
                    fill="#222"
                    stroke="#fff"
                    strokeWidth="2"
                  />
                  <circle cx="18" cy="24" r="2" fill="#fff" />
                  <circle cx="30" cy="24" r="2" fill="#fff" />
                  <rect x="20" y="28" width="8" height="2" rx="1" fill="#bbb" />
                </svg>
              </span>
              <h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:text-5xl md:leading-14 dark:text-gray-100">
                {title}
              </h1>
            </div>
          ) : (
            <h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:text-5xl md:leading-14 dark:text-gray-100">
              {title}
            </h1>
          )}
        </div>
        <div className="flex sm:space-x-24">
          {pathname.startsWith("/blog") ? null : (
            <div className="hidden h-full max-h-screen max-w-[280px] min-w-[280px] flex-wrap overflow-auto rounded-sm bg-gray-50 pt-5 shadow-md sm:flex dark:bg-gray-900/70 dark:shadow-gray-800/40">
              <div className="px-6 py-4">
                {pathname.startsWith("/tags") ? null : (
                  <>
                    <h3 className="text-2xl font-extrabold text-primary-500 mb-4">
                      Tous les Posts
                    </h3>
                    <ul>
                      {sortedTags.map((t) => {
                        return (
                          <li key={t} className="my-3">
                            {decodeURI(pathname.split("/tags/")[1]) ===
                            slug(t) ? (
                              <h3 className="text-primary-500 inline px-3 py-2 text-sm font-bold uppercase">
                                {`${t} (${tagCounts[t]})`}
                              </h3>
                            ) : (
                              <Link
                                href={`/tags/${slug(t)}`}
                                className="hover:text-primary-500 dark:hover:text-primary-500 px-3 py-2 text-sm font-medium text-gray-500 uppercase dark:text-gray-300"
                                aria-label={`View posts tagged ${t}`}
                              >
                                {`${t} (${tagCounts[t]})`}
                              </Link>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </>
                )}
              </div>
            </div>
          )}
          <div>
            <ul>
              {displayPosts.map((post) => {
                const { path, date, title, summary, tags, images } = post;
                // On prend la première image si elle existe, sinon une image par défaut
                const displayImage =
                  images && images.length > 0
                    ? images[0]
                    : "/static/images/logo.png";
                return (
                  <li key={path} className="py-5">
                    <article className="flex flex-col space-y-2 xl:space-y-0">
                      <dl>
                        <dt className="sr-only">Publié le</dt>
                        <dd className="text-base leading-6 font-medium text-gray-500 dark:text-gray-400">
                          <time dateTime={date} suppressHydrationWarning>
                            {formatDate(date, "fr-FR")}
                          </time>
                        </dd>
                      </dl>
                      <div className="space-y-3 flex items-center gap-6">
                        <Image
                          src={displayImage}
                          alt={title}
                          width={80}
                          height={80}
                          className="rounded-md object-cover hidden sm:block"
                        />
                        <div className="flex-1">
                          <h2 className="text-2xl leading-8 font-bold tracking-tight">
                            <Link
                              href={`/${path}`}
                              className="text-gray-900 dark:text-gray-100"
                            >
                              {title}
                            </Link>
                          </h2>
                          <div className="flex flex-wrap">
                            {tags?.map((tag) => (
                              <Tag key={tag} text={tag} />
                            ))}
                          </div>
                          <div className="prose max-w-none text-gray-500 dark:text-gray-400 mt-2">
                            {summary}
                          </div>
                        </div>
                      </div>
                    </article>
                  </li>
                );
              })}
            </ul>
            {pagination && pagination.totalPages > 1 && (
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
