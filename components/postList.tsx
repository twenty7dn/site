import React from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import Link from "next/link";

import Post from "@/components/post";
import PostNoBanner from "@/components/postNoBanner";

const Footer = dynamic(() => import("@/components/footer"), { ssr: true });

function PostList({
  allPosts,
  header,
  options,
  pageNumber = 1,
  totalPages,
}: {
  allPosts: any;
  header: any;
  options: any;
  pageNumber: number;
  totalPages: number;
}) {
  const router = useRouter(); // Initialize useRouter
  const { asPath } = router;
  let nextPageUrl: any, prevPageUrl: any;

  // Function to create the correct page URL
  const createPageUrl = (base: string, pageNum: number) => {
    // For page 1, don't add the page number to the URL
    return pageNum === 1 ? base : `${base}/page/${pageNum}`;
  };

  // Sort posts so that sticky posts come first
  const sortedPosts = allPosts.sort((a: any, b: any) => {
    if (a.sticky && !b.sticky) return -1;
    if (!a.sticky && b.sticky) return 1;
    return 0;
  });

  // Determine the current [slug]'s route dynamically
  if (asPath === "/") {
    nextPageUrl = createPageUrl("/", pageNumber + 1);
    prevPageUrl = createPageUrl("/", pageNumber - 1);
  } else if (asPath.startsWith("/page/2/")) {
    nextPageUrl = createPageUrl("/", pageNumber + 1);
    prevPageUrl = "/";
  } else if (asPath.startsWith("/writer/")) {
    const writerSlug = asPath.split("/writer/")[1].split("/")[0];
    nextPageUrl = createPageUrl(`/writer/${writerSlug}`, pageNumber + 1);
    prevPageUrl = createPageUrl(`/writer/${writerSlug}`, pageNumber - 1);
  } else if (asPath.startsWith("/tag/")) {
    const tagSlug = asPath.split("/tag/")[1].split("/")[0];
    nextPageUrl = createPageUrl(`/tag/${tagSlug}`, pageNumber + 1);
    prevPageUrl = createPageUrl(`/tag/${tagSlug}`, pageNumber - 1);
  } else if (asPath.startsWith("/topic/")) {
    const topicSlug = asPath.split("/topic/")[1].split("/")[0];
    nextPageUrl = createPageUrl(`/topic/${topicSlug}`, pageNumber + 1);
    prevPageUrl = createPageUrl(`/topic/${topicSlug}`, pageNumber - 1);
  } else if (asPath.startsWith("/search/")) {
    const query = asPath.split("/search/")[1].split("/")[0];
    nextPageUrl = createPageUrl(`/search/${query}`, pageNumber + 1);
    prevPageUrl = createPageUrl(`/search/${query}`, pageNumber - 1);
  } else {
    nextPageUrl = createPageUrl("", pageNumber + 1);
    prevPageUrl = createPageUrl("", pageNumber - 1);
  }

  nextPageUrl = nextPageUrl.replace("//", "/");
  prevPageUrl = prevPageUrl.replace("//", "/");

  const currentPage = pageNumber ? pageNumber : 1;

  return (
    <section
      id={`content`}
      className={`post-list bar-left/50 relative flex w-full flex-col bg-amber-50 before:w-[48px] xl:before:w-[64px]`}
    >
      {header}
      {allPosts.map((post: any) => {
        if (post.featured_media !== false) {
          return <Post key={post.id} data={post} single={false} />;
        } else {
          return <PostNoBanner key={post.id} data={post} single={false} />;
        }
      })}
      <Footer
        loadMore={
          totalPages > 1 && (
            <>
              {/* Newer Entries button */}
              {currentPage > 1 && (
                <Link
                  href={prevPageUrl}
                  className={`inline-link inline-block !p-0 uppercase`}
                >
                  Newer Entries
                </Link>
              )}
              {currentPage > 1 && currentPage < totalPages && (
                <span
                  className={`inline-link mx-2 inline-block !p-0 opacity-25`}
                >
                  /
                </span>
              )}
              {/* Older Entries button */}
              {currentPage < totalPages && (
                <Link
                  href={nextPageUrl}
                  className={`inline-link inline-block !p-0 uppercase`}
                >
                  Older Entries
                </Link>
              )}
            </>
          )
        }
        options={options}
      />
    </section>
  );
}

export default PostList;
