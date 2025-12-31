import parse from 'html-react-parser';

// ... (keep existing imports)

// ... inside RootLayout
return (
    <html lang="ko">
        <head>
            {customHeadCode && parse(customHeadCode)}
        </head>
        <body className={inter.className}>{children}</body>
    </html>
);
}
