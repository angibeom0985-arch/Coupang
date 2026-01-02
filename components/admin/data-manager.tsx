'use client';

import React from 'react';

import { LinksData } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DataManagerProps {
    data: LinksData;
}

type RangeKey = 'all' | '7d' | '30d' | '90d' | '180d' | 'custom';

export function DataManager({ data }: DataManagerProps) {
    const [rawAnalytics, setRawAnalytics] = React.useState<any[]>([]);
    const [analytics, setAnalytics] = React.useState<any>(null);
    const [range, setRange] = React.useState<RangeKey>('7d');
    const [customStart, setCustomStart] = React.useState<string>('');
    const [customEnd, setCustomEnd] = React.useState<string>('');

    React.useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const { supabase } = await import('@/lib/supabase');

                const { data, error } = await supabase
                    .from('analytics')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setRawAnalytics(data || []);
            } catch (e) {
                console.error('Failed to load analytics', e);
            }
        };
        fetchAnalytics();
    }, []);

    React.useEffect(() => {
        if (!rawAnalytics) return;

        const now = new Date();
        let startDate: Date | null = null;
        if (range === '7d') startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        if (range === '30d') startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        if (range === '90d') startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        if (range === '180d') startDate = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
        if (range === 'custom' && customStart) {
            startDate = new Date(`${customStart}T00:00:00Z`);
        }
        const endDate = range === 'custom' && customEnd ? new Date(`${customEnd}T23:59:59Z`) : null;

        const filtered = (rawAnalytics || []).filter((item) => {
            const created = new Date(item.created_at);
            if (startDate && created < startDate) return false;
            if (endDate && created > endDate) return false;
            return true;
        });

        const totalVisits = filtered.length;
        const dailyVisits: Record<string, number> = {};
        const referrers: Record<string, number> = {};

        filtered.forEach((item: any) => {
            const date = new Date(item.created_at).toISOString().split('T')[0];
            dailyVisits[date] = (dailyVisits[date] || 0) + 1;
            const src = item.source || 'direct';
            referrers[src] = (referrers[src] || 0) + 1;
        });

        setAnalytics({
            totalVisits,
            dailyVisits,
            referrers,
        });
    }, [rawAnalytics, range, customStart, customEnd]);

    if (!analytics) return <div className="p-4">분석 데이터를 불러오는 중...</div>;

    const sortedReferrers = Object.entries(analytics.referrers || {})
        .sort(([, a]: any, [, b]: any) => b - a);

    const sortedDaily = Object.entries(analytics.dailyVisits || {})
        .sort(([a]: any, [b]: any) => b.localeCompare(a));

    return (
        <Card>
            <CardHeader>
                <CardTitle>분석</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center gap-3 flex-wrap">
                    <label className="text-sm font-medium">기간</label>
                    <select
                        className="rounded-md border px-3 py-2 text-sm bg-background"
                        value={range}
                        onChange={(e) => setRange(e.target.value as RangeKey)}
                    >
                        <option value="all">전체기간</option>
                        <option value="7d">일주일</option>
                        <option value="30d">1개월</option>
                        <option value="90d">3개월</option>
                        <option value="180d">6개월</option>
                        <option value="custom">직접 입력</option>
                    </select>
                    {range === 'custom' && (
                        <div className="flex items-center gap-2 text-sm">
                            <input
                                type="date"
                                className="rounded-md border px-2 py-1 bg-background"
                                value={customStart}
                                onChange={(e) => setCustomStart(e.target.value)}
                            />
                            <span>~</span>
                            <input
                                type="date"
                                className="rounded-md border px-2 py-1 bg-background"
                                value={customEnd}
                                onChange={(e) => setCustomEnd(e.target.value)}
                            />
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-primary/5 rounded-lg border text-center">
                        <p className="text-sm text-muted-foreground mb-1">전체 방문</p>
                        <p className="text-3xl font-bold">{analytics.totalVisits.toLocaleString()}</p>
                    </div>
                    <div className="p-4 bg-primary/5 rounded-lg border text-center">
                        <p className="text-sm text-muted-foreground mb-1">오늘 방문</p>
                        <p className="text-3xl font-bold">
                            {(analytics.dailyVisits[new Date().toISOString().split('T')[0]] || 0).toLocaleString()}
                        </p>
                    </div>
                </div>

                <div>
                    <h3 className="text-sm font-semibold mb-3">유입 경로 (TOP 5)</h3>
                    <div className="space-y-2">
                        {sortedReferrers.length === 0 ? (
                            <p className="text-sm text-muted-foreground">데이터가 없습니다.</p>
                        ) : (
                            sortedReferrers.slice(0, 5).map(([source, count]: any) => (
                                <div key={source} className="flex items-center justify-between text-sm p-2 bg-muted rounded">
                                    <span className="capitalize">{source}</span>
                                    <span className="font-bold">{count}회</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div>
                    <h3 className="text-sm font-semibold mb-3">방문 추이</h3>
                    <div className="space-y-2">
                        {sortedDaily.length === 0 ? (
                            <p className="text-sm text-muted-foreground">데이터가 없습니다.</p>
                        ) : (
                            sortedDaily.map(([date, count]: any) => (
                                <div key={date} className="flex items-center justify-between text-sm border-b pb-2 last:border-0">
                                    <span className="text-muted-foreground">{date}</span>
                                    <span className="font-bold">{count}명</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-800">
                    <p className="font-semibold mb-1">SNS 공유 팁</p>
                    <p>페이지 URL 뒤에 <code>?source=채널명</code>을 붙여 공유하면 유입 경로를 추적할 수 있습니다.</p>
                    <p className="mt-1 text-muted-foreground select-all bg-white p-1 rounded border border-blue-200">
                        https://coupang.money-hotissue.com?source=instagram
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
