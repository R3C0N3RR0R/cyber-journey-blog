import { sortPosts } from "pliny/utils/contentlayer";
import { allBlogs } from "contentlayer/generated";
import Main from "./Main";

export default async function Page() {
  const sortedPosts = sortPosts(allBlogs);
  // Utiliser directement les posts sans allCoreContent pour conserver summary
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
  return <Main posts={posts} />;
}
