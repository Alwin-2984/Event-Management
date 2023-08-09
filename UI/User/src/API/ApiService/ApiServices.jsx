import { instance } from "../Interceptor/Intercepter";

const BASE_URL = import.meta.env.VITE_API_URL;

export function RegistrationAndLogin(formData, signUp, isOrganiser) {
  if (signUp) {
    let url = isOrganiser ? `${BASE_URL}organizer` : `${BASE_URL}user`;

    return instance.post(url, formData);
  } else {
    let url = isOrganiser
      ? `${BASE_URL}organizer/login`
      : `${BASE_URL}user/login`;

    return instance.post(url, formData);
  }
}

export function GoogleAuthApi(body) {
  return instance.post(`${BASE_URL}user/googleAuth`, body);
}

export function OtpVerifyApi(isOrganiser, otpBody) {
  if (isOrganiser) {
    return instance.post(`${BASE_URL}organizer/verify`, otpBody);
  } else {
    return instance.post(`${BASE_URL}user/verify`, otpBody);
  }
}



export function ChangePasswordApi(res, otpData) {
  return instance.post(`${BASE_URL}user/setPassword`, {
    emailToken: res.data.emailToken,
    password: otpData.password,
  });
}

export function forgotPasswordOtpSend(values) {
  return instance.post(`${BASE_URL}user/forgotPassword`, {
    email: values.email,
  });
}
export function verifyForgotPassword(otpDataBody) {
  return instance.post(`${BASE_URL}user/verifyForgotPassword`, otpDataBody);
}