import React, { useState, useEffect } from "react";
import Link from "next/link";

import Image from "@/components/Image";
import PostNoBanner from "@/components/postNoBanner";
import Blocks from "@/components/blocks";
import Footer from "@/components/footer";

function SinglePage({
  post,
  latestPosts,
  options,
}: {
  post: any;
  latestPosts: any;
  options: any;
}) {
  const [isVisible, setIsVisible] = useState(false);

  const handleResize = () => {
    const windowHeight =
      "innerHeight" in window
        ? window.innerHeight
        : document.documentElement.offsetHeight;
    const docHeight = Math.max(
      document.body.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.clientHeight,
      document.documentElement.scrollHeight,
      document.documentElement.offsetHeight,
    );

    // Show the button when the document height is greater than the viewport height
    setIsVisible(docHeight > windowHeight);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    // Attach the resize event listener when the component mounts
    window.addEventListener("resize", handleResize);

    // Trigger the initial check
    handleResize();

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <section
      id={`content`}
      className={`single-post flex w-full flex-col bg-amber-50`}
    >
      <React.Fragment key={post.slug}>
        <PostNoBanner key={post.slug} data={post} single={true} />
        <div
            className={`post-content bar-left/50 relative flex w-full grow flex-col before:w-[48px] xl:before:w-[64px] 2xl:flex-row`}
        >
          <div
              className={`prose prose-lg ml-[72px] mr-6 max-w-full py-8 prose-strong:font-sans xl:ml-[96px] xl:mr-0 xl:w-2/3`}
          >
            <div id={`intro`}></div>
            <Blocks data={post.blocks}/>
          </div>
          <aside
              className={`sidebar ml-[48px] flex flex-col gap-12 px-6 py-8 xl:ml-0 xl:w-1/3 xl:px-10`}
          >
            <div
                className={`author-card relative inline-block before:hidden xl:sticky xl:ml-auto xl:w-4/5 xl:before:block`}
            >
              <Image
                  source={[
                    {
                      url: post._embedded.author[0].avatar_urls[96].replace("-96x96", ""),
                      params: {
                        cover: [74, 74]
                      }
                    }
                  ]}
                  imgClass="float-right mb-1.5 ml-4 rounded-md"
              />
              <div>
                <h2
                    className={`mb-2 flex flex-col font-sans text-sm font-semibold uppercase`}
                >
                  <span className={`opacity-50`}>About</span>
                  {post._embedded.author[0].name}
                </h2>
                <p
                    className={`text-[0.85rem] italic`}
                    dangerouslySetInnerHTML={{
                      __html: post._embedded.author[0].description,
                    }}
                ></p>
                <ul
                    className={`mb-6 mt-2 flex list-none flex-row gap-2.5 xl:mb-0`}
                >
                  <li>
                    <Link
                        href={`/writer/${post._embedded.author[0].slug}`}
                        className={`inline-link font-sans text-sm`}
                    >
                      View all entries
                    </Link>
                  </li>
                  {post._embedded.author[0].acf.page_link && (
                      <li>
                        <a
                            href={post._embedded.author[0].acf.page_link.url}
                            target={
                              post._embedded.author[0].acf.page_link.url
                                  ? "_blank"
                                  : post._embedded.author[0].acf.page_link.url
                            }
                            className={`inline-link font-sans text-sm`}
                        >
                          {post._embedded.author[0].acf.page_link.title}
                        </a>
                      </li>
                  )}
                </ul>
              </div>
            </div>
            <div className={`inline-block xl:ml-auto xl:w-4/5`}>
              <h2
                  className={`mb-2 flex flex-col font-sans text-sm font-semibold uppercase`}
              >
                Latest
              </h2>
              <ul className={`flex flex-col gap-1.5`}>
                {latestPosts.map((post: any) => {
                  return (
                      <li key={post.id}>
                        <Link
                            href={`/${post.slug}`}
                            className={`inline border-b border-b-transparent font-sans text-sm transition-colors hover:border-b-bright-sun-500`}
                            dangerouslySetInnerHTML={{
                              __html: post.title.rendered,
                            }}
                        ></Link>
                      </li>
                  );
                })}
              </ul>
            </div>
          </aside>
        </div>
      </React.Fragment>

      <Footer
        loadMore={
          isVisible && (
            <button
              className={`inline-link hidden! p-0! uppercase lg:inline-block!`}
              onClick={scrollToTop}
            >
              <span className={`relative`}>Back to top</span>
              <svg
                className={`relative bottom-px ml-0.5 inline fill-black`}
                width={16}
                height={16}
                viewBox="0 0 24 24"
              >
                <path d="M7.41,15.41L12,10.83L16.59,15.41L18,14L12,8L6,14L7.41,15.41Z" />
              </svg>
            </button>
          )
        }
        options={options}
      />
    </section>
  );
}

export default SinglePage;
