import React from 'react';

type FormSectionProps = {
    title: string;
    children: React.ReactNode;
}

const FormSection: React.FC<FormSectionProps> = ({ title, children }) => {
  return (
    <div className="border border-gray-300 rounded-md p-4 my-4 font-poppins bg-primary text-white">
      <legend className="text-lg font-medium px-2 -ml-3">{title}</legend>
      <div className="mt-2">
        {children}
      </div>
    </div>
  );
};

export default FormSection;
