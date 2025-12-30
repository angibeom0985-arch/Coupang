import { kv } from '@vercel/kv';
import linksData from '@/data/links.json';

export interface Theme {
    backgroundColor: string;
    textColor: string;
    buttonColor: string;
    buttonTextColor: string;
    buttonStyle: 'rounded' | 'square' | 'pill';
}

export interface Profile {
    name: string;
    description: string;
    avatar: string;
    theme: Theme;
}

export interface LinkItem {
    id: string;
    type: 'link';
    title: string;
    url: string;
    icon: string;
    enabled: boolean;
}

export interface TextItem {
    id: string;
    type: 'text';
    content: string;
    enabled: boolean;
}

export type ContentItem = LinkItem | TextItem;

export interface LinksData {
    profile: Profile;
    links: ContentItem[];
    adBanner?: string;
}

const DATA_KEY = 'coupang_links_data';

export async function getLinksData(): Promise<LinksData> {
    try {
        const data = await kv.get<LinksData>(DATA_KEY);
        if (data) {
            return data;
        }
    } catch (error) {
        console.warn('Failed to fetch from KV, falling back to local data:', error);
    }

    return linksData as LinksData;
}
