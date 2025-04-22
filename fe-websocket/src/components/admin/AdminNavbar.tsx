'use client'

import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {Bell, Moon, Sun, UserCircle, Settings, LogOut} from 'lucide-react';
import {useTheme} from 'next-themes';
import {useUserData} from "@/hooks/useUserData";
import {Avatar} from "@mantine/core";
import Link from "next/link";
import Image from "next/image";

export default function AdminNavbar() {
    const router = useRouter();
    const {theme, setTheme} = useTheme();
    const [notifications] = useState([]);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const {user, setUser} = useUserData();

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('tokenExpiration');
        router.push('/auth');
    };

    const handleOptionClick = () => {
        setIsProfileOpen(false);
    };

    return (
        <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        {/* Logo */}
                        <Link href="/admin" className="flex items-center space-x-3 group">
                            <div
                                className="relative w-10 h-10 overflow-hidden rounded-xl transform transition-transform duration-300">
                                <Image
                                    src="/logo2.png"
                                    alt="Logo"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xl font-bold text-primery">FriendZone</span>
                                <span className="text-xs text-[#666666] dark:text-[#A0A0A0]">Admin Dashboard</span>
                            </div>
                        </Link>
                    </div>

                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            {theme === 'dark' ? (
                                <Sun className="h-5 w-5 text-gray-500 dark:text-gray-400"/>
                            ) : (
                                <Moon className="h-5 w-5 text-gray-500 dark:text-gray-400"/>
                            )}
                        </button>

                        <div className="relative">
                            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                                <Bell className="h-5 w-5 text-gray-500 dark:text-gray-400"/>
                                {notifications.length > 0 && (
                                    <span
                                        className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"/>
                                )}
                            </button>
                        </div>

                        <div className="relative">
                            {user ? (
                                <div className="flex items-center space-x-3">
                                    <button
                                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                                        className=" cursor-pointer flex items-center justify-center transition-all duration-300 focus:outline-none "
                                    >
                                        <div className="relative">
                                            <div
                                                className="absolute inset-0 rounded-full bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#515BD4] animate-gradient-xy"></div>
                                            <div className="relative rounded-full bg-[#FAFAFA] dark:bg-[#121212]">
                                                <Avatar
                                                    src={user?.avatar || '/image-person.png'}
                                                    alt={user?.username || "Profile"}
                                                    size="md"
                                                    radius="xl"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex flex-col ml-2">
                                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                {user?.username || "Admin"}
                                            </span>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                Quản trị viên
                                            </span>
                                        </div>
                                    </button>
                                </div>
                            ) : (
                                <Link
                                    href="/auth"
                                    className="px-4 py-2 border border-[#DD2A7B] rounded-lg text-sm font-semibold text-black hover:bg-gray-200 transition duration-150"
                                >
                                    Đăng nhập
                                </Link>
                            )}

                            {isProfileOpen && user && (
                                <div
                                    className="absolute right-0 mt-2 w-64 bg-[#FAFAFA] dark:bg-[#121212] border border-[#DBDBDB] dark:border-[#262626] rounded-lg shadow-lg py-2 transform transition-all duration-300 ease-in-out">
                                    {/* User Info Section */}
                                    <div className="px-4 py-3 border-b border-[#DBDBDB] dark:border-[#262626]">
                                        <div className="flex items-center space-x-3">
                                            <div className="relative">
                                                <div
                                                    className="absolute inset-0 rounded-full bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#515BD4] animate-gradient-xy"></div>
                                                <div
                                                    className="relative p-0.5 rounded-full bg-[#FAFAFA] dark:bg-[#121212]">
                                                    <Avatar
                                                        src={user?.avatar || undefined}
                                                        alt={user?.username || "Profile"}
                                                        size="md"
                                                        radius="xl"
                                                        className="border-2 border-[#FAFAFA] dark:border-[#121212]"
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-[#262626] dark:text-[#FAFAFA] truncate">
                                                    {user?.username || "Guest"}
                                                </p>
                                                <p className="text-sm text-[#666666] dark:text-[#A0A0A0] truncate">
                                                    {user?.email || ""}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Menu Items */}
                                    <Link href="/profile"
                                          onClick={handleOptionClick}
                                          className="flex items-center space-x-2 px-4 py-2 hover:bg-[#FAFAFA] dark:hover:bg-[#121212] text-[#262626] dark:text-[#FAFAFA]">
                                        <UserCircle className="h-5 w-5"/>
                                        <span>Profile</span>
                                    </Link>
                                    <Link href="/settings"
                                          onClick={handleOptionClick}
                                          className="flex items-center space-x-2 px-4 py-2 hover:bg-[#FAFAFA] dark:hover:bg-[#121212] text-[#262626] dark:text-[#FAFAFA]">
                                        <Settings className="h-5 w-5"/>
                                        <span>Settings</span>
                                    </Link>
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            handleOptionClick();
                                        }}
                                        className="flex items-center space-x-2 w-full text-left px-4 py-2 hover:bg-[#FAFAFA] dark:hover:bg-[#121212] text-[#262626] dark:text-[#FAFAFA]"
                                    >
                                        <LogOut className="h-5 w-5"/>
                                        <span>Logout</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
} 