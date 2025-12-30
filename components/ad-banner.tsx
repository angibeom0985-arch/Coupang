'use client';

interface AdBannerProps {
    text: string;
}

export function AdBanner({ text }: AdBannerProps) {
    if (!text) return null;

    return (
        <div className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-2 overflow-hidden">
            <div className="animate-scroll whitespace-nowrap">
                <span className="inline-block px-4 text-sm font-medium">
                    {text}
                </span>
                <span className="inline-block px-4 text-sm font-medium">
                    {text}
                </span>
                <span className="inline-block px-4 text-sm font-medium">
                    {text}
                </span>
            </div>
        </div>
    );
}
