import parse from "html-react-parser";
import React from "react";

import Header from "@/components/header";
import PostList from "@/components/postList";
import WpImage from "@/components/WpImage";

function Home({
  menu,
  options,
  latestPosts,
  allPosts,
  pageNumber,
  totalPages,
  head,
}: {
  menu: any;
  options: any;
  latestPosts: any;
  allPosts: any;
  pageNumber: any;
  totalPages: number;
  head: any;
}) {
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
          allPosts={allPosts}
          header={false}
          options={options}
          pageNumber={pageNumber}
          totalPages={totalPages}
        />
      </main>
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
      menu,
      options,
      latestPosts,
      allPosts,
      pageNumber,
      totalPages,
      head,
    },
    revalidate: 3600,
  };
}

export default Home;
