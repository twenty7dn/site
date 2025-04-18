// components/Layout.tsx
import React from "react";
import Header from "@/components/header";
import Image from "@/components/Image";

interface LayoutProps {
  menu: any;
  options: any;
  latestPosts: any;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({
  menu,
  options,
  latestPosts,
  children,
}) => {
  return (
    <>
      <Image
        source={[
            {
                media: "(orientation: landscape)",
                url: options.design.background.source.encrypted,
                params: {
                    cover: [1920, 1080],
                }
            },
            {
                media: "(orientation: portrait)",
                url: options.design.background.source.encrypted,
                params: {
                    cover: [1080, 1920],
                }
            }
        ]}
        imgClass={`fixed inset-0 -z-10 h-screen w-screen object-cover opacity-75`}
      />
      <main
        className={`uhd:mx-auto flex max-w-[1920px] flex-col font-serif shadow-md lg:flex-row`}
      >
        <Header menu={menu} options={options} latestPosts={latestPosts} />
        {children}
      </main>
    </>
  );
};

export default Layout;
