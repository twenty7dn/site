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
            <SinglePost
                post={currentPost}
                latestPosts={latestPostsAside}
                options={options}
            />
        </>
    );
}

export async function getStaticPaths() {
    const [posts] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_WORDPRESS_API}/post`).then((res) =>
            res.json(),
        ),
    ]);

    const allPosts = [...posts];

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
        const [options, currentPost, latestPostsAside] = await Promise.all([
            fetch(`${process.env.NEXT_PUBLIC_WORDPRESS_API}/meta`).then((res) => res.json()),
            fetch(
                `${process.env.NEXT_PUBLIC_WORDPRESS_API}/post/${params.slug}`,
            ).then((res) => res.json()),
            fetch(
                `${process.env.NEXT_PUBLIC_WORDPRESS_API}/post?per_page=3`,
            ).then((res) => res.json()),
        ]);

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
