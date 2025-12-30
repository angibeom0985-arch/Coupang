import Image from 'next/image';
import { Profile } from '@/lib/data';

interface ProfileHeaderProps {
    profile: Profile;
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
    return (
        <div className="flex flex-col items-center text-center space-y-4 mb-8">
            <div className="relative w-24 h-24 rounded-full overflow-hidden ring-4 ring-white shadow-xl">
                <Image
                    src={profile.avatar}
                    alt={profile.name}
                    fill
                    className="object-cover"
                    priority
                />
            </div>
            <div className="space-y-2">
                <h1 className="text-xl font-bold" style={{ color: profile.theme.textColor }}>
                    {profile.name}
                </h1>
                <p
                    className="text-sm whitespace-pre-wrap max-w-sm mx-auto leading-relaxed"
                    style={{ color: profile.theme.textColor }}
                >
                    {profile.description}
                </p>
            </div>
        </div>
    );
}
