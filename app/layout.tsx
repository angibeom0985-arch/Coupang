import { Inter } from "next/font/google";
import "./globals.css";
import { getLinksData } from "@/lib/data";
import parse from 'html-react-parser';
import type { Metadata, Viewport } from "next";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
};

export async function generateMetadata(): Promise<Metadata> {
    const data = await getLinksData();
    const title = data.siteTitle || "생꿀 | 생활 꿀팁&꿀템";

    return {
        title: title,
        description: "나만의 링크 모음 페이지 - 하나의 링크로 모든 것을 공유하세요",
        keywords: ["소셜미디어", "프로필링크", "꿀팁", "꿀템"],
        authors: [{ name: "Coupang Link Bio" }],
        openGraph: {
            title: title,
            description: "나만의 링크 모음 페이지 - 하나의 링크로 모든 것을 공유하세요",
            type: "website",
            locale: "ko_KR",
        },
        twitter: {
            card: "summary_large_image",
            title: title,
            description: "나만의 링크 모음 페이지 - 하나의 링크로 모든 것을 공유하세요",
        },
        icons: {
            icon: data.faviconUrl || '/favicon.ico',
        },
    };
}

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const data = await getLinksData();
    const customHeadCode = data.customHeadCode || '';

    return (
        <html lang="ko">
            <body className={inter.className}>
                {customHeadCode ? parse(customHeadCode) : null}
                {children}
            </body>
        </html>
    );
}
