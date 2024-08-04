"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { getUser } from "@/utils/auth";
import { Loader2, AlertCircle } from "lucide-react";

export const dynamic = "force-dynamic";

enum Gender {
  Male = "Male",
  Female = "Female",
}

enum MaritalStatus {
  Single = "Single",
  Married = "Married",
  Widowed = "Widowed",
}

enum EmploymentStatus {
  Employed = "Employed",
  Unemployed = "Unemployed",
}

enum ApplicationStatus {
  Unsubmitted = "Unsubmitted",
  Pending = "Pending",
  Approved = "Approved",
  Rejected = "Rejected",
}

interface User {
  nationalId: string;
  gender: Gender;
  maritalStatus: MaritalStatus;
  employmentStatus: EmploymentStatus;
  applicationStatus: ApplicationStatus;
  chronicIllness: boolean;
  disabled: boolean;
  county: string;
  subCounty: string;
  constituency: string;
  ward: string;
  village: string;
}

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<User>({
    nationalId: "",
    gender: Gender.Male,
    maritalStatus: MaritalStatus.Single,
    employmentStatus: EmploymentStatus.Unemployed,
    applicationStatus: ApplicationStatus.Unsubmitted,
    chronicIllness: false,
    disabled: false,
    county: "",
    subCounty: "",
    constituency: "",
    ward: "",
    village: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError(null);
      try {
        const currentUser = getUser();
        const response = await fetch("/api/user?id=" + currentUser?.id);
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        const data: User = await response.json();
        setUser(data);
        setFormData(data);
      } catch (error) {
        setError("Error fetching user data. Please try again.");
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const currentUser = getUser();
      const response = await fetch("/api/user?id=" + currentUser?.id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      setEditMode(false);
      setUser(formData);
    } catch (error) {
      setError("Error updating user data. Please try again.");
      console.error("Error updating user data:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        <span className="ml-2 text-lg font-medium text-gray-700">
          Loading...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <div className="flex">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span className="block sm:inline">{error}</span>
          </div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const InputField: React.FC<{
    label: string;
    name: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    disabled?: boolean;
  }> = ({ label, name, value, onChange, disabled }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
      />
    </div>
  );

  const SelectField: React.FC<{
    label: string;
    name: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
    options: { value: string; label: string }[];
  }> = ({ label, name, value, onChange, options }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );

  const CheckboxField: React.FC<{
    label: string;
    name: string;
    checked: boolean;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  }> = ({ label, name, checked, onChange }) => (
    <div className="flex items-center mb-4">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
      />
      <label className="ml-2 block text-sm text-gray-900">{label}</label>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">User Profile</h1>
      {editMode ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField
            label="National ID"
            name="nationalId"
            value={formData.nationalId}
            onChange={handleChange}
            disabled
          />
          <SelectField
            label="Gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            options={Object.values(Gender).map((value) => ({
              value,
              label: value,
            }))}
          />
          <SelectField
            label="Marital Status"
            name="maritalStatus"
            value={formData.maritalStatus}
            onChange={handleChange}
            options={Object.values(MaritalStatus).map((value) => ({
              value,
              label: value,
            }))}
          />
          <SelectField
            label="Employment Status"
            name="employmentStatus"
            value={formData.employmentStatus}
            onChange={handleChange}
            options={Object.values(EmploymentStatus).map((value) => ({
              value,
              label: value,
            }))}
          />

          <CheckboxField
            label="Chronic Illness"
            name="chronicIllness"
            checked={formData.chronicIllness}
            onChange={handleChange}
          />
          <CheckboxField
            label="Disabled"
            name="disabled"
            checked={formData.disabled}
            onChange={handleChange}
          />
          <InputField
            label="County"
            name="county"
            value={formData.county}
            onChange={handleChange}
          />
          <InputField
            label="Sub-County"
            name="subCounty"
            value={formData.subCounty}
            onChange={handleChange}
          />
          <InputField
            label="Constituency"
            name="constituency"
            value={formData.constituency}
            onChange={handleChange}
          />
          <InputField
            label="Ward"
            name="ward"
            value={formData.ward}
            onChange={handleChange}
          />
          <InputField
            label="Village"
            name="village"
            value={formData.village}
            onChange={handleChange}
          />
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => setEditMode(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center"
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(user).map(([key, value]) => (
              <div key={key} className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm font-medium text-gray-500">
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </p>
                <p className="mt-1 text-lg font-semibold text-gray-900">
                  {typeof value === "boolean" ? (value ? "Yes" : "No") : value}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <button
              onClick={() => setEditMode(true)}
              className="w-full md:w-auto px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Edit Profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
