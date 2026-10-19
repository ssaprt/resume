import { Social } from "./Social";

export const Socials = () => {
    return (
        <div className="col-end-2 w-full">
            <div className="h-[1px] w-full border-b-1 border-b-curr/30" />

            <Social
                iconName="github"
                link="https://github.com/ssaprt"
                title="Github"
                userName="ssaprt"
            />
            <div className="h-[1px] w-full border-b-1 border-b-curr/30" />

            <Social
                iconName="telegram"
                link="https://t.me/itauction"
                title="Telegram"
                userName="itauction"
            />
            <div className="h-[1px] w-full border-b-1 border-b-curr/30" />

            <Social
                iconName="whatsapp"
                link="https://wa.me/itauction"
                title="Whatsapp"
                userName="itauction"
            />
            <div className="h-[1px] w-full border-b-1 border-b-curr/30" />

            <Social
                iconName="linkedin"
                link="https://www.linkedin.com/in/denis-ukhan-86b633422"
                title="Linkedin"
                userName="denis-ukhan-86b633422"
            />
            <div className="h-[1px] w-full border-b-1 border-b-curr/30" />

            <Social
                iconName="mail"
                link="mailto:fasingtondenzel@gmail.com"
                title="Email"
                userName="fasingtondenzel@gmail.com"
            />
            <div className="h-[1px] w-full border-b-1 border-b-curr/30" />
        </div>
    );
};
