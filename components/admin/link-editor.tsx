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
    Plus,
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

const snsOptions = [
    { key: '', label: '일반 링크' },
    ...Object.entries(snsPresets).map(([key, value]) => ({
        key,
        label: value.title,
    })),
];

export function LinkEditor({ links, onUpdate, adCode }: LinkEditorProps) {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [showSnsDialog, setShowSnsDialog] = useState(false);
    const [uploadingId, setUploadingId] = useState<string | null>(null);

    const addLink = () => {
        const newLink: ContentItem = {
            id: Date.now().toString(),
            type: 'link',
            title: '??留곹겕',
            url: 'https://',
            icon: 'link',
            enabled: true,
        };
        onUpdate([...links, newLink]);
        setEditingId(newLink.id);
    };

    const addText = () => {
        const newText: ContentItem = {
            id: Date.now().toString(),
            type: 'text',
            content: '???띿뒪??,
            enabled: true,
        };
        onUpdate([...links, newText]);
        setEditingId(newText.id);
    };

    const addAdNote = () => {
        const newAd: ContentItem = {
            id: Date.now().toString(),
            type: 'ad',
            adHtml: '',
            enabled: true,
        };
        onUpdate([...links, newAd]);
        setEditingId(newAd.id);
        alert('?ㅼ젙 > 怨좉툒 ?ㅼ젙 > Body/愿묎퀬 肄붾뱶???ㅽ겕由쏀듃瑜??ｌ뼱 二쇱꽭??');
    };

    const addSNS = (platform: SnsKey) => {
        const preset = snsPresets[platform];
        const newLink: ContentItem = {
            id: Date.now().toString(),
            type: 'link',
            title: `${preset.title} ?꾨줈??,
            url: preset.url,
            icon: `sns:${platform}`,
            enabled: true,
        };
        onUpdate([...links, newLink]);
        setEditingId(newLink.id);
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

    const handleSNSSelect = (id: string, platform: string) => {
        if (!platform) {
            updateItem(id, { icon: '' });
            return;
        }
        const preset = snsPresets[platform as SnsKey];
        updateItem(id, {
            icon: `sns:${platform}`,
            title: `${preset.title} ?꾨줈??,
            url: preset.url,
        });
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
            alert("이미지 업로드 실패: " + (err.message || "잠시 후 다시 시도해주세요"));
        } finally {
            setUploadingId(null);
        }
    };

    const getIconSrc = (icon?: string) => {
        if (!icon) return null;
        if (icon.startsWith('sns:')) {
            const key = icon.replace('sns:', '') as SnsKey;
            const preset = snsPresets[key];
            return preset ? preset.icon : null;
        }
        if (icon.startsWith('http')) return icon;
        return null;
    };

    const sortedLinks = useMemo(() => links, [links]);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base font-semibold">留곹겕 & 肄섑뀗痢?愿由?/CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <Button onClick={addLink} variant="outline" className="flex-1 bg-transparent hover:bg-muted text-foreground">
                        <LinkIcon className="w-4 h-4 mr-2" />
                        ?쇰컲 留곹겕 異붽?
                    </Button>
                    <Button onClick={addText} variant="outline" className="flex-1 bg-transparent hover:bg-muted text-foreground">
                        <Type className="w-4 h-4 mr-2" />
                        ?띿뒪??異붽?
                    </Button>
                    <Button onClick={() => setShowSnsDialog(true)} variant="outline" className="flex-1 bg-transparent hover:bg-muted text-foreground">
                        SNS ?ㅼ젙
                    </Button>
                    <Button onClick={addAdNote} variant="outline" className="flex-1 bg-transparent hover:bg-muted text-foreground">
                        愿묎퀬 異붽?
                    </Button>
                </div>

                <div className="space-y-3">
                    {sortedLinks.map((item, index) => (
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
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                        <Input
                                                            value={item.title}
                                                            onChange={(e) => updateItem(item.id, { title: e.target.value })}
                                                            placeholder="留곹겕 ?쒕ぉ"
                                                        />
                                                        <select
                                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                                                            value={item.icon?.startsWith('sns:') ? item.icon.replace('sns:', '') : ''}
                                                            onChange={(e) => handleSNSSelect(item.id, e.target.value)}
                                                        >
                                                            {snsOptions.map((opt) => (
                                                                <option key={opt.key || 'default'} value={opt.key}>{opt.label}</option>
                                                            ))}
                                                        </select>
                                                    </div>
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
                                                                typeof getIconSrc(item.icon) === 'string' ? (
                                                                    <img src={getIconSrc(item.icon) as string} alt="Icon" className="w-full h-full object-cover" />
                                                                ) : (
                                                                    getIconSrc(item.icon) as React.ReactNode
                                                                )
                                                            ) : (
                                                                <span className="text-xs text-center p-1">?꾩씠肄??낅줈??/span>
                                                            )}
                                                            <div className="absolute inset-0 bg-black/30 hidden group-hover:flex items-center justify-center text-white text-xs">
                                                                蹂寃?
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
                                                    {uploadingId === item.id && <span className="text-xs text-muted-foreground">?낅줈??以?..</span>}
                                                </div>
                                            </div>
                                        </div>
                                    ) : item.type === 'text' ? (
                                        <Textarea
                                            value={item.content}
                                            onChange={(e) => updateItem(item.id, { content: e.target.value })}
                                            placeholder="?띿뒪?몃? ?낅젰?섏꽭??
                                            rows={2}
                                        />
                                    ) : (
                                        <div className="p-3 rounded-md bg-amber-50 border border-amber-200 text-sm text-amber-900 flex flex-col gap-3">
                                            <label className="text-xs font-medium text-amber-900">愿묎퀬 肄붾뱶</label>
                                            <Textarea
                                                value={item.adHtml || ''}
                                                onChange={(e) => updateItem(item.id, { adHtml: e.target.value })}
                                                placeholder="<div>?ш린??愿묎퀬 ?ㅽ겕由쏀듃瑜??ｌ쑝?몄슂</div>"
                                                rows={4}
                                                className="font-mono text-xs"
                                            />
                                            {item.adHtml ? (
                                                <div className="rounded border bg-white/60 p-2" dangerouslySetInnerHTML={{ __html: item.adHtml }} />
                                            ) : (
                                                <details className="text-xs text-muted-foreground">
                                                    <summary className="cursor-pointer text-blue-700">愿묎퀬 ?ㅼ젙 諛⑸쾿</summary>
                                                    <div className="mt-2 space-y-1 text-xs leading-relaxed">
                                                        <p>??愿묎퀬 釉붾줉??諛붾줈 ?ㅽ겕由쏀듃瑜??ｌ쑝硫???????대떦 ?꾩튂???몄텧?⑸땲??</p>
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
                                {item.type === 'link' ? '?쇰컲 留곹겕' : item.type === 'text' ? '?띿뒪??肄섑뀗痢? : '愿묎퀬 ?곸뿭'} 쨌 {item.enabled ? '?몄텧' : '?④?'}
                            </div>
                        </div>
                    ))}

                    {links.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                            <p>?꾩쭅 異붽???留곹겕媛 ?놁뒿?덈떎.</p>
                            <p className="text-sm mt-1">?곷떒 踰꾪듉???대┃??留곹겕瑜?異붽???二쇱꽭??</p>
                        </div>
                    )}
                </div>
            </CardContent>

            {showSnsDialog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold">SNS ?ㅼ젙</h3>
                            <Button variant="ghost" size="icon" onClick={() => setShowSnsDialog(false)}>
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                        <div className="grid grid-cols-5 gap-3 max-h-[60vh] overflow-y-auto">
                            {Object.entries(snsPresets).map(([key, preset]) => (
                                <button
                                    key={key}
                                    onClick={() => { addSNS(key as SnsKey); setShowSnsDialog(false); }}
                                    className="flex items-center justify-center rounded-lg border border-transparent p-2 hover:bg-muted transition bg-transparent"
                                    title={preset.title}
                                >
                                    <div className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden">
                                        <img src={preset.icon} alt={preset.title} className="w-full h-full object-contain" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </Card>
    );
}





