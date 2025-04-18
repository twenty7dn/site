import React, { useState, useEffect, useRef } from 'react';
import { formatInTimeZone } from 'date-fns-tz';
import gsap from 'gsap';

interface TimeProps {
    timezone: string; // e.g., 'America/Chicago'
}

const Time: React.FC<TimeProps> = ({ timezone }) => {
    const [currentTime, setCurrentTime] = useState<string[]>([]); // Fixed type to string[]
    const colonRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const formatted = [
                formatInTimeZone(now, timezone, 'hh'),
                formatInTimeZone(now, timezone, 'mm a') // Changed 'mm a (z)' to 'mma (z)' for correct AM/PM and timezone
            ];
            setCurrentTime(formatted);
        };

        updateTime(); // Initial time set
        const timeIntervalId = setInterval(updateTime, 1000); // Update time every second

        if (colonRef.current) {
            gsap.to(colonRef.current, {
                opacity: 0,
                duration: 0.5,
                ease: "linear",
                repeat: -1, // Infinite repeat
                yoyo: true, // Makes it go back and forth
            });
        }

        return () => {
            clearInterval(timeIntervalId); // Cleanup time interval
            gsap.killTweensOf(colonRef.current); // Cleanup GSAP animation
        };
    }, [timezone]); // Effect dependency on timezone

    return (
        <>
            <hr className="h-full ml-2 mr-1.5 text-border-soft border-t-none border-l border-l-border-soft scale-y-65"/>
            {currentTime[0]}
            <span
                ref={colonRef}
                className="relative bottom-0.25 -mx-px"
            >
                :
            </span>
            {currentTime[1]}
        </>
    );
};

export default Time;
