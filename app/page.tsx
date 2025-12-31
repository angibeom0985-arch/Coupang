'use client';

import { useState, useEffect, Suspense } from 'react';
import { getLinksData } from '@/lib/data';
import type { LinksData } from '@/lib/data';
import { ProfileHeader } from '@/components/profile-header';
import { LinkCard } from '@/components/link-card';
import { AdBanner } from '@/components/ad-banner';
import { AnalyticsTracker } from '@/components/analytics-tracker';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default function Home() {
    const [data, setData] = useState<LinksData | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const loadData = async () => {
            const data = await getLinksData();
            setData(data);
        };
        loadData();
    }, []);

    if (!data) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-muted-foreground">로딩 중...</p>
            </div>
        );
    }

    const enabledLinks = data.links.filter(link => link.enabled);
    const showSearch = data.searchEnabled === true;
    const bodyAdCode = data.customBodyCode ?? data.adCode ?? '';
    const showBanner = (data.adBannerEnabled !== false) && Boolean(data.adBanner);
    const filteredLinks = enabledLinks.filter((item) => {
        if (!showSearch) return true;

        const query = searchQuery.trim().toLowerCase();
        if (!query) return true;

        if (item.type === 'link') {
            return item.title.toLowerCase().includes(query);
        }

        if (item.type === 'text') {
            return item.content.toLowerCase().includes(query);
        }

        return true;
    });

    return (
        <>
            <Suspense>
                <AnalyticsTracker />
            </Suspense>
            {showBanner && (
                <AdBanner
                    text={data.adBanner || ''}
                    background={data.adBannerBackground}
                    textColor={data.adBannerTextColor}
                />
            )}

            <div
                className="min-h-screen py-12 px-4 sm:px-6 lg:px-8"
                style={{ backgroundColor: data.profile.theme.backgroundColor }}
            >
                <div className="max-w-2xl mx-auto">
                    {/* Custom Body Code (Display Ads) */}
                    {bodyAdCode && (
                        <div
                            className="mb-8 overflow-hidden"
                            dangerouslySetInnerHTML={{ __html: bodyAdCode }}
                        />
                    )}

                    {data.profileEnabled !== false && (
                        <ProfileHeader profile={data.profile} />
                    )}

                    {showSearch && (
                        <div className="relative mt-6">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={data.searchPlaceholder || '링크를 검색해 보세요'}
                                className="pl-9"
                            />
                        </div>
                    )}

                    <div className="space-y-4 mt-8">
                        {filteredLinks.map((item) => (
                            <LinkCard
                                key={item.id}
                                item={item}
                                theme={data.profile.theme}
                                adCode={bodyAdCode}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
