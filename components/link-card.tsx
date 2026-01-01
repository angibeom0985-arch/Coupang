import React, { useEffect, useRef } from 'react';
import { ContentItem } from '@/lib/data';
import { ExternalLink } from 'lucide-react';
import InstagramLogo from '@/components/admin/Instagram_logo_2016.svg';
import YoutubeLogo from '@/components/admin/?犿姕敫?png';
import TiktokLogo from '@/components/admin/?表啞.png';

interface LinkCardProps {
    item: ContentItem;
    theme: {
        buttonColor: string;
        buttonTextColor: string;
        buttonStyle: 'rounded' | 'square' | 'pill';
        buttonBorderColor?: string;
        textBorderColor?: string;
    };
    adCode?: string;
}

const snsIcons: Record<string, string> = {
    instagram: InstagramLogo.src,
    youtube: YoutubeLogo.src,
    tiktok: TiktokLogo.src,
};

export function LinkCard({ item, theme, adCode }: LinkCardProps) {
    if (item.type === 'ad') {
        const adHtml = item.adHtml || adCode || '';
        const adContainerRef = useRef<HTMLDivElement>(null);

        useEffect(() => {
            const container = adContainerRef.current;
            if (!container) return;

            container.innerHTML = adHtml || '';

            // Recreate script tags so third-party ad snippets execute after insertion
            const scripts = Array.from(container.querySelectorAll('script'));
            scripts.forEach((script) => {
                const newScript = document.createElement('script');
                newScript.async = script.async;
                newScript.type = script.type || 'text/javascript';

                if (script.src) {
                    newScript.src = script.src;
                } else {
                    newScript.textContent = script.textContent ?? '';
                }

                script.replaceWith(newScript);
            });
        }, [adHtml]);

        return (
            <div className="w-full rounded-2xl border border-muted bg-white/60 p-4 text-sm text-center min-h-[120px]">
                {adHtml ? (
                    <div className="w-full overflow-visible" ref={adContainerRef} />
                ) : (
                    <span className="text-muted-foreground">
                        광고 코드가 없습니다.
                    </span>
                )}
            </div>
        );
    }

    if (item.type === 'text') {
        return (
            <div className="w-full text-center py-4">
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {item.content}
                </p>
            </div>
        );
    }

    const buttonStyle = {
        backgroundColor: theme.buttonColor,
        color: theme.buttonTextColor,
        border: theme.buttonBorderColor ? `2px solid ${theme.buttonBorderColor}` : '2px solid transparent',
        textShadow: theme.textBorderColor ?
            `-1px -1px 0 ${theme.textBorderColor}, 1px -1px 0 ${theme.textBorderColor}, -1px 1px 0 ${theme.textBorderColor}, 1px 1px 0 ${theme.textBorderColor}`
            : 'none',
    };

    const roundedClass =
        theme.buttonStyle === 'pill'
            ? 'rounded-full'
            : theme.buttonStyle === 'square'
                ? 'rounded-none'
                : 'rounded-2xl';

    let iconSrc: string | null = null;
    if (item.type === 'link' && item.icon) {
        if (item.icon.startsWith('sns:')) {
            const key = item.icon.replace('sns:', '');
            const asset = snsIcons[key];
            if (asset) {
                iconSrc = asset;
            }
        } else if (item.icon.startsWith('http')) {
            iconSrc = item.icon;
        }
    }

    return (
        <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`group w-full flex items-center justify-between px-6 py-4 ${roundedClass} transition-all hover:scale-[1.02] hover:shadow-lg`}
            style={buttonStyle}
        >
            <div className="flex items-center gap-3 flex-1 overflow-hidden">
                {iconSrc ? (
                    <div className="w-10 h-10 rounded-md overflow-hidden bg-white/10 flex-shrink-0">
                        <img src={iconSrc} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                ) : (
                    <ExternalLink className="w-5 h-5 flex-shrink-0 opacity-70" />
                )}
                <span className="font-medium text-left truncate">{item.title}</span>
            </div>
            {/* Right Arrow / Icon */}
            <div className="flex-shrink-0 ml-2">
                <ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
            </div>
        </a>
    );
}
