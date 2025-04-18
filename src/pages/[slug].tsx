import React from "react";
import parse from "html-react-parser";
import Head from "next/head";

import SinglePost from "@/components/singlePost";
import SinglePage from "@/components/singlePage";

export default function PostPage({
                                   options,
                                   currentPost,
                                   latestPostsAside,
                                 }: {
  options: any;
  currentPost: any;
  latestPostsAside: any;
}) {
  return (
      <>
        {/*<Head>{parse(String(head.head + options.favicon))}</Head>*/}
        <SinglePage
            post={currentPost}
            latestPosts={latestPostsAside}
            options={options}
        />
      </>
  );
}

export async function getStaticPaths() {
  const [pages] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_WORDPRESS_HOST}/api/wp/v2/pages`).then((res) =>
        res.json(),
    ),
  ]);

  const allPosts = [...pages];

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
    const [options, currentPages] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_WORDPRESS_API}/meta`).then((res) => res.json()),
      fetch(
          `${process.env.NEXT_PUBLIC_WORDPRESS_API}/page/${params.slug}&per_page=1&_embed`,
      ).then((res) => res.json()),
    ]);

    const currentPost = [...currentPages];
    const latestPostsAside = await fetch(
        `${process.env.NEXT_PUBLIC_WORDPRESS_API}/post?per_page=3`,
    ).then((res) => res.json());

    return {
      props: {
        options,
        currentPost,
        latestPostsAside
      },
      revalidate: 3600,
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      props: {
        options: null,
        currentPost: null,
        latestPostsAside: null
      },
      revalidate: 3600,
    };
  }
}
