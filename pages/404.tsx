import Head from "next/head";
import parse from "html-react-parser";
import React from "react";

import Footer from "@/components/footer";

function Error({ options, head }: { options: any; head: any }) {
  return (
    <>
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
      <Footer loadMore={``} options={options} />
    </>
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
