'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@mantine/core';

const UnauthorizedPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-bold text-red-600 mb-4">401</h1>
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Unauthorized Access</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          You don&apos;t have permission to access this page. Please log in with the appropriate credentials.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/login" passHref>
            <Button color="blue" size="md">
              Go to Login
            </Button>
          </Link>
          <Link href="/" passHref>
            <Button variant="outline" color="gray" size="md">
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;