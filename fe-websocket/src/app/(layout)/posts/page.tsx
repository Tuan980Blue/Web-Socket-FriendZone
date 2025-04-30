import React from 'react';
import QuickPost from "@/components/quickPost/QuickPost";
import PostList from "@/app/(layout)/posts/components/PostList";

const PostsPage = () => {
    return (
        <div className="max-w-7xl mx-auto md:px-4 px-0 mb-6">
            {/* Quick Post Section */}
            <div>
                <QuickPost isCurrentUser={true}/>
            </div>
            <div>
                <PostList/>
            </div>
        </div>
    );
};

export default PostsPage;