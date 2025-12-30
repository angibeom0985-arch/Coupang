'use client';

import { useState } from 'react';
import { ContentItem } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2, GripVertical, Link as LinkIcon, Type } from 'lucide-react';

interface LinkEditorProps {
    links: ContentItem[];
    onUpdate: (links: ContentItem[]) => void;
}

export function LinkEditor({ links, onUpdate }: LinkEditorProps) {
    const [editingId, setEditingId] = useState<string | null>(null);

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
                <CardTitle>링크 및 콘텐츠 관리</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex gap-2">
                    <Button onClick={addLink} className="flex-1">
                        <LinkIcon className="w-4 h-4 mr-2" />
                        단일 링크 추가
                    </Button>
                    <Button onClick={addText} variant="outline" className="flex-1">
                        <Type className="w-4 h-4 mr-2" />
                        텍스트 추가
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
                                            <Input
                                                value={item.title}
                                                onChange={(e) => updateItem(item.id, { title: e.target.value })}
                                                placeholder="링크 제목"
                                            />
                                            <Input
                                                value={item.url}
                                                onChange={(e) => updateItem(item.id, { url: e.target.value })}
                                                placeholder="https://example.com"
                                            />
                                        </div>
                                    ) : (
                                        <Textarea
                                            value={item.content}
                                            onChange={(e) => updateItem(item.id, { content: e.target.value })}
                                            placeholder="텍스트 내용"
                                            rows={2}
                                        />
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
                                {item.type === 'link' ? '🔗 단일 링크' : '📝 텍스트'}
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
