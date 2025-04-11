import { Icon } from "@iconify/react";
import { Link, router, usePage } from "@inertiajs/react";
import {
    Button,
    Card,
    Checkbox,
    Fieldset,
    Flex,
    Grid,
    ScrollArea,
    Stack,
    Text,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import AppLoader from "~/src/components/ui/AppLoader";
import Panel from "~/src/layouts/Panel";
import { alertMessage, validateError } from "~/src/lib/helpers";
import {
    useCreateRoleMutation,
    useFetchPermissionsQuery,
    useFetchRoleQuery,
    useUpdateRoleMutation,
} from "~/src/store/actions/slices/roles";
import { RoleFormType } from "~/src/types/roles";
import TextBox from "../../../components/ui/TextBox";

const RoleForm = () => {
    const { props } = usePage();
    const { data: permissions } = useFetchPermissionsQuery("get_all=1");

    const { data, isFetching } = useFetchRoleQuery(props.id, {
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
            router.visit("/admin/roles", { replace: true });
        }
    };

    const errorCallbackHandler = (err: any) => {
        if (err.status === "validate_error") {
            const errors = validateError(err.data);
            Object.keys(errors).forEach((fieldName) =>
                setError(fieldName as keyof RoleFormType, {
                    type: "manual",
                    message: errors[fieldName],
                }),
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
        return <AppLoader h="40vh" />;
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Card withBorder>
                <Card.Section inheritPadding withBorder py="sm">
                    <Text>{props.id ? "Update" : "Add"} Role</Text>
                </Card.Section>
                <Card.Section inheritPadding withBorder py="sm">
                    <Stack>
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
                            name="grant_permission"
                            control={control}
                            render={({ field: { onChange, value } }) => (
                                <Checkbox
                                    label="Grant Permission"
                                    description="Note: Ensure the 'Grant Permission' checkbox is unchecked or set to false as needed."
                                    onChange={onChange}
                                    checked={value}
                                    error={errors.grant_permission?.message}
                                />
                            )}
                        />

                        <Fieldset legend="Permissions" w="100%">
                            {watch("grant_permission") ? (
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
                                                i: number,
                                            ) => (
                                                <Grid.Col
                                                    span={{
                                                        base: 12,
                                                        md: 3,
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
                                                                                p,
                                                                            ) =>
                                                                                value.includes(
                                                                                    p,
                                                                                ),
                                                                        );
                                                                    return (
                                                                        <Checkbox
                                                                            label={
                                                                                item.module
                                                                            }
                                                                            checked={
                                                                                allSelected
                                                                            }
                                                                            onChange={(
                                                                                e,
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
                                                                                                  ],
                                                                                              ),
                                                                                          ]
                                                                                        : value.filter(
                                                                                              (
                                                                                                  p,
                                                                                              ) =>
                                                                                                  !item.permissions.includes(
                                                                                                      p,
                                                                                                  ),
                                                                                          );
                                                                                onChange(
                                                                                    newPermissions,
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
                                                                        pI: number,
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
                                                                                    label={
                                                                                        pItem
                                                                                    }
                                                                                    checked={value.includes(
                                                                                        pItem,
                                                                                    )}
                                                                                    onChange={(
                                                                                        e,
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
                                                                                                          p,
                                                                                                      ) =>
                                                                                                          p !==
                                                                                                          pItem,
                                                                                                  );
                                                                                        onChange(
                                                                                            newPermissions,
                                                                                        );
                                                                                    }}
                                                                                />
                                                                            )}
                                                                        />
                                                                    ),
                                                                )}
                                                            </Stack>
                                                        </Card.Section>
                                                    </Card>
                                                </Grid.Col>
                                            ),
                                        )}
                                    </Grid>
                                </ScrollArea>
                            )}
                        </Fieldset>
                    </Stack>
                </Card.Section>
                <Card.Section inheritPadding withBorder py="sm">
                    <Flex gap="sm" justify="end">
                        <Button
                            variant="outline"
                            color="gray"
                            leftSection={
                                <Icon
                                    icon="hugeicons:cancel-01"
                                    fontSize={18}
                                />
                            }
                            component={Link}
                            href={`/admin/roles`}
                            disabled={
                                resultCreate.isLoading || resultUpdate.isLoading
                            }
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
                            loading={
                                resultCreate.isLoading || resultUpdate.isLoading
                            }
                        >
                            {data ? "Update" : "Save"}
                        </Button>
                    </Flex>
                </Card.Section>
            </Card>
        </form>
    );
};

RoleForm.layout = (page: any) => <Panel children={page} title="Role" />;
export default RoleForm;
