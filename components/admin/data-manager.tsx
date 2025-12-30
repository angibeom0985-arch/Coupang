'use client';

import { LinksData } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Upload } from 'lucide-react';

interface DataManagerProps {
    data: LinksData;
}

export function DataManager({ data }: DataManagerProps) {
    const exportJSON = () => {
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'links.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const copyToClipboard = () => {
        const dataStr = JSON.stringify(data, null, 2);
        navigator.clipboard.writeText(dataStr).then(() => {
            alert('JSON이 클립보드에 복사되었습니다!');
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>데이터 관리</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-900 font-medium mb-2">💡 사용 방법</p>
                    <ol className="text-sm text-yellow-800 space-y-1 list-decimal list-inside">
                        <li>편집이 완료되면 <strong>"서버에 저장"</strong> 버튼을 클릭합니다.</li>
                        <li>데이터가 자동으로 <code className="bg-yellow-100 px-1 rounded">data/links.json</code>에 저장됩니다.</li>
                        <li>또는 "JSON 다운로드"로 파일을 받아 수동으로 업로드할 수 있습니다.</li>
                    </ol>
                </div>

                <div className="space-y-2">
                    <Button
                        onClick={async () => {
                            try {
                                const response = await fetch('/api/save', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify(data),
                                });

                                const result = await response.json();

                                if (result.success) {
                                    alert('✅ 데이터가 저장되었습니다!');
                                } else {
                                    alert('❌ ' + (result.error || '저장 실패'));
                                }
                            } catch (error) {
                                console.error('Save error:', error);
                                alert('❌ 저장 중 오류가 발생했습니다.');
                            }
                        }}
                        className="w-full"
                        size="lg"
                        variant="default"
                    >
                        <Upload className="w-4 h-4 mr-2" />
                        서버에 저장
                    </Button>

                    <Button onClick={exportJSON} className="w-full" size="lg" variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        JSON 다운로드
                    </Button>

                    <Button onClick={copyToClipboard} variant="outline" className="w-full" size="lg">
                        <Upload className="w-4 h-4 mr-2" />
                        JSON 클립보드에 복사
                    </Button>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm font-medium mb-2">현재 데이터 통계</p>
                    <div className="space-y-1 text-sm text-muted-foreground">
                        <p>• 총 항목: {data.links.length}개</p>
                        <p>• 활성화된 항목: {data.links.filter(l => l.enabled).length}개</p>
                        <p>
                            • 링크:{' '}
                            {data.links.filter(l => l.type === 'link').length}개 / 텍스트:{' '}
                            {data.links.filter(l => l.type === 'text').length}개
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
