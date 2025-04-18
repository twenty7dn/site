import {
    blogQuery,
    headQuery,
    locationData,
    pagesQuery,
    singleSeriesQuery,
    singleTopicQuery,
    singleTagQuery,
    PostNode as ApiPostNode,
    PageNode as ApiPageNode,
    SeriesNode as ApiSeriesNode,
    TopicNode as ApiTopicNode,
    TagNode as ApiTagNode,
} from "./api";
import {format} from "date-fns";

// --- Utility Function ---
const Parse = (html: string | null = null): string | null => {
    return html && html.length > 0 ? String(html) : null;
};

// --- Content Interfaces ---
interface FormattedReadingTime {
    raw: string | null;
    formatted: string | null;
}

interface FormattedShortlink {
    uuid: string | null;
    slug: string | null;
}

interface FormattedDate {
    published: {
        raw: string;
        short: string;
        long: string;
    };
    modified: {
        raw: string;
        short: string;
        long: string;
    };
}

interface FormattedWriter {
    name: string | null;
}

interface FormattedTaxonomies {
    series: FormattedSeries | null;
    topics: FormattedTopic[];
    tags: FormattedTag[];
}

interface FormattedContentThumbnail {
    mimeType: string;
    source: string | null;
    dominantColor: string | null;
    dimensions: {
        width: number;
        height: number;
    };
    focalPoint: {
        x: string;
        y: string;
    };
}

interface FormattedContent {
    excerpt: string | null;
    full: {
        raw: string | null;
        blocks: any; //  Refine this type if you know the structure of editorBlocks
    };
    thumbnail: FormattedContentThumbnail | null;
}

// --- Paginated Results Interface ---
export interface PaginatedResult<T> {
    posts: T[]; // Changed from FormattedPost[] to generic T[] to reuse
    paginate: {
        totalPosts: number;
        nextPage: boolean;
        cursor: string | null;
    };
}


// --- Post Interfaces ---
export interface FormattedPost {
    title: string | null;
    subtitle: string | null;
    slug: string | null;
    path: string | null;
    pinned: boolean;
    license: string | null;
    readingTime: FormattedReadingTime;
    shortlink: FormattedShortlink;
    date: FormattedDate;
    writer: FormattedWriter;
    taxonomies: FormattedTaxonomies;
    content: FormattedContent;
}


// --- Page Interfaces ---
export interface FormattedPage {
    title: string | null;
    slug: string | null;
    path: string | null;
    date: FormattedDate;
    content: FormattedContent;
}


// --- Series Interfaces ---
export interface FormattedSeries {
    label: string | null;
    slug: string | null;
    path: string | null;
    count: number;
    content: {
        summary: string | null;
    };
}


// --- Topic Interfaces ---
export interface FormattedTopic {
    label: string | null;
    slug: string | null;
    path: string | null;
    count: number;
    content: {
        summary: string | null;
    };
}


// --- Tag Interfaces ---
export interface FormattedTag {
    label: string | null;
    slug: string | null;
    path: string | null;
    count: number;
    content: {
        summary: string | null;
    };
}


// --- Post Functions ---
const posts = async (
    first: number | null = null,
    after: string | null = null,
    slug: string | null = null,
    series: string | null = null,
    topic: string | null = null,
    tag: string | null = null,
    year: number | null = null, // Changed to number | null
    search: string | null = null,
): Promise<FormattedPost | PaginatedResult<FormattedPost>> => {
    const data = await blogQuery(first, after, slug, series, topic, tag, year, search);

    const output: FormattedPost[] = data.posts.edges.map(({node: post}) => {
        return formatPost(post);
    });

    const paginatedOutput: PaginatedResult<FormattedPost> = {
        posts: output,
        paginate: {
            totalPosts: data.posts.edges.length,
            nextPage: Boolean(data.posts.pageInfo.hasNextPage),
            cursor: data.posts.pageInfo.endCursor || null,
        },
    };

    return paginatedOutput;
};

const post = async (
    slug: string | null = null,
): Promise<FormattedPost> => {
    const data = await blogQuery(1, null, slug);

    const output: FormattedPost[] = data.posts.edges.map(({node: post}) => {
        return formatPost(post);
    });

    return output[0];
};

