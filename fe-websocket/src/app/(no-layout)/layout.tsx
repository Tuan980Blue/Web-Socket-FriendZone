import {ReactNode} from 'react';
import "@/app/globals.css"
import "@mantine/core/styles.css"
import {Metadata} from "next";

export const metadata: Metadata = {
    title: 'Web Social',
}

const Layout = async ({children}: Readonly<{ children: ReactNode }>) => {
    return (
        <>
            {children}
        </>
    );
};

export default Layout;