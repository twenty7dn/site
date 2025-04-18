import Head from "next/head";
import parse from "html-react-parser";
import React from "react";

import PostList from "@/components/postList";

function Tag({
  options,
  allPosts,
  tag,
  pageNumber,
  totalPages,
  head,
}: {
  options: any;
  allPosts: any;
  tag: any;
  pageNumber: any;
  totalPages: number;
  head: any;
}) {
  return (
    <>
      <Head>{parse(head.head + options.favicon_html)}</Head>
      <PostList
        allPosts={allPosts}
        header={
          <div
            className={`text-md relative z-10 border-b border-b-black/10 bg-amber-50 px-8 py-6 font-sans uppercase tracking-widest`}
          >
            <strong className={`font-bold`}>Tag:</strong>&nbsp;{tag[0].name}
          </div>
        }
        pageNumber={pageNumber}
        totalPages={totalPages}
        options={options}
      />
    </>
  );
}

const fetchPosts = async (url: string) => {
  const response = (await fetch(url)) as any;
  const totalPages = parseInt(response.headers.get("X-WP-TotalPages"), 10);
  const posts = await response.json();
  return { posts, totalPages };
};

export async function getStaticPaths() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_WORDPRESS_HOST}/api/wp/v2/tags`);
  const tags = await res.json();

  const paths = [];

  for (const tag of tags) {
    if (!tag.slug) {
      continue; // Skip if slug is undefined
    }

    // Fetch the total number of posts for the topic
    const resPosts = await fetch(
      `${process.env.NEXT_PUBLIC_WORDPRESS_HOST}/api/wp/v2/posts?filter[taxonomy]=post_tag&filter[term]=${tag.slug}`,
    );
    const posts = await resPosts.json();
    const totalPagesPerTopic = Math.ceil(posts.length / 8);

    for (let pageNumber = 1; pageNumber <= totalPagesPerTopic; pageNumber++) {
      paths.push({
        params: {
          slug: tag.slug,
          page: pageNumber.toString(),
        },
      });
    }
  }

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }: any) {
  const { page } = params;
  const pageNumber = parseInt(page, 10);

  // Fetch Stuff
  const [options, allPostsData, tag] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_WORDPRESS_HOST}/api`).then((res) => res.json()),
    fetchPosts(
      `${process.env.NEXT_PUBLIC_WORDPRESS_HOST}/api/wp/v2/posts?per_page=8&page=${pageNumber}&filter[taxonomy]=post_tag&filter[term]=${params.slug}`,
    ),
    fetch(
      `${process.env.NEXT_PUBLIC_WORDPRESS_HOST}/api/wp/v2/tags?slug=${params.slug}`,
    ).then((res) => res.json()),
  ]);

  const allPosts = allPostsData.posts;
  const totalPages = allPostsData.totalPages;

  const head = await fetch(
    `${process.env.NEXT_PUBLIC_WORDPRESS_HOST}/api/wp/v2/head/${encodeURIComponent(`${process.env.NEXT_PUBLIC_WORDPRESS_HOST}/tag/${params.slug}/page/${pageNumber}/`)}`,
  ).then((res) => res.json());

  return {
    props: {
      options,
      allPosts,
      tag,
      pageNumber,
      totalPages,
      head,
    },
    revalidate: 3600,
  };
}

export default Tag;
