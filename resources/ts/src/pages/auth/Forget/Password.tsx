import { router } from "@inertiajs/react";
import { Button, Card, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import Cookies from "js-cookie";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import SecretBox from "../../../components/ui/SecretBox";
import { THEME } from "../../../constants/theme";
import Auth from "../../../layouts/Auth";
import { useForgetPasswordMutation } from "../../../store/actions/slices/auth";
import { alertMessage, validateError } from "../../../utils/helpers";

type FormType = {
    user: string;
    password: string;
    password_confirmation: string;
};

const ForgetPassword = () => {
    const [create, result] = useForgetPasswordMutation();
    const {
        control,
        handleSubmit,
        formState: { errors },
        setError,
        setValue,
        reset,
    } = useForm<FormType>({
        defaultValues: {
            user: "",
            password: "",
            password_confirmation: "",
        },
    });

    const successCallbackHandler = (res: any) => {
        if (res.status === "success") {
            reset();
            notifications.show({
                position: "top-right",
                withCloseButton: true,
                autoClose: 5000,
                title: "Success",
                message: res.message,
                color: "green",
            });
            Cookies.remove("forget_user");
            router.visit("/login", { replace: true });
        }
    };

    const errorCallbackHandler = (err: any) => {
        if (err.status === "validate_error") {
            const errors = validateError(err.data);
            Object.keys(errors).forEach((fieldName) =>
                setError(fieldName as keyof FormType, {
                    type: "manual",
                    message: errors[fieldName],
                })
            );
        } else {
            alertMessage({ title: err.message, icon: "error", timer: 2000 });
        }
    };

    const onSubmit = async (form: FormType) => {
        await create(form)
            .unwrap()
            .then((res) => successCallbackHandler(res))
            .catch((err) => errorCallbackHandler(err));
    };

    useEffect(() => {
        const user = Cookies.get("forget_user") || null;
        if (user) {
            setValue("user", user);
        }
    }, [setValue]);

    return (
        <Card.Section inheritPadding py="xl" px={80}>
            <Text fz={32} component="h1" c={THEME.textLight} mb="xs">
                Reset Password
            </Text>
            <Text component="span" c={THEME.textDimmed} fz={14}>
                Your password must be different from previously used password
            </Text>
            <form
                className="flex flex-col gap-4 mt-6"
                onSubmit={handleSubmit(onSubmit)}
            >
                <Controller
                    name="password"
                    control={control}
                    rules={{
                        required: "Password field is required",
                        minLength: {
                            value: 6,
                            message:
                                "Password field should be minimum 6 characters",
                        },
                    }}
                    render={({ field: { onChange, value } }) => (
                        <SecretBox
                            label="Password"
                            onChange={onChange}
                            value={value}
                            error={errors.password?.message}
                        />
                    )}
                />
                <Controller
                    name="password_confirmation"
                    control={control}
                    rules={{
                        required: "Confirm password  field is required",
                        minLength: {
                            value: 6,
                            message:
                                "Confirm password field should be minimum 6 characters",
                        },
                    }}
                    render={({ field: { onChange, value } }) => (
                        <SecretBox
                            label="Confirm Password"
                            onChange={onChange}
                            value={value}
                            error={errors.password_confirmation?.message}
                        />
                    )}
                />
                <Button
                    color={THEME.primary}
                    fullWidth
                    type="submit"
                    loading={result.isLoading}
                >
                    Continue
                </Button>
            </form>
        </Card.Section>
    );
};
ForgetPassword.layout = (page: any) => <Auth children={page} />;
export default ForgetPassword;
