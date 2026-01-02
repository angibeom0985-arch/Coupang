import Image from 'next/image';
import { Profile } from '@/lib/data';

interface ProfileHeaderProps {
    profile: Profile;
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
    const showCover = profile.profileLayout !== 'avatar';
    const showAvatar = profile.profileLayout !== 'cover';
    const hasCoverImage = Boolean(profile.coverImage);
    const hasAvatar = Boolean(profile.avatar);

    return (
        <div className="flex flex-col items-center text-center space-y-4 mb-8">
            <div className="w-full max-w-xl rounded-2xl overflow-hidden shadow-xl bg-white/70">
                {showCover && (
                    <div className="relative h-40 bg-gradient-to-r from-slate-900 to-slate-700">
                        {hasCoverImage && (
                            <Image
                                src={profile.coverImage as string}
                                alt={`${profile.name} cover`}
                                fill
                                className="object-cover"
                                priority
                            />
                        )}
                    </div>
                )}

                <div className={`flex flex-col items-center px-6 pb-6 ${showCover ? '-mt-12' : 'pt-8'}`}>
                    {showAvatar && (
                        <div className="relative w-24 h-24 rounded-full overflow-hidden ring-4 ring-white shadow-2xl bg-slate-200">
                            {hasAvatar ? (
                                <Image
                                    src={profile.avatar}
                                    alt={profile.name}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-slate-500">
                                    {profile.name?.charAt(0) || 'N'}
                                </div>
                            )}
                        </div>
                    )}

                    <div className={`space-y-2 ${showCover ? 'mt-6' : 'mt-4'}`} style={{ fontFamily: profile.theme.fontFamily || 'inherit' }}>
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
            </div>
        </div>
    );
}
