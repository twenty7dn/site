import React, { useState, useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";

import PostNoBanner from "@/components/postNoBanner";
import Blocks from "@/components/blocks";
import Footer from "@/components/footer";

function SinglePage({ post, latestPosts, options }: { post: any, latestPosts: any, options: any }) {
    const [isVisible, setIsVisible] = useState(false);

    const handleResize = () => {
        const windowHeight = 'innerHeight' in window ? window.innerHeight : document.documentElement.offsetHeight;
        const docHeight = Math.max(
            document.body.scrollHeight,
            document.body.offsetHeight,
            document.documentElement.clientHeight,
            document.documentElement.scrollHeight,
            document.documentElement.offsetHeight
        );

        // Show the button when the document height is greater than the viewport height
        setIsVisible(docHeight > windowHeight);
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    useEffect(() => {
        // Attach the resize event listener when the component mounts
        window.addEventListener('resize', handleResize);

        // Trigger the initial check
        handleResize();

        // Clean up the event listener when the component unmounts
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <section id={`content`} className={`single-post flex flex-col w-full bg-amber-50`}>
            {post.map((post: any) => {
                return (
                    <React.Fragment key={post.id}>
                        <PostNoBanner key={post.id} data={post} single={true} />
                        <div
                            className={`post-content relative w-full flex flex-col xl:flex-row flex-grow bar-left/50 before:w-[48px] xl:before:w-[64px]`}
                        >
                            <div
                                className={`prose prose-lg prose-strong:font-sans xl:w-2/3 max-w-full py-8 ml-[72px] xl:ml-[96px] mr-6 xl:mr-0`}
                            >
                                <Blocks data={post.blocks}/>
                            </div>
                            <aside className={`sidebar flex flex-col gap-12 xl:w-1/3 py-8 px-6 xl:px-10 ml-[48px] xl:ml-0`}>
                                <div className={`author-card inline-block xl:w-4/5 xl:ml-auto relative xl:sticky before:hidden xl:before:block`}>
                                    <div>
                                        <Image
                                            alt={post._embedded.author[0].name}
                                            src={post._embedded.author[0].avatar_urls[96].replace('-96x96', '')}
                                            width={74}
                                            height={74}
                                            className={`rounded-md ml-4 mb-1.5 float-right`}
                                        />
                                    </div>
                                    <div>
                                        <h2
                                            className={`flex flex-col text-sm mb-2 uppercase font-semibold font-sans`}
                                        >
                                                <span
                                                    className={`opacity-50`}
                                                >
                                                    About
                                                </span>
                                            {post._embedded.author[0].name}
                                        </h2>
                                        <p
                                            className={`text-[0.85rem] italic`}
                                            dangerouslySetInnerHTML={{ __html: post._embedded.author[0].description }}
                                        >
                                        </p>
                                        <ul className={`flex flex-row mt-2 gap-2.5 mb-6 xl:mb-0 list-none`}>
                                            <li>
                                                <Link
                                                    href={`/writer/${post._embedded.author[0].slug}`}
                                                    className={`inline-link text-sm font-sans`}
                                                >
                                                    View all entries
                                                </Link>
                                            </li>
                                            {post._embedded.author[0].acf.page_link && (
                                                <li>
                                                    <a
                                                        href={post._embedded.author[0].acf.page_link.url}
                                                        target={post._embedded.author[0].acf.page_link.url ? '_blank' : post._embedded.author[0].acf.page_link.url}
                                                        className={`inline-link text-sm font-sans`}
                                                    >
                                                        {post._embedded.author[0].acf.page_link.title}
                                                    </a>
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                                <div className={`inline-block xl:w-4/5 xl:ml-auto`}>
                                    <h2
                                        className={`flex flex-col text-sm mb-2 uppercase font-semibold font-sans`}
                                    >
                                        Latest
                                    </h2>
                                    <ul
                                        className={`flex flex-col gap-1.5`}
                                    >
                                        {latestPosts.map((post: any) => {
                                            return (
                                                <li
                                                    key={post.id}
                                                >
                                                    <Link
                                                        href={`/${post.slug}`}
                                                        className={`inline-block text-sm border-b border-b-transparent hover:border-b-bright-sun-500 transition-colors font-sans`}
                                                        dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                                                    >
                                                    </Link>
                                                </li>
                                            )
                                        })}
                                    </ul>
                                </div>
                            </aside>
                        </div>
                    </React.Fragment>
                );
            })}

            <Footer loadMore={(
                isVisible && (
                    <button className={`inline-link !hidden lg:!inline-block !p-0 uppercase`} onClick={scrollToTop}>
                        <span className={`relative`}>Back to top</span>
                        <svg className={`relative bottom-px inline fill-black ml-0.5`} width={16} height={16} viewBox="0 0 24 24"><path d="M7.41,15.41L12,10.83L16.59,15.41L18,14L12,8L6,14L7.41,15.41Z" /></svg>
                    </button>
                )
            )} options={options}/>
        </section>
    );
}

export default SinglePage;
