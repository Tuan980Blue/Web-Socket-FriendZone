'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Search,
  CircleFadingPlus ,
  Users ,
  Film
} from 'lucide-react';
import { Avatar, Tooltip } from '@mantine/core';
import { useUserData } from '@/hooks/useUserData';

const MobileNav = () => {
  const pathname = usePathname();
  const { user } = useUserData();

  const menuItems = [
    { icon: Home, label: 'Home', href: '/' },
    { icon: Search, label: 'Search', href: '/search' },
    { icon: Film , label: 'Reels', href: '/reels' },
    { icon: CircleFadingPlus, label: 'Posts', href: '/posts' },
    { icon: Users , label: 'Follow', href: '/follows' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-[#121212]/80 backdrop-blur-md border-t border-[#DBDBDB] dark:border-[#262626] md:hidden z-50 shadow-lg">
      <div className="flex justify-around items-center h-16 px-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Tooltip 
              key={item.href} 
              label={item.label} 
              position="top" 
              withArrow
              transitionProps={{ transition: 'scale', duration: 200 }}
            >
              <Link
                href={item.href}
                className={`flex flex-col items-center justify-center w-full h-full relative group ${
                  isActive ? 'text-primery' : 'text-[#666666] dark:text-[#A0A0A0]'
                }`}
              >
                <div className="relative">
                  <Icon
                    size={24}
                    className={`${isActive ? 'icon-primery' : 'text-[#666666] dark:text-[#A0A0A0]'} 
                    transition-all duration-200 group-hover:scale-110`}
                  />
                  {isActive && (
                    <div
                      className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-primery"
                    />
                  )}
                </div>
                <span className={`text-xs mt-1 transition-all duration-200 ${isActive ? 'font-medium' : 'opacity-70'}`}>
                  {item.label}
                </span>
              </Link>
            </Tooltip>
          );
        })}
        
        <Tooltip 
          label="Profile" 
          position="top" 
          withArrow
          transitionProps={{ transition: 'scale', duration: 200 }}
        >
          <Link
            href="/profile"
            className={`flex flex-col items-center justify-center w-full h-full relative group ${
              pathname === '/profile' ? 'text-primery' : 'text-[#666666] dark:text-[#A0A0A0]'
            }`}
          >
            <div className="relative">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#515BD4] animate-gradient-xy"></div>
                <div className="relative p-0.5 rounded-full bg-[#FAFAFA] dark:bg-[#121212]">
                  <Avatar
                    src={user?.avatar || "/logo2.png"}
                    alt={user?.username || "Profile"}
                    size="sm"
                    radius="xl"
                    className="border-2 border-[#FAFAFA] dark:border-[#121212] transition-all duration-300 group-hover:scale-105"
                  />
                </div>
              </div>
              {pathname === '/profile' && (
                <div
                  className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#515BD4]"
                />
              )}
            </div>
            <span className={`text-xs mt-1 transition-all duration-200 ${pathname === '/profile' ? 'font-medium' : 'opacity-70'}`}>
              Profile
            </span>
          </Link>
        </Tooltip>
      </div>
    </nav>
  );
};

export default MobileNav; 