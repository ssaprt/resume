import { configureStore } from "@reduxjs/toolkit";
import { MailerApi } from "../../services/mailer";

export const store = configureStore({
    reducer: {
        [MailerApi.reducerPath]: MailerApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(MailerApi.middleware),
});
