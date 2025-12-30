'use client';

import { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import { LinksData, ContentItem } from '@/lib/data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { ProfileEditor } from './profile-editor';
import { LinkEditor } from './link-editor';
import { ThemeEditor } from './theme-editor';
import { DataManager } from './data-manager';
import { Loader2, Check, Cloud } from 'lucide-react';

interface EditorPanelProps {
    data: LinksData;
    onDataChange: (newData: LinksData) => void;
}

export function EditorPanel({ data, onDataChange }: EditorPanelProps) {
    const [debouncedData] = useDebounce(data, 1000);
    const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');
    const [lastSaved, setLastSaved] = useState<Date | null>(null);

    // Auto-save effect
    useEffect(() => {
        const saveData = async () => {
            if (!debouncedData) return;

            setSaveStatus('saving');
            try {
                const response = await fetch('/api/save', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(debouncedData),
                });

                const result = await response.json();

                if (result.success) {
                    setSaveStatus('saved');
                    setLastSaved(new Date());
                } else {
                    setSaveStatus('error');
                    console.error('Save failed:', result.error);
                }
            } catch (error) {
                setSaveStatus('error');
                console.error('Save error:', error);
            }
        };

        // Only save if data has been loaded and initialized
        if (debouncedData) {
            saveData();
        }
    }, [debouncedData]);

    const updateProfile = (key: string, value: any) => {
        onDataChange({
            ...data,
            profile: {
                ...data.profile,
                [key]: value,
            },
        });
    };

    const updateTheme = (key: string, value: any) => {
        onDataChange({
            ...data,
            profile: {
                ...data.profile,
                theme: {
                    ...data.profile.theme,
                    [key]: value,
                },
            },
        });
    };

    const updateAdBanner = (text: string) => {
        onDataChange({
            ...data,
            adBanner: text,
        });
    };

    const updateLinks = (newLinks: ContentItem[]) => {
        onDataChange({
            ...data,
            links: newLinks,
        });
    };

    return (
        <div className="h-full flex flex-col bg-background">
            <div className="border-b px-6 py-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">편집 패널</h2>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {saveStatus === 'saving' && (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>저장 중...</span>
                        </>
                    )}
                    {saveStatus === 'saved' && (
                        <>
                            <Cloud className="w-4 h-4 text-blue-500" />
                            <span>자동 저장됨</span>
                            {lastSaved && (
                                <span className="text-xs text-muted-foreground/50 ml-1">
                                    {lastSaved.toLocaleTimeString()}
                                </span>
                            )}
                        </>
                    )}
                    {saveStatus === 'error' && (
                        <span className="text-red-500">❌ 저장 실패</span>
                    )}
                </div>
            </div>

            <Tabs defaultValue="page" className="flex-1 flex flex-col">
                <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
                    <TabsTrigger
                        value="page"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6"
                    >
                        📄 페이지
                    </TabsTrigger>
                    <TabsTrigger
                        value="design"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6"
                    >
                        🎨 디자인
                    </TabsTrigger>
                    <TabsTrigger
                        value="manage"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6"
                    >
                        ⚙️ 관리
                    </TabsTrigger>
                </TabsList>

                <div className="flex-1 overflow-y-auto">
                    <TabsContent value="page" className="m-0 p-6 space-y-6">
                        <div className="space-y-4">
                            <div className="p-4 bg-muted/50 rounded-lg border">
                                <label className="text-sm font-medium mb-2 block">
                                    📢 상단 광고 배너 문구
                                </label>
                                <input
                                    type="text"
                                    value={data.adBanner || ''}
                                    onChange={(e) => updateAdBanner(e.target.value)}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="오른쪽에서 왼쪽으로 흐르는 광고 문구를 입력하세요"
                                />
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border">
                                    <label className="text-sm font-medium">
                                        프로필 설정
                                    </label>
                                    <Switch
                                        checked={data.profileEnabled !== false}
                                        onCheckedChange={(checked) => onDataChange({ ...data, profileEnabled: checked })}
                                    />
                                </div>
                                {data.profileEnabled !== false && (
                                    <ProfileEditor
                                        profile={data.profile}
                                        onUpdate={updateProfile}
                                    />
                                )}
                            </div>
                        </div>
                        <LinkEditor
                            links={data.links}
                            onUpdate={updateLinks}
                        />
                        <LinkEditor
                            links={data.links}
                            onUpdate={updateLinks}
                        />
                    </TabsContent>

                    <TabsContent value="design" className="m-0 p-6">
                        <ThemeEditor
                            theme={data.profile.theme}
                            onUpdate={updateTheme}
                        />
                    </TabsContent>

                    <TabsContent value="manage" className="m-0 p-6">
                        <DataManager data={data} />
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    );
}
