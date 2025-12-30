'use client';

import { LinksData, ContentItem } from '@/lib/data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProfileEditor } from './profile-editor';
import { LinkEditor } from './link-editor';
import { ThemeEditor } from './theme-editor';
import { DataManager } from './data-manager';

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

    return (
        <div className="h-full flex flex-col bg-background">
            <div className="border-b px-6 py-4">
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
                        value="manage"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6"
                    >
                        ⚙️ 관리
                    </TabsTrigger>
                </TabsList>

                <div className="flex-1 overflow-y-auto">
                    <TabsContent value="page" className="m-0 p-6 space-y-6">
                        <ProfileEditor
                            profile={data.profile}
                            onUpdate={updateProfile}
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
