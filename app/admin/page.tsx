import { ApplicationStatus, PrismaClient } from '@prisma/client';
import Applications from '../../components/admin/applications';
import Dashboard from '../../components/admin/dashboard';

const prisma = new PrismaClient();

async function getApplicationData() {
  const currentYear = new Date().getFullYear();

  const applications = await prisma.application.findMany({
    include: {
      user: {
        include: {
          governmentRecord: true,
          dependents: true,
          nextOfKin: true,
          bankDetails: true,
          alternatePayee: true,
        },
      },
    },
  });

  const applicationData = applications.map(app => ({
    id: app.id.toString(),
    firstName: app.user.governmentRecord.firstName,
    middleName: app.user.governmentRecord.middleName || '',
    lastName: app.user.governmentRecord.lastName,
    gender: app.user.governmentRecord.gender,
    dob: app.user.governmentRecord.dob.toISOString().split('T')[0],
    nationalId: app.user.nationalId,
    kra: app.user.governmentRecord.kraPin || '',
    marital: app.user.maritalStatus,
    email: app.user.email || '',
    phone: app.user.phone || '',
    address: app.user.address || '',
    county: app.user.county,
    subCounty: app.user.subCounty,
    constituency: app.user.constituency,
    ward: app.user.ward,
    location: app.user.governmentRecord.location,
    subLocation: app.user.governmentRecord.sublocation,
    village: app.user.village,
    income: app.user.sourceOfIncome || '',
    employment: app.user.employmentStatus,
    assistance: app.user.otherAssistance || '',
    illness: app.user.chronicIllness ? 'Yes' : 'No',
    disabled: app.user.disabled ? 'Yes' : 'No',
    kinFirstName: app.user.nextOfKin?.firstName || '',
    kinMiddleName: app.user.nextOfKin?.middleName || '',
    kinLastName: app.user.nextOfKin?.lastName || '',
    kinRelationship: app.user.nextOfKin?.relationship || '',
    kinEmail: app.user.nextOfKin?.email || '',
    kinPhone: app.user.nextOfKin?.phone || '',
    bankName: app.user.bankDetails?.bankName || '',
    bankAccount: app.user.bankDetails?.accountNumber || '',
    payeeFirstName: app.user.alternatePayee?.firstName || '',
    payeeMiddleName: app.user.alternatePayee?.middleName || '',
    payeeLastName: app.user.alternatePayee?.lastName || '',
    payeeBankName: app.user.alternatePayee?.bankName || '',
    payeeBankAccount: app.user.alternatePayee?.accountNumber || '',
    dependents: app.user.dependents.map(dep => ({
      dependentFirstName: dep.firstName,
      dependentMiddleName: dep.middleName || '',
      dependentLastName: dep.lastName,
      dependentGender: dep.gender,
      dependentDob: dep.dob.toISOString().split('T')[0],
      dependentRelationship: dep.relationship,
    })),
    status: app.status.toLowerCase() as 'pending' | 'approved' | 'rejected',
    isDeceased: !!app.user.governmentRecord.deathCertNo,
  }));

  const pendingApprovals = applications.filter(app => app.status === 'PENDING' as ApplicationStatus).length;
  const approvedApplicants = applications.filter(app => app.status === 'APPROVED' as ApplicationStatus).length;

  const annualApplicantTrendData = await prisma.application.groupBy({
    by: ['submittedAt'],
    _count: {
      id: true,
    },
  });

  const trendData = Array.from({ length: 5 }, (_, i) => {
    const year = currentYear - i;
    const newApplicants = annualApplicantTrendData
      .filter(data => new Date(data.submittedAt).getFullYear() === year)
      .reduce((sum, data) => sum + data._count.id, 0);

    const removedApplicants = applications.filter(
      app => app.user.governmentRecord.deathCertNo &&
              new Date(app.user.governmentRecord.deathCertNo).getFullYear() === year
    ).length;

    return { year, newApplicants, removedApplicants };
  }).reverse();

  return {
    applicationData,
    pendingApprovals,
    approvedApplicants,
    annualApplicantTrendData: trendData,
  };
}

export default async function ApplicationDashboard() {
  const { applicationData, pendingApprovals, approvedApplicants, annualApplicantTrendData } = await getApplicationData();

  return (
    <div>
      <Dashboard
        pendingApprovals={pendingApprovals}
        approvedApplicants={approvedApplicants}
        annualApplicantTrendData={annualApplicantTrendData}
      />
      <Applications applicationData={applicationData} />
    </div>
  );
}