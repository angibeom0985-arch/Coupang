import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { ContentItem } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Trash2, Link as LinkIcon, Type } from 'lucide-react';
import InstagramLogo from '@/components/admin/Instagram_logo_2016.svg';
import YoutubeLogo from '@/components/admin/유튜브.png';
import TiktokLogo from '@/components/admin/틱톡.png';

interface LinkEditorProps {
    links: ContentItem[];
    onUpdate: (links: ContentItem[]) => void;
}

export function LinkEditor({ links, onUpdate }: LinkEditorProps) {
    const [editingId, setEditingId] = useState<string | null>(null);

    const snsIcons: Record<string, any> = {
        instagram: InstagramLogo,
        youtube: YoutubeLogo,
        tiktok: TiktokLogo,
    };

    const getIconSrc = (icon?: string) => {
        if (!icon) return null;
        if (icon.startsWith('sns:')) {
            const key = icon.replace('sns:', '');
            const asset = snsIcons[key];
            if (asset) {
                return typeof asset === 'string' ? asset : asset.src;
            }
        }
        if (icon.startsWith('http')) return icon;
        return null;
    };

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
        alert('설정 > 광고 코드에 스크립트를 먼저 넣어 주세요.');
    };

    const snsPresets: Record<string, { title: string; url: string }> = {
        instagram: { title: '인스타그램', url: 'https://www.instagram.com/' },
        youtube: { title: '유튜브', url: 'https://www.youtube.com/' },
        tiktok: { title: '틱톡', url: 'https://www.tiktok.com/' },
        naverclip: { title: '네이버 클립', url: 'https://m.tv.naver.com/' },
    };

    const snsOptions = [
        { key: '', label: '일반 링크' },
        { key: 'instagram', label: '인스타그램' },
        { key: 'youtube', label: '유튜브' },
        { key: 'tiktok', label: '틱톡' },
        { key: 'naverclip', label: '네이버 클립' },
    ];

    const setSNSPlatform = (id: string, platform: string) => {
        if (!platform) {
            updateItem(id, { icon: '' });
            return;
        }
        const preset = snsPresets[platform];
        updateItem(id, {
            icon: `sns:${platform}`,
            title: `${preset.title} 프로필`,
            url: preset.url,
        });
    };

    const addSNS = () => {
        const defaultPlatform = 'instagram';
        const preset = snsPresets[defaultPlatform];
        const newLink: ContentItem = {
            id: Date.now().toString(),
            type: 'link',
            title: `${preset.title} 프로필`,
            url: preset.url,
            icon: `sns:${defaultPlatform}`,
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

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base font-semibold">링크 및 콘텐츠 관리</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <Button onClick={addLink} className="flex-1">
                        <LinkIcon className="w-4 h-4 mr-2" />
                        단일 링크 추가
                    </Button>
                    <Button onClick={addText} variant="outline" className="flex-1">
                        <Type className="w-4 h-4 mr-2" />
                        텍스트 추가
                    </Button>
                    <Button onClick={addSNS} variant="secondary" className="flex-1">
                        SNS 추가
                    </Button>
                    <Button onClick={addAdNote} variant="destructive" className="flex-1">
                        광고 추가
                    </Button>
                </div>

                <div className="space-y-3">
                    {links.map((item, index) => (
                        <div
                            key={item.id}
                            className="border rounded-lg p-4 space-y-3 bg-card hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center gap-2">
                                <div className="flex flex-col gap-1">
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-6 w-6"
                                        onClick={() => moveItem(index, 'up')}
                                        disabled={index === 0}
                                    >
                                        ↑
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-6 w-6"
                                        onClick={() => moveItem(index, 'down')}
                                        disabled={index === links.length - 1}
                                    >
                                        ↓
                                    </Button>
                                </div>

                                <div className="flex-1">
                                    {item.type === 'link' ? (
                                        <div className="space-y-2">
                                                <div className="flex gap-2">
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
                                                                onChange={(e) => setSNSPlatform(item.id, e.target.value)}
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
                                                    <div className="w-20">
                                                        <label className="cursor-pointer block relative group">
                                                            <div className={`w-20 h-20 rounded-md border flex items-center justify-center overflow-hidden bg-muted ${!getIconSrc(item.icon) ? 'text-muted-foreground' : ''}`}>
                                                                {getIconSrc(item.icon) ? (
                                                                    <img src={getIconSrc(item.icon) as string} alt="Icon" className="w-full h-full object-cover" />
                                                                ) : (
                                                                    <span className="text-xs text-center p-1">이미지<br />추가</span>
                                                                )}
                                                                <div className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center text-white text-xs">
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

                                                                    try {
                                                                        const timestamp = Date.now();
                                                                        const cleanName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
                                                                        const filename = `link_${item.id}_${timestamp}_${cleanName}`;

                                                                        // Upload to Supabase Storage
                                                                        const { error } = await supabase
                                                                            .storage
                                                                            .from('images') // Using same bucket as profile
                                                                            .upload(filename, file, { cacheControl: '3600', upsert: false });

                                                                        if (error) throw error;

                                                                        // Get Public URL
                                                                        const { data: { publicUrl } } = supabase
                                                                            .storage
                                                                            .from('images')
                                                                            .getPublicUrl(filename);

                                                                        updateItem(item.id, { icon: publicUrl });
                                                                    } catch (err: any) {
                                                                        console.error('Upload failed:', err);
                                                                        alert('이미지 업로드 실패: ' + err.message);
                                                                    }
                                                                }}
                                                            />
                                                        </label>
                                                    </div>
                                                </div>
                                        </div>
                                    ) : item.type === 'text' ? (
                                        <Textarea
                                            value={item.content}
                                            onChange={(e) => updateItem(item.id, { content: e.target.value })}
                                            placeholder="텍스트 내용"
                                            rows={2}
                                        />
                                    ) : (
                                        <div className="p-3 rounded-md bg-amber-50 border border-amber-200 text-sm text-amber-900 flex items-start gap-2">
                                            ⚠️
                                            <span>
                                                광고 영역입니다. 설정 탭에서 광고 코드를 먼저 입력하세요.
                                            </span>
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
                                {item.type === 'link' ? '🔗 단일 링크' : item.type === 'text' ? '📝 텍스트' : '📢 광고 영역'}
                                {' · '}
                                {item.enabled ? '활성화' : '비활성화'}
                            </div>
                        </div>
                    ))}

                    {links.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                            <p>아직 추가된 링크가 없습니다.</p>
                            <p className="text-sm mt-1">위 버튼을 클릭하여 링크를 추가하세요.</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
