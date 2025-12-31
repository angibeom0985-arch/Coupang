import { supabase } from "@/lib/supabase";
import tempLinksData from '@/data/links.json';

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
    profileEnabled?: boolean;
    siteTitle?: string;
    customHeadCode?: string;
    customBodyCode?: string;
}

export const SETTINGS_TABLE = 'settings';
export const SETTINGS_DOC_ID = 'coupang_links';

export async function getLinksData(): Promise<LinksData> {
    try {
        const { data, error } = await supabase
            .from(SETTINGS_TABLE)
            .select('data')
            .eq('id', SETTINGS_DOC_ID)
            .single();

        if (error) {
            console.warn('Supabase fetch error (might be first time):', error.message);
            // If error is PGRST116 (JSON object requested, multiple (or no) results returned), likely no data
            return tempLinksData as LinksData;
        }

        if (data) {
            return data.data as LinksData;
        }
    } catch (error) {
        console.warn('Failed to fetch from Supabase, falling back to local data:', error);
    }
    return tempLinksData as LinksData;
}
