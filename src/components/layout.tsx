// components/Layout.tsx
import React from "react";
import Header from "@/components/header";
import WpImage from "@/components/WpImage";

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
      <WpImage
        alt={options.name}
        url={options.site_background.url}
        src={{
          "(max-width: 960px)": [
            {
              width: 1080,
              height: 1920,
            },
          ],
          "(min-width: 961px)": [
            {
              width: 1920,
              height: 1080,
            },
          ],
        }}
        focalPoint={[50, 50]}
        className={`fixed inset-0 -z-10 h-screen w-screen object-cover opacity-75`}
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
