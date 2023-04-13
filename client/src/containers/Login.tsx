import React, { FC, useState } from "react";
import { loginUser, registerUser } from "../lib/login";

enum ActionTypes {
  Login = "login",
  Register = "register",
}

interface ILoginData {
  email: IField;
  password: IField;
}

interface IField {
  value: string;
  message: string;
}

interface IRegisterData {
  email: IField;
  password: IField;
  passwordRepeat: IField;
}

interface IFormData {
  login: ILoginData;
  register: IRegisterData;
}

interface LoginProps {}

const Login: FC<LoginProps> = () => {
  const [registering, setRegistering] = useState(false);

  const [formData, setFormData] = useState<IFormData>({
    login: {
      email: {
        value: "",
        message: "",
      },
      password: {
        value: "",
        message: "",
      },
    },
    register: {
      email: {
        value: "",
        message: "",
      },
      password: {
        value: "",
        message: "",
      },
      passwordRepeat: {
        value: "",
        message: "",
      },
    },
  });

  const handleInputGenerator = (actionType: ActionTypes, field: string) => {
    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({
        ...formData,
        [actionType]: {
          ...formData[actionType],
          [field]: {
            value: e.target.value,
            message: "",
          },
        },
      });
    };
    return handleInput;
  };

  const handleStartRegistering = () => {
    setRegistering(true);
  };

  const handleStartLogging = () => {
    setRegistering(false);
  };

  const generateRegisterMessages = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const newRegisterData = { ...formData.register };

    if (!formData.register.password.value)
      newRegisterData.password.message = "Please enter a password";
    if (!formData.register.passwordRepeat.value)
      newRegisterData.passwordRepeat.message = "Please repeat a password";

    if (
      formData.register.password.value &&
      formData.register.password.value != formData.register.passwordRepeat.value
    )
      newRegisterData.passwordRepeat.message = "Passwords must match";

    if (!emailRegex.test(formData.register.email.value)) {
      newRegisterData.email.message = "This field needs to be a valid email";
    }

    if (formData.register.password.value.length < 8) {
      newRegisterData.password.message =
        "Password has to be at least 8 characters long";
    }

    return newRegisterData;
  };

  const generateLoginMessages = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const newLoginData = { ...formData.login };

    if (!formData.login.password.value)
      newLoginData.password.message = "Please enter a password";

    if (!emailRegex.test(formData.login.email.value)) {
      newLoginData.email.message = "This field needs to be a valid email";
    }

    return newLoginData;
  };

  const handleRegister = async () => {
    const registerData = generateRegisterMessages();

    if (
      Object.keys(registerData).filter(
        (key: string) => !!registerData[key as keyof IRegisterData].message
      ).length
    ) {
      setFormData({ ...formData, register: registerData });
    } else {
      const result = await registerUser(
        formData.register.email.value,
        formData.register.password.value
      );
    }
  };

  const handleLogin = async () => {
    const loginData = generateLoginMessages();

    if (
      Object.keys(loginData).filter(
        (key: string) => !!loginData[key as keyof ILoginData].message
      ).length
    ) {
      setFormData({ ...formData, login: loginData });
    } else {
      const result = await loginUser(
        formData.login.email.value,
        formData.login.password.value
      );
    }
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="relative w-96 border border-black p-10">
        {registering ? (
          <>
            {formData.register.email.message.length != 0 && (
              <div className="pb-1 text-sm text-red-500">
                {formData.register.email.message}
              </div>
            )}
            <input
              placeholder="Email"
              name="register-email"
              className={`${
                formData.register.email.message.length
                  ? "border-red-500"
                  : "border-black"
              } mb-5 w-full border px-3 py-1`}
              type="email"
              onChange={handleInputGenerator(ActionTypes.Register, "email")}
              value={formData.register.email.value}
            />
            {formData.register.password.message.length != 0 && (
              <div className="pb-1 text-sm text-red-500">
                {formData.register.password.message}
              </div>
            )}
            <input
              placeholder="Password"
              name="register-password"
              className={`${
                formData.register.password.message.length
                  ? "border-red-500"
                  : "border-black"
              } mb-5 w-full border px-3 py-1`}
              type="password"
              onChange={handleInputGenerator(ActionTypes.Register, "password")}
              value={formData.register.password.value}
            />
            {formData.register.passwordRepeat.message.length != 0 && (
              <div className="pb-1 text-sm text-red-500">
                {formData.register.passwordRepeat.message}
              </div>
            )}
            <input
              placeholder="Repeat password"
              name="register-repeat-password"
              className={`${
                formData.register.password.message.length
                  ? "border-red-500"
                  : "border-black"
              } mb-5 w-full border px-3 py-1`}
              type="password"
              onChange={handleInputGenerator(
                ActionTypes.Register,
                "passwordRepeat"
              )}
              value={formData.register.passwordRepeat.value}
            />
            <div
              onClick={handleRegister}
              className="mx-auto mt-10 w-max cursor-pointer border border-black px-4 py-1"
            >
              Submit
            </div>
            <div
              onClick={handleStartLogging}
              className="absolute bottom-3 left-3 cursor-pointer text-sm font-light"
            >
              Switch to login
            </div>
          </>
        ) : (
          <>
            {formData.login.email.message.length != 0 && (
              <div className="pb-1 text-sm text-red-500">
                {formData.login.email.message}
              </div>
            )}
            <input
              placeholder="Email"
              name="login-email"
              className={`${
                formData.login.email.message.length
                  ? "border-red-500"
                  : "border-black"
              } mb-5 w-full border px-3 py-1`}
              type="email"
              onChange={handleInputGenerator(ActionTypes.Login, "email")}
              value={formData.login.email.value}
            />
            {formData.login.password.message.length != 0 && (
              <div className="pb-1 text-sm text-red-500">
                {formData.login.password.message}
              </div>
            )}
            <input
              placeholder="Password"
              name="login-password"
              className={`${
                formData.login.password.message.length
                  ? "border-red-500"
                  : "border-black"
              } mb-5 w-full border px-3 py-1`}
              type="password"
              onChange={handleInputGenerator(ActionTypes.Login, "password")}
              value={formData.login.password.value}
            />
            <div
              onClick={handleLogin}
              className="mx-auto mt-10 w-max cursor-pointer border border-black px-4 py-1"
            >
              Submit
            </div>
            <div
              onClick={handleStartRegistering}
              className="absolute bottom-3 left-3 cursor-pointer text-sm font-light"
            >
              I'm new here
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
