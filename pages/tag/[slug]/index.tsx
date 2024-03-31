import Head from "next/head";
import parse from "html-react-parser";
import React from "react";

import PostList from "@/components/postList";

function Tag({
  options,
  allPosts,
  totalPages,
  tag,
  head,
}: {
  options: any;
  allPosts: any;
  totalPages: number;
  tag: any;
  head: any;
}) {
  return (
    <>
      <Head>{parse(head.head + options.site_favicon)}</Head>
      <PostList
        allPosts={allPosts}
        header={
          <div
            className={`text-md relative z-10 border-b border-b-black/10 bg-amber-50 px-8 py-6 font-sans uppercase tracking-widest`}
          >
            <strong className={`font-bold`}>Tag:</strong>&nbsp;{tag[0].name}
          </div>
        }
        pageNumber={1}
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
  const res = await fetch(`${process.env.WORDPRESS_HOST}/api/wp/v2/tags`);
  const tags = await res.json();

  const paths = tags.map((tag: any) => ({
    params: { slug: tag.slug },
  }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }: any) {
  // Fetch Stuff
  const [options, allPostsData, tag] = await Promise.all([
    fetch(`${process.env.WORDPRESS_HOST}/api`).then((res) => res.json()),
    fetchPosts(
      `${process.env.WORDPRESS_HOST}/api/wp/v2/posts?per_page=8&page=1&filter[taxonomy]=post_tag&filter[term]=${params.slug}`,
    ),
    fetch(
      `${process.env.WORDPRESS_HOST}/api/wp/v2/tags?slug=${params.slug}`,
    ).then((res) => res.json()),
  ]);

  const allPosts = allPostsData.posts;
  const totalPages = allPostsData.totalPages;

  const head = await fetch(
    `${process.env.WORDPRESS_HOST}/api/wp/v2/head/${encodeURIComponent(`${process.env.WORDPRESS_HOST}/tag/${params.slug}/`)}`,
  ).then((res) => res.json());

  return {
    props: {
      options,
      allPosts,
      totalPages,
      tag,
      head,
    },
    revalidate: 3600,
  };
}

export default Tag;
