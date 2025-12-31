import React, { useState } from 'react';
import { Profile } from '@/lib/data';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp, Image as ImageIcon, Loader2, PictureInPicture2, UserCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

interface ProfileEditorProps {
    profile: Profile;
    onUpdate: (key: string, value: string) => void;
    enabled: boolean;
    onToggle: (enabled: boolean) => void;
}

type UploadTarget = 'avatar' | 'coverImage';

export function ProfileEditor({ profile, onUpdate, enabled, onToggle }: ProfileEditorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isUploading, setIsUploading] = useState<UploadTarget | null>(null);

    const uploadViaApi = async (file: File, target: UploadTarget) => {
        setIsUploading(target);
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('folder', target);

            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || 'Upload failed');
            }

            const { url } = await res.json();
            onUpdate(target, url);
        } catch (error: any) {
            console.error('Upload error:', error);
            alert('이미지 업로드 실패: ' + (error.message || '잠시 후 다시 시도해 주세요.'));
        } finally {
            setIsUploading(null);
        }
    };

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>, target: UploadTarget) => {
        const file = e.target.files?.[0];
        if (!file) return;
        uploadViaApi(file, target);
        e.target.value = '';
    };

    const layoutOptions: { key: Profile['profileLayout']; label: string; icon: React.ReactNode }[] = [
        { key: 'avatar', label: '프로필만', icon: <UserCircle2 className="w-5 h-5" /> },
        { key: 'cover', label: '배경만', icon: <PictureInPicture2 className="w-5 h-5" /> },
        { key: 'both', label: '프로필+배경', icon: <ImageIcon className="w-5 h-5" /> },
    ];

    const currentLayout = profile.profileLayout || 'both';

    return (
        <Card className={!enabled ? 'opacity-75' : ''}>
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="flex items-center gap-4">
                        <CardTitle className="text-base font-semibold">프로필 설정</CardTitle>
                        <Switch
                            checked={enabled}
                            onCheckedChange={onToggle}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                    {enabled && (
                        <CollapsibleTrigger asChild>
                            <Button variant="ghost" size="sm" className="w-9 p-0">
                                {isOpen ? (
                                    <ChevronUp className="h-4 w-4" />
                                ) : (
                                    <ChevronDown className="h-4 w-4" />
                                )}
                                <span className="sr-only">Toggle</span>
                            </Button>
                        </CollapsibleTrigger>
                    )}
                </CardHeader>
                <CollapsibleContent>
                    <CardContent className="space-y-6 pt-4">
                        <div className="space-y-2">
                            <Label>레이아웃</Label>
                            <div className="grid grid-cols-3 gap-2">
                                {layoutOptions.map((option) => (
                                    <button
                                        key={option.key}
                                        onClick={() => onUpdate('profileLayout', option.key || 'both')}
                                        className={`flex items-center justify-center gap-2 rounded-lg border p-3 text-sm transition ${currentLayout === option.key
                                            ? 'border-primary bg-primary/10'
                                            : 'border-border hover:border-primary/40'
                                            }`}
                                    >
                                        {option.icon}
                                        <span>{option.label}</span>
                                    </button>
                                ))}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                프로필 사진만, 배경 이미지만, 또는 둘 다 표시할 수 있습니다.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="avatar">프로필 이미지</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="avatar"
                                        value={profile.avatar}
                                        onChange={(e) => onUpdate('avatar', e.target.value)}
                                        placeholder="https://example.com/profile.png"
                                    />
                                    <label className="cursor-pointer">
                                        <div className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors whitespace-nowrap flex items-center">
                                            {isUploading === 'avatar' ? <Loader2 className="w-4 h-4 animate-spin" /> : '파일 선택'}
                                        </div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            disabled={isUploading !== null}
                                            onChange={(e) => handleFile(e, 'avatar')}
                                        />
                                    </label>
                                </div>
                                {profile.avatar && (
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={profile.avatar}
                                            alt="Avatar preview"
                                            className="w-20 h-20 rounded-full object-cover border"
                                        />
                                        <Button variant="ghost" size="sm" onClick={() => onUpdate('avatar', '')}>
                                            제거
                                        </Button>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="coverImage">커버 이미지</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="coverImage"
                                        value={profile.coverImage || ''}
                                        onChange={(e) => onUpdate('coverImage', e.target.value)}
                                        placeholder="https://example.com/cover.jpg"
                                    />
                                    <label className="cursor-pointer">
                                        <div className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors whitespace-nowrap flex items-center">
                                            {isUploading === 'coverImage' ? <Loader2 className="w-4 h-4 animate-spin" /> : '파일 선택'}
                                        </div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            disabled={isUploading !== null}
                                            onChange={(e) => handleFile(e, 'coverImage')}
                                        />
                                    </label>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    배경만 사용하거나 프로필 이미지와 함께 오버레이할 수 있습니다.
                                </p>
                                {profile.coverImage && (
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={profile.coverImage}
                                            alt="Cover preview"
                                            className="w-32 h-20 rounded-md object-cover border"
                                        />
                                        <Button variant="ghost" size="sm" onClick={() => onUpdate('coverImage', '')}>
                                            제거
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="name">이름</Label>
                            <Input
                                id="name"
                                value={profile.name}
                                onChange={(e) => onUpdate('name', e.target.value)}
                                placeholder="프로필 이름을 입력하세요"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">소개</Label>
                            <Textarea
                                id="description"
                                value={profile.description}
                                onChange={(e) => onUpdate('description', e.target.value)}
                                placeholder="소개를 입력하세요"
                                rows={4}
                            />
                        </div>
                    </CardContent>
                </CollapsibleContent>
            </Collapsible>
        </Card>
    );
}
