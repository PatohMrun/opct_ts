"use client";
import Link from "next/link";
import React, { useState } from "react";
import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";

const Login = () => {
  const [idNo, setIdNo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleIdNoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIdNo(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(event.target.value);
  };

  const handleRegisterSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const formData = {
      idNo,
      password,
      confirmPassword,
    };
    console.log(formData);
    // Here, you can add your logic to handle the form submission
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="min-h-[75vh] flex justify-center items-center font-poppins bg-green-100 text-white">
      <form
        onSubmit={handleRegisterSubmit}
        className="flex flex-col gap-2 mx-auto bg-primary p-4 my-4 rounded-xl border-t-4 border-secondary shadow-xl shadow-gray-500"
      >
        <label htmlFor="ID number">National ID No:</label>
        <input
          type="number"
          placeholder="ID Number"
          value={idNo}
          onChange={handleIdNoChange}
          required
        />
        <label htmlFor="password">Password:</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
          <button
            type="button"
            className="absolute right-0 top-1/2 transform -translate-y-1/2"
            onClick={toggleShowPassword}
          >
            { showPassword ? <span className="mx-8 text-gray-500"><IoEyeOff /></span> : <span className="mx-8 text-gray-500"><IoEye /></span>}
          </button>
        </div>
        <input
          type="submit"
          value="Log in"
          className="bg-secondary text-gray-900 font-bold mx-auto my-2 p-2 rounded-lg w-36"
        />
        <p className="text-xs mx-auto">Don&apos;t have an account? <Link href="/register"><span className="text-green-200">Register</span></Link></p>
      </form>
    </div>
  );
};

export default Login;