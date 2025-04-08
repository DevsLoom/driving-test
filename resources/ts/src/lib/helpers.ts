import Swal, { SweetAlertOptions } from "sweetalert2";

export const validateError = (data: { [key: string]: string | string[] }) => {
  const validate: { [key: string]: string | any } = {};
  Object.keys(data).forEach((key) => {
      if (Array.isArray(data[key])) {
          validate[key] = data[key][0];
      } else {
          validate[key] = data[key];
      }
  });
  return validate;
};

export const alertMessage = (props: SweetAlertOptions): void => {
  Swal.fire(props);
};

export const deleteAlertMessage = (
  cb: () => void = () => {},
  title: string = "Yes, Delete it"
): void => {
  Swal.fire({
    title: "Are you sure?",
    text: "Do you want to continue?",
    icon: "question",
    confirmButtonText: title,
    showCancelButton: true,
    focusCancel: true,
  }).then(({ isConfirmed }) => {
    if (isConfirmed) {
      cb();
    }
  });
};


export const maskEmail = (email: string): string => {
  const [localPart, domain] = email.split("@");
  const maskedLocal = `${localPart.slice(0, 3)}${"*".repeat(Math.max(0, localPart.length - 3))}`;
  return `${maskedLocal}@${domain}`;
};

// export const getColor = (color: string) => {
//   switch (color) {
//       case "active":
//           return 'green';

//       case "inactive":
//           return THEME.danger;
//   }
// };

export const getUserType = (type: string) => {
  switch (type) {
      case "system":
          return "System Users";

      case "student":
          return "Students";
  }
};

export const mapSelect = (
  data: any[] = [],
  label: string,
  value: string
) => {
  return data.map((item) => ({
    label: String(item?.[label] ?? ""),
    value: String(item?.[value] ?? ""),
  }));
};

export const imageUrlBuilder = (attachments: string | string[] | undefined, defaultImage: string = "") => {
  if (attachments) {
      if (typeof attachments !== "string" && attachments.length) {
          return window.origin + attachments[0];
      } else if (typeof attachments === "string") {
          return isValidUrl(attachments) ? attachments : window.origin + attachments;
      }
  }
  return defaultImage;
};

export const isValidUrl = (string: string) =>  {
  const regex = /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z0-9]{2,4}(:\d+)?(\/[^\s]*)?$/i;
  return regex.test(string);
}

