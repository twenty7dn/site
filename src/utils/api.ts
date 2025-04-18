import NodeCache from "node-cache";

interface WPGraphQLResponse<T> {
    data: T;
    errors?: WPGraphQLError[];
}

interface WPGraphQLError {
    message: string;
    locations?: { line: number; column: number }[];
    path?: (string | number)[];
    extensions?: { [key: string]: any };
}

const handleWPGraphQLResponse = async <T>(response: Response): Promise<WPGraphQLResponse<T>> => {
    const json: WPGraphQLResponse<T> = await response.json();

    if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
    }


    if (json.errors) {
        console.error("GraphQL Errors:", json.errors); // Log GraphQL errors
        throw new Error(`GraphQL Error: ${JSON.stringify(json.errors)}`);
    }

    return json;
};


export const wpFetch = async <T>(query: string, variables: Record<string, any> | null = null): Promise<WPGraphQLResponse<T>> => {
    const endpoint = process.env.NEXT_PUBLIC_WORDPRESS_API_ENDPOINT;

    if (!endpoint) {
        throw new Error("NEXT_PUBLIC_WORDPRESS_API_ENDPOINT environment variable is not defined.");
    }


    try {
        const response: Response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({query, variables}),
        });


        return handleWPGraphQLResponse<T>(response);


    } catch (error) {
        console.error("Error fetching WordPress data:", error);
        throw error;
    }
};


// --- Location Data ---
interface Country {
    name: string;
    code: string;
}


export interface LocationData {
    locationData: {
        city: string;
        state: string;
        country: Country;
        timestamp: string;
        timezone: string;
    };
}


export async function locationData(): Promise<LocationData> {
    const query = `
      query locationQuery {
        locationData {
          city
          state
          country {
            name
            code
          }
          timestamp
          timezone
        }
      }
  `;


    const response = await wpFetch<LocationData>(query);
    return response.data;
}


// --- Blog Posts Query ---
interface MediaDetails {
    width: number;
    height: number;
    x: string;
    y: string;
    color: string;
}


interface FeaturedImageNode {
    mimeType: string;
    sourceUrl: string;
    sourceFile?: string;
    mediaDetails: MediaDetails;
}


export interface AuthorNode {
    name: string;
}


export interface SeriesNode {
    name: string;
    slug: string;
    count: number;
    description: string;
}


export interface TopicNode {
    name: string;
    slug: string;
    count: number;
    description: string;
}


export interface TagNode {
    name: string;
    slug: string;
    count: number;
    description: string;
}


export interface PostNode {
    title?: string;
    subtitle?: string;
    slug?: string;
    series?: string;
    shortlink?: string;
    excerpt?: string;
    content?: string;
    date?: string;
    dateGmt?: string;
    modified?: string;
    modifiedGmt?: string;
    readingTime?: string;
    isSticky?: boolean;
    license?: string;
    author?: { node: AuthorNode };
    featuredImage?: { node: FeaturedImageNode } | null;
    allSeries?: { nodes: SeriesNode[] };
    categories?: { nodes: TopicNode[] };
    tags?: { nodes: TagNode[] };
    editorBlocks: any; // Consider creating a more specific type for editorBlocks
    toc?: string;
}

// --- Page Node Interface ---
export interface PageNode {
    title?: string;
    slug?: string;
    content?: string;
    date?: string;
    modified?: string;
    editorBlocks: any; // Consider creating a more specific type for editorBlocks
}


interface PostsResponse {
    posts: {
        pageInfo: {
            endCursor?: string;
            hasNextPage: boolean;
        };
        edges: { node: PostNode }[];
    };
}


