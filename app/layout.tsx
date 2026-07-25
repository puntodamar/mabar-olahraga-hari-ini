import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import {ThemeProvider} from "next-themes";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {

    title: "Mabar Olahraga Hari Ini 🔥",
    description: "Database mabar olahraga hari ini di sekitarmu. Temukan lokasi, jadwal, dan teman untuk bermain olahraga favoritmu. Bergabunglah dengan komunitas olahraga lokal dan nikmati pengalaman mabar yang seru!",
    openGraph: {
        title: "Mabar Olahraga Hari Ini 🔥",
        description: "Database mabar olahraga hari ini di sekitarmu. Temukan lokasi, jadwal, dan teman untuk bermain olahraga favoritmu. Bergabunglah dengan komunitas olahraga lokal dan nikmati pengalaman mabar yang seru!",
        url: "https://mabarolahraga.vercel.app/",
        siteName: "Mabar Olahraga Hari Ini 🔥",
        images: [
            {
                url: "https://mabarolahraga.vercel.app/og-image.png",
                width: 1200,
                height: 630,
            },
        ],
        locale: "id_ID",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Mabar Olahraga Hari Ini 🔥",
        description: "Database mabar olahraga hari ini di sekitarmu. Temukan lokasi, jadwal, dan teman untuk bermain olahraga favoritmu. Bergabunglah dengan komunitas olahraga lokal dan nikmati pengalaman mabar yang seru!",
        images: ["https://mabarolahraga.vercel.app/og-image.png"],
    },
};

export default function RootLayout({children,}: Readonly<{ children: React.ReactNode; }>) {
    return (
        <html
            lang="id"
            className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
            suppressHydrationWarning
        >
        <body className="min-h-full flex flex-col">
        {/*{children}*/}
            <ThemeProvider
                attribute="class"
                defaultTheme="light"
                disableTransitionOnChange>
                {children}
            </ThemeProvider>
        </body>
        </html>
    );
}
