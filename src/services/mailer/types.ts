export type MailerEmailStatus = "sent" | "failed" | "skipped";

export type MailerStatus = "sent" | "partial" | "failed";

export interface MailerResponse {
    success: boolean;
    status: MailerStatus;
    message: string;
    emails: {
        owner: "sent" | "failed";
        sender: MailerEmailStatus;
    };
    attachment: string | null;
}

export interface MailerFormFields {
    subject?: string;
    name?: string;
    email?: string;
    from?: string;
    message?: string;
    file?: File | null;
    [key: string]: string | File | null | undefined;
}
