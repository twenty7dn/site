import React from 'react';
import Image from '@/components/Image';
import Link from "next/link";

interface BookmarkAttributes {
    title?: string;
    content?: string;
    site?: string;
    favicon?: string;
    author?: string;
    thumbnail?: {
        source: string;
        alt?: string;
    };
    source?: string;
}

interface BookmarkBlock {
    attributes: BookmarkAttributes;
}

export interface BookmarkProps {
    data: BookmarkBlock;
}


const Bookmark: React.FC<BookmarkProps> = ({ data }) => {
    const block = data;
    const { title, content, site, favicon, author, thumbnail, source } = block.attrs;

    return (
            <figure
                className="grid grid-cols-[1fr_auto] auto-rows-min gap-x-3.5 max-h-min items-stretch m-0! after:hidden bg-black/10 border-t lg:!pl-[96px] lg:!-ml-[96px]">
                <div className="flex flex-col justify-center gap-2 grow w-full py-2.5">
                    <strong className="relative font-display text-md md:text-lg leading-5 max-w-max">
                        <Link href={source as string} target="_blank" rel="nofollow noopener" className="no-underline" dangerouslySetInnerHTML={{__html: title || ""}} />
                    </strong>
                    <div
                        className="font-mono text-foreground text-sm md:text-base line-clamp-2 md:line-clamp-3 tracking-tighter"
                        dangerouslySetInnerHTML={{__html: content || ""}} // Provide default empty string
                    />
                    <div
                        className="flex flex-row gap-1.5 font-mono text-foreground text-xs md:text-xs items-center justify-between mt-auto">
                        <span dangerouslySetInnerHTML={{__html: author || ""}}/>
                        <span className="flex flex-row gap-1.5 items-center ml-auto">
                            <span dangerouslySetInnerHTML={{__html: site || ""}}/>
                            {favicon && (
                                <Image
                                    source={[
                                        {
                                            url: favicon.encrypted,
                                            params: {
                                                resize: [14, 14]
                                            }
                                        }
                                    ]}
                                    alt="Site Favicon"
                                    imgClass="block size-[14px] rounded-xs -translate-y-px"
                                />
                            )}
                        </span>
                    </div>
                </div>
                {thumbnail && (
                    <Image
                        source={[
                            {
                                url: thumbnail.source.encrypted,
                                params: {
                                    resize: [128]
                                }
                            }
                        ]}
                        alt={thumbnail.alt}
                        imgClass="block min-h-full max-h-[128px] rounded-xs"
                    />
                )}
            </figure>
    );
};

export default Bookmark;
