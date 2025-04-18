import React, { useMemo } from 'react';
import { replaceUnderlinedSpans } from '@/utils';

interface AlertData {
    alert: {
        color: string;
    };
}

interface AlertBlock {
    attributes: {
        data: string;
    };
    innerBlocks: Array<{
        renderedHtml: string;
    }>;
}


export interface AlertProps {
    data: AlertBlock;
}

const Alert: React.FC<AlertProps> = ({ data }) => {
    const block = data;
    const alertData = useMemo<AlertData>(() => JSON.parse(block.attributes.data), [block]);
    const colorStyle = useMemo(
        () => ({
            '--color': alertData.alert.color,
            borderLeftColor: alertData.alert.color,
        }),
        [alertData]
    );

    return (
        <div style={colorStyle as React.CSSProperties} className="alert py-1.5 pl-4 pr-3 border-l-4 rounded-r bg-darker">
            {block.innerBlocks &&
                block.innerBlocks.map((innerBlock, index) => (
                    <div
                        key={index}
                        dangerouslySetInnerHTML={{
                            __html: replaceUnderlinedSpans(innerBlock.renderedHtml),
                        }}
                    />
                ))}
        </div>
    );
};

export default Alert;