export async function blogQuery(
    first: number | null = null,
    after: string | null = null,
    slug: string | null = null,
    series: string | null = null,
    topic: string | null = null,
    tag: string | null = null,
    year: number | null = null,
    search: string | null = null,
): Promise<PostsResponse> {
    const variables: Record<string, any> = {
        first: first || 9999,
        after,
        slug,
        series,
        topic,
        tag,
        year,
        search,
    };


    const query = `
          query GetPaginatedPosts(
              $first: Int!
              $after: String
              $slug: String
              $series: String
              $topic: String
              $tag: [String]
              $year: Int
              $search: String
          ) {
              posts(
                  first: $first
                  after: $after
                  where: {
                      stickyPosts: true,
                      name: $slug,
                      seriesSlugIn: $series,
                      categoryName: $topic,
                      tagSlugIn: $tag,
                      search: $search,
                      dateQuery: { year: $year }
                  }
              ) {
                  pageInfo {
                      endCursor
                      hasNextPage
                  }
                  edges {
                      node {
                          title
                          subtitle
                          slug
                          series
                          shortlink
                          excerpt
                          content
                          date
                          dateGmt
                          modified
                          modifiedGmt
                          readingTime
                          isSticky
                          license
                          author {
                              node {
                                  name
                              }
                          }
                          featuredImage {
                              node {
                                  mimeType
                                  sourceUrl
                                  sourceFile
                                  mediaDetails {
                                      width
                                      height
                                      x
                                      y
                                      color
                                  }
                              }
                          }
                          allSeries {
                              nodes {
                                  name
                                  slug
                                  count
                              }
                          }
                          categories {
                              nodes {
                                  name
                                  slug
                                  count
                              }
                          }
                          tags {
                              nodes {
                                  name
                                  slug
                                  count
                              }
                          }
                          editorBlocks(flat: false) {
                              clientId
                              blockEditorCategoryName
                              cssClassNames
                              isDynamic
                              name
                              renderedHtml
                              type
                              ... on CoreHeading {
                                  attributes {
                                      level
                                      content
                                  }
                              }
                              ... on CoreParagraph {
                                  attributes {
                                      cssClassName
                                      content
                                  }
                                  renderedHtml
                              }
                              ... on CoreEmbed {
                                  attributes {
                                      url
                                      type
                                      className
                                      caption
                                      align
                                  }
                              }
                              ... on CoreImage {
                                  attributes {
                                      src
                                      width
                                      height
                                      aspectRatio
                                      className
                                      cssClassName
                                      alt
                                      align
                                      caption
                                      href
                                      linkClass
                                      linkDestination
                                      linkTarget
                                      metadata
                                      scale
                                      sizeSlug
                                      style
                                      title
                                      url
                                  }
                              }
                              ... on CoreQuote {
                                  attributes {
                                      align
                                      citation
                                      className
                                      cssClassName
                                      metadata
                                      textColor
                                      value
                                  }
                              }
                              ... on AcfAlert {
                                  name
                                  attributes {
                                      data
                                  }
                                  innerBlocks {
                                      renderedHtml
                                      name
                                  }
                              }
                              ... on CoreList {
                                  attributes {
                                      cssClassName
                                      className
                                      metadata
                                      ordered
                                      start
                                      values
                                  }
                              }
                              ... on CrossBookmark {
                                  name
                                  attributes {
                                      title
                                      content
                                      site
                                      author
                                      thumbnail
                                      favicon
                                      source
                                  }
                              }
                              ... on CoreDetails {
                                  type
                                  attributes {
                                      summary
                                  }
                                  innerBlocks {
                                      type
                                      ... on CoreHeading {
                                          type
                                          attributes {
                                              level
                                              content
                                          }
                                      }
                                      ... on CoreParagraph {
                                          type
                                          attributes {
                                              content
                                          }
                                      }
                                  }
                              }
                          }
                      }
                  }
              }
          }
      `;


    const response = await wpFetch<PostsResponse>(query, variables);
    return response.data;
}


// --- Pages Query ---
interface PagesResponse {
    pages: {
        pageInfo: {
            endCursor?: string;
            hasNextPage: boolean;
        };
        edges: {
            node: {
                title?: string;
                slug?: string;
                content?: string;
                date?: string;
                dateGmt?: string;
                modified?: string;
                modifiedGmt?: string;
                editorBlocks: any; // Consider creating a more specific type for editorBlocks
            };
        }[];
    };
}


export async function pagesQuery(first: number | null = null, after: string | null = null, slug: string | null = null): Promise<PagesResponse> {
    const variables: Record<string, any> = {first: first || 9999, after, slug};
    const query = `
                    query GetPaginatedPages($first: Int!, $after: String, $slug: String) {
                        pages(first: $first, after: $after, where: { name: $slug }) {
                            pageInfo {
                                endCursor
                                hasNextPage
                            }
                            edges {
                                node {
                                    title
                                    slug
                                    content
                                    date
                                    dateGmt
                                    modified
                                    modifiedGmt
                                    editorBlocks(flat: false) {
                                        clientId
                                        blockEditorCategoryName
                                        cssClassNames
                                        isDynamic
                                        name
                                        renderedHtml
                                        type
                                        ... on CoreHeading {
                                            attributes {
                                                level
                                                content
                                            }
                                        }
                                        ... on CoreParagraph {
                                            attributes {
                                                cssClassName
                                                content
                                            }
                                            renderedHtml
                                        }
                                        ... on CoreEmbed {
                                            attributes {
                                                url
                                                type
                                                className
                                                caption
                                                align
                                            }
                                        }
                                        ... on CoreImage {
                                            attributes {
                                                src
                                                width
                                                height
                                                aspectRatio
                                                className
                                                cssClassName
                                                alt
                                                align
                                                caption
                                                href
                                                linkClass
                                                linkDestination
                                                linkTarget
                                                metadata
                                                scale
                                                sizeSlug
                                                style
                                                title
                                                url
                                            }
                                        }
                                        ... on CoreQuote {
                                            attributes {
                                                align
                                                citation
                                                className
                                                cssClassName
                                                metadata
                                                textColor
                                                value
                                            }
                                        }
                                        ... on AcfAlert {
                                            name
                                            attributes {
                                                data
                                            }
                                            innerBlocks {
                                                renderedHtml
                                                name
                                            }
                                        }
                                        ... on CoreList {
                                            attributes {
                                                cssClassName
                                                className
                                                metadata
                                                ordered
                                                start
                                                values
                                            }
                                        }
                                        ... on CrossBookmark {
                                            name
                                            attributes {
                                                title
                                                content
                                                site
                                                author
                                                thumbnail
                                                favicon
                                                source
                                            }
                                        }
                                        ... on CoreDetails {
                                            type
                                            attributes {
                                                summary
                                            }
                                            innerBlocks {
                                                type
                                                ... on CoreHeading {
                                                    type
                                                    attributes {
                                                        level
                                                        content
                                                    }
                                                }
                                                ... on CoreParagraph {
                                                    type
                                                    attributes {
                                                        content
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                `;


    const response = await wpFetch<PagesResponse>(query, variables);
    return response.data;
}