const formatPost = (post: ApiPostNode): FormattedPost => {
    return {
        title: post.title ? Parse(post.title) : null,
        subtitle: post.subtitle ? Parse(post.subtitle) : null,
        slug: post.slug ? String(post.slug) : null,
        path: post.slug && post.series ? String(`/writings/${post.slug}`) : null, // post.series could be undefined
        pinned: Boolean(post.isSticky),
        license: post.license ? Parse(post.license) : null,
        readingTime: {
            raw: post.readingTime ? String(post.readingTime) : null,
            formatted: post.readingTime ? `${post.readingTime} min read` : null,
        },
        shortlink: {
            uuid: post.shortlink ? String(`cross.fm/${post.shortlink}`) : null,
            slug: post.slug ? String(`cross.fm/${post.slug}`) : null,
        },
        date: {
            published: {
                raw: post.date ? new Date(post.date).toISOString() : new Date(0).toISOString(),
                short: post.date ? format(new Date(post.date), "MM/dd/yyyy") : "",
                long: post.date ? format(new Date(post.date), "MMMM d, yyyy") : "",
            },
            modified: {
                raw: post.modified ? new Date(post.modified).toISOString() : new Date(0).toISOString(),
                short: post.modified ? format(new Date(post.modified), "MM/dd/yyyy") : "",
                long: post.modified ? format(new Date(post.modified), "MMMM d, yyyy") : "",
            },
        },
        writer: {
            name: post.author?.node?.name ? Parse(post.author.node.name) : null,
        },
        taxonomies: {
            series: post.allSeries?.nodes?.length && post.allSeries?.nodes?.length > 0 ? formatSeries(post.allSeries.nodes[0]) : null, // Check nodes length
            topics: post.categories?.nodes?.map(formatTopic) || [], // Check nodes existence
            tags: post.tags?.nodes?.map(formatTag) || [], // Check nodes existence
        },
        content: {
            excerpt: post.excerpt ? Parse(post.excerpt.replace(" [&hellip;]", "&hellip;")) : null,
            full: {
                raw: post.content ? Parse(post.content) : null,
                blocks: post.editorBlocks || null,
            },
            thumbnail: post.featuredImage ? formatThumbnail(post.featuredImage) : null,
        },
    };
};


// --- Page Functions ---
const pages = async (first: number | null = null, after: string | null = null, slug: string | null = null): Promise<FormattedPage | PaginatedResult<FormattedPage>> => {
    const data = await pagesQuery(first, after, slug);

    const output: FormattedPage[] = data.pages.edges.map(({node: page}) => {
        return formatPage(page);
    });


    const paginatedOutput: PaginatedResult<FormattedPage> = {
        posts: output, // Corrected to 'posts' for pages as well for consistency.
        paginate: {
            totalPosts: data.pages.edges.length,
            nextPage: Boolean(data.pages.pageInfo.hasNextPage),
            cursor: data.pages.pageInfo.endCursor || null,
        },
    };
    return paginatedOutput; // Corrected to output.posts[0]

};

const page = async (slug: string | null = null): Promise<FormattedPage> => {
    const data = await pagesQuery(1, null, slug);

    const output: FormattedPage[] = data.pages.edges.map(({node: page}) => {
        return formatPage(page);
    });

    return output[0];

};


const formatPage = (page: ApiPageNode): FormattedPage => {
    return {
        title: page.title ? Parse(page.title) : null,
        slug: page.slug ? String(page.slug) : null,
        path: page.slug ? String(`/${page.slug}`) : null,
        date: {
            published: {
                raw: page.date ? new Date(page.date).toISOString() : new Date(0).toISOString(),
                short: page.date ? format(new Date(page.date), "MM/dd/yyyy") : "",
                long: page.date ? format(new Date(page.date), "MMMM d, yyyy") : "",
            },
            modified: {
                raw: page.modified ? new Date(page.modified).toISOString() : new Date(0).toISOString(),
                short: page.modified ? format(new Date(page.modified), "MM/dd/yyyy") : "",
                long: page.modified ? format(new Date(page.modified), "MMMM d, yyyy") : "",
            },
        },
        content: {
            full: {
                raw: page.content ? Parse(page.content) : null,
                blocks: page.editorBlocks || null,
            },
            thumbnail: null,
            excerpt: null,
        },
    };
};


