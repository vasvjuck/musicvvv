"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

const ReactQueryProvider = ({ children }: { children: React.ReactNode }) => {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: { retry: 2 },
            mutations: { retry: 1 },
        }
    }));

    return (
        <QueryClientProvider client={queryClient} >
            {children}
        </QueryClientProvider>
    );
};

export default ReactQueryProvider;