// --- Series Query ---
interface SeriesListResponse {
    posts: PostsResponse["posts"];
}


export async function seriesQuery(series: string | null = null, first?: number, after: string | null = null): Promise<SeriesListResponse> {
    const variables: Record<string, any> = {series, first, after};


const query = `
                    query GetPaginatedPosts($first: Int!, $after: String, $series: String) {
                        posts(first: $first, after: $after,  where: {seriesSlugIn: $series}) {
                            pageInfo {
                                endCursor
                                hasNextPage
                            }
                            edges {
                                node {
                                    title
                                    slug
                                    series
                                    excerpt
                                    date
                                    dateGmt
                                    readingTime
                                    isSticky
                                    featuredImage {
                                        node {
                                            sourceUrl
                                            sourceFile
                                            mediaDetails {
                                                width
                                                height
                                                x
                                                y
                                                color
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                `;


const response = await wpFetch<SeriesListResponse>(query, variables);
return response.data;
}


// --- Topic Query ---
interface TopicListResponse {
    posts: PostsResponse["posts"];
}


export async function topicQuery(category: string | null = null, first?: number, after: string | null = null): Promise<TopicListResponse> {
    const variables: Record<string, any> = {category, first, after};
const query = `
                    query GetPaginatedPosts($first: Int!, $after: String, $category: String) {
                        posts(first: $first, after: $after,  where: {categoryName: $category}) {
                            pageInfo {
                                endCursor
                                hasNextPage
                            }
                            edges {
                                node {
                                    title
                                    slug
                                    series
                                    excerpt
                                    date
                                    dateGmt
                                    readingTime
                                    isSticky
                                    featuredImage {
                                        node {
                                            sourceUrl
                                            sourceFile
                                            mediaDetails {
                                                width
                                                height
                                                x
                                                y
                                                color
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                `;


const response = await wpFetch<TopicListResponse>(query, variables);
return response.data;
}


// --- Tag Query ---
interface TagListResponse {
    posts: PostsResponse["posts"];
}


export async function tagQuery(tag: string | null = null, first?: number, after: string | null = null): Promise<TagListResponse> {
    const variables: Record<string, any> = {tag, first, after};
const query = `
                    query GetPaginatedPosts($first: Int!, $after: String, $tag: String) {
                        posts(first: $first, after: $after,  where: {tagSlugIn: [$tag]}) {
                            pageInfo {
                                endCursor
                                hasNextPage
                            }
                            edges {
                                node {
                                    title
                                    slug
                                    series
                                    excerpt
                                    date
                                    dateGmt
                                    readingTime
                                    isSticky
                                    featuredImage {
                                        node {
                                            sourceUrl
                                            sourceFile
                                            mediaDetails {
                                                width
                                                height
                                                x
                                                y
                                                color
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                `;


const response = await wpFetch<TagListResponse>(query, variables);
return response.data;
}


// --- All Tags Query ---
interface AllTagsResponse {
    tags: {
        nodes: TagNode[];
    };
}


export async function allTagsQuery(): Promise<AllTagsResponse> {
    const query = `
                query allTags {
                    tags(first: 9999, where: {hideEmpty: true, orderby: COUNT}) {
                        nodes {
                            name
                            slug
                            count
                        }
                    }
                }
            `;
    const response = await wpFetch<AllTagsResponse>(query);
    return response.data;
}


// --- All Categories Query ---
interface AllCategoriesResponse {
    categories: {
        nodes: TopicNode[];
    };
}


