import React, { JSX, useState, useEffect } from 'react'; // Import useState and useEffect
import {cn} from '@/utils/class-tools';
import {
    TwitterLogo,
    GithubLogo,
    LinkedinLogo,
    FacebookLogo,
    InstagramLogo,
    YoutubeLogo,
    TiktokLogo,
    Butterfly,
    LinkSimple, BookBookmark, Bookmark, MastodonLogo // Make sure MastodonLogo is imported
} from "@phosphor-icons/react";

interface LinkIconProps {
    href: string;
    external: boolean;
    size: number;
    weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone" | undefined;
    className?: string;
    isActive?: boolean | false;
}

interface MastodonResponse {
    isMastodon: boolean | false;
}

const LinkIcons: React.FC<LinkIconProps> = ({ href, external, size, weight = 'regular', className, isActive = false }) => {
    const [isMastodon, setIsMastodon] = useState<boolean>(false); // State to track if it's a Mastodon link

    useEffect(() => {
        if (external) {
            fetch(`${process.env.NEXT_PUBLIC_WORDPRESS_REST_API_ENDPOINT}/mastodon/check?url=${encodeURIComponent(href)}`)
                .then(async (response) => {
                    const res: MastodonResponse = await response.json();
                    setIsMastodon(res.isMastodon);
                })
                .catch((error) => {
                    console.error("Failed to check Mastodon instance:", error);
                    setIsMastodon(false); // Handle errors gracefully
                });
        } else {
            setIsMastodon(false); // Reset Mastodon state for internal links
        }
    }, [href, external]); // Re-run effect when href or external changes


    if (external) {
        if (isMastodon) {
            return <MastodonLogo size={size} weight={weight} className={cn('', className)} />; // Render Mastodon Logo
        }

        try {
            const url = new URL(href);
            const domain = url.hostname;
            let socialMediaIcon: JSX.Element | null = null;

            const lowerDomain = domain.toLowerCase();

            switch (true) {
                case /twitter\.com$/.test(lowerDomain):
                    socialMediaIcon = <TwitterLogo size={size} weight={weight} className={cn('', className)} />;
                    break;
                case /github\.com$/.test(lowerDomain):
                    socialMediaIcon = <GithubLogo size={size} weight={weight} className={cn('', className)} />;
                    break;
                case /linkedin\.com$/.test(lowerDomain):
                    socialMediaIcon = <LinkedinLogo size={size} weight={weight} className={cn('', className)} />;
                    break;
                case /facebook\.com$/.test(lowerDomain):
                    socialMediaIcon = <FacebookLogo size={size} weight={weight} className={cn('', className)} />;
                    break;
                case /instagram\.com$/.test(lowerDomain):
                    socialMediaIcon = <InstagramLogo size={size} weight={weight} className={cn('', className)} />;
                    break;
                case /youtube\.com$/.test(lowerDomain):
                    socialMediaIcon = <YoutubeLogo size={size} weight={weight} className={cn('', className)} />;
                    break;
                case /tiktok\.com$/.test(lowerDomain):
                    socialMediaIcon = <TiktokLogo size={size} weight={weight} className={cn('', className)} />;
                    break;
                case /bsky\.app$/.test(lowerDomain):
                    socialMediaIcon = <Butterfly size={size} weight={weight} className={cn('', className)} />;
                    break;
                default:
                    socialMediaIcon = <LinkSimple size={size} weight={weight} className={cn('', className)} />;
                    break;
            }
            return socialMediaIcon;

        } catch (error) {
            console.error("Invalid URL:", href);
            return  <LinkSimple size={size} weight={weight} className={cn('', className)} />;
        }
    } else {
        let internalLinkIcons;

        const lowerHref = href.toLowerCase();

        switch (true) {
            case /^\/library/.test(lowerHref):
                internalLinkIcons = {
                    active: <BookBookmark size={size} weight={'fill'} className={cn('', className)} />,
                    inactive: <BookBookmark size={size} weight={'duotone'} className={cn('', className)} />,
                };
                break;
            case /^\/bookmarks/.test(lowerHref):
                internalLinkIcons = {
                    active: <Bookmark size={size} weight={'fill'} className={cn('', className)} />,
                    inactive: <Bookmark size={size} weight={'duotone'} className={cn('', className)} />,
                };
                break;
            default:
                internalLinkIcons = {
                    active: <LinkSimple size={size} weight={'fill'} className={cn('', className)} />,
                    inactive: <LinkSimple size={size} weight={'duotone'} className={cn('', className)} />,
                };
                break;

        }

        return isActive ? internalLinkIcons.active : internalLinkIcons.inactive;

    }
};

export default LinkIcons;
