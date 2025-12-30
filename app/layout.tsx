import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "링크 모음 | Link in Bio",
    description: "나만의 링크 모음 페이지 - 하나의 링크로 모든 것을 공유하세요",
    keywords: ["링크인바이오", "링크모음", "소셜미디어", "프로필링크"],
    authors: [{ name: "Coupang Link Bio" }],
    openGraph: {
        title: "링크 모음 | Link in Bio",
        description: "나만의 링크 모음 페이지 - 하나의 링크로 모든 것을 공유하세요",
        type: "website",
        locale: "ko_KR",
    },
    twitter: {
        card: "summary_large_image",
        title: "링크 모음 | Link in Bio",
        description: "나만의 링크 모음 페이지 - 하나의 링크로 모든 것을 공유하세요",
    },
    viewport: {
        width: "device-width",
        initialScale: 1,
        maximumScale: 1,
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ko">
            <head>
                <script
                    async
                    src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2686975437928535"
                    crossOrigin="anonymous"
                />
            </head>
            <body className={inter.className}>{children}</body>
        </html>
    );
}
