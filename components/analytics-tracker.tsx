import { useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useSearchParams } from 'next/navigation';

export function AnalyticsTracker() {
    const searchParams = useSearchParams();
    const source = searchParams.get('source');
    const trackedRef = useRef(false);

    useEffect(() => {
        if (trackedRef.current) return;
        trackedRef.current = true;

        const trackVisit = async () => {
            try {
                // Determine source or default
                const currentSource = source || 'direct';

                // Insert into 'analytics' table
                const { error } = await supabase
                    .from('analytics')
                    .insert({
                        path: window.location.pathname,
                        source: currentSource,
                        user_agent: window.navigator.userAgent
                    });

                if (error) {
                    console.error('Analytics tracking failed:', error.message);
                }

            } catch (error) {
                console.error('Analytics tracking failed:', error);
            }
        };

        const timer = setTimeout(trackVisit, 1000);
        return () => clearTimeout(timer);
    }, [source]);

    return null;
}
