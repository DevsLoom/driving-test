// import { router } from "@inertiajs/react";
// import { Button, Card, Text } from "@mantine/core";
// import { notifications } from "@mantine/notifications";
// import React, { useEffect } from "react";
// import { Controller, useForm } from "react-hook-form";
// import { useSelector } from "react-redux";
// import SecretBox from "../../../components/ui/SecretBox";
// import TextBox from "../../../components/ui/TextBox";
// import { THEME } from "../../../constants/theme";
// import Auth from "../../../layouts/Auth";
// import { RootState } from "../../../store";
// import { useRegisterMutation } from "../../../store/actions/slices/auth";
// import { alertMessage, validateError } from "../../../utils/helpers";

// type FormType = {
//     type: string;
//     first_name: string;
//     last_name: string;
//     user: string;
//     password: string;
// };

// const Register = () => {
//     const requestUser = useSelector(
//         (state: RootState) => state.requestUser.requestUser
//     );

//     const [register, result] = useRegisterMutation();
//     const {
//         control,
//         handleSubmit,
//         formState: { errors },
//         setError,
//         reset,
//         setValue,
//     } = useForm<FormType>({
//         defaultValues: {
//             first_name: "",
//             last_name: "",
//             user: "",
//             password: "",
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
//             router.visit("/login", { replace: true });
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
//         await register(form)
//             .unwrap()
//             .then((res) => successCallbackHandler(res))
//             .catch((err) => errorCallbackHandler(err));
//     };

//     useEffect(() => {
//         if (requestUser) {
//             setValue("user", requestUser);
//         } else {
//             router.visit("/register/request", { replace: true });
//         }
//     }, [requestUser]);

//     return (
//         <Card.Section inheritPadding py="xl" px={80}>
//             <Text fz={32} component="h1" c={THEME.textLight} mb="xs">
//                 Complete Your Account
//             </Text>
//             <form
//                 className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6"
//                 onSubmit={handleSubmit(onSubmit)}
//             >
//                 <Controller
//                     name="first_name"
//                     control={control}
//                     rules={{
//                         required: "First name field is required",
//                     }}
//                     render={({ field: { onChange, value } }) => (
//                         <TextBox
//                             withAsterisk
//                             label="First Name"
//                             value={value}
//                             onChange={onChange}
//                             error={errors.first_name?.message}
//                         />
//                     )}
//                 />
//                 <Controller
//                     name="last_name"
//                     control={control}
//                     render={({ field: { onChange, value } }) => (
//                         <TextBox
//                             label="Last Name"
//                             value={value}
//                             onChange={onChange}
//                             error={errors.last_name?.message}
//                         />
//                     )}
//                 />

//                 <div className="col-span-full">
//                     <Controller
//                         name="user"
//                         control={control}
//                         render={({ field: { onChange, value } }) => (
//                             <TextBox
//                                 label="Email or Phone"
//                                 value={value}
//                                 onChange={onChange}
//                                 error={errors.user?.message}
//                                 disabled
//                             />
//                         )}
//                     />
//                 </div>
//                 <div className="col-span-full">
//                     <Controller
//                         name="password"
//                         control={control}
//                         rules={{
//                             required: "Password field is required",
//                             minLength: {
//                                 value: 6,
//                                 message:
//                                     "Password field should be minimum 6 characters",
//                             },
//                         }}
//                         render={({ field: { onChange, value } }) => (
//                             <SecretBox
//                                 withAsterisk
//                                 label="Password"
//                                 onChange={onChange}
//                                 value={value}
//                                 error={errors.password?.message}
//                             />
//                         )}
//                     />
//                 </div>
//                 <div className="col-span-full">
//                     <Button
//                         color={THEME.primary}
//                         fullWidth
//                         mt="xs"
//                         type="submit"
//                         loading={result.isLoading}
//                     >
//                         Create account
//                     </Button>
//                 </div>
//             </form>
//         </Card.Section>
//     );
// };
// Register.layout = (page: any) => (
//     <Auth children={page} title="Register | Job Journey" />
// );
// export default Register;
