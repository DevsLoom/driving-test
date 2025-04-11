// import { Icon } from "@iconify/react";
// import { Link, router } from "@inertiajs/react";
// import {
//     Anchor,
//     Button,
//     Card,
//     Checkbox,
//     Divider,
//     Grid,
//     Text,
// } from "@mantine/core";
// import { notifications } from "@mantine/notifications";
// import React, { useState } from "react";
// import { Controller, useForm } from "react-hook-form";
// import { useDispatch } from "react-redux";
// import TextBox from "../../../components/ui/TextBox";
// import { THEME } from "../../../constants/theme";
// import Auth from "../../../layouts/Auth";
// import { useRegisterRequestMutation } from "../../../store/actions/slices/auth";
// import { setRequestUser } from "../../../store/reducers/requestUser";
// import { alertMessage, validateError } from "../../../utils/helpers";

// type FormType = {
//     user: string;
// };

// const RegisterRequest = () => {
//     const dispatch = useDispatch();
//     const [checked, setChecked] = useState(false);
//     const [registerRequest, result] = useRegisterRequestMutation();

//     const {
//         control,
//         handleSubmit,
//         formState: { errors },
//         setError,
//         reset,
//     } = useForm<FormType>({
//         defaultValues: {
//             user: "",
//         },
//     });

//     const successCallbackHandler = (res: any) => {
//         if (res.status === "success") {
//             notifications.show({
//                 position: "top-right",
//                 withCloseButton: true,
//                 autoClose: 5000,
//                 title: "Success",
//                 message: res.message,
//                 color: "green",
//             });
//             if (res.data.verify_required) {
//                 dispatch(setRequestUser(res.data.user));
//                 router.visit("/register/verify", { replace: true });
//             }
//         }
//     };

//     const errorCallbackHandler = (err: any) => {
//         if (err.status === "validate_error") {
//             const errors = validateError(err.data);
//             Object.keys(errors).forEach((fieldName) =>
//                 setError(fieldName as keyof FormType, {
//                     type: "manual",
//                     message: errors[fieldName],
//                 })
//             );
//         } else {
//             alertMessage({ title: err.message, icon: "error", timer: 2000 });
//         }
//     };

//     const onSubmit = async (form: FormType) => {
//         await registerRequest(form)
//             .unwrap()
//             .then((res) => successCallbackHandler(res))
//             .catch((err) => errorCallbackHandler(err));
//     };

//     return (
//         <Card.Section inheritPadding py="xl" px={80}>
//             <Text fz={32} component="h1" c={THEME.textLight} mb="xs">
//                 Create an account
//             </Text>
//             <Text component="span" c={THEME.textDimmed} fz={14}>
//                 Already have an account?{" "}
//                 <Anchor
//                     c={THEME.primary}
//                     fw={600}
//                     component={Link}
//                     href="/login"
//                 >
//                     Login
//                 </Anchor>
//             </Text>

//             <form
//                 className="flex flex-col gap-6 mt-6"
//                 onSubmit={handleSubmit(onSubmit)}
//             >
//                 <Controller
//                     name="user"
//                     control={control}
//                     rules={{
//                         required: "The email or phone field is required",
//                     }}
//                     render={({ field: { onChange, value } }) => (
//                         <TextBox
//                             withAsterisk
//                             label="Email or Phone"
//                             value={value}
//                             onChange={onChange}
//                             error={errors.user?.message}
//                         />
//                     )}
//                 />
//                 <Checkbox
//                     color={THEME.primary}
//                     checked={checked}
//                     onChange={(e) => setChecked(e.target.checked)}
//                     label={
//                         <Text component="span" size="sm" c={THEME.textDimmed}>
//                             I agree to to the{" "}
//                             <Anchor component={Link} href="" c={THEME.primary}>
//                                 Terms & Conditions
//                             </Anchor>
//                         </Text>
//                     }
//                 />
//                 <Button
//                     color={THEME.primary}
//                     fullWidth
//                     type="submit"
//                     loading={result.isLoading}
//                     disabled={!checked}
//                 >
//                     Create account
//                 </Button>
//             </form>
//             <Divider label="Or register with" my="md" />
//             <Grid>
//                 <Grid.Col span={{ base: 12, md: 6 }}>
//                     <Button
//                         variant="outline"
//                         leftSection={<Icon icon="logos:google-icon" />}
//                         fullWidth
//                         color={THEME.textDimmed}
//                     >
//                         Google
//                     </Button>
//                 </Grid.Col>
//                 <Grid.Col span={{ base: 12, md: 6 }}>
//                     <Button
//                         variant="outline"
//                         leftSection={<Icon icon="logos:google-icon" />}
//                         fullWidth
//                         color={THEME.textDimmed}
//                     >
//                         Google
//                     </Button>
//                 </Grid.Col>
//             </Grid>
//         </Card.Section>
//     );
// };
// RegisterRequest.layout = (page: any) => (
//     <Auth children={page} title="Register | Job Journey" />
// );
// export default RegisterRequest;
