import React from 'react';
import Blocks, { BlockData } from '@/components/blocks'; // Import BlockData interface

interface ListAttributes {
    ordered?: boolean; // Assuming 'ordered' can be optionally present
    values: BlockData[]; //  Values is an array of BlockData
}

interface ListBlock {
    attributes: ListAttributes;
}

export interface ListProps {
    data: ListBlock;
}


const List: React.FC<ListProps> = ({ data }) => {
    const block = data;
    const isOrdered = block.attributes.ordered; // Determine if the list is ordered

    const ListTag = isOrdered ? 'ol' : 'ul'; // Dynamically choose between <ol> and <ul>

    return (
        <ListTag className={isOrdered ? "list-decimal" : "list-disc"}>
            {block.attributes.values.map((innerBlock, index) => (
                <li key={index}> <Blocks data={[innerBlock]} /> </li> // Wrap innerBlock in an array []
            ))}
        </ListTag>
    );
};

export default List;
