'use client';

import { useState, useEffect, Suspense } from 'react';
import { getLinksData } from '@/lib/data';
import type { LinksData } from '@/lib/data';
import { ProfileHeader } from '@/components/profile-header';
import { LinkCard } from '@/components/link-card';
import { AdBanner } from '@/components/ad-banner';
import { AnalyticsTracker } from '@/components/analytics-tracker';

export default function Home() {
    const [data, setData] = useState<LinksData | null>(null);

    useEffect(() => {
        // Load initial data
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

    return (
        <>
            <Suspense>
                <AnalyticsTracker />
            </Suspense>
            {data.adBanner && <AdBanner text={data.adBanner} />}

            <div
                className="min-h-screen py-12 px-4 sm:px-6 lg:px-8"
                style={{ backgroundColor: data.profile.theme.backgroundColor }}
            >
                <div className="max-w-2xl mx-auto">
                    {/* Custom Body Code (Display Ads) */}
                    {data.customBodyCode && (
                        <div
                            className="mb-8 overflow-hidden"
                            dangerouslySetInnerHTML={{ __html: data.customBodyCode }}
                        />
                    )}

                    {data.profileEnabled !== false && (
                        <ProfileHeader profile={data.profile} />
                    )}

                    <div className="space-y-4 mt-8">
                        {enabledLinks.map((item) => (
                            <LinkCard key={item.id} item={item} theme={data.profile.theme} />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
