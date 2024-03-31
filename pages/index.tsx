import React from "react";
import parse from "html-react-parser";
import Head from "next/head";

import PostList from "@/components/postList";

function Home({
  options,
  allPosts,
  totalPages,
  head,
}: {
  menu: any;
  options: any;
  allPosts: any;
  totalPages: number;
  head: any;
}) {
  return (
    <>
      <Head>{parse(head.head + options.site_favicon)}</Head>
      <PostList
        allPosts={allPosts}
        header={false}
        options={options}
        pageNumber={1}
        totalPages={totalPages}
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

export async function getStaticProps() {
  // Fetch Stuff
  const [options, allPostsData] = await Promise.all([
    fetch(`${process.env.WORDPRESS_HOST}/api`).then((res) => res.json()),
    fetchPosts(
      `${process.env.WORDPRESS_HOST}/api/wp/v2/posts?per_page=8&page=1`,
    ),
  ]);

  const allPosts = allPostsData.posts;
  const totalPages = allPostsData.totalPages;

  const head = await fetch(
    `${process.env.WORDPRESS_HOST}/api/wp/v2/head/${encodeURIComponent(`${process.env.WORDPRESS_HOST}/`)}`,
  ).then((res) => res.json());

  return {
    props: {
      options,
      allPosts,
      totalPages,
      head,
    },
    revalidate: 3600,
  };
}

export default Home;
