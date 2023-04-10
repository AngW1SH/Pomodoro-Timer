import React, { FC } from "react";

interface LoginProps {}

const Login: FC<LoginProps> = () => {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="w-96 border border-black p-10">
        <input
          placeholder="Login"
          className="mb-5 w-full border border-black px-3 py-1"
          type="text"
        />
        <input
          placeholder="Password"
          className="w-full border border-black px-3 py-1"
          type="password"
        />
      </div>
    </div>
  );
};

export default Login;