export async function allCategoriesQuery(): Promise<AllCategoriesResponse> {
    const query = `
                query allCategories {
                    categories(first: 9999, where: {hideEmpty: true, orderby: COUNT}) {
                        nodes {
                            name
                            slug
                            count
                        }
                    }
                }
            `;
    const response = await wpFetch<AllCategoriesResponse>(query);
    return response.data;
}


// --- All Series Query ---
interface AllSeriesResponse {
    allSeries: {
        nodes: SeriesNode[];
    };
}


export async function allSeriesQuery(): Promise<AllSeriesResponse> {
    const query = `
                query allSeries {
                    allSeries(first: 9999, where: {hideEmpty: true, orderby: COUNT}) {
                        nodes {
                            name
                            slug
                            count
                        }
                    }
                }
            `;
    const response = await wpFetch<AllSeriesResponse>(query);
    return response.data;
}


// --- Single Series Query ---
interface SingleSeriesResponse {
    allSeries: {
        nodes: {
            name?: string;
            slug?: string;
            count?: number;
            description?: string;
        }[];
    };
}


export async function singleSeriesQuery(series: string | null = null): Promise<SingleSeriesResponse> {
    const first = (series && typeof series === "string") ? 1 : 9999;
    const variables: Record<string, any> = {first, series: [series]};


    const query = `
                query GetSeries($first: Int!, $series: [String]) {
                    allSeries(first: $first, where: {hideEmpty: true, orderby: COUNT, slug: $series}) {
                        nodes {
                            name
                            slug
                            count
                            description
                        }
                    }
                }
            `;


    const response = await wpFetch<SingleSeriesResponse>(query, variables);
    return response.data;
}


// --- Single Topic Query ---
interface SingleTopicResponse {
    categories: {
        nodes: {
            name?: string;
            slug?: string;
            count?: number;
            description?: string;
        }[];
    };
}


export async function singleTopicQuery(category: string | null): Promise<SingleTopicResponse> {
    const first = (category && typeof category === "string") ? 1 : 9999;
    const variables: Record<string, any> = {first, category: [category]};


    const query = `
                query GetTopics($first: Int!, $category: [String]) {
                    categories(first: $first, where: { hideEmpty: true, orderby: COUNT, slug: $category }) {
                        nodes {
                            name
                            slug
                            count
                            description
                        }
                    }
                }
            `;


    const response = await wpFetch<SingleTopicResponse>(query, variables);
    return response.data;
}


// --- Single Tag Query ---
interface SingleTagResponse {
    tags: {
        nodes: {
            name?: string;
            slug?: string;
            count?: number;
            description?: string;
        }[];
    };
}


export async function singleTagQuery(tag: string | null): Promise<SingleTagResponse> {
    const first = (tag && typeof tag === "string") ? 1 : 9999;
    const variables: Record<string, any> = {first, tag: [tag]};


    const query = `
                query GetTags($first: Int!, $tag: [String]) {
                    tags(first: $first, where: {hideEmpty: true, orderby: COUNT, slug: $tag}) {
                        nodes {
                            name
                            slug
                            count
                            description
                        }
                    }
                }
            `;
    const response = await wpFetch<SingleTagResponse>(query, variables);
    return response.data;
}


// --- Head Query ---
interface HeadResponse {
    head: any; //  Define a more specific type for 'head' if you know its structure
}


export async function headQuery(path: string): Promise<HeadResponse> {
    const variables: Record<string, any> = {path};


    const query = `
                query GetHead($path: String!) {
                    head(path: $path)
                }
            `;


    const response = await wpFetch<HeadResponse>(query, variables);
    return response.data;
}


// --- Twitch Token Fetch ---
interface TwitchTokenResponse {
    access_token: string;
    expires_in: number;
    token_type: string;
}


export async function fetchTwitchToken(): Promise<string> {
    const cache = new NodeCache({stdTTL: 2592000}); // Cache for 1 month
    const cacheKey = `twitch_token`;
    const cachedData = cache.get(cacheKey) as string;


    if (cachedData) {
        return JSON.parse(cachedData);
    }


    const clientId = process.env.TWITCH_CLIENT_ID;
    const secret = process.env.TWITCH_CLIENT_SECRET;


    if (!clientId || !secret) {
        throw new Error("Twitch client ID or secret are not defined in environment variables.");
    }


    const body = {
        client_id: clientId,
        client_secret: secret,
        grant_type: "client_credentials",
    };
    const urlEncodedData = new URLSearchParams(body).toString();


    const response: Response = await fetch(`https://id.twitch.tv/oauth2/token`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: urlEncodedData,
    });


    if (!response.ok) {
        throw new Error(`Failed to fetch Twitch token: ${response.statusText}`);
    }


    const data: TwitchTokenResponse = await response.json() as TwitchTokenResponse; // Type assertion here
    cache.set(cacheKey, JSON.stringify(data));


    return data.access_token;
}
