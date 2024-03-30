import parse from "html-react-parser";
import React from "react";

import Header from "@/components/header";
import PostList from "@/components/postList";
import WpImage from "@/components/WpImage";

function Writer({
  menu,
  options,
  latestPosts,
  allPosts,
  totalPages,
  writer,
  head,
}: {
  menu: any;
  options: any;
  latestPosts: any;
  allPosts: any;
  totalPages: number;
  writer: any;
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
      </main>
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
  const resMenuIDs = await fetch(
    `${process.env.WORDPRESS_HOST}/api/wp/v2/menu/`,
  );
  const menus = await resMenuIDs.json();

  // Fetch Stuff
  const [menu, options, latestPosts, allPostsData, writer] = await Promise.all([
    fetch(
      `${process.env.WORDPRESS_HOST}/api/wp/v2/menu/${menus?.primary}`,
    ).then((res) => res.json()),
    fetch(`${process.env.WORDPRESS_HOST}/api`).then((res) => res.json()),
    fetch(`${process.env.WORDPRESS_HOST}/api/wp/v2/posts?per_page=5`).then(
      (res) => res.json(),
    ),
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
      menu,
      options,
      latestPosts,
      allPosts,
      totalPages,
      writer,
      head,
    },
    revalidate: 3600,
  };
}

export default Writer;
