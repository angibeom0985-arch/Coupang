import { ContentItem } from '@/lib/data';
import { ExternalLink, MessageSquare } from 'lucide-react';

interface LinkCardProps {
    item: ContentItem;
    theme: {
        buttonColor: string;
        buttonTextColor: string;
        buttonStyle: 'rounded' | 'square' | 'pill';
    };
}

export function LinkCard({ item, theme }: LinkCardProps) {
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
    };

    const roundedClass =
        theme.buttonStyle === 'pill'
            ? 'rounded-full'
            : theme.buttonStyle === 'square'
                ? 'rounded-none'
                : 'rounded-2xl';

    return (
        <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`group w-full flex items-center justify-between px-6 py-4 ${roundedClass} transition-all hover:scale-[1.02] hover:shadow-lg`}
            style={buttonStyle}
        >
            <div className="flex items-center gap-3 flex-1 overflow-hidden">
                {item.icon?.startsWith('http') ? (
                    <div className="w-10 h-10 rounded-md overflow-hidden bg-white/10 flex-shrink-0">
                        <img src={item.icon} alt={item.title} className="w-full h-full object-cover" />
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
