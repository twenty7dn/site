// pages/api/imgix.js
import ImgixClient from '@imgix/js-core';

export default function handler(req: any, res: any) {
    const client = new ImgixClient({
        domain: process.env.IMGIX_HOST as string,
        secureURLToken: process.env.IMGIX_TOKEN as string,
        includeLibraryParam: false,
    });

    let { url, ...params } = req.query;

    // Ensure path is correctly formatted and prefixed with '/'
    const path = url.replace(`${process.env.WORDPRESS_HOST}/wp-content/uploads/`, '/');

    try {
        const signedUrl = client.buildURL(path, params);
        res.status(200).json({ url: signedUrl });
    } catch (error) {
        console.error('Error generating Imgix URL:', error);
        res.status(500).json({ error: 'Error generating Imgix URL' });
    }
}
