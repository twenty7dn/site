import React from "react";
import ImgixClient from "@imgix/js-core";

interface ImageDetail {
  width: number;
  height: number;
}

interface SrcObject {
  [mediaQuery: string]: ImageDetail[];
}

interface WpImageProps {
  alt: string;
  url: string;
  className: string;
  focalPoint: [number, number];
  src: SrcObject;
  size?: [number, number];
}

const WpImage: React.FC<WpImageProps> = ({
  alt,
  url,
  className,
  focalPoint,
  src,
  size,
}) => {
  const client = new ImgixClient({
    domain: process.env.IMGIX_HOST as string,
    includeLibraryParam: false,
  });

  let sizeArr;
  if (size) {
    sizeArr = {
      width: `${size[0]}px`,
      height: `${size[1]}px`,
    };
  }

  const srcSets: Record<string, string> = fetchSignedUrls();

  function fetchSignedUrls(): Record<string, string> {
    const newSrcSets: Record<string, string> = {};

    Object.entries(src).forEach(([mediaQuery, details]) =>
      details.forEach(async (detail) => {
        const path = url.replace(
          `${process.env.WORDPRESS_HOST}/wp-content/uploads/`,
          "/",
        );
        const signedUrl = client.buildURL(path, {
          w: detail.width.toString(),
          h: detail.height.toString(),
          "fp-x": (focalPoint[0] / 100).toString(),
          "fp-y": (focalPoint[1] / 100).toString(),
        });

        newSrcSets[mediaQuery] = signedUrl;
      }),
    );

    return newSrcSets;
  }

  return (
    <picture>
      {Object.entries(src).map(([mediaQuery, details], index) =>
        details.map((detail, detailIndex) => (
          <React.Fragment key={`${mediaQuery}-${detailIndex}`}>
            <source
              srcSet={`${srcSets[mediaQuery]}&fm=avif&dpr=1 1x, ${srcSets[mediaQuery]}&fm=avif&dpr=2 2x, ${srcSets[mediaQuery]}&fm=avif&dpr=3 3x`}
              media={mediaQuery}
              type="image/avif"
            />
            <source
              srcSet={`${srcSets[mediaQuery]}&fm=webp&dpr=1 1x, ${srcSets[mediaQuery]}&fm=webp&dpr=2 2x, ${srcSets[mediaQuery]}&fm=webp&dpr=3 3x`}
              media={mediaQuery}
              type="image/webp"
            />
          </React.Fragment>
        )),
      )}
      <img
        src={`${srcSets[Object.keys(src)[0]]}&fm-webp`} // Fallback to the first URL
        alt={alt}
        width={Object.values(src)[0][0].width}
        height={Object.values(src)[0][0].height}
        className={className}
        style={sizeArr}
        loading="lazy"
      />
    </picture>
  );
};

export default WpImage;
