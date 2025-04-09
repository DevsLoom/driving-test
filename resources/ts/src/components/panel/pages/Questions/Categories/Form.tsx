import { Icon } from "@iconify/react/dist/iconify.js";
import { Button, Group } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { FC, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import AppLoader from "~/src/components/ui/AppLoader";
import FileUploader from "~/src/components/ui/FileUploader";
import TextBox from "~/src/components/ui/TextBox";
import { alertMessage, validateError } from "~/src/lib/helpers";
import {
    useCreateQuestionCategoryMutation,
    useUpdateQuestionCategoryMutation,
} from "~/src/store/actions/slices/questions/categories";
import { QuestionCategoryFormType, QuestionCategoryType } from "~/src/types/questions/categories";
import { TestFormType, TestType } from "~/src/types/theory/tests";

const QuestionCategoryForm: FC<{
    close: () => void;
    payload: any;
    loading: boolean;
    setItems: any;
}> = ({ close, payload, loading = false, setItems }) => {
    const [create, resCr] = useCreateQuestionCategoryMutation();
    const [update, resUp] = useUpdateQuestionCategoryMutation();

    const {
        control,
        handleSubmit,
        formState: { errors },
        setError,
        reset,
        setValue,
    } = useForm<QuestionCategoryFormType>({
        defaultValues: {
            name: "",
            image: "",
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

            setItems((prevItems: QuestionCategoryType[]) =>
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
                setError(fieldName as keyof QuestionCategoryFormType, {
                    type: "manual",
                    message: errors[fieldName],
                }),
            );
        } else {
            alertMessage({ title: err.message, icon: "error", timer: 5000 });
        }
    };

    const onSubmit = async (form: QuestionCategoryFormType) => {
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
                    setValue(key as keyof QuestionCategoryFormType, payload[key] ?? "");
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
                name="name"
                control={control}
                rules={{
                    required: "The name field is required.",
                }}
                render={({ field: { onChange, value } }) => (
                    <TextBox
                        label="Name"
                        value={value}
                        onChange={onChange}
                        error={errors.name?.message}
                        withAsterisk
                    />
                )}
            />

            <Controller
                name="image"
                control={control}
                render={({ field: { onChange, value } }) => (
                    <FileUploader
                        label="Image"
                        attachments={value}
                        changeHandler={onChange}
                        onRemove={() => setValue("image", "")}
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

export default QuestionCategoryForm;
