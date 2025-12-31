import { useState } from 'react';
import { Profile } from '@/lib/data';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

interface ProfileEditorProps {
    profile: Profile;
    onUpdate: (key: string, value: string) => void;
}

export function ProfileEditor({ profile, onUpdate }: ProfileEditorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    return (
        <Card>
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xl font-bold">프로필 설정</CardTitle>
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
                </CardHeader>
                <CollapsibleContent>
                    <CardContent className="space-y-4 pt-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">이름</Label>
                            <Input
                                id="name"
                                value={profile.name}
                                onChange={(e) => onUpdate('name', e.target.value)}
                                placeholder="이름을 입력하세요"
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

                        <div className="space-y-2">
                            <Label htmlFor="avatar">프로필 이미지</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="avatar"
                                    value={profile.avatar}
                                    onChange={(e) => onUpdate('avatar', e.target.value)}
                                    placeholder="https://example.com/image.jpg"
                                />
                                <label htmlFor="file-upload" className="cursor-pointer">
                                    <div className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors whitespace-nowrap flex items-center">
                                        {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : '파일 선택'}
                                    </div>
                                </label>
                                <input
                                    id="file-upload"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    disabled={isUploading}
                                    onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;

                                        setIsUploading(true);
                                        try {
                                            const timestamp = Date.now();
                                            // Remove special chars to avoid URL issues
                                            const cleanName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
                                            const filename = `${timestamp}_${cleanName}`;

                                            // 1. Upload to Supabase Storage ('images' bucket)
                                            const { data, error } = await supabase
                                                .storage
                                                .from('images')
                                                .upload(filename, file, {
                                                    cacheControl: '3600',
                                                    upsert: false
                                                });

                                            if (error) throw error;

                                            // 2. Get Public URL
                                            const { data: { publicUrl } } = supabase
                                                .storage
                                                .from('images')
                                                .getPublicUrl(filename);

                                            onUpdate('avatar', publicUrl);
                                            alert('✅ 이미지가 업로드되었습니다!');
                                            e.target.value = '';
                                        } catch (error: any) {
                                            console.error('Upload error:', error);
                                            alert('❌ 업로드 실패: ' + (error.message || '알 수 없는 오류'));
                                        } finally {
                                            setIsUploading(false);
                                        }
                                    }}
                                />
                            </div>
                            {profile.avatar && (
                                <div className="mt-2">
                                    <img
                                        src={profile.avatar}
                                        alt="Preview"
                                        className="w-20 h-20 rounded-full object-cover border-2"
                                    />
                                </div>
                            )}
                        </div>
                    </CardContent>
                </CollapsibleContent>
            </Collapsible>
        </Card>
    );
}
