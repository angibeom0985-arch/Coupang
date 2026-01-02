'use client';

interface AdBannerProps {
    text: string;
    background?: string;
    textColor?: string;
    scrollEnabled?: boolean;
}

export function AdBanner({ text, background, textColor, scrollEnabled = true }: AdBannerProps) {
    if (!text) return null;

    const bannerStyle = background
        ? { backgroundColor: background, color: textColor || '#ffffff' }
        : undefined;
    const textClass = textColor ? '' : 'text-white';

    return (
        <div
            className={`w-full ${background ? '' : 'bg-gradient-to-r from-orange-500 to-red-500'} py-2 overflow-hidden`}
            style={bannerStyle}
        >
            <div className={`${scrollEnabled ? 'animate-scroll' : 'flex'} whitespace-nowrap`}>
                <span className={`inline-block px-4 text-sm font-medium ${textClass}`}>
                    {text}
                </span>
                <span className={`inline-block px-4 text-sm font-medium ${textClass}`}>
                    {text}
                </span>
            </div>
        </div>
    );
}
