import Head from "next/head";
import parse from 'html-react-parser';
import React from "react";
import dynamic from "next/dynamic";

import SinglePost from "@/components/singlePost";
import SinglePage from "@/components/singlePage";
import Header from "@/components/header";

const WpImage = dynamic(() => import('@/components/WpImage'), { ssr: true });
export default function PostPage({menu, options, latestPosts, currentPost, latestPostsAside, head}: {menu: any, options: any, latestPosts: any, currentPost: any, latestPostsAside: any, head: any}) {
    return (
        <>
            <WpImage
                alt={options.name}
                url={options.site_background_url}
                src={{
                    '(max-width: 960px)': [
                        {
                            width: 1080,
                            height: 1920
                        }
                    ],
                    '(min-width: 961px)': [
                        {
                            width: 1920,
                            height: 1080
                        }
                    ]
                }}
                focalPoint={[50,50]}
                className={`fixed inset-0 w-screen h-screen object-cover opacity-75 -z-10`}
            />
            <main className={`flex flex-col lg:flex-row max-w-[1920px] font-serif`}>
                <Header menu={menu} options={options} latestPosts={latestPosts} />
                {currentPost[0].type === 'post' ? (
                    <SinglePost post={currentPost} latestPosts={latestPostsAside} options={options} />
                ) : (
                    <SinglePage post={currentPost} latestPosts={latestPostsAside} options={options} />
                )}
            </main>
        </>
    )
}

export async function getStaticPaths() {
    const [posts, pages] = await Promise.all([
        fetch(`${process.env.WORDPRESS_HOST}/api/wp/v2/posts`).then(res => res.json()),
        fetch(`${process.env.WORDPRESS_HOST}/api/wp/v2/pages`).then(res => res.json()),
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
        const resMenuIDs = await fetch(`${process.env.WORDPRESS_HOST}/api/wp/v2/menu/`);
        const menus = await resMenuIDs.json();

        // Fetch Stuff
        const [menu, options, latestPosts, currentPosts, currentPages] = await Promise.all([
            fetch(`${process.env.WORDPRESS_HOST}/api/wp/v2/menu/${menus?.primary}`).then(res => res.json()),
            fetch(`${process.env.WORDPRESS_HOST}/api`).then(res => res.json()),
            fetch(`${process.env.WORDPRESS_HOST}/api/wp/v2/posts?per_page=5`).then(res => res.json()),
            fetch(`${process.env.WORDPRESS_HOST}/api/wp/v2/posts?slug=${params.slug}&per_page=1&_embed`).then(res => res.json()),
            fetch(`${process.env.WORDPRESS_HOST}/api/wp/v2/pages?slug=${params.slug}&per_page=1&_embed`).then(res => res.json()),
        ]);

        const currentPost = [...currentPosts, ...currentPages];
        const latestPostsAside = await fetch(`${process.env.WORDPRESS_HOST}/api/wp/v2/posts?per_page=3`).then(res => res.json());

        const head = await fetch(`${process.env.WORDPRESS_HOST}/api/wp/v2/head/${encodeURIComponent(`${process.env.WORDPRESS_HOST}/${params.slug}/`)}`).then(res => res.json());

        return {
            props: {
                menu,
                options,
                latestPosts,
                currentPost,
                latestPostsAside,
                head
            },
            revalidate: 3600,
        };
    } catch (error) {
        console.error("Error fetching data:", error);
        return {
            props: {
                menu: null,
                options: null,
                latestPosts: null,
                allPosts: null
            },
            revalidate: 3600,
        };
    }
}