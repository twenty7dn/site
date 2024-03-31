import React from "react";
import parse from "html-react-parser";
import Head from "next/head";

import SinglePost from "@/components/singlePost";
import SinglePage from "@/components/singlePage";

export default function PostPage({
  options,
  currentPost,
  latestPostsAside,
  head,
}: {
  options: any;
  currentPost: any;
  latestPostsAside: any;
  head: any;
}) {
  return (
    <>
      <Head>{parse(head.head + options.site_favicon)}</Head>
      {currentPost[0].type === "post" ? (
        <SinglePost
          post={currentPost}
          latestPosts={latestPostsAside}
          options={options}
        />
      ) : (
        <SinglePage
          post={currentPost}
          latestPosts={latestPostsAside}
          options={options}
        />
      )}
    </>
  );
}

export async function getStaticPaths() {
  const [posts, pages] = await Promise.all([
    fetch(`${process.env.WORDPRESS_HOST}/api/wp/v2/posts`).then((res) =>
      res.json(),
    ),
    fetch(`${process.env.WORDPRESS_HOST}/api/wp/v2/pages`).then((res) =>
      res.json(),
    ),
  ]);

  const allPosts = [...posts, ...pages];

  const paths = allPosts.map((post: any) => ({
    params: { slug: post.slug },
  }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }: any) {
  try {
    // Fetch Stuff
    const [options, currentPosts, currentPages] = await Promise.all([
      fetch(`${process.env.WORDPRESS_HOST}/api`).then((res) => res.json()),
      fetch(
        `${process.env.WORDPRESS_HOST}/api/wp/v2/posts?slug=${params.slug}&per_page=1&_embed`,
      ).then((res) => res.json()),
      fetch(
        `${process.env.WORDPRESS_HOST}/api/wp/v2/pages?slug=${params.slug}&per_page=1&_embed`,
      ).then((res) => res.json()),
    ]);

    const currentPost = [...currentPosts, ...currentPages];
    const latestPostsAside = await fetch(
      `${process.env.WORDPRESS_HOST}/api/wp/v2/posts?per_page=3`,
    ).then((res) => res.json());

    const head = await fetch(
      `${process.env.WORDPRESS_HOST}/api/wp/v2/head/${encodeURIComponent(`${process.env.WORDPRESS_HOST}/${params.slug}/`)}`,
    ).then((res) => res.json());

    return {
      props: {
        options,
        currentPost,
        latestPostsAside,
        head,
      },
      revalidate: 3600,
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      props: {
        options: null,
        currentPost: null,
        latestPostsAside: null,
        head: null,
      },
      revalidate: 3600,
    };
  }
}
