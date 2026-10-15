import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { apiUrl } from "../lib/api/config/api";

export const api = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        baseUrl: apiUrl,
    }),
    tagTypes: ["NpmPackages", "Versions", "AIAgent"],
    endpoints: () => ({}),
});