// --- Series Functions ---
const series = async (seriesSlug: string | null = null): Promise<FormattedSeries | FormattedSeries[]> => {
    const data = await singleSeriesQuery(seriesSlug);
    // @ts-ignore
    const output: FormattedSeries[] = data.allSeries.nodes.map(formatSeries);
    return seriesSlug ? output[0] : output;
};


const formatSeries = (seriesData: ApiSeriesNode): FormattedSeries => {
    return {
        label: seriesData.name ? Parse(seriesData.name) : null,
        slug: seriesData.slug ? String(seriesData.slug) : null,
        path: seriesData.slug ? String(`/writings/series/${seriesData.slug}`) : null,
        count: seriesData.count != null ? Number(seriesData.count) : 0,
        content: {
            summary: seriesData.description ? Parse(seriesData.description) : null,
        },
    };
};


// --- Topic Functions ---
const topics = async (topicSlug: string | null = null): Promise<FormattedTopic | FormattedTopic[]> => {
    const data = await singleTopicQuery(topicSlug);
    // @ts-ignore
    const output: FormattedTopic[] = data.categories.nodes.map(formatTopic);
    return topicSlug ? output[0] : output;
};


const formatTopic = (topicData: ApiTopicNode): FormattedTopic => {
    return {
        label: topicData.name ? Parse(topicData.name) : null,
        slug: topicData.slug ? String(topicData.slug) : null,
        path: topicData.slug ? String(`/writings/topics/${topicData.slug}`) : null,
        count: topicData.count != null ? Number(topicData.count) : 0,
        content: {
            summary: topicData.description ? Parse(topicData.description) : null,
        },
    };
};


const tags = async (tagSlug: string | null = null): Promise<FormattedTag | FormattedTag[]> => {
    const data = await singleTagQuery(tagSlug);
    // @ts-ignore
    const output: FormattedTag[] = data.tags.nodes.map(formatTag);
    return tagSlug ? output[0] : output;
};


const formatTag = (tagData: ApiTagNode): FormattedTag => {
    return {
        label: tagData.name ? Parse(tagData.name) : null,
        slug: tagData.slug ? String(tagData.slug) : null,
        path: tagData.slug ? String(`/writings/tags/${tagData.slug}`) : null,
        count: tagData.count != null ? Number(tagData.count) : 0,
        content: {
            summary: tagData.description ? Parse(tagData.description) : null,
        },
    };
};


// --- Thumbnail Functions ---
const formatThumbnail = (featuredImage: ApiPostNode["featuredImage"]): FormattedContentThumbnail | null => { // Updated parameter type and return type
    if (!featuredImage?.node) { // Check if featuredImage or featuredImage.node is null/undefined
        return null;
    }
    const thumbnail = featuredImage.node;
    return {
        mimeType: String(thumbnail.mimeType),
        source: thumbnail.sourceUrl ? String(thumbnail.sourceUrl) : null,
        dominantColor: thumbnail.mediaDetails?.color ? String(thumbnail.mediaDetails.color) : null,
        dimensions: {
            width: thumbnail.mediaDetails?.width != null ? Number(thumbnail.mediaDetails.width) : 0,
            height: thumbnail.mediaDetails?.height != null ? Number(thumbnail.mediaDetails.height) : 0,
        },
        focalPoint: {
            x: thumbnail.mediaDetails?.x ? String(thumbnail.mediaDetails.x) : "0.5",
            y: thumbnail.mediaDetails?.y ? String(thumbnail.mediaDetails.y) : "0.5",
        },
    };
};


// --- Head, Location, and Content Functions ---
const head = async (path: string): Promise<any> => { // Type 'any' can be replaced with a more specific type
    return await headQuery(path);
};


const getLocation = async (): Promise<any> => { // Type 'any' can be replaced with a more specific type
    return await locationData();
};


interface ContentQuery {
    first?: number | null;
    after?: string | null;
    slug?: string | null;
    series?: string | null;
    topic?: string | null;
    tag?: string | null;
    search?: string | null;
    year?: number | null;
}

type CollectionType = "post" | "posts" | "page" | "pages" | "series" | "topics" | "tags";


