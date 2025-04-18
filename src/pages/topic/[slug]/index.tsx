import Head from "next/head";
import parse from "html-react-parser";
import React from "react";
import Link from "next/link";

import PostList from "@/components/postList";

function Topic({
  options,
  allPosts,
  totalPages,
  breadcrumb,
  head,
}: {
  options: any;
  allPosts: any;
  totalPages: number;
  breadcrumb: any;
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
            <strong className={`font-bold`}>Topic:</strong>&nbsp;
            {breadcrumb.map((item: any) =>
              item.current ? (
                <span key={item.id}>{item.name}</span>
              ) : (
                <React.Fragment key={item.id}>
                  <Link href={`/topic/${item.slug}`}>{item.name}</Link>
                  <svg
                    viewBox="0 0 24 24"
                    width={16}
                    height={16}
                    className={`relative bottom-[2px] mx-0.5 inline-block fill-current opacity-50`}
                  >
                    <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
                  </svg>
                </React.Fragment>
              ),
            )}
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
  const res = await fetch(`${process.env.NEXT_PUBLIC_WORDPRESS_HOST}/api/wp/v2/categories`);
  const topics = await res.json();

  const paths = topics.map((topic: any) => ({
    params: { slug: topic.slug },
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
  const [options, allPostsData, topic] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_WORDPRESS_HOST}/api`).then((res) => res.json()),
    fetchPosts(
      `${process.env.NEXT_PUBLIC_WORDPRESS_HOST}/api/wp/v2/posts?per_page=8&page=1&filter[taxonomy]=category&filter[term]=${params.slug}`,
    ),
    fetch(
      `${process.env.NEXT_PUBLIC_WORDPRESS_HOST}/api/wp/v2/categories?slug=${params.slug}&_embed`,
    ).then((res) => res.json()),
  ]);

  const [breadcrumb] = await Promise.all([
    fetch(
      `${process.env.NEXT_PUBLIC_WORDPRESS_HOST}/api/wp/v2/term/category/${topic[0].id}`,
    ).then((res) => res.json()),
  ]);

  const allPosts = allPostsData.posts;
  const totalPages = allPostsData.totalPages;

  const head = await fetch(
    `${process.env.NEXT_PUBLIC_WORDPRESS_HOST}/api/wp/v2/head/${encodeURIComponent(`${process.env.NEXT_PUBLIC_WORDPRESS_HOST}/topic/${params.slug}/`)}`,
  ).then((res) => res.json());

  return {
    props: {
      options,
      allPosts,
      totalPages,
      topic,
      breadcrumb,
      head,
    },
    revalidate: 3600,
  };
}

export default Topic;
