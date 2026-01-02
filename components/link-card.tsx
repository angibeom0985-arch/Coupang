import React, { useEffect, useRef } from 'react';
import { ContentItem } from '@/lib/data';
import { ExternalLink } from 'lucide-react';
import InstagramLogo from '@/components/admin/Instagram_logo_2016.svg';
import YoutubeLogo from '@/components/admin/유튜브.png';
import TiktokLogo from '@/components/admin/틱톡.png';

interface LinkCardProps {
    item: ContentItem;
    theme: {
        buttonColor: string;
        buttonTextColor: string;
        buttonStyle: 'rounded' | 'square' | 'pill';
        buttonBorderColor?: string;
        textBorderColor?: string;
        buttonHoverColor?: string;
        fontFamily?: string;
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

    const layout: 'small' | 'medium' | 'large' =
        item.type === 'link' && (item.layout === 'small' || item.layout === 'large')
            ? item.layout
            : 'medium';

    const buttonStyle = {
        backgroundColor: theme.buttonColor,
        color: theme.buttonTextColor,
        border: theme.buttonBorderColor ? `2px solid ${theme.buttonBorderColor}` : '2px solid transparent',
        textShadow: theme.textBorderColor ?
            `-1px -1px 0 ${theme.textBorderColor}, 1px -1px 0 ${theme.textBorderColor}, -1px 1px 0 ${theme.textBorderColor}, 1px 1px 0 ${theme.textBorderColor}`
            : 'none',
        fontFamily: theme.fontFamily || 'inherit',
        ['--hover-color' as any]: theme.buttonHoverColor || theme.buttonColor,
    };

    const roundedClass =
        theme.buttonStyle === 'pill'
            ? 'rounded-full'
            : theme.buttonStyle === 'square'
                ? 'rounded-none'
                : 'rounded-2xl';

    const snsKeys: string[] =
        item.type === 'link' && item.icon?.startsWith('sns:')
            ? item.icon.replace('sns:', '').split(',').map((k) => k.trim()).filter(Boolean)
            : [];

    const snsIconList = snsKeys
        .map((key) => snsIcons[key])
        .filter(Boolean);

    let iconSrc: string | null = null;
    if (item.type === 'link' && item.icon && !item.icon.startsWith('sns:')) {
        if (item.icon.startsWith('http')) {
            iconSrc = item.icon;
        }
    }

    const renderIconRow = (size: 'sm' | 'md') => {
        if (snsIconList.length > 0) {
            return (
                <div className="flex items-center gap-1 flex-shrink-0">
                    {snsIconList.map((src, idx) => (
                        <img key={src + idx} src={src} alt="sns" className={`${size === 'sm' ? 'w-6 h-6' : 'w-8 h-8'} rounded-lg object-contain`} />
                    ))}
                </div>
            );
        }
        if (iconSrc) {
            return (
                <div className={`${size === 'sm' ? 'w-8 h-8' : 'w-10 h-10'} rounded-md overflow-hidden bg-white/10 flex-shrink-0`}>
                    <img src={iconSrc} alt={item.title} className="w-full h-full object-cover" />
                </div>
            );
        }
        return <ExternalLink className={`${size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'} flex-shrink-0 opacity-70`} />;
    };

    if (layout === 'small') {
        return (
            <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`group w-full flex items-center justify-between px-4 py-3 text-sm ${roundedClass} transition-all hover:scale-[1.015] hover:shadow-md hover:[background-color:var(--hover-color)]`}
                style={buttonStyle}
            >
                <div className="flex items-center gap-2 flex-1 overflow-hidden">
                    {renderIconRow('sm')}
                    <span className="font-medium text-left truncate">{item.title}</span>
                </div>
                <ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-2" />
            </a>
        );
    }

    if (layout === 'large') {
        return (
            <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group w-full overflow-hidden rounded-2xl border bg-white/80 shadow-sm hover:shadow-lg transition"
                style={{ borderColor: theme.buttonBorderColor || '#e5e7eb', fontFamily: theme.fontFamily || 'inherit', ['--hover-color' as any]: theme.buttonHoverColor || theme.buttonColor }}
            >
                <div className="relative w-full aspect-[16/9] bg-muted overflow-hidden flex items-center justify-center">
                    {iconSrc ? (
                        <img src={iconSrc} alt={item.title} className="w-full h-full object-cover" />
                    ) : snsIconList.length > 0 ? (
                        <div className="flex items-center gap-2 bg-white/80 px-4 py-2 rounded-full shadow">
                            {snsIconList.map((src, idx) => (
                                <img key={src + idx} src={src} alt="sns" className="w-8 h-8 rounded-lg object-contain" />
                            ))}
                        </div>
                    ) : (
                        <div className="h-full w-full flex items-center justify-center text-sm text-muted-foreground">
                            이미지를 추가해 주세요
                        </div>
                    )}
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-opacity" />
                </div>
                <div className="px-4 py-3 flex items-start justify-between gap-3 group-hover:[background-color:var(--hover-color)] transition-colors">
                    <div className="min-w-0 flex-1">
                        <div className="font-semibold text-base truncate">{item.title}</div>
                        <div className="text-xs text-muted-foreground truncate">{item.url}</div>
                    </div>
                    <span
                        className="text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap"
                        style={{ backgroundColor: theme.buttonColor, color: theme.buttonTextColor }}
                    >
                        바로가기
                    </span>
                </div>
            </a>
        );
    }

    return (
        <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`group w-full flex items-center justify-between px-6 py-4 ${roundedClass} transition-all hover:scale-[1.02] hover:shadow-lg hover:[background-color:var(--hover-color)]`}
            style={buttonStyle}
        >
            <div className="flex items-center gap-3 flex-1 overflow-hidden">
                {renderIconRow('md')}
                <span className="font-medium text-left truncate">{item.title}</span>
            </div>
            <div className="flex-shrink-0 ml-2">
                <ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
            </div>
        </a>
    );
}
