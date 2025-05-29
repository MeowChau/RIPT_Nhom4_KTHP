declare namespace PT {
  interface Schedule {
    day: string;
    status: 'off' | 'morning' | 'afternoon' | 'on';
  }

  interface PersonalTrainer {
    _id: string;
    name: string;
    gymId: {
      _id: string;
      name: string;
    } | string;
    description: string;
    image?: string;
    schedule: Schedule[];
    createdAt?: string;
    updatedAt?: string;
  }

  interface QueryParams {
    gymId?: string;
  }

  interface CreatePTData {
    name: string;
    gymId: string;
    description: string;
    image?: string;
    schedule?: Schedule[];
  }

  interface UpdatePTData {
    name?: string;
    gymId?: string;
    description?: string;
    image?: string;
    schedule?: Schedule[];
  }

  interface APIResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    errors?: any;
  }
}