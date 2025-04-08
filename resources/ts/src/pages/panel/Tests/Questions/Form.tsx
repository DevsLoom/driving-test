import { Icon } from "@iconify/react/dist/iconify.js";
import { usePage } from "@inertiajs/react";
import {
    Box,
    Button,
    Card,
    Fieldset,
    Group,
    Radio,
    Stack,
    Text,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useEffect } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import SearchTags from "~/src/components/panel/SearchTags";
import EditorBox from "~/src/components/ui/EditorBox";
import SelectBox from "~/src/components/ui/SelectBox";
import { LANGUAGES } from "~/src/constants/Languages";
import Panel from "~/src/layouts/Panel";
import { alertMessage, mapSelect, validateError } from "~/src/lib/helpers";
import {
    useCreateQuestionMutation,
    useFetchQuestionQuery,
    useUpdateQuestionMutation,
} from "~/src/store/actions/slices/theory/questions";
import { QuestionFormType } from "~/src/types/theory/questions";

const QuestionForm = () => {
    const { props } = usePage();

    const [create, resCr] = useCreateQuestionMutation();
    const [update, resUp] = useUpdateQuestionMutation();

    const { data, isFetching } = useFetchQuestionQuery(`${props.question_id}`, {
        skip: !props.question_id,
        refetchOnMountOrArgChange: true,
    });

    const {
        control,
        handleSubmit,
        formState: { errors },
        setError,
        reset,
        setValue,
        watch,
    } = useForm<QuestionFormType>({
        defaultValues: {
            test_id: "",
            title: "",
            tags: [],
            options: [
                {
                    title: "",
                    is_correct: false,
                },
            ],
            explanations: [
                {
                    language: "",
                    explanation: "",
                },
            ],
            status: "active",
        },
    });

    const {
        fields: options,
        append: oAppend,
        update: oUpdate,
    } = useFieldArray({
        control,
        name: "options",
    });

    const {
        fields: explanations,
        append: eAppend,
        update: eUpdate,
    } = useFieldArray({
        control,
        name: "explanations",
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
        }
    };

    const errorCallbackHandler = (err: any) => {
        if (err.status === "validate_error") {
            const errors = validateError(err.data);
            Object.keys(errors).forEach((fieldName) =>
                setError(fieldName as keyof QuestionFormType, {
                    type: "manual",
                    message: errors[fieldName],
                }),
            );
        } else {
            alertMessage({ title: err.message, icon: "error", timer: 5000 });
        }
    };

    const onSubmit = async (form: QuestionFormType) => {
        if (data) {
            await update(form)
                .unwrap()
                .then((res) => successCallbackHandler(res))
                .catch((err) => errorCallbackHandler(err));
        } else {
            await create(form)
                .unwrap()
                .then((res) => successCallbackHandler(res))
                .catch((err) => errorCallbackHandler(err));
        }
    };

    useEffect(() => {
        if (props.id) {
            setValue("test_id", props.id?.toString());
        }
    }, [props.id]);

    useEffect(() => {
        if (data && Object.keys(data).length > 0) {
            reset();
            Object.keys(data).forEach((key) => {
                if (data[key] !== null) {
                    if (key === "options") {
                        let options = data["options"];

                        let formatOptions: any[] = [];
                        options?.forEach((item: any) => {
                            formatOptions.push({
                                id: item?.id,
                                title: item?.title,
                                is_correct:
                                    String(item?.id) ===
                                    String(
                                        data?.["question_correct_option"]?.[
                                            "option_id"
                                        ],
                                    ),
                            });
                        });
                        console.log("formatOptions", formatOptions);
                        setValue("options", formatOptions, {
                            shouldDirty: true,
                        });
                    } else {
                        setValue(
                            key as keyof QuestionFormType,
                            data[key] ?? "",
                        );
                    }
                }
            });
        }
    }, [data]);

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Card withBorder>
                <Card.Section inheritPadding py="sm" withBorder>
                    <Text>Add Question</Text>
                </Card.Section>
                <Card.Section inheritPadding py="sm" withBorder>
                    <Stack gap="md">
                        <Controller
                            name="title"
                            control={control}
                            rules={{
                                required: "The title is required.",
                            }}
                            render={({ field: { onChange, value } }) => (
                                <EditorBox
                                    label="Title"
                                    onChange={onChange}
                                    value={value}
                                    error={errors?.title?.message}
                                    withAsterisk
                                    height="100px"
                                />
                            )}
                        />

                        <Fieldset legend="Options" variant="filled">
                            <Controller
                                name="options"
                                control={control}
                                render={({ field: { onChange } }) => (
                                    <Stack>
                                        {watch("options").map((oItem, oI) => (
                                            <Box pos="relative" key={oI}>
                                                <Radio
                                                    name="correctOption"
                                                    variant="outline"
                                                    pos="absolute"
                                                    top={36}
                                                    right={10}
                                                    className="!z-50"
                                                    checked={oItem.is_correct} // Ensures the radio is checked if `is_correct` is true
                                                    onChange={() => {
                                                        // Update the is_correct state based on the selected radio button
                                                        const updatedOptions =
                                                            options.map(
                                                                (opt, idx) => ({
                                                                    ...opt,
                                                                    is_correct:
                                                                        idx ===
                                                                        oI, // Set only the selected option to true
                                                                }),
                                                            );
                                                        oUpdate(
                                                            oI,
                                                            updatedOptions[oI],
                                                        );
                                                        setValue(
                                                            "options",
                                                            updatedOptions,
                                                            {
                                                                shouldDirty:
                                                                    true,
                                                            },
                                                        );
                                                    }}
                                                />
                                                <EditorBox
                                                    label={`Option # ${oI + 1}`}
                                                    onChange={(newValue) => {
                                                        oUpdate(oI, {
                                                            ...options[oI],
                                                            title: newValue,
                                                        });
                                                    }}
                                                    value={oItem.title}
                                                    height="100px"
                                                />
                                            </Box>
                                        ))}
                                    </Stack>
                                )}
                            />

                            <Box ta="end" mt="lg">
                                <Button
                                    variant="outline"
                                    size="xs"
                                    leftSection={
                                        <Icon
                                            icon="material-symbols:add-rounded"
                                            fontSize={20}
                                        />
                                    }
                                    onClick={() =>
                                        oAppend({
                                            title: "",
                                            is_correct: false,
                                        })
                                    }
                                    type="button"
                                >
                                    Add Option
                                </Button>
                            </Box>
                        </Fieldset>

                        <Fieldset legend="Explanations" variant="filled">
                            <Stack>
                                {watch("explanations").map((eItem, eI) => (
                                    <Fieldset key={eI}>
                                        <Stack>
                                            <Controller
                                                name={`explanations.${eI}.language`}
                                                control={control}
                                                render={({
                                                    field: { onChange, value },
                                                }) => (
                                                    <SelectBox
                                                        data={mapSelect(
                                                            LANGUAGES,
                                                            "name",
                                                            "code",
                                                        )}
                                                        label="Language"
                                                        w={300}
                                                        onChange={onChange}
                                                        value={value}
                                                        error={
                                                            errors
                                                                ?.explanations?.[
                                                                eI
                                                            ]?.language?.message
                                                        }
                                                    />
                                                )}
                                            />

                                            <Controller
                                                name={`explanations.${eI}.explanation`}
                                                control={control}
                                                rules={{
                                                    required:
                                                        "Explanation is required.",
                                                }}
                                                render={({
                                                    field: { onChange, value },
                                                }) => (
                                                    <EditorBox
                                                        label={`Explanation # ${eI + 1}`}
                                                        onChange={onChange}
                                                        value={value}
                                                        error={
                                                            errors
                                                                ?.explanations?.[
                                                                eI
                                                            ]?.explanation
                                                                ?.message
                                                        }
                                                        withAsterisk
                                                        height="100px"
                                                    />
                                                )}
                                            />
                                        </Stack>
                                    </Fieldset>
                                ))}
                            </Stack>

                            <Box ta="end" mt="lg">
                                <Button
                                    variant="outline"
                                    size="xs"
                                    leftSection={
                                        <Icon
                                            icon="material-symbols:add-rounded"
                                            fontSize={20}
                                        />
                                    }
                                    onClick={() =>
                                        eAppend({
                                            language: "",
                                            explanation: "",
                                        })
                                    }
                                    type="button"
                                >
                                    Add Explanation
                                </Button>
                            </Box>
                        </Fieldset>

                        <Controller
                            name="tags"
                            control={control}
                            render={({ field: { onChange, value } }) => (
                                <SearchTags
                                    value={value}
                                    onChange={onChange}
                                    error={errors.tags?.message}
                                />
                            )}
                        />
                    </Stack>
                </Card.Section>
                <Card.Section inheritPadding py="sm" withBorder>
                    <Group justify="end">
                        <Button
                            variant="outline"
                            color="gray"
                            leftSection={
                                <Icon
                                    icon="hugeicons:cancel-01"
                                    fontSize={18}
                                />
                            }
                            // disabled={resCr.isLoading || resUp.isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            leftSection={
                                <Icon
                                    icon="lucide:check-circle"
                                    fontSize={18}
                                />
                            }
                            type="submit"
                            // loading={resCr.isLoading || resUp.isLoading}
                        >
                            {/* {payload ? "Update" : "Save"} */}
                            Save
                        </Button>
                    </Group>
                </Card.Section>
            </Card>
        </form>
    );
};
QuestionForm.layout = (page: any) => <Panel children={page} title="Test" />;

export default QuestionForm;
