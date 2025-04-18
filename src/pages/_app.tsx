import React from "react";
import "@/styles/globals.css";
import 'mapbox-gl/dist/mapbox-gl.css';
import NextApp from "next/app";
import Layout from "@/components/layout";
import Head from "next/head";
import { Poly, Lato, Caveat, Fira_Code } from 'next/font/google';

// Import all variants of Poly
const poly = Poly({
    subsets: ['latin'],
    weight: ['400'],
    style: ['normal', 'italic'],
    variable: '--font-poly',
});

// Import all variants of Lato
const lato = Lato({
    subsets: ['latin'],
    weight: ['100', '300', '400', '700', '900'], // Specify all available weights
    style: ['normal', 'italic'], // Specify both normal and italic styles
    variable: '--font-lato',
});

// Import all variants of Caveat
const caveat = Caveat({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'], // Specify all available weights
    variable: '--font-caveat',
});

// Import all variants of Fira Code
const firaCode = Fira_Code({
    subsets: ['latin'],
    weight: ['300', '400', '500', '600', '700'], // Specify all available weights
    variable: '--font-fira-code',
});

class MyApp extends NextApp {
  static async getInitialProps(appContext: any) {
    const appProps = await NextApp.getInitialProps(appContext);

    let menu = {} as any;
    let primaryMenu = {} as any;
    let options = {} as any;
    let latestPosts = {} as any;

    try {
      // Fetch initial menu data
      menu = await fetchData(`${process.env.NEXT_PUBLIC_WORDPRESS_API}/menu/`);

      // Fetch the primary menu if available
      if (menu?.PRIMARY) {
        primaryMenu = await fetchData(
            `${process.env.NEXT_PUBLIC_WORDPRESS_API}/menu/${menu?.PRIMARY}`,
        );
      }

      options = await fetchData(`${process.env.NEXT_PUBLIC_WORDPRESS_API}/meta`);
      latestPosts = await fetchData(
          `${process.env.NEXT_PUBLIC_WORDPRESS_API}/post?per_page=5`,
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
    try {
        console.log(`Workspaceing URL using fetch: ${url}`);
        const response = await fetch(url);

        if (!response.ok) {
            const message = `An error occurred: ${response.status}`;
            console.error(message);
            throw new Error(message);
        }

        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            return data;
        } else {
            const text = await response.text();
            console.warn(`Unexpected Content-Type: ${contentType}. Raw data:`, text);
            return text; // Or throw an error if you strictly expect JSON
        }
    } catch (error) {
        console.error("Error during fetch:", error);
        throw error;
    }
}

export default MyApp;
