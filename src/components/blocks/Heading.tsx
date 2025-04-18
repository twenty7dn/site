import React, {JSX, ReactNode } from 'react'; // Explicitly import JSX
import { replaceUnderlinedSpans, sanitizeText } from '@/utils';
import { HTMLAttributes } from 'react';

interface HeadingAttributes {
    level: 1 | 2 | 3 | 4 | 5 | 6;
    content: string;
}

interface HeadingBlock {
    attributes: HeadingAttributes;
}

export interface HeadingProps {
    data: HeadingBlock;
}

// Define Tag as a functional component directly - SIMPLIFIED DEFINITION
interface TagProps extends HTMLAttributes<HTMLElement> {
    level: number;
}

const Tag: React.FC<TagProps> = ({ level, ...props }) => {
    const Component = ({
        1: 'h1',
        2: 'h2',
        3: 'h3',
        4: 'h4',
        5: 'h5',
        6: 'h6',
    }[level || 2] || 'p') as keyof JSX.IntrinsicElements;

    // More explicit and simpler return
    return React.createElement(Component, props);
};


const Heading: React.FC<HeadingProps> = ({ data }) => {
    const block = data;

    return (
        <Tag
            level={block.attributes.level} // Pass level as a prop
            id={sanitizeText(block.attributes.content)} // Provide default empty string for content
            dangerouslySetInnerHTML={{
                __html: replaceUnderlinedSpans(block.attributes.content), // Provide default empty string for content
            }}
        />
    );
};

export default Heading;
