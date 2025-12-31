'use client';

import { useState, useEffect } from 'react';
import { LinksData } from '@/lib/data';
import { ProfileHeader } from '@/components/profile-header';
import { LinkCard } from '@/components/link-card';
import { Smartphone } from 'lucide-react';

import { AdBanner } from '@/components/ad-banner';

interface PreviewPanelProps {
    data: LinksData;
}

export function PreviewPanel({ data }: PreviewPanelProps) {
    const enabledLinks = data.links.filter(link => link.enabled);

    return (
        <div className="h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-slate-100 to-slate-200">
            <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
                <Smartphone className="w-4 h-4" />
                <span>실시간 미리보기</span>
            </div>

            <div className="relative">
                {/* Mobile frame */}
                <div className="w-[375px] h-[667px] bg-white rounded-[3rem] shadow-2xl border-8 border-black overflow-hidden flex flex-col">
                    {/* Status Bar Area (Top rounded corners safe area) */}
                    <div className="h-6 w-full bg-white shrink-0"></div>

                    {data.adBanner && <AdBanner text={data.adBanner} />}

                    <div
                        className="w-full flex-1 overflow-y-auto"
                        style={{ backgroundColor: data.profile.theme.backgroundColor }}
                    >
                        <div className="py-12 px-6">
                            <ProfileHeader profile={data.profile} />

                            <div className="space-y-4">
                                {enabledLinks.map((item) => (
                                    <LinkCard key={item.id} item={item} theme={data.profile.theme} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Home button */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-12 h-12 bg-black rounded-full opacity-20"></div>
            </div>
        </div>
    );
}
