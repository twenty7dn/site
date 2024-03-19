// hooks/head.ts
import { useEffect, useState } from 'react';

export async function fetchHeadData(currentPath: string) {
    const response = await fetch(`${process.env.FRONTEND_HOST}/api/head?currentPath=${currentPath}`);
    const data = await response.json();

    return data.headData;
}

export default function useHeadData(currentPath: string) {
    const [headData, setHeadData] = useState('');

    useEffect(() => {
        const fetchHead = async () => {
            const head = await fetchHeadData(currentPath);
            setHeadData(head);
        };

        fetchHead();
    }, [currentPath]);

    return headData;
}
