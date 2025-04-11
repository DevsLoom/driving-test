import { Icon } from "@iconify/react/dist/iconify.js";
import { Button, Group } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { FC, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import AppLoader from "~/src/components/ui/AppLoader";
import FileUploader from "~/src/components/ui/FileUploader";
import SecretBox from "~/src/components/ui/SecretBox";
import SelectBox from "~/src/components/ui/SelectBox";
import TextBox from "~/src/components/ui/TextBox";
import { alertMessage, mapSelect, validateError } from "~/src/lib/helpers";
import { useFetchRolesQuery } from "~/src/store/actions/slices/roles";
import {
    useCreateUserMutation,
    useUpdateUserMutation,
} from "~/src/store/actions/slices/users";
import { UserFormType, UserType } from "~/src/types/users";

const StuffForm: FC<{
    close: () => void;
    payload: any;
    loading: boolean;
    setItems: any;
}> = ({ close, payload, loading = false, setItems }) => {
    const [create, resCr] = useCreateUserMutation();
    const [update, resUp] = useUpdateUserMutation();
    const { data: roles } = useFetchRolesQuery("get_all=1");

    const {
        control,
        handleSubmit,
        formState: { errors },
        setError,
        reset,
        setValue,
    } = useForm<UserFormType>({
        defaultValues: {
            type: "system",
            role_id: "",
            first_name: "",
            last_name: "",
            email: "",
            phone: "",
            avatar: "",
            status: "active",
        },
    });

    const successCallbackHandler = (res: any, isUpdate = false) => {
        if (res.status === "success") {
            notifications.show({
                position: "top-right",
                withCloseButton: true,
                autoClose: 5000,
                title: "Success",
                message: res.message,
                color: "green",
            });
            reset();
            close();
            setItems((prevItems: UserType[]) =>
                isUpdate
                    ? prevItems.map((item) =>
                          item.id === res.data.id ? res.data : item,
                      )
                    : [res.data, ...prevItems],
            );
        }
    };

    const errorCallbackHandler = (err: any) => {
        if (err.status === "validate_error") {
            const errors = validateError(err.data);
            Object.keys(errors).forEach((fieldName) =>
                setError(fieldName as keyof UserFormType, {
                    type: "manual",
                    message: errors[fieldName],
                }),
            );
        } else {
            alertMessage({ title: err.message, icon: "error", timer: 5000 });
        }
    };

    const onSubmit = async (form: UserFormType) => {
        if (payload) {
            await update(form)
                .unwrap()
                .then((res) => successCallbackHandler(res, true))
                .catch((err) => errorCallbackHandler(err));
        } else {
            await create(form)
                .unwrap()
                .then((res) => successCallbackHandler(res, false))
                .catch((err) => errorCallbackHandler(err));
        }
    };

    useEffect(() => {
        if (payload && Object.keys(payload).length > 0) {
            reset();
            Object.keys(payload).forEach((key) => {
                if (payload[key] !== null) {
                    if (key === "role_id") {
                        setValue("role_id", payload["role_id"]?.toString());
                    } else {
                        setValue(key as keyof UserFormType, payload[key] ?? "");
                    }
                }
            });
        }
    }, [payload]);

    if (loading) {
        return <AppLoader h="50vh" />;
    }

    return (
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
            <Controller
                name="role_id"
                control={control}
                render={({ field: { onChange, value } }) => (
                    <SelectBox
                        data={mapSelect(roles, "name", "id")}
                        onChange={onChange}
                        value={value}
                        label="Select Role"
                        withAsterisk
                        error={errors.role_id?.message}
                    />
                )}
            />
            <Controller
                name="first_name"
                control={control}
                rules={{
                    required: "The first name field is required.",
                }}
                render={({ field: { onChange, value } }) => (
                    <TextBox
                        label="First Name"
                        value={value}
                        onChange={onChange}
                        error={errors.first_name?.message}
                        withAsterisk
                    />
                )}
            />
            <Controller
                name="last_name"
                control={control}
                render={({ field: { onChange, value } }) => (
                    <TextBox
                        label="Last Name"
                        value={value}
                        onChange={onChange}
                        error={errors.last_name?.message}
                    />
                )}
            />
            <Controller
                name="email"
                control={control}
                rules={{
                    required: "The email field is required.",
                }}
                render={({ field: { onChange, value } }) => (
                    <TextBox
                        label="Email"
                        value={value}
                        onChange={onChange}
                        error={errors.last_name?.message}
                    />
                )}
            />

            <Controller
                name="phone"
                control={control}
                render={({ field: { onChange, value } }) => (
                    <TextBox
                        label="Phone"
                        value={value}
                        onChange={onChange}
                        error={errors.phone?.message}
                    />
                )}
            />

            {!payload ? (
                <Controller
                    name="password"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                        <SecretBox
                            label="Password"
                            value={value}
                            onChange={onChange}
                            error={errors.password?.message}
                        />
                    )}
                />
            ) : (
                ""
            )}

            <Controller
                name="avatar"
                control={control}
                render={({ field: { onChange, value } }) => (
                    <FileUploader
                        label="Avatar"
                        attachments={value}
                        changeHandler={onChange}
                        onRemove={() => setValue("avatar", "")}
                    />
                )}
            />

            <Group mt="xs" justify="end">
                <Button
                    variant="outline"
                    color="gray"
                    leftSection={
                        <Icon icon="hugeicons:cancel-01" fontSize={18} />
                    }
                    onClick={() => {
                        reset();
                        close();
                    }}
                    disabled={resCr.isLoading || resUp.isLoading}
                >
                    Cancel
                </Button>
                <Button
                    leftSection={
                        <Icon icon="lucide:check-circle" fontSize={18} />
                    }
                    type="submit"
                    loading={resCr.isLoading || resUp.isLoading}
                >
                    {payload ? "Update" : "Save"}
                </Button>
            </Group>
        </form>
    );
};

export default StuffForm;
