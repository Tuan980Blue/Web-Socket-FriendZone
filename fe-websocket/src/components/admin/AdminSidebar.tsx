'use client'

import {useState, useEffect} from 'react';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {
    LayoutDashboard,
    Users,
    FileText,
    Flag,
    MessageSquare,
    Image,
    Settings,
    Shield,
    ChevronLeft,
    ChevronRight,
    FolderTree,
    ChevronDown,
    ChevronUp,
    LucideIcon, ShieldCheck,
} from 'lucide-react';

interface MenuItem {
    title: string;
    icon: LucideIcon;
    href: string;
    subItems?: MenuItem[];
}

const menuItems: MenuItem[] = [
    {
        title: 'Dashboard',
        icon: LayoutDashboard,
        href: '/admin',
    },
    {
        title: 'Admins',
        icon: Shield,
        href: '/admin/admins',
    },
    {
        title: 'Users',
        icon: Users,
        href: '/admin/users',
    },
    {
        title: 'Posts',
        icon: FileText,
        href: '/admin/posts',
    },
    {
        title: 'Categories',
        icon: FolderTree,
        href: '/admin/categories',
        subItems: [
            {
                title: 'All Categories',
                icon: FolderTree,
                href: '/admin/categories/all',
            },
            {
                title: 'Add Category',
                icon: FolderTree,
                href: '/admin/categories/add',
            },
            {
                title: 'Manage Categories',
                icon: FolderTree,
                href: '/admin/categories/manage',
            },
        ],
    },
    {
        title: 'Reports',
        icon: Flag,
        href: '/admin/reports',
    },
    {
        title: 'Comments',
        icon: MessageSquare,
        href: '/admin/comments',
    },
    {
        title: 'Media',
        icon: Image,
        href: '/admin/media',
    },
    {
        title: 'Settings',
        icon: Settings,
        href: '/admin/settings',
    },
];

interface AdminSidebarProps {
    onCollapseChange?: (isCollapsed: boolean) => void;
}

export default function AdminSidebar({onCollapseChange}: AdminSidebarProps) {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [expandedItems, setExpandedItems] = useState<string[]>([]);

    useEffect(() => {
        if (onCollapseChange) {
            onCollapseChange(isCollapsed);
        }
    }, [isCollapsed, onCollapseChange]);

    const toggleSubItems = (href: string) => {
        setExpandedItems(prev =>
            prev.includes(href)
                ? prev.filter(item => item !== href)
                : [...prev, href]
        );
    };

    const renderMenuItem = (item: MenuItem) => {
        const isActive = pathname === item.href;
        const hasSubItems = Boolean(item.subItems?.length);
        const isExpanded = expandedItems.includes(item.href);

        return (
            <div key={item.href}>
                <Link
                    href={hasSubItems ? '#' : item.href}
                    onClick={(e) => {
                        if (hasSubItems) {
                            e.preventDefault();
                            toggleSubItems(item.href);
                        }
                    }}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 hover:translate-x-1 ${
                        isActive
                            ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    } ${isCollapsed ? 'justify-center' : ''}`}
                >
                    <div className={`flex items-center w-full ${isCollapsed ? 'justify-center' : ''}`}>
                        <div className="flex items-center">
                            <item.icon
                                className={`h-5 w-5 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}
                            />
                            {!isCollapsed && (
                                <span className="ml-3 transition-opacity duration-200">{item.title}</span>
                            )}
                        </div>
                        {!isCollapsed && (
                            <div className="ml-auto flex items-center">
                                {hasSubItems && (
                                    isExpanded ?
                                        <ChevronUp className="h-4 w-4 text-gray-500"/> :
                                        <ChevronDown className="h-4 w-4 text-gray-500"/>
                                )}
                                {isActive && !hasSubItems && (
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 ml-2"/>
                                )}
                            </div>
                        )}
                    </div>
                </Link>
                {hasSubItems && isExpanded && !isCollapsed && (
                    <div className="ml-6 mt-1 space-y-1">
                        {item.subItems?.map((subItem) => (
                            <Link
                                key={subItem.href}
                                href={subItem.href}
                                className={`flex items-center px-4 py-2 text-sm rounded-lg transition-all duration-200 hover:translate-x-1 ${
                                    pathname === subItem.href
                                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                                }`}
                            >
                                <subItem.icon className="h-4 w-4 mr-3"/>
                                <span>{subItem.title}</span>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <aside
            className={`bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 h-screen ${
                isCollapsed ? 'w-16' : 'w-64'
            }`}
        >
            <div className="flex flex-col h-full">
                <div className="flex items-center justify-between pt-2 px-4 border-b border-blue-300 dark:border-gray-700 pb-2">
                    <span
                        className={`flex items-center gap-2 text-lg font-bold text-gray-800 dark:text-white tracking-wide transition-all duration-300 ${
                            isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto'
                        }`}>
                        <ShieldCheck className="w-5 h-5 text-gray-900"/>
                        Admin Pro
                    </span>
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                        {isCollapsed ? (
                            <ChevronRight className="h-5 w-5 text-gray-500 dark:text-gray-400"/>
                        ) : (
                            <ChevronLeft className="h-5 w-5 text-gray-500 dark:text-gray-400"/>
                        )}
                    </button>
                </div>


                <nav className="flex-1 space-y-1 px-4 overflow-y-auto">
                    {menuItems.map(renderMenuItem)}
                </nav>
            </div>
        </aside>
    );
} 