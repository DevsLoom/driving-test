import { router } from "@inertiajs/react";
import { Button, Card, PinInput, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import Cookies from "js-cookie";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { THEME } from "../../../constants/theme";
import Auth from "../../../layouts/Auth";
import { useForgetVerifyMutation } from "../../../store/actions/slices/auth";
import { alertMessage, validateError } from "../../../utils/helpers";

type FormType = {
    user: string;
    code: string;
};

const ForgetVerify = () => {
    const [create, result] = useForgetVerifyMutation();
    const {
        control,
        handleSubmit,
        formState: { errors },
        setError,
        setValue,
    } = useForm<FormType>({
        defaultValues: {
            user: "",
            code: "",
        },
    });

    const successCallbackHandler = (res: any) => {
        if (res.status === "success") {
            notifications.show({
                position: "top-right",
                withCloseButton: true,
                autoClose: 5000,
                title: "Success",
                message: res.message,
                color: "green",
            });
            if (res.data.password_required) {
                Cookies.set("forget_user", res.data.user, { expires: 1 });
                router.visit("/forget-password/new-password", {
                    replace: true,
                });
            }
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
                Verification
            </Text>
            <Text component="span" c={THEME.textDimmed} fz={14}>
                Enter the 6-digit code sent to your email or phone
            </Text>
            <form
                className="flex flex-col gap-4 mt-6"
                onSubmit={handleSubmit(onSubmit)}
            >
                <div>
                    <Controller
                        name="code"
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <PinInput
                                value={value}
                                onChange={onChange}
                                size="xl"
                                length={6}
                                type="number"
                            />
                        )}
                    />
                    <Text fz={14} c={THEME.danger}>
                        {errors.code?.message}
                    </Text>
                </div>

                <Button
                    color={THEME.primary}
                    fullWidth
                    type="submit"
                    loading={result.isLoading}
                >
                    Verify and Proceed
                </Button>
            </form>
        </Card.Section>
    );
};
ForgetVerify.layout = (page: any) => <Auth children={page} />;
export default ForgetVerify;
