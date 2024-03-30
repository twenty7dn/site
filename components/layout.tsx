// components/Layout.tsx
import React, { useState, useEffect } from "react";
import parse from "html-react-parser";
import Head from "next/head";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [headData, setHeadData] = useState<string>("");
  const [optionsData, setOptionsData] = useState<string>("");

  useEffect(() => {
    const fetchHeaderData = async () => {
      try {
        const currentPath = window.location.pathname;
        const wordpressApiUrl = `${process.env.WORDPRESS_HOST}/api/wp/v2/head/${encodeURIComponent(`${process.env.WORDPRESS_HOST}${currentPath}`)}`;
        const siteOptionsUrl = `${process.env.WORDPRESS_HOST}/api`;

        const [headResponse, optionsResponse] = await Promise.all([
          fetch(wordpressApiUrl),
          fetch(siteOptionsUrl),
        ]);

        const [headData, optionsData] = await Promise.all([
          headResponse.json(),
          optionsResponse.json(),
        ]);

        setHeadData(headData.head);
        setOptionsData(optionsData.site_favicon);
      } catch (error) {
        console.error("Fetching head data failed:", error);
        // Handle error
      }
    };

    fetchHeaderData();
  }, []);

  return (
    <>
      <Head>{parse(headData + optionsData)}</Head>
      {children}
    </>
  );
};

export default Layout;
