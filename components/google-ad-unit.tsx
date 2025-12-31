'use client';

import { useEffect } from 'react';

export default function GoogleAdUnit() {
    useEffect(() => {
        try {
            // @ts-ignore
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (err) {
            console.error('AdSense error:', err);
        }
    }, []);

    return (
        <div>
            <center>
                <ins
                    className="adsbygoogle"
                    style={{ display: 'block' }}
                    data-ad-client="ca-pub-2686975437928535"
                    data-ad-slot="6081362969"
                    data-ad-format="auto"
                    data-full-width-responsive="true"
                />
            </center>
        </div>
    );
}
