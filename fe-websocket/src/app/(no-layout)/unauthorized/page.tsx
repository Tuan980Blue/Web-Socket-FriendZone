import React from 'react';
import Unauthorized from "next/dist/client/components/unauthorized-error";

const Page = () => {
    return (
        <div>
            <Unauthorized/>
        </div>
    );
};

export default Page;