"use client";

import React, { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Box, MantineProvider, createTheme } from "@mantine/core";
import { UserProvider } from "@/store/UserContext";
import "@mantine/dates/styles.css";
import "@mantine/core/styles.css";

export const queryClient = new QueryClient();

const theme = createTheme({
    primaryColor: "instagram",
    colors: {
        instagram: [
            '#F58529', // 0 - Orange
            '#DD2A7B', // 1 - Pink
            '#8134AF', // 2 - Purple
            '#515BD4', // 3 - Blue
            '#3897F0', // 4 - Light Blue (Follow/CTA)
            '#ED4956', // 5 - Red (Notification/Like)
            '#20C997', // 6 - Teal (Success)
            '#8E8E8E', // 7 - Gray (Secondary Text)
            '#262626', // 8 - Dark Gray (Primary Text)
            '#FAFAFA', // 9 - Light Gray (Background)
        ],
    },
    primaryShade: 3,
    fontFamily: 'var(--font-geist-sans)',
    components: {
        Button: {
            defaultProps: {
                radius: 'md',
            },
        },
        Card: {
            defaultProps: {
                radius: 'md',
            },
        },
    },
});

const RootWrapper = ({ children }: Readonly<{ children: ReactNode }>) => {
    return (
        <QueryClientProvider client={queryClient}>
            <MantineProvider 
                theme={theme}
                defaultColorScheme="light"
            >
                <UserProvider>
                    <Box className="relative">
                        {children}
                    </Box>
                </UserProvider>
            </MantineProvider>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
};

export default RootWrapper;
