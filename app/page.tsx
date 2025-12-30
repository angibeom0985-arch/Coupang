import { getLinksData, getEnabledLinks } from '@/lib/data';
import { ProfileHeader } from '@/components/profile-header';
import { LinkCard } from '@/components/link-card';

export default function Home() {
    const data = getLinksData();
    const enabledLinks = getEnabledLinks();

    return (
        <main
            className="min-h-screen flex items-center justify-center p-4"
            style={{ backgroundColor: data.profile.theme.backgroundColor }}
        >
            <div className="w-full max-w-2xl mx-auto py-12">
                <ProfileHeader profile={data.profile} />

                <div className="space-y-4 px-4">
                    {enabledLinks.map((item) => (
                        <LinkCard key={item.id} item={item} theme={data.profile.theme} />
                    ))}
                </div>

                <footer className="mt-16 text-center">
                    <p className="text-xs opacity-50" style={{ color: data.profile.theme.textColor }}>
                        © 2025 All rights reserved
                    </p>
                </footer>
            </div>
        </main>
    );
}
