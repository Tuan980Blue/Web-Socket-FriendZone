import React from 'react';
import QuickPost from "@/components/quickPost/QuickPost";
import PostList from "@/app/(layout)/post/components/PostList";

const Page = () => {
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

export default Page;