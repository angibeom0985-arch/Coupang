import React, { useMemo, useState } from 'react';
import { ContentItem } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
    Trash2,
    Link as LinkIcon,
    Type,
    MoveUp,
    MoveDown,
    X
} from 'lucide-react';
import InstagramLogo from '@/components/admin/Instagram_logo_2016.svg';
import YoutubeLogo from '@/components/admin/유튜브.png';
import TiktokLogo from '@/components/admin/틱톡.png';

interface LinkEditorProps {
    links: ContentItem[];
    adCode?: string;
    onUpdate: (links: ContentItem[]) => void;
}

type SnsKey = 'instagram' | 'youtube' | 'tiktok';

const snsPresets: Record<SnsKey, { title: string; url: string; icon: string }> = {
    youtube: { title: '유튜브', url: 'https://www.youtube.com/', icon: YoutubeLogo.src },
    instagram: { title: '인스타그램', url: 'https://www.instagram.com/', icon: InstagramLogo.src },
    tiktok: { title: '틱톡', url: 'https://www.tiktok.com/', icon: TiktokLogo.src },
};

const layoutOptions: { key: 'small' | 'medium' | 'large'; label: string; description: string }[] = [
    { key: 'small', label: '스몰 카드', description: '콤팩트한 텍스트 중심' },
    { key: 'medium', label: '중간 카드', description: '기본 버튼 형태' },
    { key: 'large', label: '라지 카드', description: '이미지를 크게 보여줍니다' },
];

