export function convertValue(value: any): string | number {
  return value === "auto" || value === null || value === undefined
    ? "auto"
    : parseInt(value, 10);
}

export function sortObjectByCustomOrder<T extends object>(
  obj: T,
  keyOrder: (keyof T)[],
): Partial<T> {
  return keyOrder.reduce((sortedObj, key) => {
    if (key in obj) {
      sortedObj[key] = obj[key];
    }
    return sortedObj;
  }, {} as Partial<T>);
}

interface Params {
  focus?: [string | number | null, string | number | null] | null;
  zoom?: number | null;
  turn?: number | null;
  resize?: [string | number | null, string | number | null] | null;
  cover?: [string | number | null, string | number | null] | null;
  resizeMin?: [string | number | null, string | number | null] | null;
  resizeMax?: [string | number | null, string | number | null] | null;
  quality?: number | null;
  output?: string | null;

  [key: string]: any;
}

export interface ImageSource {
  media?: string;
  url: string;
  params?: Params;
}

export interface ResolvedImageSource {
  media?: string;
  webp: string;
}

export async function buildImageURL(
  src: string,
  params: Params,
  encrypted: boolean,
  dpr: number = 1,
  placeholder: boolean = false,
): Promise<string> {
  const clonedParams: Params = { ...params };
  let formattedFocus: string | undefined;

  const transformKeys = ["cover", "resize", "resizeMin", "resizeMax"];
  transformKeys.forEach((key) => {
    if (clonedParams[key] && Array.isArray(clonedParams[key])) {
      clonedParams[key] = (clonedParams[key] as (string | number | null)[])
        .map((val) => {
          const convertedValue = convertValue(val);
          if (convertedValue === "auto") {
            return "-";
          } else if (typeof convertedValue === "number") {
            return convertedValue * dpr;
          } else {
            return "-";
          }
        })
        .join("x");
    }
  });

  if (clonedParams.focus) {
    formattedFocus = `${clonedParams.focus[0]}px${clonedParams.focus[1]}p`;
  }

  const sortedParams = sortObjectByCustomOrder(clonedParams, [
    "focus",
    "zoom",
    "turn",
    "resize",
    "cover",
    "resizeMin",
    "resizeMax",
    "quality",
    "output",
  ]);

  const transformsArray = Object.keys(sortedParams).map((prop) => {
    let value = (sortedParams as any)[prop];
    if (prop === "focus" && formattedFocus) {
      value = formattedFocus;
    }
    return `${prop.replace(/([a-z])([A-Z])/g, (_, lower, upper) => `${lower}-${upper.toLowerCase()}`)}=${value}`;
  });

  const transforms = transformsArray.join("/");

  const twicpicsDomain = process.env.NEXT_PUBLIC_IMAGE_HOST;
  if (!twicpicsDomain) {
    throw new Error("Missing NEXT_PUBLIC_IMAGE_HOST environment variable.");
  }

  return `${twicpicsDomain}/${src}?v1/${transforms}`;
}

export async function resolveImageSources(
  source: ImageSource[],
  encrypted = false,
  dpr = 3,
): Promise<{
  fallbackSrc: string;
  resolvedSources: ResolvedImageSource[];
}> {
  const fallback = source[0];

  const fallbackUrl = await buildImageURL(
    fallback.url,
    { ...fallback.params, output: "png" },
    encrypted,
    1,
  );

  const webpPromises = source.flatMap(({ url, params }) =>
    Array.from({ length: dpr }, (_, i) =>
      buildImageURL(url, { ...params, output: "webp" }, encrypted, i + 1),
    ),
  );

  const webpURLs = await Promise.all(webpPromises);

  const resolvedSources = source.map(({ media }, index) => {
    const startIndex = index * dpr;
    const webpSet = webpURLs
      .slice(startIndex, startIndex + dpr)
      .map((url, i) => `${url} ${i + 1}x`)
      .join(", ");
    return { media, webp: webpSet };
  });

  const primaryWebp = resolvedSources[0]?.webp?.split(", ")[0]?.split(" ")[0];
  const finalFallback = primaryWebp || fallbackUrl;

  return {
    fallbackSrc: finalFallback,
    resolvedSources,
  };
}
