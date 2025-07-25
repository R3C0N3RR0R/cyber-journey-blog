"use client";

import { Comments as CommentsComponent } from "pliny/comments";
import { useState } from "react";
import siteMetadata from "@/data/siteMetadata";

export default function Comments({ slug }: { slug: string }) {
  const [loadComments, setLoadComments] = useState(false);

  if (!siteMetadata.comments?.provider) {
    return null;
  }
  return null;
}
