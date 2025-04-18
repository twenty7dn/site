import React, {useState} from 'react';
import { BlockData } from './index';

export interface DetailsProps {
    data: BlockData;
}

interface ParsedDetailsContent {
    summary: string;
    content: string;
}

const Details: React.FC<DetailsProps> = ({ data }) => {
    const [open, setOpen] = useState<boolean>(false);

    const renderedHtml = data.renderedHtml;
    let parsedContent: ParsedDetailsContent = { summary: '', content: '' };

    if (renderedHtml) {
        const detailsRegex = /<details(.*?)><summary>(.*?)<\/summary>(.*?)<\/details>/s;
        const match = renderedHtml.match(detailsRegex);

        if (match) {
            parsedContent = {
                summary: match[2] || '', // Content of <summary> tag (group 2)
                content: match[3] || '', // Content after <summary> and before </details> (group 3)
            };
        } else {
            console.warn("Could not parse <details> content with regex for block:", data);
            parsedContent = { summary: 'Summary', content: renderedHtml }; // Fallback
        }
    }

    return (
        <details>
            <summary className={`${open ? 'hidden' : 'flex flex-row items-center gap-x-1.5'}`} onClick={() => setOpen(true)}>
                <span dangerouslySetInnerHTML={{ __html: parsedContent.summary }} />
            </summary>
            <div dangerouslySetInnerHTML={{ __html: parsedContent.content as string }} />
        </details>
    );
};

export default Details;
