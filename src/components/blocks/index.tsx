import React, { Fragment, useMemo } from 'react';

// Static component imports
import Image, { ImageProps } from '@/components/blocks/Image';
import Quote, { QuoteProps } from '@/components/blocks/Quote';
import Heading, { HeadingProps } from '@/components/blocks/Heading';
import Paragraph, { ParagraphProps } from '@/components/blocks/Paragraph';
import Alert, { AlertProps } from '@/components/blocks/Alert';
import Bookmark, { BookmarkProps } from '@/components/blocks/Bookmark';
import List, { ListProps } from '@/components/blocks/List';
import Details, { DetailsProps } from '@/components/blocks/Details';

// Define BlockData interface to represent the data prop for Blocks component
export interface BlockData {
    name: string;
    attrs: any;
    innerBlocks: BlockData[];
    innerHTML?: string;
    innerContent?: string[];
    renderedHtml: string;
    clientId: string;
    isValid: boolean;
    blockEditorCategoryName: string;
    cssClassNames: string;
    isDynamic: boolean;
    blockType: string;
    [key: string]: any;
}


interface BlocksProps {
    data?: BlockData[] | null;
}


const Blocks: React.FC<BlocksProps> = ({ data }) => {
    const blocks = Array.isArray(data) ? data : [];

    return (
        <>
            {blocks.map((block, index) => {
                let BlockComponent: React.FC<any> | undefined;

                switch (block.blockName) {
                    case 'core/image':
                        BlockComponent = Image as React.FC<ImageProps>;
                        break;
                    case 'core/quote':
                        BlockComponent = Quote as React.FC<QuoteProps>;
                        break;
                    case 'core/separator':
                        return <hr className="my-6!" key={index} />;
                    case 'core/heading':
                        BlockComponent = Heading as React.FC<HeadingProps>;
                        break;
                    case 'core/paragraph':
                        BlockComponent = Paragraph as React.FC<ParagraphProps>;
                        break;
                    case 'acf/alert':
                        BlockComponent = Alert as React.FC<AlertProps>;
                        break;
                    case 'cross/bookmark':
                        BlockComponent = Bookmark as React.FC<BookmarkProps>;
                        break;
                    case 'core/list':
                        BlockComponent = List as React.FC<ListProps>;
                        break;
                    case 'core/details':
                        BlockComponent = Details as React.FC<ListProps>;
                        break;
                    default:
                        if (block.name === 'core/more') return null;
                        break;
                }

                if (BlockComponent) {
                    return (
                        <Fragment key={index}>
                            <BlockComponent data={block} />
                        </Fragment>
                    );
                }
            })}
        </>
    );
};

export default Blocks;
