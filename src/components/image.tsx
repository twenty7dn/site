import React from "react";
import {
  ImageSource,
  ResolvedImageSource,
  resolveImageSources,
} from "@/utils/image";

interface BaseProps {
  alt?: string;
  imgClass?: string;
  pictureClass?: string;
  width?: number | string;
  height?: number | string;
  loading?: "lazy" | "eager";
  decoding?: "async" | "sync" | "auto";
}

// Server-resolved version (used internally or passed into the base)
export interface ServerImageProps extends BaseProps {
  resolvedSources: ResolvedImageSource[];
  fallbackSrc: string;
}

const Image: React.FC<ServerImageProps> = ({
  resolvedSources,
  fallbackSrc,
  alt = "",
  imgClass = "",
  pictureClass = "",
  width,
  height,
  loading = "lazy",
  decoding = "async",
}) => {
  return (
    <picture className={pictureClass}>
      {resolvedSources.map(({ media, webp }, index) => (
        <source key={index} media={media} srcSet={webp} type="image/webp" />
      ))}
      <img
        src={fallbackSrc}
        alt={alt}
        className={`object-cover transition-opacity duration-200 ${imgClass}`}
        width={width}
        height={height}
        loading={loading}
        decoding={decoding}
      />
    </picture>
  );
};

export default Image;

// -------------------------------
// ✅ Enhanced server version
// -------------------------------

export interface EnhancedImageProps extends BaseProps {
  source: ImageSource[];
  encrypted?: boolean;
  dpr?: number;
}

export async function ImageWithResolvedSource({
  source,
  encrypted = false,
  dpr = 3,
  ...rest
}: EnhancedImageProps) {
  const { fallbackSrc, resolvedSources } = await resolveImageSources(
    source,
    encrypted,
    dpr,
  );

  return (
    <Image
      fallbackSrc={fallbackSrc}
      resolvedSources={resolvedSources}
      {...rest}
    />
  );
}