export function LinkEditor({ links, onUpdate }: LinkEditorProps) {
    const [showSnsDialog, setShowSnsDialog] = useState(false);
    const [uploadingId, setUploadingId] = useState<string | null>(null);

    const addLink = () => {
        const newLink: ContentItem = {
            id: Date.now().toString(),
            type: 'link',
            title: '새 링크',
            url: 'https://',
            icon: 'link',
            enabled: true,
            layout: 'medium',
        };
        onUpdate([...links, newLink]);
    };

    const addText = () => {
        const newText: ContentItem = {
            id: Date.now().toString(),
            type: 'text',
            content: '새 텍스트',
            enabled: true,
        };
        onUpdate([...links, newText]);
    };

    const addAdNote = () => {
        const newAd: ContentItem = {
            id: Date.now().toString(),
            type: 'ad',
            adHtml: '',
            enabled: true,
        };
        onUpdate([...links, newAd]);
    };

    const addSNS = (platform: SnsKey) => {
        const preset = snsPresets[platform];
        const newLink: ContentItem = {
            id: Date.now().toString(),
            type: 'link',
            title: `${preset.title} 링크`,
            url: preset.url,
            icon: `sns:${platform}`,
            enabled: true,
            layout: 'medium',
        };
        onUpdate([...links, newLink]);
    };

    const parseSnsIcons = (icon?: string): SnsKey[] => {
        if (!icon || !icon.startsWith('sns:')) return [];
        return icon
            .replace('sns:', '')
            .split(',')
            .map((k) => k.trim() as SnsKey)
            .filter((k) => snsPresets[k]);
    };

    const updateSnsIcons = (id: string, nextList: SnsKey[]) => {
        const value = nextList.length ? `sns:${nextList.join(',')}` : '';
        updateItem(id, { icon: value });
    };

    const deleteItem = (id: string) => {
        onUpdate(links.filter(link => link.id !== id));
    };

    const updateItem = (id: string, updates: Partial<ContentItem>) => {
        onUpdate(
            links.map(link =>
                link.id === id ? { ...link, ...updates } as ContentItem : link
            )
        );
    };

    const moveItem = (index: number, direction: 'up' | 'down') => {
        const newLinks = [...links];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= newLinks.length) return;
        [newLinks[index], newLinks[targetIndex]] = [newLinks[targetIndex], newLinks[index]];
        onUpdate(newLinks);
    };

    const uploadIcon = async (id: string, file: File) => {
        setUploadingId(id);
        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("folder", "icons");

            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || "Upload failed");
            }

            const { url } = await res.json();
            updateItem(id, { icon: url });
        } catch (err: any) {
            console.error("Upload failed:", err);
            alert("이미지 업로드 실패: " + (err.message || "다시 시도해 주세요"));
        } finally {
            setUploadingId(null);
        }
    };

    const getIconSrc = (icon?: string) => {
        if (!icon) return null;
        if (icon.startsWith('sns:')) {
            return parseSnsIcons(icon)
                .map((k) => snsPresets[k]?.icon)
                .filter(Boolean) as string[];
        }
        if (icon.startsWith('http')) return [icon];
        return null;
    };

    const getLayoutValue = (item: ContentItem): 'small' | 'medium' | 'large' => {
        if (item.type !== 'link') return 'medium';
        if (item.layout === 'small' || item.layout === 'large') return item.layout;
        return 'medium';
    };

    const sortedLinks = useMemo(() => links, [links]);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base font-semibold">링크 & 콘텐츠 관리</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <Button onClick={addLink} variant="outline" className="flex-1 bg-transparent hover:bg-muted text-foreground">
                        <LinkIcon className="w-4 h-4 mr-2" />
                        일반 링크 추가
                    </Button>
                    <Button onClick={addText} variant="outline" className="flex-1 bg-transparent hover:bg-muted text-foreground">
                        <Type className="w-4 h-4 mr-2" />
                        텍스트 추가
                    </Button>
                    <Button onClick={() => setShowSnsDialog(true)} variant="outline" className="flex-1 bg-transparent hover:bg-muted text-foreground">
                        SNS 설정
                    </Button>
                    <Button onClick={addAdNote} variant="outline" className="flex-1 bg-transparent hover:bg-muted text-foreground">
                        광고 추가
                    </Button>
                </div>

                <div className="space-y-3">
                    {sortedLinks.map((item, index) => {
                        const layoutValue = getLayoutValue(item);
                        const selectedSns = parseSnsIcons(item.icon);
                        const isSnsLink = selectedSns.length > 0;
                        const snsIconSources = selectedSns
                            .map((k) => snsPresets[k]?.icon)
                            .filter(Boolean) as string[];
                        return (
                        <div
                            key={item.id}
                            className="border rounded-lg p-4 space-y-3 bg-card hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center gap-2">
                                <div className="flex flex-col gap-1">
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-8 w-8"
                                        onClick={() => moveItem(index, 'up')}
                                        disabled={index === 0}
                                    >
                                        <MoveUp className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-8 w-8"
                                        onClick={() => moveItem(index, 'down')}
                                        disabled={index === links.length - 1}
                                    >
                                        <MoveDown className="w-4 h-4" />
                                    </Button>
                                </div>

                                <div className="flex-1">
                                    {item.type === 'link' ? (
                                        <div className="space-y-2">
                                            <div className="flex gap-2 flex-col md:flex-row">
                                                <div className="flex-1 space-y-2">
                                                    <Input
                                                        value={item.title}
                                                        onChange={(e) => updateItem(item.id, { title: e.target.value })}
                                                        placeholder="링크 제목"
                                                    />
                                                    {isSnsLink && (
                                                        <div className="space-y-1">
                                                            <div className="text-xs font-medium text-muted-foreground">SNS 설정 (유튜브 · 인스타 · 틱톡)</div>
                                                            <div className="flex flex-wrap gap-2">
                                                                {Object.entries(snsPresets).map(([key, preset]) => {
                                                                    const selected = selectedSns.includes(key as SnsKey);
                                                                    return (
                                                                        <button
                                                                            key={key}
                                                                            type="button"
                                                                            className={`flex items-center gap-2 px-3 py-2 rounded-md border text-xs transition ${
                                                                                selected ? 'border-primary bg-primary/10' : 'border-input hover:border-primary/40'
                                                                            }`}
                                                                            onClick={() => {
                                                                                const current = parseSnsIcons(item.icon);
                                                                                const next = selected
                                                                                    ? current.filter((k) => k !== key)
                                                                                    : [...current, key as SnsKey];
                                                                                updateSnsIcons(item.id, next);
                                                                                if (next.length) {
                                                                                    const primary = snsPresets[next[0] as SnsKey];
                                                                                    updateItem(item.id, {
                                                                                        title: `${primary.title} 링크`,
                                                                                        url: primary.url,
                                                                                    });
                                                                                }
                                                                            }}
                                                                        >
                                                                            <img src={preset.icon} alt={preset.title} className="w-5 h-5 rounded-full" />
                                                                            <span>{preset.title}</span>
                                                                        </button>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    )}
                                                    <Input
                                                        value={item.url}
                                                        onChange={(e) => updateItem(item.id, { url: e.target.value })}
                                                        placeholder="https://example.com"
                                                    />
                                                </div>
                                                <div className="w-24 flex flex-col items-center gap-2">
                                                    <label className="cursor-pointer block relative group w-full">
                                                        <div className={`w-full h-20 rounded-md border flex items-center justify-center overflow-hidden bg-muted ${!getIconSrc(item.icon) ? 'text-muted-foreground' : ''}`}>
                                                            {getIconSrc(item.icon) ? (
                                                                Array.isArray(getIconSrc(item.icon)) ? (
                                                                    <div className="flex items-center justify-center gap-2 w-full h-full">
                                                                        {(getIconSrc(item.icon) as string[]).map((src, idx) => (
                                                                            <img key={src + idx} src={src} alt="Icon" className="w-8 h-8 object-contain" />
                                                                        ))}
                                                                    </div>
                                                                ) : (
                                                                    getIconSrc(item.icon) as React.ReactNode
                                                                )
                                                            ) : (
                                                                <span className="text-xs text-center p-1">이미지 업로드</span>
                                                            )}
                                                            <div className="absolute inset-0 bg-black/30 hidden group-hover:flex items-center justify-center text-white text-xs">
                                                                변경
                                                            </div>
                                                        </div>
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            className="hidden"
                                                            onChange={async (e) => {
                                                                const file = e.target.files?.[0];
                                                                if (!file) return;
                                                                await uploadIcon(item.id, file);
                                                            }}
                                                        />
                                                    </label>
                                                    {uploadingId === item.id && <span className="text-xs text-muted-foreground">업로드 중...</span>}
                                                </div>
                                            </div>
                                            {!isSnsLink && (
                                                <div className="pt-1">
                                                    <div className="text-xs text-muted-foreground mb-2">카드 레이아웃</div>
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                                        {layoutOptions.map((opt) => (
                                                            <button
                                                                key={opt.key}
                                                                type="button"
                                                                onClick={() => updateItem(item.id, { layout: opt.key })}
                                                                className={`flex flex-col items-center gap-2 rounded-lg border p-2 text-xs transition ${
                                                                    layoutValue === opt.key
                                                                        ? 'border-primary bg-primary/10'
                                                                        : 'border-input hover:border-primary/40'
                                                                }`}
                                                            >
                                                                <div className="w-full aspect-[16/10] rounded-md border border-dashed bg-muted flex items-center justify-center text-[11px]">
                                                                    {opt.label}
                                                                </div>
                                                                <div className="text-[11px] text-muted-foreground text-center leading-tight">
                                                                    {opt.description}
                                                                </div>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ) : item.type === 'text' ? (
                                        <Textarea
                                            value={item.content}
                                            onChange={(e) => updateItem(item.id, { content: e.target.value })}
                                            placeholder="텍스트를 입력해 주세요"
                                            rows={2}
                                        />
                                    ) : (
                                        <div className="text-sm flex flex-col gap-3">
                                            <label className="text-xs font-medium text-foreground">광고 코드</label>
                                            <Textarea
                                                value={item.adHtml || ''}
                                                onChange={(e) => updateItem(item.id, { adHtml: e.target.value })}
                                                placeholder="<div>여기에 광고 코드를 붙여 넣어주세요</div>"
                                                rows={4}
                                                className="font-mono text-xs"
                                            />
                                            {item.adHtml ? (
                                                <div className="w-full" dangerouslySetInnerHTML={{ __html: item.adHtml }} />
                                            ) : (
                                                <details className="text-xs text-muted-foreground">
                                                    <summary className="cursor-pointer text-blue-700">광고 설정 안내</summary>
                                                    <div className="mt-2 space-y-1 text-xs leading-relaxed">
                                                        <p>설정 메뉴에 제공된 광고 스니펫을 붙여 넣어주세요.</p>
                                                    </div>
                                                </details>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Switch
                                        checked={item.enabled}
                                        onCheckedChange={(checked) => updateItem(item.id, { enabled: checked })}
                                    />
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => deleteItem(item.id)}
                                    >
                                        <Trash2 className="w-4 h-4 text-destructive" />
                                    </Button>
                                </div>
                            </div>

                            <div className="text-xs text-muted-foreground">
                                {item.type === 'link' ? (isSnsLink ? 'SNS 링크' : '일반 링크') : item.type === 'text' ? '텍스트' : '광고 영역'} · {item.enabled ? '노출' : '숨김'}
                            </div>
                        </div>
                        );
                    })}

                    {links.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                            <p>아직 등록된 링크가 없습니다.</p>
                            <p className="text-sm mt-1">위의 버튼을 눌러 링크를 추가해 주세요.</p>
                        </div>
                    )}
                </div>
            </CardContent>

            {showSnsDialog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold">SNS 설정</h3>
                            <Button variant="ghost" size="icon" onClick={() => setShowSnsDialog(false)}>
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                        <div className="flex gap-3 overflow-x-auto pb-2">
                            {Object.entries(snsPresets).map(([key, preset]) => (
                                <button
                                    key={key}
                                    onClick={() => { addSNS(key as SnsKey); setShowSnsDialog(false); }}
                                    className="flex items-center gap-3 rounded-lg border px-3 py-2 bg-white hover:bg-muted transition whitespace-nowrap"
                                    title={preset.title}
                                >
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden border">
                                        <img src={preset.icon} alt={preset.title} className="w-full h-full object-contain" />
                                    </div>
                                    <span className="text-sm font-medium">{preset.title}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </Card>
    );
}
