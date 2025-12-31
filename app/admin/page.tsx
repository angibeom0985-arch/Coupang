'use client';

import { useState, useEffect } from 'react';
import { getLinksData } from '@/lib/data';
import type { LinksData } from '@/lib/data';
import { PreviewPanel } from '@/components/admin/preview-panel';
import { EditorPanel } from '@/components/admin/editor-panel';
import { supabase } from '@/lib/supabase';
import { SETTINGS_TABLE, SETTINGS_DOC_ID } from '@/lib/data';
import { Loader2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useDebounce } from 'use-debounce';

export default function AdminPage() {
    const [data, setData] = useState<LinksData | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [debouncedData] = useDebounce(data, 1500);
    const router = useRouter();

    useEffect(() => {
        // Load initial data
        const loadData = async () => {
            const data = await getLinksData();
            setData(data);
        };
        loadData();
    }, []);

    const saveData = async (options?: { silent?: boolean }) => {
        const silent = options?.silent ?? false;
        if (!data || isSaving) return;

        setIsSaving(true);
        try {
            // Check session just in case
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                if (!silent) {
                    alert('로그인이 만료되었습니다. 다시 로그인해주세요.');
                    router.push('/admin/login');
                }
                return;
            }

            const { error } = await supabase
                .from(SETTINGS_TABLE)
                .upsert({
                    id: SETTINGS_DOC_ID,
                    data: data,
                    updated_at: new Date().toISOString()
                });

            if (error) throw error;

            if (!silent) {
                alert('저장되었습니다.');
            }
        } catch (error: any) {
            console.error('Save failed:', error);
            if (!silent) {
                alert('저장에 실패했습니다: ' + error.message);
            }
        } finally {
            setIsSaving(false);
        }
    };

    useEffect(() => {
        if (!debouncedData) return;
        // 데이터 변경 후 자동 저장 (조용히)
        saveData({ silent: true });
    }, [debouncedData]);

    const handleReorder = (sourceId: string, targetId: string) => {
        setData((prev) => {
            if (!prev) return prev;
            const links = [...prev.links];
            const fromIndex = links.findIndex((l) => l.id === sourceId);
            const toIndex = links.findIndex((l) => l.id === targetId);
            if (fromIndex === -1 || toIndex === -1) return prev;

            const [moved] = links.splice(fromIndex, 1);
            links.splice(toIndex, 0, moved);
            return { ...prev, links };
        });
    };

    const handleSave = () => saveData({ silent: false });

    if (!data) {
        return (
            <div className="h-screen flex items-center justify-center">
                <p className="text-muted-foreground">로딩 중...</p>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col">
            {/* Header */}
            <header className="border-b bg-background px-6 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">관리 콘솔</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <a
                            href="/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                            공개 페이지 보기 →
                        </a>
                        <Button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="flex items-center gap-2"
                        >
                            {isSaving ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Save className="w-4 h-4" />
                            )}
                            저장하기
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left: Preview */}
                <div className="w-1/2 border-r">
                    <PreviewPanel data={data} onReorder={handleReorder} />
                </div>

                {/* Right: Editor */}
                <div className="w-1/2 overflow-y-auto">
                    <EditorPanel data={data} onDataChange={setData} />
                </div>
            </div>
        </div>
    );
}
