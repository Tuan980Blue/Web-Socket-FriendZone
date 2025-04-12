import React from "react";
import { Metadata } from "next";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "@/app/globals.css";
import {UserProvider} from "@/store/UserContext";
import {ReelProvider} from "@/hooks/useReelsData";
import Navbar from "@/components/Navbar";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";

export const metadata: Metadata = {
    title: "Web Social",
    description: "Kết nối dễ dàng hơn với bạn",
};

export default function Layout({
                                   children,
                               }: Readonly<{ children: React.ReactNode }>) {
    return (
        <MantineProvider
            theme={{
                primaryColor: 'instagram',
                colors: {
                    instagram: [
                        '#F58529', // 0 - Orange
                        '#DD2A7B', // 1 - Pink
                        '#8134AF', // 2 - Purple
                        '#515BD4', // 3 - Blue
                        '#3897F0', // 4 - Light Blue (Follow/CTA)
                        '#ED4956', // 5 - Red (Notification/Like)
                        '#20C997', // 6 - Teal (Success)
                        '#8E8E8E', // 7 - Gray (Secondary Text)
                        '#262626', // 8 - Dark Gray (Primary Text)
                        '#FAFAFA', // 9 - Light Gray (Background)
                    ],
                },
                primaryShade: 3,
                fontFamily: 'var(--font-geist-sans)',
                components: {
                    Button: {
                        defaultProps: {
                            radius: 'md',
                        },
                    },
                    Card: {
                        defaultProps: {
                            radius: 'md',
                        },
                    },
                },
            }}
        >
            <UserProvider>
                <ReelProvider>
                    <div className="min-h-screen flex flex-col">
                        <Navbar/>
                        <div className="flex-1 flex relative">
                            <LeftSidebar/>
                            <main className="flex-1 ml-64 mr-80 mt-16">
                                <div className="px-4 md:px-6 lg:px-8 p-8">
                                    {children}
                                </div>
                            </main>
                            <RightSidebar/>
                        </div>
                    </div>
                </ReelProvider>
            </UserProvider>
        </MantineProvider>
    );
}
