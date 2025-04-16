'use client';

import React from 'react';
import QuickPost from "@/components/quickPost/QuickPost";

const Home = () => {
    return (
        <div className="max-w-7xl mx-auto">
            {/* Quick Post Section */}
            <QuickPost isCurrentUser={true} />
            <div>
                Các bài đăng của mọi người ở đây.....
            </div>
        </div>
    );
};

export default Home;