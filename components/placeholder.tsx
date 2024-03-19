import React from "react";

const Placeholder = ({ src, className }: { src: any; className: string }) => (
    <div className={className} style={{ width: (Object.values(src).pop() as any)[0].width, height: (Object.values(src).pop() as any)[0].height }}></div>
);

export default Placeholder;