'use client';

import { Theme } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface ThemeEditorProps {
    theme: Theme;
    onUpdate: (key: string, value: string) => void;
    faviconUrl?: string;
    onFaviconUpdate: (url: string) => void;
}

export function ThemeEditor({ theme, onUpdate, faviconUrl, onFaviconUpdate }: ThemeEditorProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>테마 설정</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
                {/* Page Design Section */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium border-b pb-2">📄 페이지 디자인</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="backgroundColor">배경 색상</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="backgroundColor"
                                    type="color"
                                    value={theme.backgroundColor}
                                    onChange={(e) => onUpdate('backgroundColor', e.target.value)}
                                    className="w-20 h-10 cursor-pointer"
                                />
                                <Input
                                    value={theme.backgroundColor}
                                    onChange={(e) => onUpdate('backgroundColor', e.target.value)}
                                    placeholder="#ffffff"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="textColor">텍스트 색상</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="textColor"
                                    type="color"
                                    value={theme.textColor}
                                    onChange={(e) => onUpdate('textColor', e.target.value)}
                                    className="w-20 h-10 cursor-pointer"
                                />
                                <Input
                                    value={theme.textColor}
                                    onChange={(e) => onUpdate('textColor', e.target.value)}
                                    placeholder="#000000"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="favicon">사이트 아이콘 (파비콘)</Label>
                        <div className="space-y-1">
                            <Input
                                id="favicon"
                                value={faviconUrl || ''}
                                onChange={(e) => onFaviconUpdate(e.target.value)}
                                placeholder="https://example.com/icon.png"
                            />
                            <p className="text-xs text-muted-foreground">
                                브라우저 탭에 표시될 아이콘의 이미지 URL을 입력하세요. (권장: 32x32 혹은 64x64)
                            </p>
                        </div>
                    </div>
                </div>

                {/* Button Design Section */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium border-b pb-2">🔘 버튼 디자인</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="buttonColor">버튼 배경 색상 (&& 테두리)</Label>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1">
                                    <Label className="text-xs text-muted-foreground">배경</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="buttonColor"
                                            type="color"
                                            value={theme.buttonColor}
                                            onChange={(e) => onUpdate('buttonColor', e.target.value)}
                                            className="w-full h-10 cursor-pointer"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs text-muted-foreground">테두리</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            type="color"
                                            value={theme.buttonBorderColor || '#000000'}
                                            onChange={(e) => onUpdate('buttonBorderColor', e.target.value)}
                                            className="w-full h-10 cursor-pointer"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="buttonTextColor">버튼 텍스트 색상 (&& 테두리)</Label>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1">
                                    <Label className="text-xs text-muted-foreground">텍스트</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="buttonTextColor"
                                            type="color"
                                            value={theme.buttonTextColor}
                                            onChange={(e) => onUpdate('buttonTextColor', e.target.value)}
                                            className="w-full h-10 cursor-pointer"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs text-muted-foreground">외곽선</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            type="color"
                                            value={theme.textBorderColor || '#ffffff'}
                                            onChange={(e) => onUpdate('textBorderColor', e.target.value)}
                                            className="w-full h-10 cursor-pointer"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>버튼 스타일</Label>
                        <div className="flex gap-2">
                            {(['rounded', 'square', 'pill'] as const).map((style) => (
                                <button
                                    key={style}
                                    onClick={() => onUpdate('buttonStyle', style)}
                                    className={`flex-1 py-3 px-4 border-2 transition-all ${theme.buttonStyle === style
                                        ? 'border-primary bg-primary/10'
                                        : 'border-border hover:border-primary/50'
                                        } ${style === 'rounded'
                                            ? 'rounded-2xl'
                                            : style === 'square'
                                                ? 'rounded-none'
                                                : 'rounded-full'
                                        }`}
                                >
                                    {style === 'rounded' && '둥근 모서리'}
                                    {style === 'square' && '사각형'}
                                    {style === 'pill' && '완전히 둥글게'}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="p-4 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground mb-3">미리보기</p>
                        <div
                            className="p-4 rounded-2xl transition-all border-2"
                            style={{
                                backgroundColor: theme.buttonColor,
                                color: theme.buttonTextColor,
                                borderColor: theme.buttonBorderColor || 'transparent',
                                textShadow: theme.textBorderColor ? `-1px -1px 0 ${theme.textBorderColor}, 1px -1px 0 ${theme.textBorderColor}, -1px 1px 0 ${theme.textBorderColor}, 1px 1px 0 ${theme.textBorderColor}` : 'none',
                                borderRadius: theme.buttonStyle === 'rounded' ? '1rem' : theme.buttonStyle === 'square' ? '0' : '9999px',
                            }}
                        >
                            <p className="text-center font-medium">버튼 미리보기</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
