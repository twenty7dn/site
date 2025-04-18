// components/Status.tsx
import { ReactElement, useEffect, useState } from "react";
import Marquee from "react-fast-marquee";
import Card, { Spacer } from "@/components/Card";
import { Pause, Play } from "@phosphor-icons/react";
import Image from "@/components/Image";

function NowPlaying(): ReactElement | null {
  const [nowPlayingStatusData, setNowPlayingStatusData] = useState({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_WORDPRESS_API}/now-playing`,
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch status: ${response.statusText}`);
        }
        const data = await response.json();
        setNowPlayingStatusData(data);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || "Failed to fetch status.");
        setLoading(false);
        setNowPlayingStatusData(null);
      }
    };

    fetchData();

    const intervalId = setInterval(fetchData, 60000); // Refetch every 60 seconds

    return () => clearInterval(intervalId);
  }, []);

  if (error) {
    return null;
  }

  console.log("DATA?:", JSON.stringify(nowPlayingStatusData, null, 2));

  const { name, artist, albumArt, nowPlaying }: any =
    nowPlayingStatusData || {}; // Use empty object as default to avoid errors

  // Check if name and artist exist before rendering marquee
  if (!name || !artist) {
    return null;
  }

  return (
    <Card
      className={"p-2 lg:p-2"}
      footer={[
        <>{nowPlaying && "Listening"}</>,
        <Spacer className={nowPlaying ? "ml-1" : ""} />,
        <>
          {nowPlaying ? (
            <Play size={14} weight="duotone" className="relative z-10" />
          ) : (
            <Pause size={14} weight="duotone" className="relative z-10" />
          )}
        </>,
      ]}
    >
      <div className="grid grid-cols-[42px_calc(100%_-_42px)] items-center">
        <Image
          source={[
            {
              url: albumArt.encrypted,
              params: {
                resize: [36],
              },
            },
          ]}
          imgClass={"rounded-sm"}
          pictureClass={"mr-[8px]"}
        />
        <div className="relative bottom-0.5 flex flex-col max-w-max select-none">
          {nowPlaying ? (
            <>
              <Marquee
                className={"mask-marquee"}
                pauseOnHover={true}
                speed={20}
              >
                <span className={"leading-5 truncate pr-12"}>{name}</span>
                <span
                  className={
                    "text-sm text-foreground/65 leading-3 truncate pr-12"
                  }
                >
                  {artist}
                </span>
              </Marquee>
            </>
          ) : (
            <>
              <span className={"leading-5 truncate"}>{name}</span>
              <span className={"text-sm text-foreground/65 leading-3 truncate"}>
                {artist}
              </span>
            </>
          )}
        </div>
      </div>
    </Card>
  );
}

export default NowPlaying;
