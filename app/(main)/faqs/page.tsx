

import React from "react";

const FAQPage = () => {
  const faqs = [
    {
      question: "What is the OPCT Application System?",
      answer:
        "The OPCT Application System is a platform designed to streamline the process for older persons in Kenya to apply for government support. Our system aims to make the application process user-friendly, accessible, and efficient.",
    },
    {
      question: "Who is eligible for the OPCT program?",
      answer:
        "The Older Persons Cash Transfer (OPCT) program is specifically for older persons in Kenya who meet certain eligibility criteria set by the government. For detailed eligibility requirements, please visit the official government website or contact your local social services office.",
    },
    {
      question: "How can I apply for the OPCT program through your system?",
      answer:
        "To apply, visit our Home page and follow the step-by-step instructions. If you need assistance, our system provides detailed guidance and support to ensure you can complete your application successfully.",
    },
    {
      question: "Is the OPCT Application System affiliated with the Kenyan government?",
      answer:
        "Yes, while we are an independent platform, we work closely with government agencies to align our system with the existing Older Persons Cash Transfer program. Our goal is to enhance the application process through technology.",
    },
    {
      question: "What are your core values?",
      answer:
        "Our core values are: Innovation: Using technology to improve processes. Accessibility: Making our system easy to use for everyone. Efficiency: Reducing application waiting times. Empowerment: Providing tools and resources to help older persons access support.",
    },
    {
      question: "How do you ensure the system is accessible to everyone?",
      answer:
        "We design our platform with user-friendliness in mind, including clear instructions, a simple interface, and support options. We aim to accommodate all levels of technological proficiency.",
    },
    {
      question: "What can I do if I encounter an issue while using the system?",
      answer:
        "If you experience any issues, please contact our support team through the 'Messages' section or email us at support@opct-kenya.com. We are here to help you navigate any challenges you may encounter.",
    },
    {
      question: "How can I get involved with the OPCT Application System project?",
      answer:
        "You can support our mission by providing feedback, testing our application system, or spreading awareness about our platform. Visit our Get Involved section for more information.",
    },
    {
      question: "What are your future plans?",
      answer:
        "We aim to expand our platform's capabilities to offer additional support services, such as information on healthcare, social services, and community resources, for older persons.",
    },
    {
      question: "Where can I find more information about the Older Persons Cash Transfer program?",
      answer:
        "For more information, please visit the official Government of Kenya website or contact your local social services office.",
    },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl mx-auto my-8">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">
        OPCT FAQs
      </h1>
      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <div key={index} className="border-b border-gray-200 pb-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {faq.question}
            </h2>
            <p className="text-gray-600">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQPage;
