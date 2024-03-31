import { format } from "date-fns-tz";
import Link from "next/link";

function PostNoBanner({ data, single }: { data: any; single: boolean }) {
  return (
    <section
      className={`post bar-left/50 relative z-10 flex flex-col bg-amber-50 before:w-[48px] xl:before:w-[64px] [&>hr]:first-of-type:hidden [&_header]:first-of-type:mt-24`}
    >
      <hr
        className={`ml-[48px] border-b-2 border-t-0 border-b-black/10 xl:ml-[64px]`}
      />
      <header className={`relative`}>
        {data.sticky ? (
          single ? (
            <svg
              viewBox="0 0 20 20"
              width={20}
              height={20}
              className={`absolute inset-0 ${data.subtitle ? "!mb-10" : ""} ${single ? "top-auto mb-10 xl:mb-12" : "bottom-auto mt-8"} z-30 mx-[14px] fill-current xl:mx-[22px]`}
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
              className={`absolute inset-0 ${data.subtitle ? "!mb-10" : ""} ${single ? "top-auto mb-10 xl:mb-12" : "bottom-auto mt-8"} z-30 mx-[14px] scale-125 fill-current xl:mx-[22px]`}
            >
              <path d="M16,12V4H17V2H7V4H8V12L6,14V16H11.2V22H12.8V16H18V14L16,12Z" />
            </svg>
          )
        ) : (
          <svg
            viewBox="0 0 20 20"
            width={20}
            height={20}
            className={`absolute inset-0 ${data.subtitle ? "!mb-10" : ""} ${single ? "top-auto mb-10 xl:mb-12" : "bottom-auto mt-8"} z-30 mx-[14px] fill-current xl:mx-[22px]`}
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
          className={`my-8 ml-[72px] mr-6 xl:ml-[96px] ${single ? "xl:w-2/3" : "xl:w-1/2"}`}
        >
          {data.type === "post" && (
            <p className={`italic opacity-40`}>
              {format(new Date(data.date), "EEEE, MMMM do, yyyy ~ h:mm a z")}
            </p>
          )}
          {single ? (
            <span className={`font-sans text-3xl leading-tight xl:text-5xl`}>
              <span
                dangerouslySetInnerHTML={{ __html: data.title.rendered }}
              ></span>
              {data.subtitle && (
                <span
                  className={`block font-serif text-lg !italic xl:text-2xl`}
                  dangerouslySetInnerHTML={{ __html: data.subtitle.rendered }}
                ></span>
              )}
            </span>
          ) : (
            <Link
              className={`post-link pointer-events-none font-sans text-3xl leading-tight transition-all hover:text-bright-sun-600 xl:text-4xl`}
              href={`/${data.slug}`}
            >
              <span
                className={`pointer-events-auto max-w-max`}
                dangerouslySetInnerHTML={{ __html: data.title.rendered }}
              ></span>
              {data.subtitle && (
                <span
                  className={`pointer-events-auto block max-w-max font-serif text-lg !italic xl:text-2xl`}
                  dangerouslySetInnerHTML={{ __html: data.subtitle.rendered }}
                ></span>
              )}
            </Link>
          )}
        </div>
        {single && (
          <hr
            className={`ml-[48px] border-b-2 border-t-0 border-b-black/10 xl:ml-[64px]`}
          />
        )}
      </header>
      {!single && (
        <div>
          <div
            className={`mb-2 ml-[72px] mr-6 text-lg xl:ml-[96px] xl:w-1/2`}
            dangerouslySetInnerHTML={{ __html: data.description.rendered }}
          ></div>
          <Link
            className={`inline-link mb-8 ml-[72px] inline-block font-sans uppercase xl:ml-[96px]`}
            href={`/${data.slug}`}
          >
            Read full entry
          </Link>
        </div>
      )}
    </section>
  );
}

export default PostNoBanner;
