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

export function getLinksData(): LinksData {
    return linksData as LinksData;
}

export function getEnabledLinks(): ContentItem[] {
    const data = getLinksData();
    return data.links.filter(link => link.enabled);
}
