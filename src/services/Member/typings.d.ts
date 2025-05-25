declare namespace MemberAPI {
  interface RenewalRecord {
    date: string;
    package: string;
    status: string;
  }

  interface MemberData {
    _id: string;
    name: string;
    email: string;
    phone: string;
    gymId: string;
    membershipPackage: string;
    startDate: string;
    endDate: string;
    renewalHistory: RenewalRecord[];
    role: 'user' | 'admin' | 'trainer';
  }

  interface UpdateMemberParams {
    name?: string;
    email?: string;
    phone?: string;
    gymId?: string;
    membershipPackage?: string;
    startDate?: string;
    password?: string;
  }

  interface RenewMembershipParams {
    membershipPackage: string;
    startDate: string;
    renewalHistory: RenewalRecord[];
  }

  interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
  }

  interface GymData {
    _id: string;
    name: string;
    address: string;
    description?: string;
    imageUrl?: string;
  }
}