import Head from 'next/head';
import parse from "html-react-parser";
import React from "react";
import dynamic from 'next/dynamic';

import Header from "@/components/header";
import Footer from "@/components/footer";

const WpImage = dynamic(() => import('@/components/WpImage'), { ssr: true });

function Writer({menu, options, latestPosts, head}: {menu: any, options: any, latestPosts: any, head: any}) {
    return (
        <>
            <Head>
                {parse(head.head + options.site_favicon)}
            </Head>
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
                <Header menu={menu} options={options} latestPosts={latestPosts}/>
                <section id={`content`}
                         className={`post-list relative flex flex-col w-full min-h-screen bg-amber-50 bar-left/50 before:w-[48px] xl:before:w-[64px]`}>
                    <section
                        className={`relative post flex flex-col [&>hr]:first-of-type:hidden [&_header]:first-of-type:mt-24 bar-left/50 before:w-[48px] xl:before:w-[64px] bg-amber-50 z-10`}
                    >
                        <hr className={`border-t-0 border-b-2 border-b-black/10 ml-[48px] xl:ml-[64px]`}/>
                        <header
                            className={`relative !mt-48`}
                        >
                            <svg viewBox="0 0 24 24" width={20} height={20}
                                 className={`absolute inset-0 top-auto mb-10 mx-[14px] xl:mx-[22px] fill-current z-30`}>
                                <path
                                    d="M11,15H13V17H11V15M11,7H13V13H11V7M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20Z"/>
                            </svg>
                            <div
                                className={`ml-[72px] xl:ml-[96px] mr-6 opacity-75`}
                            >
                                <span
                                    className={`post-link text-2xl xl:text-4xl font-sans leading-tight pointer-events-none`}
                                >
                                        <span className={`pointer-events-auto max-w-max`}>
                                            Page Not Found
                                        </span>
                                        <span
                                            className={`block text-lg xl:text-2xl !italic font-serif pointer-events-auto max-w-max`}>
                                            HTTP Error 404
                                        </span>
                                    </span>
                            </div>
                            <hr className={`mt-8 border-t-0 border-b-2 border-b-black/10 ml-[48px] xl:ml-[64px]`}/>
                        </header>
                    </section>
                    <Footer loadMore={``} options={options}/>
                </section>
            </main>
        </>
    )
}

export async function getStaticProps() {
    const resMenuIDs = await fetch(`${process.env.WORDPRESS_HOST}/api/wp/v2/menu/`);
    const menus = await resMenuIDs.json();

    // Fetch Stuff
    const [menu, options, latestPosts] = await Promise.all([
        fetch(`${process.env.WORDPRESS_HOST}/api/wp/v2/menu/${menus?.primary}`).then(res => res.json()),
        fetch(`${process.env.WORDPRESS_HOST}/api`).then(res => res.json()),
        fetch(`${process.env.WORDPRESS_HOST}/api/wp/v2/posts?per_page=5`).then(res => res.json())
    ]);

    const head = await fetch(`${process.env.WORDPRESS_HOST}/api/wp/v2/head/${encodeURIComponent(`${process.env.WORDPRESS_HOST}/404/`)}`).then(res => res.json());

    return {
        props: {
            menu,
            options,
            latestPosts,
            head
        },
        revalidate: 3600,
    };
}

export default Writer;