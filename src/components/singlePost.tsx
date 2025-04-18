import React, { useState, useEffect } from "react";
import Link from "next/link";
import Tippy, { useSingleton } from "@tippyjs/react";
import { animateFill, sticky } from "tippy.js";
import parse, { domToReact } from "html-react-parser";
import "tippy.js/dist/tippy.css";
import "tippy.js/dist/backdrop.css";
import "tippy.js/animations/shift-away.css";

import Post from "@/components/post";
import PostNoBanner from "@/components/postNoBanner";
import Blocks from "@/components/blocks";
import Footer from "@/components/footer";
import Image from "@/components/Image";
import Button from "@/components/Button";

function SinglePost({
  post,
  latestPosts,
  options,
}: {
  post: any;
  latestPosts: any;
  options: any;
}) {
  const [isVisible, setIsVisible] = useState(false);
  let [tooltipVisible, setTooltipVisible] = useState(true);
  const [tooltipData, setTooltipData] = useState<string | null>(null);

  const [sourceTopics, targetTopics] = useSingleton();
  const [sourceTags, targetTags] = useSingleton();

  console.log('DATA?:', JSON.stringify(post, null, 2));

  useEffect(() => {
    const storedTooltipData = localStorage.getItem(
      `authorTooltip${post.author.name}`,
    );
    setTooltipData(storedTooltipData);

    setTimeout(() => {
      setTooltipVisible(false);
    }, post.author.link.tooltip.duration);
  }, [post]);

  useEffect(() => {
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

      setIsVisible(docHeight > windowHeight);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleLinkClick = (authorId: number, tooltipContent: any) => {
    localStorage.setItem(
      `authorTooltip${authorId}`,
      JSON.stringify(tooltipContent),
    );
    setTooltipVisible(false);
  };

  if (
    JSON.stringify([
      `${post.author.link.tooltip.content}`,
      `${post.author.link.url}`,
    ]) === tooltipData
  ) {
    tooltipVisible = false;
  }

  useEffect(() => {
    const SmoothScroll = require("smooth-scroll");
    new SmoothScroll('a[href*="#"], #totop', {
      speed: 500,
      speedAsDuration: true,
      updateURL: false,
      offset: (anchor: any, toggle: any) => {
        // Apply offset only for anchor tags that are not #totop
        return toggle.getAttribute("href") !== "#" ? 16 : 0;
      },
    });
  }, []);

  let toc: any;

  if (post?.toc_content?.length > 0) {
    const options: any = {
      replace: ({
        name,
        attribs,
        children,
      }: {
        name: any;
        attribs: any;
        children: any;
      }) => {
        if (name) {
          if (name === "a") {
            return (
              <a
                {...attribs}
                className={`inline border-b border-b-transparent font-sans text-sm transition-colors hover:border-b-bright-sun-500`}
              >
                {domToReact(children)}
              </a>
            );
          }
        }
      },
    };

    toc = parse(post?.toc_content, options);
  }

  return (
    <section
      id={`content`}
      className={`single-post flex w-full flex-col bg-amber-50`}
    >
      { post.cover ? (
        <React.Fragment key={post.slug}>
      <Post key={post.slug} data={post} single={true} />
      <div
          className={`post-content bar-left/50 relative flex w-full grow flex-col before:w-[48px] xl:before:w-[64px] 2xl:flex-row`}
      >
        <div id={`intro`}></div>
        <div
            className={`prose-dropcap prose prose-lg ml-[72px] mr-6 max-w-full py-8 prose-strong:font-sans xl:ml-[96px] 2xl:mr-0 2xl:w-2/3`}
        >
          <Blocks data={post.content.blocks}/>
        </div>
        <aside
            className={`sidebar ml-[48px] xl:ml-[72px] flex flex-col gap-12 px-6 py-8 2xl:ml-0 2xl:w-1/3 2xl:px-10`}
        >
          <div className={`author-card inline-block 2xl:ml-auto 2xl:w-4/5 2xl:sticky 2xl:before:block`}>
            <div
                className={`before:hidden mb-4`}
            >
              <div>
                <Image
                    source={[
                      {
                        url: post.author.avatar.source.encrypted,
                        params: {
                          cover: [74, 74]
                        }
                      }
                    ]}
                    imgClass="float-right mb-1.5 ml-4 rounded-md"
                />
              </div>
              <div>
                <h2
                    className={`mb-2 flex flex-col font-sans text-sm font-semibold uppercase`}
                >
                  <span className={`opacity-50`}>About</span>
                  {post.author.name}
                </h2>
                <p
                    className={`text-[0.85rem] italic`}
                    dangerouslySetInnerHTML={{
                      __html: post.author.bio,
                    }}
                ></p>
                <ul className={`mb-6 mt-2 list-none xl:mb-0`}>
                  <li className={`mr-2.5 inline-block`}>
                    <Link
                        href={`/author/${post.author.slug}`}
                        className={`inline-link font-sans text-sm`}
                    >
                      View all entries
                    </Link>
                  </li>
                  {post.author.link.url &&
                      post.author.link.tooltip && (
                          <li className={`inline-block`}>
                            <Tippy
                                content={
                                  post.author.link.tooltip.content
                                }
                                className={`tooltip-br`}
                                allowHTML={true}
                                placement={"bottom-end"}
                                offset={[0, 0]}
                                sticky={true}
                                hideOnClick={`toggle`}
                                trigger={`manual`}
                                arrow={true}
                                inertia={true}
                                showOnCreate={true}
                                plugins={[sticky]}
                                visible={tooltipVisible}
                                popperOptions={{
                                  strategy: "fixed",
                                }}
                            >
                              <a
                                  onClick={() =>
                                      handleLinkClick(
                                          post.author.slug,
                                          [
                                            `${post.author.link.tooltip.content}`,
                                            `${post.author.link.url}`,
                                          ],
                                      )
                                  }
                                  href={
                                    post.author.link.url
                                  }
                                  target={'_blank'}
                                  className={`inline-link font-sans text-sm`}
                              >
                                {post.author.link.label}
                              </a>
                            </Tippy>
                          </li>
                      )}
                  {post.author.link &&
                      !post.author.link.tooltip && (
                          <li className={`inline-block`}>
                            <a
                                href={
                                  post.author.link.url
                                }
                                target={'_blank'}
                                className={`inline-link font-sans text-sm`}
                            >
                              {post.author.link.label}
                            </a>
                          </li>
                      )}
                </ul>
              </div>
            </div>
            {toc && (
                <div
                    className={`toc mt-8 hidden bg-amber-50 before:hidden 2xl:inline-block 2xl:before:block`}
                >
                  <h2
                      className={`mb-2 flex flex-col font-sans text-sm font-semibold uppercase`}
                  >
                    Contents
                  </h2>
                  <a href="#intro"
                     className="inline border-b border-b-transparent font-sans text-sm transition-colors hover:border-b-bright-sun-500">
                    Introduction
                  </a>
                  {toc}
                </div>
            )}
          </div>
          <div className={`inline-block 2xl:ml-auto 2xl:w-4/5`}>
            <h2
                className={`mb-2 flex flex-col font-sans text-sm font-semibold uppercase`}
            >
              Topics
            </h2>
            <div>
              <Tippy singleton={sourceTopics}
                     sticky={true}
                     hideOnClick={true}
                     placement={"bottom"}
                     offset={[0, 2]}
                     arrow={false}
                     className={"scale-90"}
                     animateFill={true}
                     plugins={[animateFill]}
                     moveTransition="transform 0.25s ease-in-out"
              />
              {post.terms.topics.map((topic: any) => {
                return (
                    <Tippy
                        key={topic.slug}
                        singleton={targetTopics}
                        content={`${topic.label} (${topic.count})`}
                    >
                      <Button
                          variant="primary"
                          size="small"
                          key={topic.id}
                          href={`/topic/${topic.slug}`}
                          className={`inline-block text-stone-950 uppercase`}
                      >
                        {topic.label}
                      </Button>
                    </Tippy>
                );
              })}
            </div>
          </div>
          {post.terms.tags.length > 0 && (
              <div className={`inline-block 2xl:ml-auto 2xl:w-4/5`}>
                <h2
                    className={`mb-2 flex flex-col font-sans text-sm font-semibold uppercase px-1 lg:px-2`}
                >
                  Tags
                </h2>
                <div>
                  <Tippy singleton={sourceTags}
                         sticky={true}
                         hideOnClick={true}
                         placement={"bottom"}
                         offset={[0, 2]}
                         arrow={false}
                         className={"scale-90"}
                         animateFill={true}
                         plugins={[animateFill]}
                         moveTransition="transform 0.25s ease-in-out"
                  />
                  {post.terms.tags.map((tag: any) => {
                    return (
                        <Tippy
                            key={tag.id}
                            singleton={targetTags}
                            content={`${tag.name} (${tag.count})`}
                        >
                          <Button
                              variant="primary"
                              size="small"
                              key={tag.slug}
                              href={`/tag/${tag.slug}`}
                              className={`inline-block text-stone-950 uppercase`}
                          >
                            {tag.label}
                          </Button>
                        </Tippy>
                    );
                  })}
                </div>
              </div>
          )}
          <div className={`inline-block 2xl:ml-auto 2xl:w-4/5`}>
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
  ) : (
        <React.Fragment key={post.id}>
          <PostNoBanner key={post.id} data={post} single={true} />
          <div
              className={`post-content bar-left/50 relative flex w-full grow flex-col before:w-[48px] xl:before:w-[64px] 2xl:flex-row`}
          >
            <div id={`intro`}></div>
            <div
                className={`prose-dropcap prose prose-lg ml-[72px] mr-6 max-w-full py-8 prose-strong:font-sans xl:ml-[96px] 2xl:mr-0 2xl:w-2/3`}
            >
              <Blocks data={post.blocks}/>
            </div>
            <aside
                className={`sidebar ml-[48px] xl:ml-[72px] flex flex-col gap-12 px-6 py-8 2xl:ml-0 2xl:w-1/3 2xl:px-10`}
            >
              <div className={`author-card inline-block 2xl:ml-auto 2xl:w-4/5 2xl:sticky 2xl:before:block`}>
                <div
                    className={`before:hidden mb-4`}
                >
                  <div>
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
                  </div>
                  <div>
                    <h2
                        className={`mb-2 flex flex-col font-sans text-sm font-semibold uppercase`}
                    >
                      <span className={`opacity-50`}>About</span>
                      {post.author.name}
                    </h2>
                    <p
                        className={`text-[0.85rem] italic`}
                        dangerouslySetInnerHTML={{
                          __html: post.author.bio,
                        }}
                    ></p>
                    <ul className={`mb-6 mt-2 list-none xl:mb-0`}>
                      <li className={`mr-2.5 inline-block`}>
                        <Link
                            href={`/author/${post.slug}`}
                            className={`inline-link font-sans text-sm`}
                        >
                          View all entries
                        </Link>
                      </li>
                      {post.author.link &&
                          post.author.link.tooltip && (
                              <li className={`inline-block`}>
                                <Tippy
                                    content={
                                      post.author.link.tooltip.content
                                    }
                                    className={`tooltip-br`}
                                    allowHTML={true}
                                    placement={"bottom-end"}
                                    offset={[0, 0]}
                                    sticky={true}
                                    hideOnClick={`toggle`}
                                    trigger={`manual`}
                                    arrow={true}
                                    inertia={true}
                                    showOnCreate={true}
                                    plugins={[sticky]}
                                    visible={tooltipVisible}
                                    popperOptions={{
                                      strategy: "fixed",
                                    }}
                                >
                                  <a
                                      onClick={() =>
                                          handleLinkClick(
                                              post._embedded.author[0].id,
                                              [
                                                `${post.author.link.tooltip.content}`,
                                                `${post.author.link.url}`,
                                              ],
                                          )
                                      }
                                      href={
                                        post.author.link.url
                                      }
                                      target={'_blank'}
                                      className={`inline-link font-sans text-sm`}
                                  >
                                    {post.author.link.label}
                                  </a>
                                </Tippy>
                              </li>
                          )}
                      {post.author.link &&
                          !post.author.link.tooltip && (
                              <li className={`inline-block`}>
                                <a
                                    href={
                                      post.author.link.url
                                    }
                                    target={'_blank'}
                                    className={`inline-link font-sans text-sm`}
                                >
                                  {post.author.link.label}
                                </a>
                              </li>
                          )}
                    </ul>
                  </div>
                </div>
                {toc && (
                    <div
                        className={`toc mt-8 hidden bg-amber-50 before:hidden 2xl:inline-block 2xl:before:block`}
                    >
                      <h2
                          className={`mb-2 flex flex-col font-sans text-sm font-semibold uppercase`}
                      >
                        Contents
                      </h2>
                      <a href="#intro"
                         className="inline border-b border-b-transparent font-sans text-sm transition-colors hover:border-b-bright-sun-500">
                        Introduction
                      </a>
                      {toc}
                    </div>
                )}
              </div>
              <div className={`inline-block 2xl:ml-auto 2xl:w-4/5`}>
                <h2
                    className={`mb-2 flex flex-col font-sans text-sm font-semibold uppercase`}
                >
                  Topics
                </h2>
                <div>
                  <Tippy singleton={sourceTopics}
                         sticky={true}
                         hideOnClick={true}
                         placement={"bottom"}
                         offset={[0, 2]}
                         arrow={false}
                         className={"scale-90"}
                         animateFill={true}
                         plugins={[animateFill]}
                         moveTransition="transform 0.25s ease-in-out"
                  />
                  {post.terms.topics.map((topic: any) => {
                    return (
                        <Tippy
                            key={topic.id}
                            singleton={targetTopics}
                            content={`${topic.name} (${topic.count})`}
                        >
                          <Link
                              key={topic.id}
                              href={`/topic/${topic.slug}`}
                              className={`inline-btn font-sans font-semibold uppercase`}
                          >
                            {topic.name}
                          </Link>
                        </Tippy>
                    );
                  })}
                </div>
              </div>
              {post.terms.tags.length > 0 && (
                  <div className={`inline-block 2xl:ml-auto 2xl:w-4/5`}>
                    <h2
                        className={`mb-2 flex flex-col font-sans text-sm font-semibold uppercase`}
                    >
                      Tags
                    </h2>
                    <div>
                      <Tippy singleton={sourceTags}
                             sticky={true}
                             hideOnClick={true}
                             placement={"bottom"}
                             offset={[0, 2]}
                             arrow={false}
                             className={"scale-90"}
                             animateFill={true}
                             plugins={[animateFill]}
                             moveTransition="transform 0.25s ease-in-out"
                      />
                      {post.terms.tags.map((tag: any) => {
                        return (
                            <Tippy
                                key={tag.id}
                                singleton={targetTags}
                                content={`${tag.name} (${tag.count})`}
                            >
                              <Link
                                  key={tag.id}
                                  href={`/tag/${tag.slug}`}
                                  className={`inline-btn font-sans font-semibold uppercase`}
                              >
                                {tag.name}
                              </Link>
                            </Tippy>
                        );
                      })}
                    </div>
                  </div>
              )}
              <div className={`inline-block 2xl:ml-auto 2xl:w-4/5`}>
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
    )
  }
      <Footer
          loadMore={
              isVisible && (
                  <a
                      id={`totop`}
                      href={`#`}
                      className={`inline-link hidden! p-0! uppercase lg:inline-block!`}
                  >
                    <span className={`relative`}>Back to top</span>
                    <svg
                        className={`relative bottom-px ml-0.5 inline fill-black`}
                        width={16}
                        height={16}
                        viewBox="0 0 24 24"
                    >
                      <path d="M7.41,15.41L12,10.83L16.59,15.41L18,14L12,8L6,14L7.41,15.41Z"/>
                    </svg>
                  </a>
              )
          }
          options={options}
      />
    </section>
  );
}

export default SinglePost;
