import React, { useEffect, useState } from "react";

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
  // State to store the fetched URLs
  const [srcSets, setSrcSets] = useState<Record<string, string>>({});

  let sizeArr;
  if (size) {
    sizeArr = {
      width: `${size[0]}px`,
      height: `${size[1]}px`,
    };
  }

  useEffect(() => {
    const fetchSignedUrls = async () => {
      const allPromises = Object.entries(src).flatMap(([mediaQuery, details]) =>
        details.map(async (detail) => {
          const params = new URLSearchParams({
            url,
            w: detail.width.toString(),
            h: detail.height.toString(),
            "fp-x": (focalPoint[0] / 100).toString(),
            "fp-y": (focalPoint[1] / 100).toString(),
          });

          // Prepare fetch requests for avif and webp formats
          const avifPromise = fetch(`/api/imgix?${params}&fm=avif`).then(
            (res) => res.json(),
          );
          const webpPromise = fetch(`/api/imgix?${params}&fm=webp`).then(
            (res) => res.json(),
          );

          const [avifRes, webpRes] = await Promise.all([
            avifPromise,
            webpPromise,
          ]);

          // Construct unique keys for storing URLs
          const avifKey = `${mediaQuery}-avif`;
          const webpKey = `${mediaQuery}-webp`;

          return { [avifKey]: avifRes.url, [webpKey]: webpRes.url };
        }),
      );

      // Resolve all fetch promises and update state
      const results = await Promise.all(allPromises);
      const fetchedSrcSets = results.reduce(
        (acc, result) => ({ ...acc, ...result }),
        {},
      );
      setSrcSets(fetchedSrcSets);
    };

    fetchSignedUrls();
  }, [url, focalPoint, src]); // Dependency array to re-fetch if props change

  return (
    <picture>
      {Object.entries(src).map(([mediaQuery, details], index) =>
        details.map((detail, detailIndex) => (
          <React.Fragment key={`${mediaQuery}-${detailIndex}`}>
            <source
              srcSet={srcSets[`${mediaQuery}-avif`]}
              media={mediaQuery}
              type="image/avif"
            />
            <source
              srcSet={srcSets[`${mediaQuery}-webp`]}
              media={mediaQuery}
              type="image/webp"
            />
          </React.Fragment>
        )),
      )}
      <img
        src={srcSets[`${Object.keys(src)[0]}-webp`]} // Fallback to the first webp URL
        alt={alt}
        width={Object.values(src)[0][0].width}
        height={Object.values(src)[0][0].height}
        className={className}
        style={sizeArr}
      />
    </picture>
  );
};

export default WpImage;
