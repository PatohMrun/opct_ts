import { NextResponse } from "next/server";
import {
  ApprovedPerson,
  NotApprovedPerson,
  PendingApprovalPerson,
} from "@/app/admin/export/page";
import prisma from "@/utils/prisma";

export async function GET() {
  // Fetch users who have applied
  const usersWhoHaveApplied = await prisma.user.findMany({
    where: {
      application: {
        isNot: null,
      },
    },
    include: {
      application: true,
    },
  });

  // Filter users based on application status
  const approvedUserNationalIds = usersWhoHaveApplied
    .filter((user) => user.application?.status === "Approved")
    .map((user) => user.nationalId);
  const rejectedUserNationalIds = usersWhoHaveApplied
    .filter((user) => user.application?.status === "Rejected")
    .map((user) => user.nationalId);
  const pendingUserNationalIds = usersWhoHaveApplied
    .filter((user) => user.application?.status === "Pending")
    .map((user) => user.nationalId);

  // Fetch details from GovernmentRecord based on national IDs
  const approvedRecords = await prisma.governmentRecord.findMany({
    where: {
      nationalId: { in: approvedUserNationalIds },
    },
    include: {
      user: {
        include: {
          bankDetails: true,
        },
      },
    },
  });

  const rejectedRecords = await prisma.governmentRecord.findMany({
    where: {
      nationalId: { in: rejectedUserNationalIds },
    },
    include: {
      user: {
        include: {
          bankDetails: true,
        },
      },
    },
  });

  const pendingRecords = await prisma.governmentRecord.findMany({
    where: {
      nationalId: { in: pendingUserNationalIds },
    },
    include: {
      user: {
        include: {
          bankDetails: true,
          application: {
            select: {
              submittedAt: true,
            },
          },
        },
      },
    },
  });

  // Structure data into the appropriate types
  const approvedPersons: ApprovedPerson[] = approvedRecords.map((record) => ({
    id: record.user?.id ?? NaN,
    name: `${record.firstName} ${record.middleName ?? ""} ${
      record.lastName
    }`.trim(),
    nationalId: record.nationalId,
    bankDetails: "",
    alternatePayerBankDetails: `${record.user?.bankDetails?.bankName ?? ""} ${
      record.user?.bankDetails?.accountNumber ?? ""
    }`,
    phoneNumber: record.user?.phone ?? "",
  }));

  const rejectedPersons: NotApprovedPerson[] = rejectedRecords.map(
    (record) => ({
      id: record.user?.id ?? NaN,
      name: `${record.firstName} ${record.middleName ?? ""} ${
        record.lastName
      }`.trim(),
      nationalId: record.nationalId,
      email: record.user?.email ?? "",
      deathCertNo: record.deathCertNo ?? "",
    })
  );

  const pendingApprovalPersons: PendingApprovalPerson[] = pendingRecords.map(
    (record) => ({
      id: record.user?.id ?? NaN,
      name: `${record.firstName} ${record.middleName ?? ""} ${
        record.lastName
      }`.trim(),
      nationalId: record.nationalId,
      applicationDate:
        record.user?.application?.submittedAt.toISOString() ?? "", // Adjust format as needed
    })
  );

  // Return the response with structured data
  return NextResponse.json({
    approved: approvedPersons,
    rejected: rejectedPersons,
    pending: pendingApprovalPersons,
  });
}
