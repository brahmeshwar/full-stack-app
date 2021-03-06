/** @format */

export const required = (value: any) =>
  value ? undefined : "Value is Required";
export const email = (value: any) => {
  const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return value && emailRegex.test(value) ? undefined : "Invalid Email";
};

export const mobile = (value: any) =>
  value &&
  /[6-9]{1}\d{9}/.test(value) &&
  value.length === 10 &&
  /[0-9]/.test(value)
    ? undefined
    : "Invalid Mobile Number";

export const date = (value: any) => {
  const year = parseInt(value && value.split("-"), 10);
  return year >= 1960 && year <= new Date().getFullYear()
    ? undefined
    : "Invalid Date (or) Date Format";
};

// export interface IValidatorResult {
//   err: boolean;
//   errMessage: string;
// }
// export class Validator {
//   static email = (s: string | null, fieldName: string): IValidatorResult => {
//     const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//     if (s && emailRegex.test(s)) return { err: false, errMessage: "" };
//     else
//       return {
//         err: true,
//         errMessage: `Entered ${fieldName} is an invalid email`,
//       };
//   };

//   static mobile = (s: string | null, fieldName: string): IValidatorResult => {
//     const mobileRegex = /[6-9]{1}\d{9}/;
//     if (s && mobileRegex.test(s)) return { err: false, errMessage: "" };
//     else
//       return {
//         err: true,
//         errMessage: `Entered ${fieldName} is an invalid Mobile Number`,
//       };
//   };

//   static date = (s: string | null, fieldName: string): IValidatorResult => {
//     const dateRegex = ;
//     if (s && dateRegex.test(s)) return { err: false, errMessage: "" };
//     else
//       return {
//         err: true,
//         errMessage: `Entered ${fieldName} is an invalid date (or) invalid format.`,
//       };
//   };

//   static password = (
//     val: string | null,
//     fieldName: string,
//   ): IValidatorResult => {
//     const res: IValidatorResult = {
//       err: false,
//       errMessage: "",
//     };
//     const PASSWORD_POLICY = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,20}$/;
//     if (val && PASSWORD_POLICY.test(val)) {
//       res.err = false;
//       res.errMessage = "";
//     } else {
//       res.err = true;
//       res.errMessage = `${fieldName} must contain 10 to 20 characters having One Number, One Special Character, One Uppercase Letter, One Lowercase Letter`;
//     }
//     return res;
//   };
//   static equal = (
//     enteredValue: string | null,
//     compareVal: string | null,
//     fieldName: string,
//     comparatorFieldName: string,
//   ): IValidatorResult => {
//     return enteredValue && compareVal && enteredValue === compareVal
//       ? {
//           err: false,
//           errMessage: "",
//         }
//       : {
//           err: true,
//           errMessage: `Entered ${fieldName} doesn't match with ${comparatorFieldName}`,
//         };
//   };

//   static numberRequired = (
//     s: number,
//     minVal: number,
//     maxVal: number,
//     fieldName: string,
//   ): IValidatorResult => {
//     if (s >= minVal && s <= maxVal) return { err: false, errMessage: "" };
//     else return { err: true, errMessage: `${fieldName} is an invalid value` };
//   };

//   static isRequired = (
//     s: string | null,
//     fieldName: string,
//     inpType?: "option" | "checkbox",
//   ): IValidatorResult => {
//     if (inpType && inpType === "option")
//       return s && s.length > 0
//         ? { err: false, errMessage: "" }
//         : { err: true, errMessage: `${fieldName} option not selected` };
//     else if (inpType && inpType === "checkbox") {
//       return s && s.length > 0
//         ? { err: false, errMessage: "" }
//         : { err: true, errMessage: `${fieldName} not selected` };
//     } else
//       return s && s.length > 0
//         ? { err: false, errMessage: "" }
//         : { err: true, errMessage: `${fieldName} cannot be blank` };
//   };
// }
