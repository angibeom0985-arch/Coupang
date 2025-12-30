'use client';

import { useState, useEffect } from 'react';
import { getLinksData, LinksData } from '@/lib/data';
import { ProfileHeader } from '@/components/profile-header';
import { LinkCard } from '@/components/link-card';
import { EditorPanel } from '@/components/admin/editor-panel';
import { Smartphone } from 'lucide-react';

export default function Home() {
    const [data, setData] = useState<LinksData | null>(null);

    useEffect(() => {
        // Load initial data
        setData(getLinksData());
    }, []);

    if (!data) {
        return (
            <div className="h-screen flex items-center justify-center">
                <p className="text-muted-foreground">로딩 중...</p>
            </div>
        );
    }

    const enabledLinks = data.links.filter(link => link.enabled);

    return (
        <div className="h-screen flex flex-col">
            {/* Header */}
            <header className="border-b bg-background px-6 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">🔗 링크 인 바이오 에디터</h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            왼쪽에서 실시간 미리보기를 확인하며 오른쪽에서 편집하세요
                        </p>
                    </div>
                </div>
            </header>

            {/* Main Content - Split Screen */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left: Live Preview */}
                <div className="w-1/2 border-r bg-gradient-to-br from-slate-100 to-slate-200 flex flex-col items-center justify-center p-8">
                    <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
                        <Smartphone className="w-4 h-4" />
                        <span>실시간 미리보기</span>
                    </div>

                    {/* Mobile Frame */}
                    <div className="relative">
                        <div className="w-[375px] h-[667px] bg-white rounded-[3rem] shadow-2xl border-8 border-black overflow-hidden">
                            <div
                                className="w-full h-full overflow-y-auto"
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

                {/* Right: Editor Panel */}
                <div className="w-1/2 overflow-y-auto">
                    <EditorPanel data={data} onDataChange={setData} />
                </div>
            </div>
        </div>
    );
}
