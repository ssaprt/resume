import { api } from "../api";

export interface MailerResponse {
    success: boolean;
    status: "sent" | "partial" | "failed";
    message: string;
    emails: {
        owner: "sent" | "failed";
        sender: "sent" | "failed" | "skipped";
    };
    attachment: string | null;
}

export const MailerApi = api.injectEndpoints({
    endpoints: (builder) => ({
        sendMail: builder.mutation<MailerResponse, FormData>({
            query: (body) => ({
                url: "/mailer",
                method: "POST",
                body,
            }),
        }),
    }),
});

export const { useSendMailMutation } = MailerApi;
