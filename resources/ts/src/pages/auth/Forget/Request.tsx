import { router } from "@inertiajs/react";
import { Button, Card, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import Cookies from "js-cookie";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import TextBox from "../../../components/ui/TextBox";
import { THEME } from "../../../constants/theme";
import Auth from "../../../layouts/Auth";
import { useForgetRequestMutation } from "../../../store/actions/slices/auth";
import { alertMessage, validateError } from "../../../utils/helpers";

type FormType = {
    user: string;
};

const ForgetRequest = () => {
    const [create, result] = useForgetRequestMutation();
    const {
        control,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm<FormType>({
        defaultValues: {
            user: "",
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
            if (res.data.verify_required) {
                Cookies.set("forget_user", res.data.user, { expires: 1 });
                router.visit("/forget-password/verify", { replace: true });
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

    return (
        <Card.Section inheritPadding py="xl" px={80}>
            <Text fz={32} component="h1" c={THEME.textLight} mb="xs">
                Forgot Password
            </Text>
            <Text component="span" c={THEME.textDimmed} fz={14}>
                Enter the email address associated with your account
            </Text>
            <form
                className="flex flex-col gap-4 mt-6"
                onSubmit={handleSubmit(onSubmit)}
            >
                <Controller
                    name="user"
                    control={control}
                    rules={{
                        required: "Email or Phone field is required",
                    }}
                    render={({ field: { onChange, value } }) => (
                        <TextBox
                            label="Email or Phone"
                            value={value}
                            onChange={onChange}
                            error={errors.user?.message}
                        />
                    )}
                />
                <Button
                    color={THEME.primary}
                    fullWidth
                    type="submit"
                    loading={result.isLoading}
                >
                    Recover Password
                </Button>
            </form>
        </Card.Section>
    );
};
ForgetRequest.layout = (page: any) => <Auth children={page} />;
export default ForgetRequest;
