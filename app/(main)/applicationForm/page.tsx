//app/applicationForm/page.tsx
"use client"
import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import FormSection from '@/components/formSection';
import { useRouter } from 'next/navigation';
import { getUser } from '@/utils/auth'; 

interface Dependent {
  dependentFirstName: string;
  dependentMiddleName: string;
  dependentLastName: string;
  dependentGender: string;
  dependentDob: string;
  dependentRelationship: string;
}

const ApplicationForm: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [firstName, setFirstName] = useState<string>('');
  const [middleName, setMiddleName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [gender, setGender] = useState<string>('');
  const [dob, setDob] = useState<string>('');
  const [nationalId, setNationalId] = useState<string>('');
  const [kra, setKra] = useState<string>('');
  const [marital, setMarital] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');

  const [address, setAddress] = useState<string>('');
  const [county, setCounty] = useState<string>('');
  const [subCounty, setSubCounty] = useState<string>('');
  const [constituency, setConstituency] = useState<string>('');
  const [ward, setWard] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [subLocation, setSubLocation] = useState<string>('');
  const [Village, setVillage] = useState<string>('');

  const [income, setIncome] = useState<string>('');
  const [employment, setEmployment] = useState<string>('');
  const [assistance, setAssistance] = useState<string>('');
  const [illness, setIllness] = useState<string>('');
  const [disabled, setDisabled] = useState<string>('');

  const [kinFirstName, setKinFirstName] = useState<string>('');
  const [kinMiddleName, setKinMiddleName] = useState<string>('');
  const [kinLastName, setKinLastName] = useState<string>('');
  const [kinRelationship, setKinRelationship] = useState<string>('');
  const [kinEmail, setKinEmail] = useState<string>('');
  const [kinPhone, setKinPhone] = useState<string>('');

  const [bankName, setBankName] = useState<string>('');
  const [bankAccount, setBankAccount] = useState<string>('');

  const [payeeFirstName, setPayeeFirstName] = useState<string>('');
  const [payeeMiddleName, setPayeeMiddleName] = useState<string>('');
  const [payeeLastName, setPayeeLastName] = useState<string>('');
  const [payeeBankName, setPayeeBankName] = useState<string>('');
  const [payeeBankAccount, setPayeeBankAccount] = useState<string>('');

  const [dependent, setDependent] = useState<Dependent>({
    dependentFirstName: '',
    dependentMiddleName: '',
    dependentLastName: '',
    dependentGender: '',
    dependentDob: '',
    dependentRelationship: '',
  });

  const [dependents, setDependents] = useState<Dependent[]>([]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setDependent({
      ...dependent,
      [name]: value,
    });
  };

  const addDependent = () => {
    setDependents([...dependents, dependent]);
    // Reset the form
    setDependent({
      dependentFirstName: '',
      dependentMiddleName: '',
      dependentLastName: '',
      dependentGender: '',
      dependentDob: '',
      dependentRelationship: '',
    });
  };

  const removeDependent = (index: number) => {
    const newDependents = [...dependents];
    newDependents.splice(index, 1);
    setDependents(newDependents);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const user = getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      
      try {
        const response = await fetch(`/api/applicationForm?nationalId=${user.nationalId}`);
        if (!response.ok) {
          console.log('tyuiyuiusdewyretyuifrfwtrrwtyrwrucdffhdufefniedfjeiejeu');
          throw new Error('Failed to fetch user data');
        }
        const data = await response.json();
        const { userData } = data;
        console.log('tyuiyuiusdewyretyuifrfwtrrwtyrwrucdffhdufefniedfjeiejeu');

        // Prefill the form with government record data
        setNationalId(userData.nationalId);
        setFirstName(userData.governmentRecord.firstName);
        setMiddleName(userData.governmentRecord.middleName || '');
        setLastName(userData.governmentRecord.lastName);
        setGender(userData.governmentRecord.gender);
        setDob(new Date(userData.governmentRecord.dob).toISOString().split('T')[0]);
        setKra(userData.governmentRecord.kraPin || '');

        // Prefill with user data if available
        setEmail(userData.email || '');
        setPhone(userData.phone || '');
        setMarital(userData.maritalStatus || '');
        setEmployment(userData.employmentStatus || '');
        setIllness(userData.chronicIllness ? 'yes' : 'no');
        setDisabled(userData.disabled ? 'yes' : 'no');
        setIncome(userData.sourceOfIncome || '');
        setAssistance(userData.otherAssistance || '');
        setAddress(userData.address || '');
        setCounty(userData.county || '');
        setSubCounty(userData.subCounty || '');
        setConstituency(userData.constituency || '');
        setWard(userData.ward || '');
        setVillage(userData.village || '');

        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to load user data. Please try again.');
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);
  
  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    
    const formData = {
      nationalId,
      firstName,
      middleName,
      lastName,
      gender,
      dob,
      kra,
      marital,
      email,
      phone,
      address,
      county,
      subCounty,
      constituency,
      ward,
      location,
      subLocation,
      Village,
      income,
      employment,
      assistance,
      illness,
      disabled,
      kinFirstName,
      kinMiddleName,
      kinLastName,
      kinRelationship,
      kinEmail,
      kinPhone,
      bankName,
      bankAccount,
      payeeFirstName,
      payeeMiddleName,
      payeeLastName,
      payeeBankName,
      payeeBankAccount,
      dependents,
    };

    try {
      const response = await fetch('/api/submit-application', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit application');
      }

      const result = await response.json();
      console.log('Application submitted successfully:', result);
      router.push('/home');
    } catch (error) {
      console.error('Error submitting application:', error);
      setError('Failed to submit application. Please try again.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }
 

  return (
    <form className="max-w-3xl mx-auto p-4">
      <FormSection title="Personal Information">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="personalFirstName" className="block text-sm font-medium">First Name *</label>
            <input type="text" id="personalFirstName" name="personalFirstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
             className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-gray-900" placeholder='E.g., John' required />
          </div>
          <div>
            <label htmlFor="personalMiddleName" className="block text-sm font-medium">Middle Name</label>
            <input type="text" id="personalMiddleName" name="personalMiddleName"
              value={middleName}
              onChange={(e) => setMiddleName(e.target.value)}
             className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-gray-900" placeholder='E.g., Fred' />
          </div>
          <div>
            <label htmlFor="personalLastName" className="block text-sm font-medium">Last Name *</label>
            <input type="text" id="personalLastName" name="personalLastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
             className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-gray-900" placeholder='E.g., Smith' required />
          </div>
          <div>
            <label htmlFor="personalGender" className="block text-sm font-medium">Gender *</label>
            <select name="personalGender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
             id="personalGender" className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-gray-900" required>
              <option value="" disabled selected>Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <div>
            <label htmlFor="personalDob" className="block text-sm font-medium">Date of Birth *</label>
            <input type="date" id="personalDob" name="personalDob"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-gray-900" required />
          </div>
          <div>
            <label htmlFor="personalNationalID" className="block text-sm font-medium">National ID *</label>
            <input type="text" id="personalNationalID" name="personalNationalID"
              value={nationalId}
              onChange={(e) => setNationalId(e.target.value)}
             className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-gray-900" placeholder='E.g., 12345678' required />
          </div>
          <div>
            <label htmlFor="personalKraPin" className="block text-sm font-medium">KRA Pin</label>
            <input type="text" id="personalKraPin" name="personalKraPin"
              value={kra}
              onChange={(e) => setKra(e.target.value)}
             className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-gray-900" placeholder='E.g., A0123456XF' />
          </div>
          <div>
            <label htmlFor="personalMarital" className="block text-sm font-medium">Marital Status *</label>
            <select name="personalMarital"
              value={marital}
              onChange={(e) => setMarital(e.target.value)}
             id="personalMarital" className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-gray-900" required>
              <option value="" disabled selected>Select</option>
              <option value="single">Single</option>
              <option value="married">Married</option>
              <option value="widowed">Widowed</option>
            </select>
          </div>
          <div>
            <label htmlFor="personalEmail" className="block text-sm font-medium">Email</label>
            <input type="email" id="personalEmail" name="personalEmail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
             className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-gray-900" placeholder='youremail@example.com' />
          </div>
          <div>
            <label htmlFor="personalPhone" className="block text-sm font-medium">Phone Number *</label>
            <input type="text" id="personalPhone" name="personalPhone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
             className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-gray-900" placeholder='07XXXXXXXX' required />
          </div>
        </div>
      </FormSection>

      <FormSection title="Address Information">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="addressAddress" className="block text-sm font-medium">Address *</label>
            <input type="text" id="addressAddress" name="addressAddress"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
             className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-gray-900" placeholder='E.g., 123-60100' required />
          </div>
          <div>
            <label htmlFor="County" className="block text-sm font-medium">County *</label>
            <input type="text" id="County" name="County"
              value={county}
              onChange={(e) => setCounty(e.target.value)}
             className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-gray-900" placeholder='E.g., Embu' required />
          </div>
          <div>
            <label htmlFor="addressSubcounty" className="block text-sm font-medium">Sub-County *</label>
            <input type="text" id="addressSubcounty" name="addressSubcounty"
              value={subCounty}
              onChange={(e) => setSubCounty(e.target.value)}
             className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-gray-900" placeholder='E.g., Embu-East' required />
          </div>
          <div>
            <label htmlFor="addressConstituency" className="block text-sm font-medium">Constituency *</label>
            <input type="text" id="addressConstituency" name="addressConstituency"
              value={constituency}
              onChange={(e) => setConstituency(e.target.value)}
             className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-gray-900" placeholder='E.g., Runyenjes' required />
          </div>
          <div>
            <label htmlFor="addressWard" className="block text-sm font-medium">Ward *</label>
            <input type="text" id="addressWard" name="addressWard"
              value={ward}
              onChange={(e) => setWard(e.target.value)}
             className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-gray-900" placeholder='E.g., Kagaari-South' required />
          </div>
          <div>
            <label htmlFor="addressLocation" className="block text-sm font-medium">Location *</label>
            <input type="text" id="addressLocation" name="addressLocation"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
             className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-gray-900" placeholder='E.g., Kagaari-South-West' required />
          </div>
          <div>
            <label htmlFor="addressSublocation" className="block text-sm font-medium">Sub-Location *</label>
            <input type="text" id="addressSublocation" name="addressSublocation"
              value={subLocation}
              onChange={(e) => setSubLocation(e.target.value)}
             className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-gray-900" placeholder='E.g., Nthagaiya' required />
          </div>
          <div>
            <label htmlFor="addressVillage" className="block text-sm font-medium">Village *</label>
            <input type="text" id="addressVillage" name="addressVillage"
              value={Village}
              onChange={(e) => setVillage(e.target.value)}
             className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-gray-900" placeholder='E.g., Kianguchu' required />
          </div>
        </div>
      </FormSection>

      <FormSection title="Socio-Economic Information">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="socioEconomicIncome" className="block text-sm font-medium">Source of Income</label>
            <input type="text" id="socioEconomicIncome" name="socioEconomicIncome"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
             className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-gray-900" placeholder='E.g., Farming' />
          </div>
          <div>
            <label htmlFor="socioEconomicEmployment" className="block text-sm font-medium">Employment Status *</label>
            <select name="socioEconomicEmployment"
              value={employment}
              onChange={(e) => setEmployment(e.target.value)}
             id="socioEconomicEmployment" className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-gray-900" required>
              <option value="" disabled selected>Select</option>
              <option value="employed">Employed</option>
              <option value="unemployed">Unemployed</option>
            </select>
          </div>
          <div>
            <label htmlFor="socioEconomicAssistance" className="block text-sm font-medium">Other Assistance</label>
            <input type="text" id="socioEconomicAssistance" name="socioEconomicAssistance"
              value={assistance}
              onChange={(e) => setAssistance(e.target.value)}
             className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-gray-900" placeholder='E.g., Other Inuajamii Schemes' />
          </div>
          <div>
            <label htmlFor="socioEconomicIllness" className="block text-sm font-medium">Chronic Illness *</label>
            <select name="socioEconomicIllness"
              value={illness}
              onChange={(e) => setIllness(e.target.value)}
             id="socioEconomicIllness" className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-gray-900" required>
              <option value="" disabled selected>Select</option>
              <option value="ill">Yes</option>
              <option value="not-ill">No</option>
            </select>
          </div>
          <div>
            <label htmlFor="socioEconomicDisabled" className="block text-sm font-medium">Disabled *</label>
            <select name="socioEconomicDisabled"
              value={disabled}
              onChange={(e) => setDisabled(e.target.value)}
             id="socioEconomicDisabled" className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-gray-900" required>
              <option value="" disabled selected>Select</option>
              <option value="disabled">Yes</option>
              <option value="abled">No</option>
            </select>
          </div>
        </div>
      </FormSection>

      <FormSection title="Next of Kin">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="nextOfKinFirstName" className="block text-sm font-medium">First Name *</label>
            <input type="text" id="nextOfKinFirstName" name="nextOfKinFirstName"
              value={kinFirstName}
              onChange={(e) => setKinFirstName(e.target.value)}
             className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-gray-900" placeholder='E.g., John' required />
          </div>
          <div>
            <label htmlFor="nextOfKinMiddleName" className="block text-sm font-medium">Middle Name</label>
            <input type="text" id="nextOfKinMiddleName" name="nextOfKinMiddleName"
              value={kinMiddleName}
              onChange={(e) => setKinMiddleName(e.target.value)}
             className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-gray-900" placeholder='E.g., Fred' />
          </div>
          <div>
            <label htmlFor="nextOfKinLastName" className="block text-sm font-medium">Last Name *</label>
            <input type="text" id="nextOfKinLastName" name="nextOfKinLastName"
              value={kinLastName}
              onChange={(e) => setKinLastName(e.target.value)}
             className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-gray-900" placeholder='E.g., Smith' required />
          </div>
          <div>
            <label htmlFor="nextOfKinRelationship" className="block text-sm font-medium">Relationship *</label>
            <input type="text" id="nextOfKinRelationship" name="nextOfKinRelationship"
              value={kinRelationship}
              onChange={(e) => setKinRelationship(e.target.value)}
             className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-gray-900" placeholder='E.g., Spouse' required />
          </div>
          <div>
            <label htmlFor="nextOfKinEmail" className="block text-sm font-medium">Email</label>
            <input type="email" id="nextOfKinEmail" name="nextOfKinEmail"
              value={kinEmail}
              onChange={(e) => setKinEmail(e.target.value)}
             className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-gray-900" placeholder='youremail@example.com' />
          </div>
          <div>
            <label htmlFor="nextOfKinPhone" className="block text-sm font-medium">Phone Number *</label>
            <input type="text" id="nextOfKinPhone" name="nextOfKinPhone"
              value={kinPhone}
              onChange={(e) => setKinPhone(e.target.value)}
             className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-gray-900" placeholder='07XXXXXXXX' required />
          </div>
        </div>
      </FormSection>

      <FormSection title="Bank Details">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="bankBankName" className="block text-sm font-medium">Bamk Name </label>
            <input type="text" id="bankBankName" name="bankBankName"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
             className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-gray-900" placeholder='E.g., Equity Bank' />
          </div>
          <div>
            <label htmlFor="bankAccountNumber" className="block text-sm font-medium">Account No.</label>
            <input type="text" id="bankAccountNumber" name="bankAccountNumber"
              value={bankAccount}
              onChange={(e) => setBankAccount(e.target.value)}
             className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-gray-900" placeholder='E.g., 0190123456789' />
          </div>
        </div>
      </FormSection>

      <FormSection title="Alternate Payee">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="alternatePayeeFirstName" className="block text-sm font-medium">First Name </label>
            <input type="text" id="alternatePayeeFirstName" name="alternatePayeeFirstName"
              value={payeeFirstName}
              onChange={(e) => setPayeeFirstName(e.target.value)}
             className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-gray-900" placeholder='E.g., John' />
          </div>
          <div>
            <label htmlFor="alternatePayeeMiddleName" className="block text-sm font-medium">Middle Name</label>
            <input type="text" id="alternatePayeeMiddleName" name="alternatePayeeMiddleName"
              value={payeeMiddleName}
              onChange={(e) => setPayeeMiddleName(e.target.value)}
             className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-gray-900" placeholder='E.g., Fred' />
          </div>
          <div>
            <label htmlFor="alternatePayeeLastName" className="block text-sm font-medium">Last Name </label>
            <input type="text" id="alternatePayeeLastName" name="alternatePayeeLastName"
              value={payeeLastName}
              onChange={(e) => setPayeeLastName(e.target.value)}
             className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-gray-900" placeholder='E.g., Smith' />
          </div>
          <div>
            <label htmlFor="alternatePayeeBankName" className="block text-sm font-medium">Bank Name </label>
            <input type="text" id="alternatePayeeBankName" name="alternatePayeeBankName"
              value={payeeBankName}
              onChange={(e) => setPayeeBankName(e.target.value)}
             className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-gray-900" placeholder='E.g., Equity Bank' />
          </div>
          <div>
            <label htmlFor="alternatePayeeAccountNumber" className="block text-sm font-medium">Account No.</label>
            <input type="text" id="alternatePayeeAccountNumber" name="alternatePayeeAccountNumber"
              value={payeeBankAccount}
              onChange={(e) => setPayeeBankAccount(e.target.value)}
             className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-gray-900" placeholder='E.g., 0190123456789' />
          </div>
        </div>
      </FormSection>

      <FormSection title="Dependants">
        {/* Render added dependents */}
        {
          dependents.length > 0 && (
          <div className="my-6 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">First Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Middle Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">D.O.B</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Relationship</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remove</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dependents.map((dependent, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{dependent.dependentFirstName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{dependent.dependentMiddleName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{dependent.dependentLastName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{dependent.dependentGender}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{dependent.dependentDob}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{dependent.dependentRelationship}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <button className='bg-primary text-white p-2 rounded-lg '
                      onClick={() => removeDependent(index)}
                      >Remove</button>
                    </td>
                  </tr>
              ))}
            </tbody>
          </table>
        </div>

            )}

<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label htmlFor="dependentFirstName" className="block text-sm font-medium">First Name</label>
        <input
          type="text"
          id="dependentFirstName"
          name="dependentFirstName"
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-gray-900"
          placeholder="E.g., John"
          value={dependent.dependentFirstName}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label htmlFor="dependentMiddleName" className="block text-sm font-medium">Middle Name</label>
        <input
          type="text"
          id="dependentMiddleName"
          name="dependentMiddleName"
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-gray-900"
          placeholder="E.g., Fred"
          value={dependent.dependentMiddleName}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label htmlFor="dependentLastName" className="block text-sm font-medium">Last Name</label>
        <input
          type="text"
          id="dependentLastName"
          name="dependentLastName"
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-gray-900"
          placeholder="E.g., Smith"
          value={dependent.dependentLastName}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label htmlFor="dependentGender" className="block text-sm font-medium">Gender</label>
        <select
          name="dependentGender"
          id="dependentGender"
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-gray-900"
          value={dependent.dependentGender}
          onChange={handleInputChange}
        >
          <option value="" disabled>Select</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
      </div>
      <div>
        <label htmlFor="dependentDob" className="block text-sm font-medium">Date of Birth</label>
        <input
          type="date"
          id="dependentDob"
          name="dependentDob"
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-gray-900"
          value={dependent.dependentDob}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label htmlFor="dependentRelationship" className="block text-sm font-medium">Relationship</label>
        <input
          type="text"
          id="dependentRelationship"
          name="dependentRelationship"
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-gray-900"
          placeholder="E.g., Daughter"
          value={dependent.dependentRelationship}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <button
          type="button"
          onClick={addDependent}
          className="bg-secondary text-gray-900 py-2 px-4 rounded-md hover:bg-green-300 hover:text-primary transition-colors"
        >
          Add Dependent
        </button>
      </div>
    </div>
      </FormSection>

    {/* submitButton */}
    <div className='flex justify-end'>
    <button className="bg-primary text-secondary py-2 px-4 rounded-md hover:bg-secondary hover:text-gray-900 transition-colors"
    onClick={handleFormSubmit}
    >SUBMIT</button>
    </div>

    </form>
  );
};

export default ApplicationForm;