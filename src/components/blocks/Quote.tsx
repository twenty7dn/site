import React from 'react';
import { replaceUnderlinedSpans } from '@/utils';
import parse from "html-react-parser";

interface QuoteAttributes {
    value?: string;
    citation?: string;
    borderColor?: string;
}

interface QuoteBlock {
    attributes: QuoteAttributes;
}

export interface QuoteProps {
    data: QuoteBlock;
}


const Quote: React.FC<QuoteProps> = ({ data }) => {
    const block = data;

    return (
        <blockquote
            style={{ '--color': block.attributes.borderColor } as React.CSSProperties} // Type assertion for style
            className="blockquote"
        >
            {parse(replaceUnderlinedSpans(block.attributes.value || ""))}
            <cite
                key="cite" // Added key to cite
                className="block text-right -translate-y-px"
                dangerouslySetInnerHTML={{
                    __html: replaceUnderlinedSpans(block.attributes.citation || ""), // Handle undefined citation
                }}
            />
        </blockquote>
    );
};

export default Quote;
