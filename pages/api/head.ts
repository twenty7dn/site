// pages/api/head.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const currentPath = req.query.currentPath as string; // Extract currentPath from query parameters

    try {
        // Use currentPath in your WordPress API URL if needed
        const wordpressApiUrl = `${process.env.WORDPRESS_HOST}/api/wp/v2/head/${encodeURIComponent(`${process.env.WORDPRESS_HOST}${currentPath}`)}`;
        const siteOptionsUrl = `${process.env.WORDPRESS_HOST}/api`;

        const headResponse = await fetch(wordpressApiUrl);
        const headData = await headResponse.json();

        const optionsResponse = await fetch(siteOptionsUrl);
        const optionsData = await optionsResponse.json();

        res.status(200).json({ headData, optionsData });
    } catch (error) {
        console.error('Fetching WordPress data failed:', error);
        res.status(500).json({ error: 'Failed to fetch WordPress data' });
    }
}
