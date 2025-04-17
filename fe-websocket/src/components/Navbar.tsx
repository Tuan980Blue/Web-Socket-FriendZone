'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {Bell, CircleFadingPlus, Home, MessageSquare, Search} from 'lucide-react';
import {Avatar, Tooltip} from '@mantine/core';
import Image from "next/image";
import { useUserData } from '@/hooks/useUserData';

const Navbar = () => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, setUser } = useUserData();

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
    <nav className="fixed top-0 left-0 right-0 h-16 bg-[#FAFAFA] dark:bg-[#121212] border-b border-[#DBDBDB] dark:border-[#262626] z-50">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="relative w-10 h-10 overflow-hidden rounded-xl transform transition-transform duration-300">
            <Image 
              src="/logo2.png"
              alt="Logo" 
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-primery">FriendZone</span>
            <span className="text-xs text-[#666666] dark:text-[#A0A0A0]">Connect & Share</span>
          </div>
        </Link>

        {/* Search Bar */}
        <div className={`flex-1 hidden md:block max-w-2xl mx-4 ${isSearchFocused ? 'w-full' : 'w-auto'}`}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#666666] dark:text-[#A0A0A0]" size={20} />
            <input
              type="text"
              placeholder="Search friends, posts, hashtags..."
              className="w-full pl-10 pr-4 py-2 rounded-full bg-[#FAFAFA] dark:bg-[#121212] border border-[#DBDBDB] dark:border-[#262626] focus:outline-none focus:ring-2 focus:ring-[#DD2A7B] transition-all duration-300"
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
          </div>
        </div>

        {/* Main Menu */}
        <div className="flex items-center space-x-4">
          <Link href="/" className={`p-2 rounded-full hidden md:block hover:bg-[#FAFAFA] dark:hover:bg-[#121212] ${pathname === '/' ? 'icon-primery' : 'text-[#666666] dark:text-[#A0A0A0] hover:text-[#262626] dark:hover:text-[#FAFAFA]'}`}>
            <Home size={24} />
          </Link>

          <Link href="/messages" className={`relative p-2 rounded-full hover:bg-[#FAFAFA] dark:hover:bg-[#121212] ${pathname === '/messages' ? 'icon-primery' : 'text-[#666666] dark:text-[#A0A0A0] hover:text-[#262626] dark:hover:text-[#FAFAFA]'}`}>
            <MessageSquare size={24} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#ED4956] rounded-full"></span>
          </Link>
          
          <Link href="/notifications" className={`relative p-2 rounded-full hover:bg-[#FAFAFA] dark:hover:bg-[#121212] ${pathname === '/notifications' ? 'icon-primery' : 'text-[#666666] dark:text-[#A0A0A0] hover:text-[#262626] dark:hover:text-[#FAFAFA]'}`}>
            <Bell size={24} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#ED4956] rounded-full"></span>
          </Link>

          <Link href="/posts" className={`p-2 rounded-full hidden md:block bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#515BD4] text-white hover:opacity-90 ${pathname === '/post' ? 'icon-primery' : 'text-[#666666] dark:text-[#A0A0A0] dark:hover:text-[#FAFAFA]'}`}>
            <CircleFadingPlus size={24} />
          </Link>

          <div className="relative">
            {user ? (
                <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="border border-gray-300 dark:border-[#121212] cursor-pointer rounded-full flex items-center justify-center transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-gray-200"
                >
                  <div className="relative">
                    <Tooltip label={user.fullName || undefined}
                             withArrow
                             className={"italic"}
                    >
                      <div className="relative">
                        <div
                            className="absolute inset-0 rounded-full bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#515BD4] animate-gradient-xy"></div>
                        <div className="relative rounded-full bg-[#FAFAFA] dark:bg-[#121212]">
                          <Avatar
                              src={user?.avatar || undefined}
                              alt={user?.username || "Profile"}
                              size="md"
                              radius="xl"
                          />
                        </div>
                      </div>
                    </Tooltip>
                  </div>
                </button>
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
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#515BD4] animate-gradient-xy"></div>
                        <div className="relative p-0.5 rounded-full bg-[#FAFAFA] dark:bg-[#121212]">
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
                        className="block px-4 py-2 hover:bg-[#FAFAFA] dark:hover:bg-[#121212] text-[#262626] dark:text-[#FAFAFA]">Profile</Link>
                  <Link href="/settings"
                        onClick={handleOptionClick}
                        className="block px-4 py-2 hover:bg-[#FAFAFA] dark:hover:bg-[#121212] text-[#262626] dark:text-[#FAFAFA]">Settings</Link>
                  <button
                      onClick={() => {
                        handleLogout();
                        handleOptionClick();
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-[#FAFAFA] dark:hover:bg-[#121212] text-[#262626] dark:text-[#FAFAFA]"
                  >
                    Logout
                  </button>
                </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 