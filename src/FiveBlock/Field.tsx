import { Controller, useFormContext } from "react-hook-form";
import { TextAreaWithScrollBar } from "../components/textarea/TextAreaWithScrollBar";

type FormProps = {
    name: string;
    email: string;
    message: string;
    agree: boolean;
};

type FieldProps = {
    text: string;
    placeholder?: string;
    required?: boolean;
} & (
    | {
          type: "textarea";
          field: "message";
      }
    | {
          type: "email";
          field: "email";
      }
    | {
          type?: "text";
          field: "name";
      }
);

export const Field = (props: FieldProps) => {
    const {
        control,
        register,
        formState: { errors },
    } = useFormContext<FormProps>();

    const id = `field-${props.field}`;

    const label = (
        <label
            htmlFor={id}
            className="text-crm/90 text-[10px]! uppercase tracking-[0.2px] shrink-0"
        >
            {props.text}
            {props.required && (
                <span className="ml-1 text-nestjs" aria-hidden="true">
                    *
                </span>
            )}
        </label>
    );

    if (props.type === "textarea") {
        return (
            <div
                data-cursor="write"
                data-color="curr"
                data-shadow="0 0 50px 20px"
                className="col-start-1 w-full"
            >
                <div className="row-center-1">
                    {label}
                    {errors.message?.message && (
                        <p
                            className="w-full text-[12px]! text-nestjs pt-[4px]"
                            role="alert"
                        >
                            {String(errors.message.message)}
                        </p>
                    )}
                </div>

                <Controller
                    control={control}
                    name="message"
                    rules={{
                        required: props.required
                            ? "This field is required"
                            : false,
                    }}
                    render={({ field, fieldState }) => (
                        <TextAreaWithScrollBar
                            name={field.name}
                            textareaId={id}
                            textareaRef={field.ref}
                            onTextareaBlur={field.onBlur}
                            placeholder={props.placeholder}
                            children={field.value ?? ""}
                            backValue={field.onChange}
                            required={props.required}
                            invalid={fieldState.invalid}
                            textareaClassName="h-[72px]! pb-0! leading-5"
                            className={`w-full! ${
                                fieldState.invalid ? "border-nestjs/50!" : ""
                            }`}
                        />
                    )}
                />
            </div>
        );
    }

    const error = errors[props.field];

    return (
        <div
            data-cursor="write"
            data-color="curr"
            data-shadow="0 0 50px 20px"
            className="col-start-1 w-full"
        >
            {label}

            <input
                className={`
                    bg-transparent
                    border-b-1
                    pb-2
                    pt-3
                    border-crm/50
                    text-curr
                    text-1xl!
                    font-jetbrains-mono
                    w-full
                    placeholder:text-crm/50
                    outline-none
                    transition
                    focus:border-curr
                    focus:ring-0
                    focus:ring-curr
                    disabled:cursor-not-allowed
                    disabled:bg-transparent
                    aria-invalid:border-nestjs
                    autofill:bg-transparent
                    autofill:text-crm
                    [&:-webkit-autofill]:[-webkit-text-fill-color:var(--curr)]
                    [&:-webkit-autofill]:[transition-delay:9999s]
                    [&:-webkit-autofill]:[box-shadow:0_0_0_1000px_var(--background)_inset]
                    ${error ? "border-nestjs" : ""}
                `}
                type={props.type ?? "text"}
                id={id}
                placeholder={props.placeholder}
                required={props.required}
                aria-required={props.required}
                aria-invalid={!!error}
                {...register(props.field, {
                    required: props.required ? "This field is required" : false,
                    ...(props.type === "email" && {
                        pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: "Enter a valid email address",
                        },
                    }),
                })}
            />

            {error?.message && (
                <p className="w-full text-sm text-nestjs" role="alert">
                    {String(error.message)}
                </p>
            )}
        </div>
    );
};
