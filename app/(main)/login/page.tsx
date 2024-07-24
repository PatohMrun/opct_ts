"use client";

import Link from "next/link";
import React, { useState, FormEvent } from "react";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { useRouter } from 'next/navigation';

const Login: React.FC = () => {
  const [nationalId, setNationalId] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const handleNationalIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNationalId(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleLoginSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nationalId, password }),
        credentials: 'include', // This is important for including cookies
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      // Login successful
      const data = await response.json();
      // Store user data in session storage
      sessionStorage.setItem('userData', JSON.stringify(data.user));
      // Redirect to dashboard or home page
      router.push('/home');
      
      
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred');
      }
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-[75vh] flex justify-center items-center font-poppins bg-green-100 text-white">
      <form
        onSubmit={handleLoginSubmit}
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
            {showPassword ? <span className="mx-8 text-gray-500"><IoEyeOff /></span> : <span className="mx-8 text-gray-500"><IoEye /></span>}
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