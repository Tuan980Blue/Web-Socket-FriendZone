'use client';

import React, { useState } from 'react';
import Story from "@/components/story/Story";
import AddStoryModal from "@/components/story/AddStoryModal";
import { useStories } from '@/hooks/useStories';
import {useUserData} from "@/hooks/useUserData";
import PostsPage from "@/app/(layout)/posts/page";

const Home = () => {
    const [isAddStoryModalOpen, setIsAddStoryModalOpen] = useState(false);
    const { addStory } = useStories();
    
    // Get user data from the hook
    const {user} = useUserData();

    const handleAddStory = () => {
        setIsAddStoryModalOpen(true);
    };

    const handleStorySubmit = async (file: File) => {
        // Only add story if user data is available
        if (user?.id && user?.username && user?.avatar) {
            addStory({
                file,
                userId: user.id,
                username: user.username,
                avatarUrl: user.avatar
            });
        }
    };

    // Default values for when user data is not available
    const userId = user?.id || 'guest';
    const username = user?.username || 'Guest User';
    const avatar = user?.avatar || '/image-person.png';

    return (
        <div className="max-w-7xl mx-auto">
            {/* Story Section */}
            <Story 
                currentUserId={userId}
                currentUsername={username}
                currentUserAvatar={avatar}
                onAddStory={handleAddStory}
            />

            {/* Posts Section */}
            <div>
                <PostsPage/>
            </div>

            {/* Add Story Modal */}
            <AddStoryModal
                isOpen={isAddStoryModalOpen}
                onClose={() => setIsAddStoryModalOpen(false)}
                onAddStory={handleStorySubmit}
            />
        </div>
    );
};

export default Home;