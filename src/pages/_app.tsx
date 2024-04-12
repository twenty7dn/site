import React from "react";
import "@/styles/globals.css";
import NextApp from "next/app";
import Layout from "@/components/layout";
import https from "https";
import Head from "next/head";

class MyApp extends NextApp {
  static async getInitialProps(appContext: any) {
    const appProps = await NextApp.getInitialProps(appContext);

    let menu = {} as any;
    let primaryMenu = {} as any;
    let options = {} as any;
    let latestPosts = {} as any;

    try {
      // Fetch initial menu data
      menu = await fetchData(`${process.env.WORDPRESS_HOST}/api/wp/v2/menu/`);

      // Fetch the primary menu if available
      if (menu?.primary) {
        primaryMenu = await fetchData(
          `${process.env.WORDPRESS_HOST}/api/wp/v2/menu/${menu?.primary}`,
        );
      }

      options = await fetchData(`${process.env.WORDPRESS_HOST}/api`);
      latestPosts = await fetchData(
        `${process.env.WORDPRESS_HOST}/api/wp/v2/posts?per_page=5`,
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    }

    return {
      ...appProps,
      menu,
      primaryMenu,
      options,
      latestPosts,
    };
  }

  render() {
    const { Component, pageProps, primaryMenu, options, latestPosts } =
      this.props;

    return (
      <>
        <Head>
          <link
            rel="alternate"
            type="application/atom+xml"
            title={`${options.name} › Atom Feed`}
            href="/feed/atom/"
          />
          <link
            rel="alternate"
            type="application/rss+xml"
            title={`${options.name} › RSS Feed`}
            href="/feed/rss/"
          />
          <link
            rel="alternate"
            type="application/json"
            title={`${options.name} › JSON Feed`}
            href="/feed/json/"
          />
        </Head>
        <Layout menu={primaryMenu} options={options} latestPosts={latestPosts}>
          <Component {...pageProps} />
        </Layout>
      </>
    );
  }
}

async function fetchData(url: string) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          resolve(JSON.parse(data));
        });
      })
      .on("error", (err) => {
        reject(err);
      });
  });
}

export default MyApp;
