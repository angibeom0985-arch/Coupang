import { useDebounce } from 'use-debounce';
import { LinksData, ContentItem } from '@/lib/data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { ProfileEditor } from './profile-editor';
import { LinkEditor } from './link-editor';
import { ThemeEditor } from './theme-editor';
import { DataManager } from './data-manager';
import { SiteSettingsEditor } from './site-settings-editor';

interface EditorPanelProps {
    data: LinksData;
    onDataChange: (newData: LinksData) => void;
}

export function EditorPanel({ data, onDataChange }: EditorPanelProps) {
    const [debouncedData] = useDebounce(data, 1000);

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
                        value="settings"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6"
                    >
                        ⚙️ 설정
                    </TabsTrigger>
                    <TabsTrigger
                        value="manage"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6"
                    >
                        📊 통계
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

                            <div className="p-4 bg-muted/50 rounded-lg border">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="space-y-2 flex-1">
                                        <label className="text-sm font-medium block">
                                            🔍 검색창 표시
                                        </label>
                                        <p className="text-sm text-muted-foreground">
                                            링크/텍스트를 제목으로 찾을 수 있는 검색 입력창을 표시합니다.
                                        </p>
                                        {data.searchEnabled && (
                                            <Input
                                                value={data.searchPlaceholder || ''}
                                                onChange={(e) => onDataChange({ ...data, searchPlaceholder: e.target.value })}
                                                placeholder="검색어를 입력하세요"
                                            />
                                        )}
                                    </div>
                                    <Switch
                                        checked={data.searchEnabled === true}
                                        onCheckedChange={(checked) => onDataChange({ ...data, searchEnabled: checked })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <ProfileEditor
                                    profile={data.profile}
                                    onUpdate={updateProfile}
                                    enabled={data.profileEnabled !== false}
                                    onToggle={(checked) => onDataChange({ ...data, profileEnabled: checked })}
                                />
                            </div>
                        </div>
                        <LinkEditor
                            links={data.links}
                            onUpdate={updateLinks}
                        />
                    </TabsContent>

                    <TabsContent value="design" className="m-0 p-6">
                        <ThemeEditor
                            theme={data.profile.theme}
                            onUpdate={updateTheme}
                            faviconUrl={data.faviconUrl}
                            onFaviconUpdate={(url) => onDataChange({ ...data, faviconUrl: url })}
                        />
                    </TabsContent>

                    <TabsContent value="settings" className="m-0 p-6">
                        <SiteSettingsEditor
                            data={data}
                            onUpdate={(updates) => onDataChange({ ...data, ...updates })}
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
