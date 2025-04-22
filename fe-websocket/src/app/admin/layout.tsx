'use client';

import AdminNavbar from '@/components/admin/AdminNavbar';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminGuard from "@/components/AdminGuard";
import React, { useState } from 'react';
import {useUserData} from "@/hooks/useUserData";
import LoadingOverlay from "@/components/LoadingOverlay";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { isLoading } = useUserData();

  return (
      <>
        {isLoading && <LoadingOverlay />}
        <AdminGuard>
          <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
            <div className="fixed top-0 left-0 right-0 z-10">
              <AdminNavbar />
            </div>
            <div className="flex flex-1 pt-16">
              <div className="fixed left-0 top-16 bottom-0 z-10">
                <AdminSidebar onCollapseChange={setIsSidebarCollapsed} />
              </div>
              <main className={`flex-1 p-6 overflow-auto transition-all duration-300 ${isSidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
                {children}
              </main>
            </div>
          </div>
        </AdminGuard>
      </>
  );
} 