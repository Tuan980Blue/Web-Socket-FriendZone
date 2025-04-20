'use client';

import React, { useState } from 'react';
import Story from "@/components/story/Story";
import AddStoryModal from "@/components/story/AddStoryModal";
import PostsPage from "@/app/(layout)/posts/page";
import { useStories } from '@/hooks/useStories';

const Home = () => {
    const [isAddStoryModalOpen, setIsAddStoryModalOpen] = useState(false);
    const { addStory } = useStories();
    
    // Mock current user data (replace with real user data from your auth system)
    const currentUser = {
        id: 'current-user-id',
        username: 'Current User',
        avatar: '/default-avatar.png'
    };

    const handleAddStory = () => {
        setIsAddStoryModalOpen(true);
    };

    const handleStorySubmit = async (file: File) => {
        // Add story using the hook
        addStory(
            file, 
            currentUser.id, 
            currentUser.username, 
            currentUser.avatar
        );
    };

    return (
        <div className="max-w-7xl mx-auto">
            {/* Story Section */}
            <Story 
                currentUserId={currentUser.id}
                currentUsername={currentUser.username}
                currentUserAvatar={currentUser.avatar}
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