import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';

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

        // Save to links.json
        const filePath = path.join(process.cwd(), 'data', 'links.json');
        const jsonContent = JSON.stringify(data, null, 4);
        await writeFile(filePath, jsonContent, 'utf-8');

        return NextResponse.json({
            success: true,
            message: '데이터가 저장되었습니다.'
        });

    } catch (error) {
        console.error('Save error:', error);
        return NextResponse.json(
            { error: '데이터 저장 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}
