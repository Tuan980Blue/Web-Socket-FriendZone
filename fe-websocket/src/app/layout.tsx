import { Inter } from "next/font/google";
import "./globals.css";
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/dates/styles.css';
import RootWrapper from "@/components/RootWrapper";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
});

export const viewport = {
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <head>
            <link rel="icon" href="/logo2.png" type="image/png" />
            <title>WebSocket Social</title>
        </head>
        <body className={`${inter.variable} antialiased`}>
        <RootWrapper>
            {children}
        </RootWrapper>
        </body>
        </html>
    );
}
