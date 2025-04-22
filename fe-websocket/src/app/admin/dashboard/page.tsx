'use client';

import { useState, useEffect } from 'react';
import {
    Users,
    FileText,
    Flag,
    HardDrive,
    Clock as ClockIcon,
    TrendingUp,
    TrendingDown,
    LucideIcon
} from 'lucide-react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import { Loader } from '@mantine/core';

interface Stats {
    totalUsers: number;
    totalPosts: number;
    totalReports: number;
    totalStorage: number;
    onlineUsers: number;
    userGrowth: number;
    postGrowth: number;
}

interface ChartData {
    date: string;
    users: number;
    posts: number;
}

// Initial state
const initialStats: Stats = {
    totalUsers: 0,
    totalPosts: 0,
    totalReports: 0,
    totalStorage: 0,
    onlineUsers: 0,
    userGrowth: 0,
    postGrowth: 0
};

const initialChartData: ChartData[] = [];

// Mock data - Replace with actual API calls
const mockStats = {
    totalUsers: 12312,
    totalPosts: 23941,
    totalReports: 31,
    totalStorage: 4.2,
    onlineUsers: 156,
    userGrowth: 12.5,
    postGrowth: -2.3
};

const mockChartData = [
    { date: '2024-01', users: 10000, posts: 20000 },
    { date: '2024-02', users: 11000, posts: 21000 },
    { date: '2024-03', users: 12000, posts: 22000 },
    { date: '2024-04', users: 12312, posts: 23941 },
];

const StatCard = ({ title, value, icon: Icon, trend, trendValue }: {
    title: string;
    value: string | number;
    icon: LucideIcon;
    trend?: 'up' | 'down';
    trendValue?: number;
}) => (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
                <p className="text-2xl font-semibold mt-1">{value}</p>
                {trend && trendValue && (
                    <div className={`flex items-center mt-2 text-sm ${
                        trend === 'up' ? 'text-green-500' : 'text-red-500'
                    }`}>
                        {trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                        <span className="ml-1">{Math.abs(trendValue)}%</span>
                    </div>
                )}
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900 rounded-full">
                <Icon className="w-6 h-6 text-blue-500" />
            </div>
        </div>
    </div>
);

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats>(initialStats);
    const [chartData, setChartData] = useState<ChartData[]>(initialChartData);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Use mock data directly
        setStats(mockStats);
        setChartData(mockChartData);
        setIsLoading(false);
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
                <Loader size="xl" variant="dots" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Dashboard</h1>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                    Last updated: {new Date().toLocaleString()}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Users"
                    value={stats.totalUsers.toLocaleString()}
                    icon={Users}
                    trend="up"
                    trendValue={stats.userGrowth}
                />
                <StatCard
                    title="Total Posts"
                    value={stats.totalPosts.toLocaleString()}
                    icon={FileText}
                    trend="down"
                    trendValue={stats.postGrowth}
                />
                <StatCard
                    title="Reports Today"
                    value={stats.totalReports}
                    icon={Flag}
                />
                <StatCard
                    title="Storage Used"
                    value={`${stats.totalStorage.toFixed(1)}GB`}
                    icon={HardDrive}
                />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Growth Chart */}
                <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                    <h2 className="text-lg font-semibold mb-4">Growth Overview</h2>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="users"
                                    stroke="#3B82F6"
                                    name="Users"
                                />
                                <Line
                                    type="monotone"
                                    dataKey="posts"
                                    stroke="#10B981"
                                    name="Posts"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Online Users */}
                <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                    <h2 className="text-lg font-semibold mb-4">Online Users</h2>
                    <div className="flex items-center justify-center h-80">
                        <div className="text-center">
                            <ClockIcon className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                            <p className="text-4xl font-bold">{stats.onlineUsers}</p>
                            <p className="text-gray-600 dark:text-gray-400 mt-2">Users currently online</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}