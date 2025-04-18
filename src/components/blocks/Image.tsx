import React from 'react';
import { default as BlockImage } from '@/components/Image';

interface ImageAttributes {
    src: string;
    title: string;
    caption?: string;
    width?: number;
    height?: number;
    align?: 'left' | 'center' | 'wide' | 'full' | 'right';
}

export interface ImageProps {
    data?: {
        attributes: ImageAttributes;
    };
}

const Image: React.FC<ImageProps> = ({ data }) => {
    if (!data) {
        return null;
    }

    const { align } = data.attrs;

    const defaultWidth = 736;
    const customHeight = 'auto';
    const {caption} = data;

    // Compute block class based on alignment and caption
    const getBlockClass = (): string => {
        let base = 'image-block ';
        switch (align) {
            case 'left':
                return `${base} float-none xl:float-left my-2! mx-auto! xl:-ml-5! xl:mr-4! xl:w-auto ${caption ? 'py-2 pr-2 rounded-r bg-dark' : ''}`;
            case 'center':
                return `${base} float-none my-2! mx-auto! xl:w-auto ${caption ? 'p-2 rounded-sm bg-dark' : ''}`;
            case 'wide':
                return `${base} float-none my-2! max-w-5xl xl:-mx-7 xl:w-auto`;
            case 'full':
                return `${base} float-none my-2! max-w-full mx-auto xl:w-auto p-2 rounded-sm bg-dark`;
            case 'right':
                return `${base} float-none xl:float-right my-2! mx-auto! xl:ml-4! xl:-mr-5! xl:w-auto ${caption ? 'py-2 pl-2 rounded-l bg-dark' : ''}`;
            default:
                return `${base} float-none my-2! max-w-5xl mx-auto xl:w-auto ${caption ? 'p-2 rounded-sm bg-dark' : ''}`;
        }
    };

    const blockClass = getBlockClass();

    // Image class applied to the image component
    const blockImgClass = 'm-0 w-full';

    // Compute block width based on alignment
    const getBlockWidth = (): number => {
        switch (align) {
            case 'left':
            case 'right':
                return customWidth || 256;
            case 'center':
                return customWidth || 1200;
            case 'wide':
                return 840;
            case 'full':
                return 1920;
            default:
                return customWidth || defaultWidth;
        }
    };

    const blockWidth = getBlockWidth();

    // Function to scale the image based on original dimensions
    const scaleImage = (originalWidth: number, originalHeight: number, newWidth: number): { width: number; height: number } => {
        const newHeight = (originalHeight * newWidth) / originalWidth;
        return { width: newWidth, height: newHeight };
    };

    // Compute image dimensions (width and height)
    const dimensions = scaleImage(blockWidth, customHeight || 0, 720);

    // Caption styling (currently empty)
    const blockCaptionClass = '';

    // Helper function to wrap text in a paragraph tag
    const wrapInParagraph = (text: string): string => {
        return text.trim().startsWith('<p>') && text.trim().endsWith('</p>')
            ? text
            : text.trim();
    };

    return (
        <>
            <figure className={blockClass}>
                <BlockImage
                    height={customHeight || 'auto'}
                    source={[
                        {
                            url: data.media_source,
                            params: {
                                cover: [blockWidth, customHeight || 'auto'],
                            },
                        },
                    ]}
                    imgClass={`rounded-sm ${blockImgClass}`}
                />
                {caption && (
                    <figcaption
                        className={`flex flex-row items-center gap-x-1.5 mt-2 ${blockCaptionClass} leading-3`}
                        dangerouslySetInnerHTML={{
                            __html: wrapInParagraph(caption),
                        }}
                    />
                )}
            </figure>
        </>
    );
};

export default Image;
