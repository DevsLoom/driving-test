import { Icon } from "@iconify/react";
import { Link, router, usePage } from "@inertiajs/react";
import {
    Button,
    Card,
    Center,
    Checkbox,
    Fieldset,
    Flex,
    Grid,
    Loader,
    ScrollArea,
    Stack,
    Text,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import SelectBox from "../../../components/ui/SelectBox";
import TextBox from "../../../components/ui/TextBox";
import { statusOptions } from "../../../constants/selectOptions";
import { THEME } from "../../../constants/theme";
import Backend from "../../../layouts/Backend";
import {
    useCreateRoleMutation,
    useFetchPermissionsQuery,
    useFetchRoleQuery,
    useUpdateRoleMutation,
} from "../../../store/actions/slices/roles";
import { RoleFormType } from "../../../Type/role";
import { alertMessage, validateError } from "../../../utils/helpers";

const RoleForm = () => {
    const { props } = usePage();
    const { data: permissions } = useFetchPermissionsQuery("get_all=1");

    const { data, isFetching, isError, error } = useFetchRoleQuery(props.id, {
        skip: !props.id,
        refetchOnMountOrArgChange: true,
    });

    const [create, resultCreate] = useCreateRoleMutation();
    const [update, resultUpdate] = useUpdateRoleMutation();

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        setError,
        watch,
    } = useForm<RoleFormType>({
        defaultValues: {
            name: "",
            grant_permission: true,
            permissions: [],
            status: "active",
        },
    });

    const form = watch();

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
            reset();
            router.visit("/admin/system/roles", { replace: true });
        }
    };

    const errorCallbackHandler = (err: any) => {
        if (err.status === "validate_error") {
            const errors = validateError(err.data);
            Object.keys(errors).forEach((fieldName) =>
                setError(fieldName as keyof RoleFormType, {
                    type: "manual",
                    message: errors[fieldName],
                })
            );
        } else {
            alertMessage({ title: err.message, icon: "error", timer: 2000 });
        }
    };

    const onSubmit = async (form: RoleFormType) => {
        if (props.id) {
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
        if (data && Object.keys(data).length > 0) {
            Object.keys(data).forEach((key) => {
                if (data[key] !== null) {
                    setValue(key as keyof RoleFormType, data[key]);
                }
            });
        }
    }, [data]);

    if (isFetching) {
        return (
            <Card
                w={{ base: "100%", md: "50%" }}
                h="calc(100vh - 200px)"
                radius="lg"
                mx="auto"
            >
                <Center h="100%">
                    <Loader color={THEME.primary} size="xl" type="dots" />
                </Center>
            </Card>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Card w={{ base: "100%", md: "50%" }} radius="lg" mx="auto">
                <Card.Section inheritPadding withBorder py="sm">
                    <Text>{props.id ? "Update" : "Create"} User</Text>
                </Card.Section>
                <Card.Section
                    inheritPadding
                    withBorder
                    py="sm"
                    className="!grid !gird-col-1 md:!grid-cols-2 gap-2"
                >
                    <Controller
                        name="name"
                        control={control}
                        rules={{
                            required: "Name field is required",
                        }}
                        render={({ field: { onChange, value } }) => (
                            <TextBox
                                label="Name"
                                onChange={onChange}
                                value={value}
                                error={errors.name?.message}
                            />
                        )}
                    />
                    <Controller
                        name="status"
                        control={control}
                        rules={{
                            required: "Status field is required",
                        }}
                        render={({ field: { onChange, value } }) => (
                            <SelectBox
                                label="Status"
                                onChange={onChange}
                                data={statusOptions}
                                value={value}
                                error={errors.status?.message}
                            />
                        )}
                    />
                    <Controller
                        name="grant_permission"
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <Checkbox
                                label="Grant Permission"
                                description="Note: Ensure the 'Grant Permission' checkbox is unchecked or set to false as needed."
                                onChange={onChange}
                                checked={value}
                                error={errors.grant_permission?.message}
                                color={THEME.primary}
                            />
                        )}
                    />
                    <div className="col-span-full">
                        <Fieldset
                            legend="Permissions"
                            w="100%"
                            bg={THEME.cardBg}
                        >
                            {form.grant_permission ? (
                                <Text size="xs" c="dimmed" ta="center">
                                    Ensure that 'Grant Permission' is deselected
                                    or set to unchecked for customized
                                    permissions.
                                </Text>
                            ) : (
                                <ScrollArea h={500} offsetScrollbars>
                                    <Grid w="100%">
                                        {permissions?.map(
                                            (
                                                item: {
                                                    module: string;
                                                    permissions: string[];
                                                },
                                                i: number
                                            ) => (
                                                <Grid.Col
                                                    span={{
                                                        base: 12,
                                                        md: 6,
                                                    }}
                                                    key={i}
                                                >
                                                    <Card
                                                        withBorder
                                                        shadow="sm"
                                                    >
                                                        <Card.Section
                                                            inheritPadding
                                                            py="sm"
                                                            withBorder
                                                        >
                                                            <Controller
                                                                name="permissions"
                                                                control={
                                                                    control
                                                                }
                                                                render={({
                                                                    field: {
                                                                        onChange,
                                                                        value,
                                                                    },
                                                                }) => {
                                                                    const allSelected =
                                                                        item.permissions.every(
                                                                            (
                                                                                p
                                                                            ) =>
                                                                                value.includes(
                                                                                    p
                                                                                )
                                                                        );
                                                                    return (
                                                                        <Checkbox
                                                                            color={
                                                                                THEME.primary
                                                                            }
                                                                            label={
                                                                                item.module
                                                                            }
                                                                            checked={
                                                                                allSelected
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) => {
                                                                                const newPermissions =
                                                                                    e
                                                                                        .target
                                                                                        .checked
                                                                                        ? [
                                                                                              ...new Set(
                                                                                                  [
                                                                                                      ...value,
                                                                                                      ...item.permissions,
                                                                                                  ]
                                                                                              ),
                                                                                          ]
                                                                                        : value.filter(
                                                                                              (
                                                                                                  p
                                                                                              ) =>
                                                                                                  !item.permissions.includes(
                                                                                                      p
                                                                                                  )
                                                                                          );
                                                                                onChange(
                                                                                    newPermissions
                                                                                );
                                                                            }}
                                                                        />
                                                                    );
                                                                }}
                                                            />
                                                        </Card.Section>
                                                        <Card.Section
                                                            inheritPadding
                                                            py="sm"
                                                            withBorder
                                                        >
                                                            <Stack ml="lg">
                                                                {item.permissions.map(
                                                                    (
                                                                        pItem: string,
                                                                        pI: number
                                                                    ) => (
                                                                        <Controller
                                                                            name="permissions"
                                                                            control={
                                                                                control
                                                                            }
                                                                            key={
                                                                                pI
                                                                            }
                                                                            render={({
                                                                                field: {
                                                                                    onChange,
                                                                                    value,
                                                                                },
                                                                            }) => (
                                                                                <Checkbox
                                                                                    color={
                                                                                        THEME.primary
                                                                                    }
                                                                                    label={
                                                                                        pItem
                                                                                    }
                                                                                    checked={value.includes(
                                                                                        pItem
                                                                                    )}
                                                                                    onChange={(
                                                                                        e
                                                                                    ) => {
                                                                                        const newPermissions =
                                                                                            e
                                                                                                .target
                                                                                                .checked
                                                                                                ? [
                                                                                                      ...value,
                                                                                                      pItem,
                                                                                                  ]
                                                                                                : value.filter(
                                                                                                      (
                                                                                                          p
                                                                                                      ) =>
                                                                                                          p !==
                                                                                                          pItem
                                                                                                  );
                                                                                        onChange(
                                                                                            newPermissions
                                                                                        );
                                                                                    }}
                                                                                />
                                                                            )}
                                                                        />
                                                                    )
                                                                )}
                                                            </Stack>
                                                        </Card.Section>
                                                    </Card>
                                                </Grid.Col>
                                            )
                                        )}
                                    </Grid>
                                </ScrollArea>
                            )}
                        </Fieldset>
                    </div>
                </Card.Section>
                <Card.Section inheritPadding withBorder py="sm">
                    <Flex justify="end" gap="xs">
                        <Button
                            type="button"
                            variant="outline"
                            color={THEME.textDimmed}
                            leftSection={
                                <Icon
                                    icon="material-symbols:close-rounded"
                                    fontSize={20}
                                />
                            }
                            disabled={
                                resultCreate.isLoading || resultUpdate.isLoading
                            }
                            component={Link}
                            href="/admin/system/roles"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            color={THEME.primary}
                            leftSection={
                                <Icon
                                    icon="lucide:check-circle"
                                    fontSize={20}
                                />
                            }
                            loading={
                                resultCreate.isLoading || resultUpdate.isLoading
                            }
                        >
                            {props.id ? "Update" : "Save"}
                        </Button>
                    </Flex>
                </Card.Section>
            </Card>
        </form>
    );
};

RoleForm.layout = (page: any) => <Backend children={page} />;
export default RoleForm;
