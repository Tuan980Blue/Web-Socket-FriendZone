'use client'

import { useState } from 'react';
import {
  Search,
  MoreVertical,
  Eye,
  Check,
  X,
  AlertTriangle,
  MessageSquare,
  Flag,
  User
} from 'lucide-react';

// Mock data - Replace with actual API calls
const mockReports = [
  {
    id: 1,
    reporter: {
      id: 1,
      username: 'john_doe',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
    },
    reported: {
      id: 2,
      username: 'jane_smith',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
    },
    type: 'inappropriate_content' as const,
    content: 'This post contains inappropriate images',
    createdAt: '2024-03-15',
    status: 'pending' as const,
  },
  {
    id: 2,
    reporter: {
      id: 3,
      username: 'bob_wilson',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3',
    },
    reported: {
      id: 4,
      username: 'alice_brown',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=4',
    },
    type: 'harassment' as const,
    content: 'User is sending threatening messages',
    createdAt: '2024-03-14',
    status: 'resolved' as const,
  },
  // Add more mock reports as needed
];

type Report = {
  id: number;
  reporter: {
    id: number;
    username: string;
    avatar: string;
  };
  reported: {
    id: number;
    username: string;
    avatar: string;
  };
  type: 'inappropriate_content' | 'harassment' | 'spam' | 'other';
  content: string;
  createdAt: string;
  status: 'pending' | 'resolved' | 'rejected';
};

const reportTypeIcons = {
  inappropriate_content: AlertTriangle,
  harassment: User,
  spam: MessageSquare,
  other: Flag,
};

const reportTypeLabels = {
  inappropriate_content: 'Inappropriate Content',
  harassment: 'Harassment',
  spam: 'Spam',
  other: 'Other',
};

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>(mockReports);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'resolved' | 'rejected'>('all');

  const filteredReports = reports.filter(report => {
    const matchesSearch = 
      report.reporter.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reported.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || report.status === filter;
    return matchesSearch && matchesFilter;
  });

  const handleResolveReport = (reportId: number) => {
    setReports(reports.map(report =>
      report.id === reportId
        ? { ...report, status: 'resolved' as const }
        : report
    ));
  };

  const handleRejectReport = (reportId: number) => {
    setReports(reports.map(report =>
      report.id === reportId
        ? { ...report, status: 'rejected' as const }
        : report
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Reports</h1>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search reports..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={filter}
          onChange={(e) => setFilter(e.target.value as 'all' | 'pending' | 'resolved' | 'rejected')}
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="resolved">Resolved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Reports Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Reporter
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Reported
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Content
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredReports.map((report) => {
              const TypeIcon = reportTypeIcons[report.type];
              return (
                <tr key={report.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        className="rounded-full w-8 h-8"
                        src={report.reporter.avatar}
                        alt={report.reporter.username}
                      />
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {report.reporter.username}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        className="rounded-full w-8 h-8"
                        src={report.reported.avatar}
                        alt={report.reported.username}
                      />
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {report.reported.username}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <TypeIcon className="h-5 w-5 text-gray-400" />
                      <span className="ml-2 text-sm text-gray-900 dark:text-white">
                        {reportTypeLabels[report.type]}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-white line-clamp-2">
                      {report.content}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(report.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      report.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        : report.status === 'resolved'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setSelectedReport(report)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        <Eye size={20} />
                      </button>
                      {report.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleResolveReport(report.id)}
                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                          >
                            <Check size={20} />
                          </button>
                          <button
                            onClick={() => handleRejectReport(report.id)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <X size={20} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Report Details Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Report Details
              </h2>
              <button
                onClick={() => setSelectedReport(null)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <MoreVertical size={20} />
              </button>
            </div>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <img
                    className="rounded-full w-8 h-8"
                    src={selectedReport.reporter.avatar}
                    alt={selectedReport.reporter.username}
                  />
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      Reported by
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {selectedReport.reporter.username}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <img
                    className="rounded-full w-8 h-8"
                    src={selectedReport.reported.avatar}
                    alt={selectedReport.reported.username}
                  />
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      Reported User
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {selectedReport.reported.username}
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Report Type
                </h3>
                <div className="flex items-center">
                  {(() => {
                    const TypeIcon = reportTypeIcons[selectedReport.type];
                    return (
                      <>
                        <TypeIcon className="h-5 w-5 text-gray-400" />
                        <span className="ml-2 text-sm text-gray-900 dark:text-white">
                          {reportTypeLabels[selectedReport.type]}
                        </span>
                      </>
                    );
                  })()}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Report Content
                </h3>
                <p className="text-sm text-gray-900 dark:text-white">
                  {selectedReport.content}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    Reported on
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(selectedReport.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    Status
                  </h3>
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    selectedReport.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      : selectedReport.status === 'resolved'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {selectedReport.status}
                  </span>
                </div>
              </div>
              {selectedReport.status === 'pending' && (
                <div className="flex justify-end gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => handleRejectReport(selectedReport.id)}
                    className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                  >
                    Reject Report
                  </button>
                  <button
                    onClick={() => handleResolveReport(selectedReport.id)}
                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
                  >
                    Resolve Report
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 