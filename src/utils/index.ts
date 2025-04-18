export function formatInteger(number: number): string {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function listToString(array: string[]): string {
    if (array.length === 0) return "";
    if (array.length === 1) return array[0];

    const allButLast = array.slice(0, -1);
    const lastItem = array[array.length - 1];

    return `${allButLast.join(", ")} & ${lastItem}`;
}

export function sanitizeText(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
}

export function arrayColumns<T>(arr: T[]): [T[], T[]] {
    const evenIndexes: T[] = [];
    const oddIndexes: T[] = [];

    arr.forEach((item, index) => {
        if (index % 2 === 0) {
            evenIndexes.push(item);
        } else {
            oddIndexes.push(item);
        }
    });

    return [evenIndexes, oddIndexes];
}

export function replaceUnderlinedSpans(html: string): string {
    return html.replace(
        /<span\s+[^>]*style=["'][^"']*text-decoration:\s*underline;?[^"']*["'][^>]*>(.*?)<\/span>/gi,
        "<u>$1</u>",
    );
}

export function formatRuntime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours > 0 && mins > 0) {
        return `${hours}h ${mins}m`;
    } else if (hours > 0) {
        return `${hours}h`;
    } else {
        return `${mins}m`;
    }
}

interface Link {
    category: number;
    url: string;
}

export function gameLink(links: Link[]): string | null {
    const priority = [13, 17, 15, 3, 2, 1];

    for (const category of priority) {
        const link = links.find((link) => link.category === category);
        if (link) return link.url;
    }

    return links[0]?.url || null;
}

export function stripHtml(html: string | null | undefined): string {
    if (!html) return "";

    return html
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<\/(p|div|h[1-6]|li|blockquote|pre|tr|td|th|ul|ol|table)>/gi, "\n")
        .replace(/<[^>]+>/g, "")
        .replace(/\n{2,}/g, "\n")
        .trim();
}
