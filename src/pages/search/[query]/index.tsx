import Head from "next/head";
import parse from "html-react-parser";
import React, { useEffect } from "react";

import PostList from "@/components/postList";

function Search({
  options,
  allPosts,
  totalPages,
  head,
  query,
}: {
  options: any;
  allPosts: any;
  totalPages: number;
  head: any;
  query: string;
}) {
  let transformedData: any = [];

  allPosts.map((post: any) => {
    if (post._embedded && post._embedded.self && post._embedded.self[0]) {
      transformedData.push({
        id: post._embedded.self[0].id,
        date: post._embedded.self[0].date,
        title: post._embedded.self[0].title,
        slug: post._embedded.self[0].slug,
        type: post.type,
        description: post._embedded.self[0].description,
        featured_media: post._embedded.self[0].featured_media,
      });
    } else {
      // Log the structure of the problematic post
      console.error("Invalid post structure:", post);
    }
  });

  return (
    <>
      <Head>{parse(head.head + options.favicon_html)}</Head>
      <PostList
        allPosts={transformedData}
        header={
          <div
            className={`text-md relative z-10 border-b border-b-black/10 bg-amber-50 px-8 py-6 font-sans uppercase tracking-widest`}
          >
            Your search for{" "}
            <strong className={`font-bold`}>{query.replace("+", " ")}</strong>{" "}
            returned{" "}
            <strong className={`font-bold`}>
              {allPosts.length} {allPosts.length === 1 ? "result" : "results"}
            </strong>
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

export async function getServerSideProps({ params }: any) {
  // Fetch Stuff
  const [options, allPostsData] = await Promise.all([
    fetch(`${process.env.WORDPRESS_HOST}/api`).then((res) => res.json()),
    // Fetch posts based on the search query
    fetchPosts(
      `${process.env.WORDPRESS_HOST}/api/wp/v2/search?per_page=8&page=1&search=${params.query}&_embed`,
    ),
  ]);

  const allPosts = allPostsData.posts;
  const totalPages = allPostsData.totalPages;

  const head = await fetch(
    `${process.env.WORDPRESS_HOST}/api/wp/v2/head/${encodeURIComponent(`${process.env.WORDPRESS_HOST}/search/${params.query}/`)}`,
  ).then((res) => res.json());

  return {
    props: {
      options,
      allPosts,
      totalPages,
      head,
      query: params.query, // Pass the query parameter to the component
    },
  };
}

export default Search;
