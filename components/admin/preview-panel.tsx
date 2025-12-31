'use client';

import { useMemo, useState } from 'react';
import { LinksData } from '@/lib/data';
import { ProfileHeader } from '@/components/profile-header';
import { LinkCard } from '@/components/link-card';
import { Smartphone, Search } from 'lucide-react';
import { AdBanner } from '@/components/ad-banner';
import { Input } from '@/components/ui/input';

interface PreviewPanelProps {
    data: LinksData;
    onReorder?: (sourceId: string, targetId: string) => void;
}

export function PreviewPanel({ data, onReorder }: PreviewPanelProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [draggingId, setDraggingId] = useState<string | null>(null);
    const [dragOverId, setDragOverId] = useState<string | null>(null);
    const enabledLinks = data.links.filter((link) => link.enabled);
    const showSearch = data.searchEnabled === true;
    const filteredLinks = useMemo(() => {
        if (!showSearch) return enabledLinks;

        const query = searchQuery.trim().toLowerCase();
        if (!query) return enabledLinks;

        return enabledLinks.filter((item) => {
            if (item.type === 'link') {
                return item.title.toLowerCase().includes(query);
            }
            return item.content.toLowerCase().includes(query);
        });
    }, [enabledLinks, searchQuery, showSearch]);

    return (
        <div className="h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-slate-100 to-slate-200">
            <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
                <Smartphone className="w-4 h-4" />
                <span>미리보기</span>
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
                        <div className="py-12 px-6 space-y-6">
                            {data.customBodyCode && (
                                <div
                                    className="mb-2 overflow-hidden"
                                    dangerouslySetInnerHTML={{ __html: data.customBodyCode }}
                                />
                            )}

                            {data.profileEnabled !== false && (
                                <ProfileHeader profile={data.profile} />
                            )}

                            {showSearch && (
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder={data.searchPlaceholder || '검색어를 입력하세요'}
                                        className="pl-9 bg-white/80"
                                    />
                                </div>
                            )}

                            <div className="space-y-4">
                                {filteredLinks.map((item) => {
                                    const isDragging = draggingId === item.id;
                                    const isDragOver = dragOverId === item.id;
                                    return (
                                        <div
                                            key={item.id}
                                            draggable={!!onReorder}
                                            onDragStart={() => {
                                                setDraggingId(item.id);
                                                setDragOverId(item.id);
                                            }}
                                            onDragOver={(e) => {
                                                if (!onReorder) return;
                                                e.preventDefault();
                                                if (dragOverId !== item.id) {
                                                    setDragOverId(item.id);
                                                }
                                            }}
                                            onDrop={(e) => {
                                                e.preventDefault();
                                                if (onReorder && draggingId && draggingId !== item.id) {
                                                    onReorder(draggingId, item.id);
                                                }
                                                setDragOverId(null);
                                                setDraggingId(null);
                                            }}
                                            onDragEnd={() => {
                                                setDragOverId(null);
                                                setDraggingId(null);
                                            }}
                                            className={`transition-transform ${isDragging ? 'opacity-70' : ''} ${isDragOver && !isDragging ? 'ring-2 ring-primary/60 ring-offset-2 ring-offset-white' : ''}`}
                                        >
                                            <LinkCard key={item.id} item={item} theme={data.profile.theme} />
                                        </div>
                                    );
                                })}
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
