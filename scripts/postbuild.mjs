import rss from "./rss.mjs";
import { writeFileSync } from "fs";
import { allBlogs } from "../.contentlayer/generated/index.mjs";
import { slug } from "github-slugger";

async function generateTagData() {
  const tagCount = {};
  allBlogs.forEach((post) => {
    if (post.draft) return;
    post.tags.forEach((tag) => {
      const formattedTag = slug(tag);
      tagCount[formattedTag] = (tagCount[formattedTag] || 0) + 1;
    });
  });
  writeFileSync("./app/tag-data.json", JSON.stringify(tagCount, null, 2));
  console.log("Tag data generated...");
}

async function postbuild() {
  await generateTagData();
  await rss();
}

postbuild();
