import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/utils/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const user = getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.json();

    // Validate formData (basic validation, you might want to add more comprehensive validation)
    if (!formData.nationalId || !formData.firstName || !formData.lastName || !formData.gender || !formData.dob) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Update User
    const updatedUser = await prisma.user.update({
      where: { nationalId: formData.nationalId },
      data: {
        email: formData.email,
        phone: formData.phone,
        maritalStatus: formData.marital,
        employmentStatus: formData.employment,
        chronicIllness: formData.illness === 'yes',
        disabled: formData.disabled === 'yes',
        sourceOfIncome: formData.income,
        otherAssistance: formData.assistance,
        address: formData.address,
        county: formData.county,
        subCounty: formData.subCounty,
        constituency: formData.constituency,
        ward: formData.ward,
        village: formData.Village,
      },
    });

    // Create or update Application
    const application = await prisma.application.upsert({
      where: { userId: updatedUser.id },
      update: { status: 'Pending' },
      create: {
        userId: updatedUser.id,
        status: 'Pending',
      },
    });

    // Create or update NextOfKin
    await prisma.nextOfKin.upsert({
      where: { userId: updatedUser.id },
      update: {
        firstName: formData.kinFirstName,
        middleName: formData.kinMiddleName,
        lastName: formData.kinLastName,
        relationship: formData.kinRelationship,
        email: formData.kinEmail,
        phone: formData.kinPhone,
      },
      create: {
        userId: updatedUser.id,
        firstName: formData.kinFirstName,
        middleName: formData.kinMiddleName,
        lastName: formData.kinLastName,
        relationship: formData.kinRelationship,
        email: formData.kinEmail,
        phone: formData.kinPhone,
      },
    });

    // Create or update BankDetails
    await prisma.bankDetails.upsert({
      where: { userId: updatedUser.id },
      update: {
        bankName: formData.bankName,
        accountNumber: formData.bankAccount,
      },
      create: {
        userId: updatedUser.id,
        bankName: formData.bankName,
        accountNumber: formData.bankAccount,
      },
    });

    // Create or update AlternatePayee
    await prisma.alternatePayee.upsert({
      where: { userId: updatedUser.id },
      update: {
        firstName: formData.payeeFirstName,
        middleName: formData.payeeMiddleName,
        lastName: formData.payeeLastName,
        bankName: formData.payeeBankName,
        accountNumber: formData.payeeBankAccount,
      },
      create: {
        userId: updatedUser.id,
        firstName: formData.payeeFirstName,
        middleName: formData.payeeMiddleName,
        lastName: formData.payeeLastName,
        bankName: formData.payeeBankName,
        accountNumber: formData.payeeBankAccount,
      },
    });

    // Delete existing dependents and create new ones
    await prisma.dependent.deleteMany({ where: { userId: updatedUser.id } });
    await prisma.dependent.createMany({
      data: formData.dependents.map((dep: any) => ({
        userId: updatedUser.id,
        firstName: dep.dependentFirstName,
        middleName: dep.dependentMiddleName,
        lastName: dep.dependentLastName,
        gender: dep.dependentGender,
        dob: new Date(dep.dependentDob),
        relationship: dep.dependentRelationship,
      })),
    });

    return NextResponse.json({ message: 'Application submitted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error submitting application:', error);
    return NextResponse.json({ error: 'Failed to submit application' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}