import { Icon } from "@iconify/react";
import { Link, router } from "@inertiajs/react";
import {
    ActionIcon,
    Anchor,
    Button,
    Card,
    Checkbox,
    Group,
    Table,
    Text,
    Tooltip,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import Cookies from "js-cookie";
import { Controller, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import Auth from "~/src/layouts/Auth";
import { alertMessage, validateError } from "~/src/lib/helpers";
import tokenDecoder from "~/src/lib/jwt";
import { useRegularLoginMutation } from "~/src/store/actions/slices/auth";
import { setCurrentUser } from "~/src/store/reducers/auth";
import SecretBox from "../../components/ui/SecretBox";
import TextBox from "../../components/ui/TextBox";

const demo = [
    { name: "Super Admin", email: "hello@devsloom.ca", password: "123456" },
    { name: "Admin", email: "admin@devsloom.ca", password: "123456" },
];

type FormType = {
    user: string;
    password: string;
    remember_me: boolean;
};

const Login = () => {
    const dispatch = useDispatch();
    const [regularLogin, result] = useRegularLoginMutation();

    const {
        control,
        handleSubmit,
        formState: { errors },
        setError,
        setValue,
    } = useForm<FormType>({
        defaultValues: {
            user: "",
            password: "",
            remember_me: false,
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

            Cookies.set("_secret", res.data.token, { expires: 1 });
            const { myDecodedToken, isMyTokenExpired } = tokenDecoder(
                res.data.token,
            );
            dispatch(
                setCurrentUser({
                    token: res.data.token,
                    currentUser: myDecodedToken,
                    isTokenExpire: isMyTokenExpired,
                    isAuthenticate: true,
                }),
            );
            router.visit("/admin/dashboard", { replace: true });
        }
    };

    const errorCallbackHandler = (err: any) => {
        if (err.status === "validate_error") {
            const errors = validateError(err.data);
            Object.keys(errors).forEach((fieldName) =>
                setError(fieldName as keyof FormType, {
                    type: "manual",
                    message: errors[fieldName],
                }),
            );
        } else {
            alertMessage({ title: err.message, icon: "error", timer: 5000 });
        }
    };

    const onSubmit = async (form: FormType) => {
        await regularLogin(form)
            .unwrap()
            .then((res) => successCallbackHandler(res))
            .catch((err) => errorCallbackHandler(err));
    };

    return (
        <Card.Section inheritPadding py="xl" px={80}>
            <Text fz={32} component="h1" mb="xs">
                Welcome to Login
            </Text>
            <Text component="span" fz={14}>
                Don't have an account?{" "}
                <Anchor fw={600} component={Link} href="/register/request">
                    Register
                </Anchor>
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
                <Group justify="space-between">
                    <Controller
                        name="remember_me"
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <Checkbox
                                label="Remember Me"
                                onChange={onChange}
                                checked={value}
                                error={errors.remember_me?.message}
                            />
                        )}
                    />
                    <Anchor
                        fw={400}
                        component={Link}
                        href="/forget-password"
                        fz={12}
                    >
                        Forget password?
                    </Anchor>
                </Group>

                <Button fullWidth type="submit" loading={result.isLoading}>
                    Login
                </Button>
            </form>

            <Table>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Name</Table.Th>
                        <Table.Th>Email</Table.Th>
                        <Table.Th>Password</Table.Th>
                        <Table.Th>Action</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Thead>
                    {demo.map((item, i) => (
                        <Table.Tr key={i}>
                            <Table.Th>{item?.name}</Table.Th>
                            <Table.Th>{item?.email}</Table.Th>
                            <Table.Th>{item?.password}</Table.Th>
                            <Table.Th>
                                <Tooltip withArrow label="Copy">
                                    <ActionIcon
                                        variant="subtle"
                                        onClick={() => {
                                            setValue("user", item?.email);
                                            setValue(
                                                "password",
                                                item?.password,
                                            );
                                            setValue("remember_me", true);
                                        }}
                                    >
                                        <Icon icon="solar:copy-outline" />
                                    </ActionIcon>
                                </Tooltip>
                            </Table.Th>
                        </Table.Tr>
                    ))}
                </Table.Thead>
            </Table>
        </Card.Section>
    );
};
Login.layout = (page: any) => <Auth children={page} title="Login" />;
export default Login;
