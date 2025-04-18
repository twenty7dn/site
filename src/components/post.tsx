import React from "react";
import { format } from "date-fns-tz";
import Link from "next/link";
import Image from "@/components/Image";

interface PostProps {
  data: any;
  single: boolean;
}

const Post = ({ data, single }: { data: any; single: boolean }) => {
  const hasFeaturedMedia =
    data.cover && data.cover.source && data.cover.focus;

  const backgroundColor = hasFeaturedMedia
    ? data.cover.color.dark.muted
    : "transparent";

  return (
    <section className={`post relative z-10 flex flex-col bg-amber-50`}>
      <header
        className={`bar-left cover-gradient relative text-white before:w-[48px] xl:before:w-[64px]`}
        style={{ backgroundColor }}
      >
        {hasFeaturedMedia && single && (
          <>
            <Image
              source={[
                  {
                      media: "(max-width: 512px)",
                      url: data.cover.source.encrypted,
                      params: {
                          cover: [512, 360],
                          focus: data.cover.focus
                      }
                  },
                  {
                      media: "(min-width: 513px)",
                      url: data.cover.source.encrypted,
                      params: {
                          cover: [1590, 512],
                          focus: data.cover.focus
                      }
                  }
              ]}
              imgClass={`absolute inset-0 h-full w-full object-cover`}
            />

            {data.cover.credit && (
              <span
                className={`absolute bottom-1.5 right-2 z-20 hidden text-sm text-white/50 transition-colors hover:text-white xl:block [&_a]:text-white/75 [&_a]:transition-colors hover:[&_a]:text-white [&_a]:hover:text-bright-sun-400!`}
                dangerouslySetInnerHTML={{ __html: data.cover.credit }}
              ></span>
            )}
          </>
        )}
        {hasFeaturedMedia && !single && (
          <>
              <Image
                  source={[
                      {
                          media: "(max-width: 512px)",
                          url: data.cover.source.encrypted,
                          params: {
                              cover: [512, 360],
                              focus: data.cover.focus
                          }
                      },
                      {
                          media: "(min-width: 513px)",
                          url: data.cover.source.encrypted,
                          params: {
                              cover: [1590, 292],
                              focus: data.cover.focus
                          }
                      }
                  ]}
                  imgClass={`absolute inset-0 h-full w-full object-cover`}
              />
          </>
        )}
        {data.sticky ? (
          single ? (
            <svg
              viewBox="0 0 20 20"
              width={20}
              height={20}
              className={`absolute inset-0 top-auto ${data.subtitle ? "mb-9" : single ? "mb-11" : "mb-10"} z-30 mx-[14px] fill-current xl:mx-[22px]`}
            >
              <path
                d={
                  data.type === "post"
                    ? "M18 3v2H2V3h16zm-6 4v2H2V7h10zm6 0v2h-4V7h4zM8 11v2H2v-2h6zm10 0v2h-8v-2h8zm-4 4v2H2v-2h12z"
                    : "M3 1v18h14V1H3zm9 13H6v-1h6v1zm2-3H6v-1h8v1zm0-3H6V7h8v1zm0-3H6V4h8v1z"
                }
              />
            </svg>
          ) : (
            <svg
              viewBox="0 0 24 24"
              width={20}
              height={20}
              className={`absolute inset-0 top-auto ${data.subtitle ? "mb-9" : single ? "mb-11" : "mb-10"} z-30 mx-[14px] scale-125 fill-current xl:mx-[22px]`}
            >
              <path d="M16,12V4H17V2H7V4H8V12L6,14V16H11.2V22H12.8V16H18V14L16,12Z" />
            </svg>
          )
        ) : (
          <svg
            viewBox="0 0 20 20"
            width={20}
            height={20}
            className={`absolute inset-0 top-auto ${data.subtitle ? "mb-9" : single ? "mb-11" : "mb-10"} z-30 mx-[14px] fill-current xl:mx-[22px]`}
          >
            <path
              d={
                data.type === "post"
                  ? "M18 3v2H2V3h16zm-6 4v2H2V7h10zm6 0v2h-4V7h4zM8 11v2H2v-2h6zm10 0v2h-8v-2h8zm-4 4v2H2v-2h12z"
                  : "M3 1v18h14V1H3zm9 13H6v-1h6v1zm2-3H6v-1h8v1zm0-3H6V7h8v1zm0-3H6V4h8v1z"
              }
            />
          </svg>
        )}
        <div
          className={`relative ${single ? "mt-32 xl:mt-96" : "mt-32 xl:mt-48"} my-8 ml-[72px] mr-6 xl:ml-[96px] ${single ? "xl:w-2/3" : "xl:w-1/2"} z-20`}
        >
          <p className={`italic opacity-60`}>
            {format(new Date(data.date.published.raw), "EEEE, MMMM do, yyyy ~ h:mm a z")}
          </p>
          {single ? (
            <span className={`font-sans text-3xl leading-tight xl:text-5xl`}>
              <span
                dangerouslySetInnerHTML={{ __html: data.title }}
              ></span>
              {data.subtitle && (
                <span
                  className={`block font-serif text-lg italic! xl:text-2xl`}
                  dangerouslySetInnerHTML={{ __html: data.subtitle }}
                />
              )}
            </span>
          ) : (
            <Link
              className={`post-link pointer-events-none relative block font-sans text-3xl leading-tight drop-shadow-sm transition-all xl:text-4xl [&>span:first-of-type]:opacity-100 hover:[&>span:first-of-type]:opacity-0 [&>span:last-of-type]:opacity-0 hover:[&>span:last-of-type]:opacity-100 [&>span]:transition-all`}
              href={`/blog/${data.slug}`}
            >
              <span className={`inline-block`}>
                <span
                  className={`pointer-events-auto max-w-max`}
                  dangerouslySetInnerHTML={{ __html: data.title }}
                />
                {data.subtitle && (
                  <span
                    className={`pointer-events-auto block max-w-max font-serif text-lg italic! xl:text-2xl`}
                    dangerouslySetInnerHTML={{ __html: data.subtitle }}
                  />
                )}
              </span>
              <span
                className={`absolute inset-0 inline-block h-full w-full bg-linear-to-b from-bright-sun-400 to-bright-sun-600 bg-clip-text text-transparent`}
              >
                <span
                  className={`pointer-events-auto max-w-max`}
                  dangerouslySetInnerHTML={{ __html: data.title }}
                />
                {data.subtitle && (
                  <span
                    className={`block max-w-max font-serif text-lg italic! xl:text-2xl`}
                    dangerouslySetInnerHTML={{ __html: data.subtitle }}
                  />
                )}
              </span>
            </Link>
          )}
        </div>
      </header>
      {!single && (
        <div
          className={`bar-left/50 relative before:w-[48px] xl:before:w-[64px]`}
        >
          <div
            className={`mb-2 ml-[72px] mr-6 mt-8 text-lg xl:ml-[96px] xl:w-1/2`}
            dangerouslySetInnerHTML={{ __html: data.content.summary }}
          />
          <Link
            className={`inline-link mb-8 ml-[72px] inline-block font-sans uppercase xl:ml-[96px]`}
            href={`/blog/${data.slug}`}
          >
            Read full entry
          </Link>
        </div>
      )}
    </section>
  );
};

const MemoizedPost = React.memo(Post);
export default MemoizedPost;
