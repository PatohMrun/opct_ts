import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const nationalId = request.nextUrl.searchParams.get('nationalId');

  if (!nationalId) {
    return NextResponse.json({ error: 'National ID is required' }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { nationalId },
      include: {
        governmentRecord: true,
        nextOfKin: true,
        bankDetails: true,
        alternatePayee: true,
        dependents: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userData = {
      nationalId: user.nationalId,
      email: user.email,
      phone: user.phone,
      maritalStatus: user.maritalStatus,
      employmentStatus: user.employmentStatus,
      chronicIllness: user.chronicIllness,
      disabled: user.disabled,
      sourceOfIncome: user.sourceOfIncome,
      otherAssistance: user.otherAssistance,
      address: user.address,
      county: user.county,
      subCounty: user.subCounty,
      constituency: user.constituency,
      ward: user.ward,
      village: user.village,
      governmentRecord: {
        firstName: user.governmentRecord.firstName,
        middleName: user.governmentRecord.middleName,
        lastName: user.governmentRecord.lastName,
        gender: user.governmentRecord.gender,
        dob: user.governmentRecord.dob,
        kraPin: user.governmentRecord.kraPin,
      },
      nextOfKin: user.nextOfKin,
      bankDetails: user.bankDetails,
      alternatePayee: user.alternatePayee,
      dependents: user.dependents,
    };

    return NextResponse.json({ userData });
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();
    
    // Update user data
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

    // Update or create next of kin
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

    // Update or create bank details
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

    // Update or create alternate payee
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

    // Update dependents
    await prisma.dependent.deleteMany({
      where: { userId: updatedUser.id },
    });

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

    // Create or update application
    await prisma.application.upsert({
      where: { userId: updatedUser.id },
      update: {
        status: 'Pending',
        submittedAt: new Date(),
      },
      create: {
        userId: updatedUser.id,
        status: 'Pending',
      },
    });

    return NextResponse.json({ message: 'Application submitted successfully' });
  } catch (error) {
    console.error('Error submitting application:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}