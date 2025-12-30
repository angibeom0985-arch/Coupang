import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

// Ensure this route uses Node.js runtime
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';


export async function POST(request: NextRequest) {
    try {
        const data = await request.json();

        // Validate data structure
        if (!data.profile || !data.links) {
            return NextResponse.json(
                { error: '잘못된 데이터 형식입니다.' },
                { status: 400 }
            );
        }

        // Handle based on environment
        if (process.env.NODE_ENV === 'development') {
            // In development, save to local file
            const { writeFile } = await import('fs/promises');
            const path = await import('path');
            const filePath = path.default.join(process.cwd(), 'data', 'links.json');
            await writeFile(filePath, JSON.stringify(data, null, 4), 'utf-8');
        } else {
            // In production, use Vercel KV
            if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
                console.error('Missing Vercel KV environment variables');
                return NextResponse.json(
                    { error: 'Vercel KV 설정이 누락되었습니다. Vercel 대시보드에서 Storage를 연결해주세요.' },
                    { status: 500 }
                );
            }
            await kv.set('coupang_links_data', data);
        }

        return NextResponse.json({
            success: true,
            message: '데이터가 저장되었습니다.'
        });

    } catch (error: any) {
        console.error('Save error details:', error);
        return NextResponse.json(
            { error: `데이터 저장 중 오류가 발생했습니다: ${error.message}` },
            { status: 500 }
        );
    }
}
