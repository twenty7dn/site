import React, { useMemo } from "react";
import parse from "html-react-parser";
import Head from "next/head";

interface HeadProps {
  headContent: string; // Assuming headContent is a string
}

const MemoizedHead: React.FC<HeadProps> = ({ headContent }) => {
  const parsedContent = useMemo(() => parse(headContent), [headContent]);

  return <Head>{parsedContent}</Head>;
};

export default MemoizedHead;
