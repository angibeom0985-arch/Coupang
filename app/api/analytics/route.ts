import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ANALYTICS_KEY = 'coupang_analytics';

interface AnalyticsData {
    totalVisits: number;
    dailyVisits: Record<string, number>;
    referrers: Record<string, number>;
}

export async function GET(request: NextRequest) {
    try {
        let data = await kv.get<AnalyticsData>(ANALYTICS_KEY);

        if (!data) {
            data = {
                totalVisits: 0,
                dailyVisits: {},
                referrers: {}
            };
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Analytics fetch error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch analytics' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { source } = body;

        // Date key for daily stats (YYYY-MM-DD)
        const today = new Date().toISOString().split('T')[0];

        // Fetch current data
        let data = await kv.get<AnalyticsData>(ANALYTICS_KEY);
        if (!data) {
            data = {
                totalVisits: 0,
                dailyVisits: {},
                referrers: {}
            };
        }

        // Update stats
        data.totalVisits += 1;
        data.dailyVisits[today] = (data.dailyVisits[today] || 0) + 1;

        if (source) {
            data.referrers[source] = (data.referrers[source] || 0) + 1;
        }

        // Save back to KV
        await kv.set(ANALYTICS_KEY, data);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Analytics track error:', error);
        return NextResponse.json(
            { error: 'Failed to track visit' },
            { status: 500 }
        );
    }
}
