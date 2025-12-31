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

export default function AdminPage() {
    const [data, setData] = useState<LinksData | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Load initial data
        const loadData = async () => {
            const data = await getLinksData();
            setData(data);
        };
        loadData();
    }, []);

    const handleSave = async () => {
        if (!data || isSaving) return;

        setIsSaving(true);
        try {
            // Check session just in case
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                alert('로그인이 만료되었습니다.');
                router.push('/admin/login');
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

            alert('저장이 완료되었습니다.');
        } catch (error: any) {
            console.error('Save failed:', error);
            alert('저장에 실패했습니다: ' + error.message);
        } finally {
            setIsSaving(false);
        }
    };

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
                        <h1 className="text-2xl font-bold">링크 모음</h1>
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
                    <PreviewPanel data={data} />
                </div>

                {/* Right: Editor */}
                <div className="w-1/2 overflow-y-auto">
                    <EditorPanel data={data} onDataChange={setData} />
                </div>
            </div>
        </div>
    );
}
