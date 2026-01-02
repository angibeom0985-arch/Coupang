import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file');
        const folder = (formData.get('folder')?.toString() || 'uploads').replace(/[^a-zA-Z0-9/_-]/g, '');

        if (!file || !(file instanceof File)) {
            return NextResponse.json({ error: 'file is required' }, { status: 400 });
        }

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !supabaseKey) {
            return NextResponse.json({ error: 'Supabase service key or URL is missing. Set SUPABASE_SERVICE_ROLE_KEY and NEXT_PUBLIC_SUPABASE_URL.' }, { status: 500 });
        }

        // Guard against accidentally using the anon/public key, which will hit RLS.
        const keyRole = (() => {
            try {
                const payload = JSON.parse(Buffer.from(supabaseKey.split('.')[1] || '', 'base64').toString('utf-8'));
                return payload?.role as string | undefined;
            } catch (err) {
                console.error('Failed to decode Supabase key:', err);
                return undefined;
            }
        })();

        if (keyRole !== 'service_role') {
            return NextResponse.json(
                { error: 'SUPABASE_SERVICE_ROLE_KEY must be the service role key (role: service_role). Please update the environment variable with the correct key from Supabase.' },
                { status: 500 }
            );
        }

        const supabase = createClient(supabaseUrl, supabaseKey);

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const path = `${folder}/${Date.now()}_${cleanName}`;

        const { error } = await supabase.storage
            .from('images')
            .upload(path, buffer, {
                contentType: file.type || 'application/octet-stream',
                upsert: false,
            });

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
            .from('images')
            .getPublicUrl(path);

        return NextResponse.json({ url: publicUrl, path });
    } catch (error: any) {
        console.error('Upload API error:', error?.message || error);
        return NextResponse.json({ error: error?.message || 'Upload failed' }, { status: 500 });
    }
}
