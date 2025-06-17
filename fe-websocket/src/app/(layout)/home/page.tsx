'use client';

import React from 'react';
import {useUserData} from "@/hooks/useUserData";
import PostsPage from "@/app/(layout)/posts/page";
import StorySection from '@/components/StorySection';

const Home = () => {
    
    // Get user data from the hook
    const {user} = useUserData();

    return (
        <div className="max-w-7xl mx-auto">
            {/* Story Section */}
            <StorySection user={user} />
            {/* Posts Section */}
            <div>
                <PostsPage/>
            </div>

        </div>
    );
};

export default Home;