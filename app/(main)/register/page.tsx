"use client";

import Link from "@/components/link-with-loader";
import React, { useState } from "react";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { useRouter } from "next/navigation";
import nProgress from "nprogress";

const Register = () => {
  const [nationalId, setNationalId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const handleNationalIdChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNationalId(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(event.target.value);
  };

  const handleRegisterSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      nProgress.start();
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nationalId, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }

      // Registration successful
      router.push("/login");
    } catch (error: unknown) {
      nProgress.done();
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred");
      }
    }
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
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <label htmlFor="ID number">National ID No:</label>
        <input
          type="text"
          placeholder="ID Number"
          value={nationalId}
          onChange={handleNationalIdChange}
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
            {showPassword ? (
              <span className="mx-8 text-gray-500">
                <IoEyeOff />
              </span>
            ) : (
              <span className="mx-8 text-gray-500">
                <IoEye />
              </span>
            )}
          </button>
        </div>
        <label htmlFor=" Repeat password">Repeat Password:</label>
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            required
          />
          <button
            type="button"
            className="absolute right-0 top-1/2 transform -translate-y-1/2"
            onClick={toggleShowConfirmPassword}
          >
            {showConfirmPassword ? (
              <span className="mx-8 text-gray-500">
                <IoEyeOff />
              </span>
            ) : (
              <span className="mx-8 text-gray-500">
                <IoEye />
              </span>
            )}
          </button>
        </div>
        <input
          type="submit"
          value="Register"
          className="bg-green-600 text-white font-bold px-4 py-2 rounded-lg hover:bg-green-500 transition-colors duration-300 mx-auto my-2 w-36"
        />
        <p className="text-xs mx-auto">
          Already have an account?{" "}
          <Link href="/login">
            <span className="text-green-200">Log in</span>
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
