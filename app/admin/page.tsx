'use client';

import { useState, useEffect } from 'react';
import { getLinksData, LinksData } from '@/lib/data';
import { PreviewPanel } from '@/components/admin/preview-panel';
import { EditorPanel } from '@/components/admin/editor-panel';

export default function AdminPage() {
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

    return (
        <div className="h-screen flex flex-col">
            {/* Header */}
            <header className="border-b bg-background px-6 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">링크 인 바이오 편집기</h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            실시간으로 편집하고 JSON을 다운로드하세요
                        </p>
                    </div>
                    <a
                        href="/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                    >
                        공개 페이지 보기 →
                    </a>
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
