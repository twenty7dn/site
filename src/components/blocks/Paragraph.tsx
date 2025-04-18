import React from 'react';
import { replaceUnderlinedSpans } from '@/utils';
import { useRouter } from 'next/router';
import parse from "html-react-parser";

interface ParagraphAttributes {
    content?: string;
    cssClassName?: string; // Assuming cssClassName might be present
}
interface ParagraphBlock {
    attributes: ParagraphAttributes;
}
export interface ParagraphProps {
    data: ParagraphBlock;
}

const Paragraph: React.FC<ParagraphProps> = ({ data }) => {
    const router = useRouter();
    const block = data;

    const handleClick = (event: React.MouseEvent<HTMLParagraphElement, MouseEvent>) => {
        const target = event.target as HTMLAnchorElement;
        if (target.tagName === 'A' && target.href) {
            event.preventDefault(); // Prevent the default browser navigation
            const href = target.getAttribute('href');
            if (href) {
                // Check if the link is external
                if (href.startsWith('http') || href.startsWith('mailto:')) {
                    window.open(href, '_blank'); // Open external links in a new tab
                } else {
                    router.push(href); // Use Next.js router for internal links
                }
            }
        }
    };

    if ( block.innerContent.length === 0 ) {
        return;
    }

    return (
        <>
            {parse(block.innerContent.toString())}
        </>
    );
};

export default Paragraph;

function stripPTags(htmlString) {
    if (!htmlString) {
        return "";
    }

    let strippedString = htmlString.trim();

    // Remove opening <p> tag if present
    if (strippedString.startsWith("<p>")) {
        strippedString = strippedString.substring(3);
    }

    // Remove closing </p> tag if present
    if (strippedString.endsWith("</p>")) {
        strippedString = strippedString.slice(0, -4);
    }

    return strippedString;
}
