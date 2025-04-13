import {ReactNode} from 'react';
import "@/app/globals.css"
import "@mantine/core/styles.css"

const Layout = async ({children}: Readonly<{ children: ReactNode }>) => {
    return (
        <>
            {children}
        </>
    );
};

export default Layout;