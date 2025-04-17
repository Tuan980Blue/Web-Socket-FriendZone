'use client';

import React from "react";
import "@mantine/core/styles.css";
import "@/app/globals.css";
import {UserProvider} from "@/store/UserContext";
import {ReelProvider} from "@/hooks/useReelsData";
import Navbar from "@/components/Navbar";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";
import MobileNav from "@/components/MobileNav";
import {usePathname} from 'next/navigation';
import AuthGuard from "@/components/AuthGuardProps";

export default function Layout({
                                   children,
                               }: Readonly<{ children: React.ReactNode }>) {
    const pathname = usePathname();
    const isProfilePage = pathname === '/profile' || pathname.startsWith('/profile/');

    return (
        <UserProvider>
            <ReelProvider>
                <div className="min-h-screen flex flex-col">
                    <Navbar/>
                    <div className="flex-1 flex relative">
                        <LeftSidebar/>
                        <AuthGuard>
                            <main
                                className={`flex-1 md:ml-64 ${isProfilePage ? '' : 'lg:mr-80'} mt-16 pb-16 md:pb-0`}>
                                <div className="px-4 md:px-6 lg:px-8 p-2">
                                    {children}
                                </div>
                            </main>
                            {!isProfilePage && <div className="hidden lg:block"><RightSidebar/></div>}
                        </AuthGuard>
                    </div>
                    <MobileNav/>
                </div>
            </ReelProvider>
        </UserProvider>
    );
}
