import React from 'react';
import AdminGuard from "@/components/AdminGuard";

const Page = () => {
    return (
        <div>
            <AdminGuard>
                <div>
                    Adminnnnnnnnnn
                </div>
            </AdminGuard>
        </div>
    );
};

export default Page;