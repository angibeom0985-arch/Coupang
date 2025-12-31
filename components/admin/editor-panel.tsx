import { LinksData, ContentItem } from '@/lib/data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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

    const updateLinks = (newLinks: ContentItem[]) => {
        onDataChange({
            ...data,
            links: newLinks,
        });
    };

    const bannerEnabled = data.adBannerEnabled !== false;
    const bannerTextColors = ['#0f172a', '#ffffff', '#334155', '#f97316'];
    const bannerBgColors = ['#fde68a', '#fca5a5', '#d9f99d', '#c7d2fe', '#0f172a', '#f97316'];

    const renderBannerCard = (options?: { showColors?: boolean }) => {
        const showColors = options?.showColors !== false;
        return (
            <div className="p-4 bg-muted/50 rounded-lg border space-y-4">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="text-sm font-medium">배너 문구</p>
                        <p className="text-xs text-muted-foreground">페이지 상단에 노출되는 안내/공지 배너입니다.</p>
                    </div>
                    <Switch
                        checked={bannerEnabled}
                        onCheckedChange={(checked) => onDataChange({ ...data, adBannerEnabled: checked })}
                    />
                </div>
                <Textarea
                    value={data.adBanner || ''}
                    onChange={(e) => onDataChange({ ...data, adBanner: e.target.value })}
                    placeholder="상단 배너에 표시할 문구를 입력하세요."
                    rows={3}
                />
                {showColors && (
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                            <p className="text-xs font-medium text-muted-foreground">글씨 색상</p>
                            <div className="flex gap-2 flex-wrap">
                                {bannerTextColors.map((c) => (
                                    <button
                                        key={c}
                                        className={`w-8 h-8 rounded-full border ${data.adBannerTextColor === c ? 'ring-2 ring-primary' : ''}`}
                                        style={{ backgroundColor: c }}
                                        onClick={() => onDataChange({ ...data, adBannerTextColor: c })}
                                    />
                                ))}
                                <Input
                                    type="color"
                                    value={data.adBannerTextColor || '#ffffff'}
                                    onChange={(e) => onDataChange({ ...data, adBannerTextColor: e.target.value })}
                                    className="w-12 h-8 p-0"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <p className="text-xs font-medium text-muted-foreground">배경 색상</p>
                            <div className="flex gap-2 flex-wrap">
                                {bannerBgColors.map((c) => (
                                    <button
                                        key={c}
                                        className={`w-8 h-8 rounded-full border ${data.adBannerBackground === c ? 'ring-2 ring-primary' : ''}`}
                                        style={{ backgroundColor: c }}
                                        onClick={() => onDataChange({ ...data, adBannerBackground: c })}
                                    />
                                ))}
                                <Input
                                    type="color"
                                    value={data.adBannerBackground || '#f97316'}
                                    onChange={(e) => onDataChange({ ...data, adBannerBackground: e.target.value })}
                                    className="w-12 h-8 p-0"
                                />
                            </div>
                        </div>
                    </div>
                )}
                <div className="p-3 rounded-lg border flex items-center gap-3" style={{ backgroundColor: data.adBannerBackground || '#f97316' }}>
                    <span className="text-sm font-medium" style={{ color: data.adBannerTextColor || '#ffffff' }}>
                        {data.adBanner || '배너 문구를 입력하세요.'}
                    </span>
                </div>
            </div>
        );
    };

    return (
        <div className="h-full flex flex-col bg-background">
            <div className="border-b px-6 py-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">편집</h2>
            </div>

            <Tabs defaultValue="page" className="flex-1 flex flex-col">
                <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
                    <TabsTrigger
                        value="page"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6"
                    >
                        기본 페이지
                    </TabsTrigger>
                    <TabsTrigger
                        value="design"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6"
                    >
                        디자인
                    </TabsTrigger>
                    <TabsTrigger
                        value="settings"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6"
                    >
                        설정
                    </TabsTrigger>
                    <TabsTrigger
                        value="manage"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6"
                    >
                        데이터 관리
                    </TabsTrigger>
                </TabsList>

                <div className="flex-1 overflow-y-auto">
                    <TabsContent value="page" className="m-0 p-6 space-y-6">
                        <div className="space-y-4">
                            {renderBannerCard({ showColors: false })}

                            <div className="p-4 bg-muted/50 rounded-lg border">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="space-y-2 flex-1">
                                        <label className="text-sm font-medium block">
                                            검색 기능 표시
                                        </label>
                                        <p className="text-sm text-muted-foreground">
                                            링크/텍스트 제목으로 찾을 수 있는 검색 바를 표시합니다.
                                        </p>
                                        {data.searchEnabled && (
                                            <Input
                                                value={data.searchPlaceholder || ''}
                                                onChange={(e) => onDataChange({ ...data, searchPlaceholder: e.target.value })}
                                                placeholder="검색어를 입력하세요."
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

                    <TabsContent value="design" className="m-0 p-6 space-y-6">
                        {renderBannerCard()}

                        <ThemeEditor
                            theme={data.profile.theme}
                            onUpdate={updateTheme}
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
