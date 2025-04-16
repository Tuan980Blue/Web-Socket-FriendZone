import React from 'react';
import QuickPost from "@/components/quickPost/QuickPost";

const Page = () => {
    return (
        <div className="max-w-7xl mx-auto">
            {/* Quick Post Section */}
            <QuickPost isCurrentUser={true}/>
            <div>
                Các bài đăng trước đây của bạn
            </div>
        </div>
    );
};

export default Page;