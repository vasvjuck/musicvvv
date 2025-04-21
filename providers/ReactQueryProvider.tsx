"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

const ReactQueryProvider = ({ children }: { children: React.ReactNode }) => {
    const [qc] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 1000 * 60 * 5,   // 5m
                retry: 2,
            },
            mutations: {
                retry: 1,
            },
        }
    }));
    return (
        <QueryClientProvider client={qc} >
            {children}
        </QueryClientProvider>
    );
};

export default ReactQueryProvider;
