"use client";

import React, { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Box, MantineProvider, createTheme } from "@mantine/core";
import { UserProvider } from "@/store/UserContext";
import "@mantine/dates/styles.css";

export const queryClient = new QueryClient();

const theme = createTheme({
    primaryColor: "orange",
    colors: {
        orange: [
            "#fff4e6",
            "#ffe8cc",
            "#ffd8a8",
            "#ffc078",
            "#ffa94d",
            "#ff922b", // orange[5] - primary
            "#fd7e14",
            "#f76707",
            "#e8590c",
            "#d9480f",
        ],
    },
});

const RootWrapper = ({ children }: Readonly<{ children: ReactNode }>) => {
    return (
        <QueryClientProvider client={queryClient}>
            <MantineProvider theme={theme}>
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
