// components/Status.tsx
'use client'; // Make sure it's a client component for using useState and useEffect
import {useState, useEffect, ReactElement} from 'react';

interface StatusProps {
    userId: string; // Expect userId as a prop now
}

function Status({ userId }: StatusProps): ReactElement | null {
    const [discordStatusData, setDiscordStatusData] = useState<{ data?: { discord_status?: string } } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (!userId) {
            setError('User ID is missing.');
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            setError(null); // Clear any previous errors
            try {
                const response = await fetch(`/api/discord?userId=${userId}`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch status: ${response.statusText}`);
                }
                const data = await response.json();
                setDiscordStatusData(data);
                setLoading(false);
            } catch (err: any) {
                setError(err.message || 'Failed to fetch status.');
                setLoading(false);
                setDiscordStatusData(null); // Clear data on error
            }
        };

        fetchData(); // Initial fetch

        const intervalId = setInterval(fetchData, 5000); // Refetch every 5 seconds

        return () => clearInterval(intervalId); // Cleanup interval on component unmount
    }, [userId]); // Re-run effect if userId changes

    if (error) {
        return null;
    }

    const statusValue = discordStatusData?.data?.discord_status;

    let statusText = null;
    switch (statusValue) {
        case 'online':
            statusText = 'Online';
            break;
        case 'idle':
            statusText = 'Away';
            break;
        case 'afk':
            statusText = 'Away';
            break;
        case 'away':
            statusText = 'Away';
            break;
        case 'dnd':
            statusText = 'Unavailable';
            break;
        default:
            statusText = null;
            break;
    }

    if ( !statusText ) {
        return null;
    }

    return (
        <>
            <hr className="h-full ml-2 mr-1.5 text-border-soft border-t-none border-l border-l-border-soft scale-y-65"/>
            <span className="uppercase">{statusText}</span>
        </>
    );
}

export default Status;