const getContent = async (
    collection: CollectionType,
    query: ContentQuery = {
        first: null,
        after: null,
        slug: null,
        series: null,
    }
): Promise<FormattedPost | FormattedPost[] | FormattedPage | FormattedPage[] | FormattedSeries | FormattedSeries[] | FormattedTopic | FormattedTopic[] | FormattedTag | FormattedTag[] | PaginatedResult<FormattedPost> | PaginatedResult<FormattedPage> | PaginatedResult<FormattedSeries> | PaginatedResult<FormattedTopic> | PaginatedResult<FormattedTag> | undefined> => {

    let result: FormattedPost | FormattedPost[] | FormattedPage | FormattedPage[] | FormattedSeries | FormattedSeries[] | FormattedTopic | FormattedTopic[] | FormattedTag | FormattedTag[] | PaginatedResult<FormattedPost> | PaginatedResult<FormattedPage> | PaginatedResult<FormattedSeries> | PaginatedResult<FormattedTopic> | PaginatedResult<FormattedTag> | undefined;

    switch (collection) {
        case "posts":
            result = await posts(
                query.first,
                query.after,
                query.slug,
                query.series,
                query.topic,
                query.tag,
                query.year,
                query.search,
            ) as FormattedPost | PaginatedResult<FormattedPost>;
            break;
        case "post":
            result = await post(
                query.slug
            ) as FormattedPost;
            break;
        case "page":
            result = await page(query.slug) as FormattedPage;
            break;
        case "pages":
            result = await pages(query.first, query.after, query.slug) as FormattedPage | PaginatedResult<FormattedPage>;
            break;
        case "series":
            result = await series(query.slug) as FormattedSeries | FormattedSeries[];
            break;
        case "topics":
            result = await topics(query.slug) as FormattedTopic | FormattedTopic[];
            break;
        case "tags":
            result = await tags(query.slug) as FormattedTag | FormattedTag[];
            break;
        default:
            result = undefined;
            break;
    }
    return result;
};


// --- Library Functions (unchanged from your previous version) ---
interface LibraryItem {
    [key: string]: any; // Allows any other properties
    type: string;
    dates?: {
        added?: string;
    };
}


const getLibrary = async (status: number, limit: number = 1000): Promise<LibraryItem[]> => {
    const baseUrl = `${process.env.NEXT_PUBLIC_WORDPRESS_REST_API_ENDPOINT}/library`;
    const endpoints: string[] = ["films", "shows", "books", "comics", "games"];
    const mergedList: LibraryItem[] = [];


    const fetchPromises = endpoints.map(async (type) => {
        try {
            const url = `${baseUrl}/${type}/${status}?limit=${limit}`;

            const responseData = await fetch(url, {
                method: "GET",
                headers: {"Content-Type": "application/json"}
            }).then((response) => response.json());

            // Validate response structure
            if (!responseData || !Array.isArray(responseData.items)) {
                console.error(`Unexpected response format for ${type}:`, responseData);
                return [];
            }


            return responseData.items.map((item: any) => ({
                ...item,
                type
            }));
        } catch (error) {
            console.error(`Error fetching ${type}:`, error);
            return [];
        }
    });


    const results = await Promise.all(fetchPromises);


    results.forEach(itemList => {
        if (itemList && Array.isArray(itemList)) {
            mergedList.push(...itemList);
        }
    });


    // Sort by dates.added
    mergedList.sort((a, b) => {
        const dateA = a.dates?.added ? new Date(a.dates.added) : new Date(0); // Default to epoch if missing
        const dateB = b.dates?.added ? new Date(b.dates.added) : new Date(0);
        return dateB.getTime() - dateA.getTime(); // Sort in descending order
    });

    return mergedList;
};


const getLibraryUrl = (type: string, status: string, limit: number = 1000): string => {
    const baseUrl = process.env.LIBRARY_API_URL;
    return `${baseUrl}/${type}/${status}?limit=${limit}`;
};


export {
    getContent,
    getLocation,
    getLibrary,
    getLibraryUrl,
    posts, // Export individual content type functions if needed
    pages,
    series,
    topics,
    tags,
    formatPost, // Export formatPost and other format... functions if you want to use them elsewhere
    formatPage,
    formatSeries,
    formatTopic,
    formatTag
};
