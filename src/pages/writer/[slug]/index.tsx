import Head from "next/head";
import parse from "html-react-parser";
import React from "react";

import Header from "@/components/header";
import PostList from "@/components/postList";
import WpImage from "@/components/WpImage";

function Writer({
  options,
  allPosts,
  totalPages,
  writer,
  head,
}: {
  options: any;
  allPosts: any;
  totalPages: number;
  writer: any;
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
            <strong className={`font-bold`}>Writer:</strong>&nbsp;
            {writer[0].name}
          </div>
        }
        pageNumber={1}
        totalPages={totalPages}
        options={options}
      />
    </>
  );
}

export async function getStaticPaths() {
  const res = await fetch(`${process.env.WORDPRESS_HOST}/api/wp/v2/users`);
  const authors = await res.json();

  const paths = authors.map((author: any) => ({
    params: { slug: author.slug },
  }));

  return {
    paths,
    fallback: false,
  };
}

const fetchPosts = async (url: string) => {
  const response = (await fetch(url)) as any;
  const totalPages = parseInt(response.headers.get("X-WP-TotalPages"), 10);
  const posts = await response.json();
  return { posts, totalPages };
};

export async function getStaticProps({ params }: any) {
  // Fetch Stuff
  const [options, allPostsData, writer] = await Promise.all([
    fetch(`${process.env.WORDPRESS_HOST}/api`).then((res) => res.json()),
    fetchPosts(
      `${process.env.WORDPRESS_HOST}/api/wp/v2/posts?per_page=8&page=1&filter[author_name]=${params.slug}`,
    ),
    fetch(
      `${process.env.WORDPRESS_HOST}/api/wp/v2/users?slug=${params.slug}`,
    ).then((res) => res.json()),
  ]);

  const allPosts = allPostsData.posts;
  const totalPages = allPostsData.totalPages;

  const head = await fetch(
    `${process.env.WORDPRESS_HOST}/api/wp/v2/head/${encodeURIComponent(`${process.env.WORDPRESS_HOST}/writer/${params.slug}/`)}`,
  ).then((res) => res.json());

  return {
    props: {
      options,
      allPosts,
      totalPages,
      writer,
      head,
    },
    revalidate: 3600,
  };
}

export default Writer;
