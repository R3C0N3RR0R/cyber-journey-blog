import { sortPosts } from "pliny/utils/contentlayer";
import { allChallenges } from "contentlayer/generated";
import { genPageMetadata } from "app/seo";
import ListLayout from "@/layouts/ListLayoutWithTags";

const POSTS_PER_PAGE = 5;

export const metadata = genPageMetadata({ title: "Challenges" });

export default async function ChallengesPage(props: {
  searchParams: Promise<{ page: string }>;
}) {
  const sortedPosts = sortPosts(allChallenges);
  // Utiliser directement les challenges
  const posts = sortedPosts
    .filter((post) => !post.draft)
    .map((post) => ({
      slug: post.slug,
      date: post.date,
      title: post.title,
      summary: post.summary,
      tags: post.tags,
      images: post.images,
      path: post.path,
      type: post.type,
      readingTime: post.readingTime,
      filePath: post.filePath,
      toc: post.toc,
      structuredData: post.structuredData,
    }));
  const pageNumber = 1;
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  const initialDisplayPosts = posts.slice(0, POSTS_PER_PAGE * pageNumber);
  const pagination = {
    currentPage: pageNumber,
    totalPages: totalPages,
  };

  return (
    <ListLayout
      posts={posts}
      initialDisplayPosts={initialDisplayPosts}
      pagination={pagination}
      title="Challenges de Sécurité"
    />
  );
}
