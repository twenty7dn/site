import parse from "html-react-parser";
import React from "react";

import Header from "@/components/header";
import PostList from "@/components/postList";
import WpImage from "@/components/WpImage";

function Search({
  menu,
  options,
  latestPosts,
  allPosts,
  query,
  pageNumber,
  totalPages,
  head,
}: {
  menu: any;
  options: any;
  latestPosts: any;
  allPosts: any;
  query: string;
  pageNumber: number;
  totalPages: number;
  head: any;
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
      <head>{parse(head.head + options.site_favicon)}</head>
      <WpImage
        alt={options.name}
        url={options.site_background_url}
        src={{
          "(max-width: 960px)": [
            {
              width: 1080,
              height: 1920,
            },
          ],
          "(min-width: 961px)": [
            {
              width: 1920,
              height: 1080,
            },
          ],
        }}
        focalPoint={[50, 50]}
        className={`fixed inset-0 -z-10 h-screen w-screen object-cover opacity-75`}
      />
      <main className={`flex max-w-[1920px] flex-col font-serif lg:flex-row`}>
        <Header menu={menu} options={options} latestPosts={latestPosts} />
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
          options={options}
          pageNumber={pageNumber}
          totalPages={totalPages}
        />
      </main>
    </>
  );
}

const fetchPosts = async (url: string) => {
  const response = (await fetch(url)) as any;
  const totalPages = parseInt(response.headers.get("X-WP-TotalPages"), 10);
  const posts = await response.json();
  return { posts, totalPages };
};

export async function getServerSideProps(context: any) {
  // Extracting query parameters
  const { query, page = "1" } = context.query;
  const pageNumber = parseInt(page, 10) || 1;

  const resMenuIDs = await fetch(
    `${process.env.WORDPRESS_HOST}/api/wp/v2/menu/`,
  );
  const menus = await resMenuIDs.json();

  // Fetch Stuff
  const [menu, options, latestPosts, allPostsData] = await Promise.all([
    fetch(
      `${process.env.WORDPRESS_HOST}/api/wp/v2/menu/${menus?.primary}`,
    ).then((res) => res.json()),
    fetch(`${process.env.WORDPRESS_HOST}/api`).then((res) => res.json()),
    fetch(`${process.env.WORDPRESS_HOST}/api/wp/v2/posts?per_page=5`).then(
      (res) => res.json(),
    ),
    // Fetch posts based on the search query
    fetchPosts(
      `${process.env.WORDPRESS_HOST}/api/wp/v2/search?per_page=8&page=1&search=${query}&_embed`,
    ),
  ]);

  const allPosts = allPostsData.posts;
  const totalPages = allPostsData.totalPages;

  const head = await fetch(
    `${process.env.WORDPRESS_HOST}/api/wp/v2/head/${encodeURIComponent(`${process.env.WORDPRESS_HOST}/search/${query}/`)}`,
  ).then((res) => res.json());

  return {
    props: {
      menu,
      options,
      latestPosts,
      allPosts,
      query,
      pageNumber,
      totalPages,
      head,
    },
  };
}

export default Search;
