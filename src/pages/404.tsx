import Head from "next/head";
import parse from "html-react-parser";
import React from "react";

import Footer from "@/components/footer";

function Error({ options, head }: { options: any; head: any }) {
  return (
    <section
        id={`content`}
        className={`post-list bar-left/50 relative flex w-full flex-col bg-amber-50 before:w-[48px] xl:before:w-[64px]`}
    >
      <Head>{parse(head.head + options.site_favicon)}</Head>
      <hr
        className={`ml-[48px] border-b-2 border-t-0 border-b-black/10 xl:ml-[64px]`}
      />
      <header className={`relative !mt-48`}>
        <svg
          viewBox="0 0 24 24"
          width={20}
          height={20}
          className={`absolute inset-0 top-auto z-30 mx-[14px] mb-10 fill-current xl:mx-[22px]`}
        >
          <path d="M11,15H13V17H11V15M11,7H13V13H11V7M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20Z" />
        </svg>
        <div className={`ml-[72px] mr-6 opacity-75 xl:ml-[96px]`}>
          <span
            className={`post-link pointer-events-none font-sans text-2xl leading-tight xl:text-4xl`}
          >
            <span className={`pointer-events-auto max-w-max`}>
              Page Not Found
            </span>
            <span
              className={`pointer-events-auto block max-w-max font-serif text-lg !italic xl:text-2xl`}
            >
              HTTP Error 404
            </span>
          </span>
        </div>
        <hr
          className={`ml-[48px] mt-8 border-b-2 border-t-0 border-b-black/10 xl:ml-[64px]`}
        />
      </header>
      <div className={`prose mt-1.5 mb-6 ml-[72px] mr-6 text-lg xl:ml-[96px] xl:w-1/2`}>
        <blockquote className={`quote prose-quoteless`}>
          <p>
            In computer network communications, the HTTP 404, 404 not found, 404, 404 error, page not found, or file not
            found error message is a hypertext transfer protocol (HTTP) standard response code, to indicate that the
            browser was able to communicate with a given server, but the server could not find what was requested. The
            error may also be used when a server does not wish to disclose whether it has the requested information.
          </p>
          <p>
            The website hosting server will typically generate a &quot;404 Not Found&quot; web page when a user attempts
            to follow a broken or dead link; hence the 404 error is one of the most recognizable errors encountered on
            the
            World Wide Web.
          </p>
          <cite>
            <a href="https://www.wikiwand.com/en/articles/HTTP_404" target={`_blank`}>
              ~ Wikipedia
            </a>
          </cite>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
               className="absolute left-[-10px] top-[10px] bg-amber-50 fill-stone-950 lg:left-[-10px]" width="1em"
               height="1em">
            <path d="M14,17H17L19,13V7H13V13H16M6,17H9L11,13V7H5V13H8L6,17Z"></path>
          </svg>
        </blockquote>
      </div>
      <Footer loadMore={``} options={options}/>
    </section>
  );
}

export async function getStaticProps() {
  // Fetch Stuff
  const [options] = await Promise.all([
    fetch(`${process.env.WORDPRESS_HOST}/api`).then((res) => res.json()),
  ]);

  const head = await fetch(
      `${process.env.WORDPRESS_HOST}/api/wp/v2/head/${encodeURIComponent(`${process.env.WORDPRESS_HOST}/404/`)}`,
  ).then((res) => res.json());

  return {
    props: {
      options,
      head,
    },
    revalidate: 3600,
  };
}

export default Error;
