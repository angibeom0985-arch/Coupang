'use client';

import { Profile } from '@/lib/data';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ProfileEditorProps {
    profile: Profile;
    onUpdate: (key: string, value: string) => void;
}

export function ProfileEditor({ profile, onUpdate }: ProfileEditorProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>프로필 설정</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
                    <Label htmlFor="avatar">프로필 이미지 URL</Label>
                    <Input
                        id="avatar"
                        value={profile.avatar}
                        onChange={(e) => onUpdate('avatar', e.target.value)}
                        placeholder="https://example.com/image.jpg"
                    />
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
        </Card>
    );
}
