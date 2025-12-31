import { ContentItem } from '@/lib/data';
import { ExternalLink, Instagram, Youtube, Music4, Globe2, Facebook, Mail, Phone, Link2 } from 'lucide-react';

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

const snsIcons: Record<string, string | JSX.Element> = {
    instagram: <Instagram className="w-5 h-5" />,
    youtube: <Youtube className="w-5 h-5" />,
    tiktok: <Music4 className="w-5 h-5" />,
    x: <Globe2 className="w-5 h-5" />,
    threads: <Globe2 className="w-5 h-5" />,
    naverclip: <Globe2 className="w-5 h-5" />,
    facebook: <Facebook className="w-5 h-5" />,
    homepage: <Link2 className="w-5 h-5" />,
    email: <Mail className="w-5 h-5" />,
    phone: <Phone className="w-5 h-5" />,
};

export function LinkCard({ item, theme, adCode }: LinkCardProps) {
    if (item.type === 'ad') {
        return (
            <div className="w-full rounded-2xl border border-muted bg-white/60 p-4 text-sm text-center">
                {adCode
                    ? (
                        <div
                            className="w-full h-full overflow-hidden"
                            dangerouslySetInnerHTML={{ __html: adCode }}
                        />
                    ) : (
                        <span className="text-muted-foreground">
                            ?? ?????. ?? ?? Body/?? ??? ????? ?????.
                        </span>
                    )
                }
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
    let iconNode: JSX.Element | null = null;
    if (item.type === 'link' && item.icon) {
        if (item.icon.startsWith('sns:')) {
            const key = item.icon.replace('sns:', '');
            const asset = snsIcons[key];
            if (asset) {
                if (typeof asset === 'string') {
                    iconSrc = asset;
                } else {
                    iconNode = asset as JSX.Element;
                }
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
                {iconSrc || iconNode ? (
                    <div className="w-10 h-10 rounded-md overflow-hidden bg-white/10 flex-shrink-0">
                        {iconSrc ? (
                            <img src={iconSrc} alt={item.title} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-white/80">
                                {iconNode}
                            </div>
                        )}
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
