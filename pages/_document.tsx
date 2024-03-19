// pages/_document.tsx
import Document, { Html, Head, Main, NextScript } from 'next/document';
import React from 'react';
import parse from "html-react-parser";

class AppDocument extends Document {
    static async getInitialProps(ctx: any) {
        const currentPath = ctx.pathname; // Use pathname from ctx

        try {
            // Fetch head data directly within getInitialProps
            const wordpressApiUrl = `${process.env.WORDPRESS_HOST}/api/wp/v2/head/${encodeURIComponent(`${process.env.WORDPRESS_HOST}${currentPath}`)}`;
            const siteOptionsUrl = `${process.env.WORDPRESS_HOST}/api`;

            const [headResponse, optionsResponse] = await Promise.all([
                fetch(wordpressApiUrl),
                fetch(siteOptionsUrl)
            ]);

            const [headData, optionsData] = await Promise.all([
                headResponse.json(),
                optionsResponse.json()
            ]);

            return {
                headData: headData.head, // Convert headData object to a string
                optionsData: optionsData.site_favicon, // Convert headData object to a string
                ...await Document.getInitialProps(ctx), // Include default Document props
            };
        } catch (error) {
            console.error('Fetching head data failed:', error);
            return {
                headData: '', // Return an empty headData in case of an error
                ...await Document.getInitialProps(ctx), // Include default Document props
            };
        }
    }

    render() {
        const { headData, optionsData } = this.props as any;

        return (
            <Html>
                <Head>
                    {parse(headData + optionsData)}
                </Head>
                <body className={`bg-black text-stone-950`}>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default AppDocument;
