import Head from "next/head";
import parse from "html-react-parser";
import React from "react";

import PostList from "@/components/postList";

function Home({
  options,
  allPosts,
  pageNumber,
  totalPages,
  head,
}: {
  options: any;
  allPosts: any;
  pageNumber: any;
  totalPages: number;
  head: any;
}) {
  return (
    <>
      <Head>{parse(head.head + options.favicon_html)}</Head>
      <PostList
        allPosts={allPosts}
        header={false}
        options={options}
        pageNumber={pageNumber}
        totalPages={totalPages}
      />
    </>
  );
}

export async function getStaticPaths() {
  // Fetch total number of posts to determine the number of pages
  const res = await fetch(
    `${process.env.WORDPRESS_HOST}/api/wp/v2/posts?per_page=8&page=1`,
  );
  const totalPosts = parseInt(res.headers.get("X-WP-Total") as string, 10);
  const totalNumberOfPages = Math.ceil(totalPosts / 8);

  // Generate paths for each page
  const paths = Array.from({ length: totalNumberOfPages }, (_, i) => ({
    params: { page: (i + 1).toString() },
  }));

  return {
    paths,
    fallback: "blocking", // or false if you want to pre-generate all pages
  };
}

const fetchPosts = async (url: string) => {
  const response = (await fetch(url)) as any;
  const totalPages = parseInt(response.headers.get("X-WP-TotalPages"), 10);
  const posts = await response.json();
  return { posts, totalPages };
};

export async function getStaticProps({ params }: any) {
  const pageNumber = parseInt(params.page, 10);

  // Fetch Stuff
  const [options, allPostsData] = await Promise.all([
    fetch(`${process.env.WORDPRESS_HOST}/api`).then((res) => res.json()),
    fetchPosts(
      `${process.env.WORDPRESS_HOST}/api/wp/v2/posts?per_page=8&page=${pageNumber}`,
    ),
  ]);

  const allPosts = allPostsData.posts;
  const totalPages = allPostsData.totalPages;

  const head = await fetch(
    `${process.env.WORDPRESS_HOST}/api/wp/v2/head/${encodeURIComponent(`${process.env.WORDPRESS_HOST}/page/${pageNumber}/`)}`,
  ).then((res) => res.json());

  return {
    props: {
      options,
      allPosts,
      pageNumber,
      totalPages,
      head,
    },
    revalidate: 3600,
  };
}

export default Home;
