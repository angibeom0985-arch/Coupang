'use client';

import React from 'react';

import { LinksData } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Upload } from 'lucide-react';

interface DataManagerProps {
    data: LinksData;
}

export function DataManager({ data }: DataManagerProps) {
    const [analytics, setAnalytics] = React.useState<any>(null);

    React.useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const { supabase } = await import('@/lib/supabase');

                // Fetch all analytics data (Warning: heavy for large datasets, sufficient for MVP)
                const { data, error } = await supabase
                    .from('analytics')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) throw error;

                const analyticsData = data || [];

                // Process data for dashboard
                const totalVisits = analyticsData.length;

                // Daily visits
                const dailyVisits: Record<string, number> = {};
                // Referrers
                const referrers: Record<string, number> = {};

                analyticsData.forEach((item: any) => {
                    // Date (YYYY-MM-DD)
                    const date = new Date(item.created_at).toISOString().split('T')[0];
                    dailyVisits[date] = (dailyVisits[date] || 0) + 1;

                    // Source
                    const src = item.source || 'direct';
                    referrers[src] = (referrers[src] || 0) + 1;
                });

                setAnalytics({
                    totalVisits,
                    dailyVisits,
                    referrers
                });

            } catch (e) {
                console.error('Failed to load analytics', e);
            }
        };
        fetchAnalytics();
    }, []);

    if (!analytics) return <div className="p-4">통계 불러오는 중...</div>;

    const sortedReferrers = Object.entries(analytics.referrers || {})
        .sort(([, a]: any, [, b]: any) => b - a);

    const sortedDaily = Object.entries(analytics.dailyVisits || {})
        .sort(([a]: any, [b]: any) => b.localeCompare(a))
        .slice(0, 7); // Last 7 days

    return (
        <Card>
            <CardHeader>
                <CardTitle>📊 방문자 통계</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Total Stats */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-primary/5 rounded-lg border text-center">
                        <p className="text-sm text-muted-foreground mb-1">총 방문자 수</p>
                        <p className="text-3xl font-bold">{analytics.totalVisits.toLocaleString()}</p>
                    </div>
                    <div className="p-4 bg-primary/5 rounded-lg border text-center">
                        <p className="text-sm text-muted-foreground mb-1">오늘 방문자</p>
                        <p className="text-3xl font-bold">
                            {(analytics.dailyVisits[new Date().toISOString().split('T')[0]] || 0).toLocaleString()}
                        </p>
                    </div>
                </div>

                {/* Sources */}
                <div>
                    <h3 className="text-sm font-semibold mb-3">📌 유입 경로 (TOP 5)</h3>
                    <div className="space-y-2">
                        {sortedReferrers.length === 0 ? (
                            <p className="text-sm text-muted-foreground">아직 데이터가 없습니다.</p>
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

                {/* Daily Trend */}
                <div>
                    <h3 className="text-sm font-semibold mb-3">📅 최근 7일 방문 추이</h3>
                    <div className="space-y-2">
                        {sortedDaily.length === 0 ? (
                            <p className="text-sm text-muted-foreground">아직 데이터가 없습니다.</p>
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
                    <p className="font-semibold mb-1">ℹ️ SNS 공유 팁</p>
                    <p>내 URL 뒤에 <code>?source=채널명</code>을 붙여 공유하면 유입 경로를 추적할 수 있습니다.</p>
                    <p className="mt-1 text-muted-foreground select-all bg-white p-1 rounded border border-blue-200">
                        https://coupang.money-hotissue.com?source=instagram
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
