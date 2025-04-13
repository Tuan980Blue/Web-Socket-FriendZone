'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Users,
  Film,
  Bookmark,
  Compass,
  Moon,
  Sun, CircleFadingPlus
} from 'lucide-react';
import { Avatar } from '@mantine/core';
import { useUserData } from '@/hooks/useUserData';

const LeftSidebar = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const pathname = usePathname();
  const { user } = useUserData();

  const menuItems = [
    { icon: Home, label: 'News Feed', href: '/' },
    { icon: Users, label: 'Friends', href: '/friends' },
    { icon: Film , label: 'Reels', href: '/reels' },
    { icon: Bookmark, label: 'Saved', href: '/saved' },
    { icon: Compass, label: 'Explore', href: '/explore' },
  ];

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-[#FAFAFA] dark:bg-[#121212] border-r border-[#DBDBDB] dark:border-[#262626] overflow-y-auto hidden md:block">
      <div className="p-4">
        {/* Profile Summary */}
        <Link href="/profile" className="flex items-center space-x-2 p-1 rounded-lg hover:bg-[#FAFAFA] dark:hover:bg-[#121212]">
          <Avatar
            src={user?.avatar || undefined}
            alt={user?.username || "Profile"}
            size="lg"
            radius="xl"
          />
          <div>
            <h3 className="font-medium text-[#262626] dark:text-[#FAFAFA]">{user?.username || "Guest"}</h3>
            <p className="text-sm text-[#666666] dark:text-[#A0A0A0]">View Profile</p>
          </div>
        </Link>

        {/* Quick Menu */}
        <nav className="mt-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 p-2 rounded-lg mb-1 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#F58529]/10 via-[#DD2A7B]/10 to-[#515BD4]/10'
                    : 'hover:bg-[#FAFAFA] dark:hover:bg-[#121212]'
                }`}
              >
                <Icon 
                  size={20} 
                  className={isActive ? 'icon-primery' : 'text-[#666666] dark:text-[#A0A0A0]'} 
                />
                <span className={isActive ? 'text-primery font-medium' : 'text-[#666666] dark:text-[#A0A0A0]'}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Create Post Button */}
        <button className="w-full mt-4 p-2 bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#515BD4] text-white rounded-lg hover:opacity-90 flex items-center justify-center space-x-2">
          <CircleFadingPlus size={20} />
          <span>Create Post</span>
        </button>


        <div className="mt-6">
          <h3 className="text-sm font-medium text-[#666666] dark:text-[#A0A0A0] mb-2">More..</h3>
          <div className="space-y-1">

          </div>
        </div>

        {/* Dark Mode Toggle */}
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="mt-6 w-full p-2 flex items-center space-x-3 text-[#666666] dark:text-[#A0A0A0] hover:text-[#262626] dark:hover:text-[#FAFAFA] hover:bg-[#FAFAFA] dark:hover:bg-[#121212] rounded-lg"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
      </div>
    </aside>
  );
};

export default LeftSidebar;