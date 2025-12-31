'use client';

import { useState } from 'react';
import { LinksData } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, Upload } from 'lucide-react';

interface SiteSettingsEditorProps {
    data: LinksData;
    onUpdate: (updates: Partial<LinksData>) => void;
}

export function SiteSettingsEditor({ data, onUpdate }: SiteSettingsEditorProps) {
    const combinedBodyAdCode = data.customBodyCode ?? data.adCode ?? '';
    const [isUploading, setIsUploading] = useState(false);

    const uploadFavicon = async (file: File) => {
        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('folder', 'favicon');

            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || 'Upload failed');
            }

            const { url } = await res.json();
            onUpdate({ faviconUrl: url });
        } catch (error: any) {
            console.error('Favicon upload error:', error);
            alert('파비콘 업로드 실패: ' + (error.message || '잠시 후 다시 시도해 주세요.'));
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>기본 설정</CardTitle>
                    <CardDescription>사이트의 기본 정보를 설정합니다.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="siteTitle">사이트 제목 (브라우저 탭)</Label>
                        <Input
                            id="siteTitle"
                            value={data.siteTitle || ''}
                            onChange={(e) => onUpdate({ siteTitle: e.target.value })}
                            placeholder="관리자 페이지"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="favicon">사이트 아이콘/파비콘</Label>
                        <div className="flex gap-2">
                            <Input
                                id="favicon"
                                value={data.faviconUrl || ''}
                                onChange={(e) => onUpdate({ faviconUrl: e.target.value })}
                                placeholder="https://example.com/icon.png"
                            />
                            <label className="cursor-pointer flex items-center">
                                <div className="px-3 py-2 border rounded-md hover:bg-muted transition text-sm flex items-center gap-1">
                                    {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                                    <span>업로드</span>
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    disabled={isUploading}
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) uploadFavicon(file);
                                        e.target.value = '';
                                    }}
                                />
                            </label>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            브라우저 탭에 표시될 아이콘 이미지 URL을 입력하거나 파일을 업로드하세요. (권장: 32x32 또는 64x64)
                        </p>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>고급 설정 (스크립트/광고)</CardTitle>
                    <CardDescription>
                        외부 스크립트나 광고 코드를 삽입합니다. <strong>주의: 잘못된 코드는 사이트 오류를 유발할 수 있습니다.</strong>
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="headCode">Head 코드 (&lt;head&gt; 내부)</Label>
                        <Textarea
                            id="headCode"
                            value={data.customHeadCode || ''}
                            onChange={(e) => onUpdate({ customHeadCode: e.target.value })}
                            placeholder="<script>...</script>"
                            rows={6}
                            className="font-mono text-xs"
                        />
                        <p className="text-xs text-muted-foreground">
                            구글 애드센스 자동광고 스크립트 등을 여기에 입력하세요.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="bodyCode">Body/광고 코드 (페이지 상단/광고)</Label>
                        <Textarea
                            id="bodyCode"
                            value={combinedBodyAdCode}
                            onChange={(e) => {
                                const value = e.target.value;
                                onUpdate({ customBodyCode: value, adCode: value });
                            }}
                            placeholder="<div>광고/바디 코드</div>"
                            rows={6}
                            className="font-mono text-xs"
                        />
                        <p className="text-xs text-muted-foreground">
                            디스플레이 광고 코드나 커스텀 HTML을 여기에 입력하세요. 이 코드는 페이지 상단에 노출되며 광고 카드에도 재사용됩니다.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
