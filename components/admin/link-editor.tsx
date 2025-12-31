import React, { useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';
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
    Instagram,
    Youtube,
    Music4,
    Globe2,
    Facebook,
    Mail,
    Phone,
    X
} from 'lucide-react';

interface LinkEditorProps {
    links: ContentItem[];
    onUpdate: (links: ContentItem[]) => void;
}

type SnsKey = 'instagram' | 'youtube' | 'tiktok' | 'naverclip' | 'facebook' | 'homepage' | 'email' | 'phone' | 'threads' | 'x';

const snsPresets: Record<SnsKey, { title: string; url: string; icon: React.ReactNode }> = {
    youtube: { title: '유튜브', url: 'https://www.youtube.com/', icon: <Youtube className="w-4 h-4" /> },
    instagram: { title: '인스타그램', url: 'https://www.instagram.com/', icon: <Instagram className="w-4 h-4" /> },
    tiktok: { title: '틱톡', url: 'https://www.tiktok.com/', icon: <Music4 className="w-4 h-4" /> },
    x: { title: 'X', url: 'https://x.com/', icon: <Globe2 className="w-4 h-4" /> },
    threads: { title: '쓰레드', url: 'https://www.threads.net/', icon: <Globe2 className="w-4 h-4" /> },
    naverclip: { title: '네이버 블로그', url: 'https://m.blog.naver.com/', icon: <Globe2 className="w-4 h-4" /> },
    facebook: { title: '페이스북', url: 'https://www.facebook.com/', icon: <Facebook className="w-4 h-4" /> },
    homepage: { title: '홈페이지', url: 'https://', icon: <Globe2 className="w-4 h-4" /> },
    email: { title: '이메일', url: 'mailto:', icon: <Mail className="w-4 h-4" /> },
    phone: { title: '전화번호', url: 'tel:', icon: <Phone className="w-4 h-4" /> },
};

const snsOptions = [{ key: '', label: '일반 링크' }, ...Object.entries(snsPresets).map(([key, value]) => ({
    key,
    label: value.title,
}))];

export function LinkEditor({ links, onUpdate }: LinkEditorProps) {
    const [editingId, setEditingId] = useState<string | null>(null);
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
        };
        onUpdate([...links, newLink]);
        setEditingId(newLink.id);
    };

    const addText = () => {
        const newText: ContentItem = {
            id: Date.now().toString(),
            type: 'text',
            content: '새 텍스트',
            enabled: true,
        };
        onUpdate([...links, newText]);
        setEditingId(newText.id);
    };

    const addAdNote = () => {
        const newAd: ContentItem = {
            id: Date.now().toString(),
            type: 'ad',
            enabled: true,
        };
        onUpdate([...links, newAd]);
        setEditingId(newAd.id);
        alert('설정 > 고급 설정 > Body/광고 코드에 스크립트를 넣어 주세요.');
    };

    const addSNS = (platform: SnsKey) => {
        const preset = snsPresets[platform];
        const newLink: ContentItem = {
            id: Date.now().toString(),
            type: 'link',
            title: `${preset.title} 프로필`,
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
            title: `${preset.title} 프로필`,
            url: preset.url,
        });
    };

    const uploadIcon = async (id: string, file: File) => {
        setUploadingId(id);
        try {
            const timestamp = Date.now();
            const cleanName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
            const filename = `link_${id}_${timestamp}_${cleanName}`;

            const { error } = await supabase
                .storage
                .from('images')
                .upload(filename, file, { cacheControl: '3600', upsert: false });

            if (error) throw error;

            const { data: { publicUrl } } = supabase
                .storage
                .from('images')
                .getPublicUrl(filename);

            updateItem(id, { icon: publicUrl });
        } catch (err: any) {
            console.error('Upload failed:', err);
            alert('이미지 업로드 실패: ' + err.message);
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
                <CardTitle className="text-base font-semibold">링크 & 콘텐츠 관리</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <Button onClick={addLink} className="flex-1">
                        <LinkIcon className="w-4 h-4 mr-2" />
                        일반 링크 추가
                    </Button>
                    <Button onClick={addText} variant="outline" className="flex-1">
                        <Type className="w-4 h-4 mr-2" />
                        텍스트 추가
                    </Button>
                    <Button onClick={() => setShowSnsDialog(true)} variant="secondary" className="flex-1">
                        <Plus className="w-4 h-4 mr-2" />
                        SNS 설정
                    </Button>
                    <Button onClick={addAdNote} variant="destructive" className="flex-1">
                        광고 추가
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
                                                            placeholder="링크 제목"
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
                                                                <span className="text-xs text-center p-1">아이콘 업로드</span>
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
                                        </div>
                                    ) : item.type === 'text' ? (
                                        <Textarea
                                            value={item.content}
                                            onChange={(e) => updateItem(item.id, { content: e.target.value })}
                                            placeholder="텍스트를 입력하세요"
                                            rows={2}
                                        />
                                    ) : (
                                        <div className="p-3 rounded-md bg-amber-50 border border-amber-200 text-sm text-amber-900 flex items-start gap-2">
                                            <span role="img" aria-label="notice">📢</span>
                                            <span>광고 영역입니다. 설정 탭의 Body/광고 코드에 스크립트를 입력하세요.</span>
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
                                {item.type === 'link' ? '일반 링크' : item.type === 'text' ? '텍스트 콘텐츠' : '광고 영역'} · {item.enabled ? '노출' : '숨김'}
                            </div>
                        </div>
                    ))}

                    {links.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                            <p>아직 추가된 링크가 없습니다.</p>
                            <p className="text-sm mt-1">상단 버튼을 클릭해 링크를 추가해 주세요.</p>
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
                        <div className="grid grid-cols-1 gap-2 max-h-[60vh] overflow-y-auto">
                            {Object.entries(snsPresets).map(([key, preset]) => (
                                <div key={key} className="flex items-center justify-between rounded-lg border px-3 py-2 hover:bg-muted/60 transition">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                                            {preset.icon}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">{preset.title}</p>
                                            <p className="text-xs text-muted-foreground">{preset.url}</p>
                                        </div>
                                    </div>
                                    <Button size="sm" variant="secondary" onClick={() => { addSNS(key as SnsKey); setShowSnsDialog(false); }}>
                                        <Plus className="w-4 h-4 mr-1" />
                                        추가
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </Card>
    );
}
