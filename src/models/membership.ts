export interface PlanProps {
  id: string;
  duration: string;
  price: number;
  originalPrice?: number;
  popular?: boolean;
  features: string[];
}


export interface BenefitProps {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  // add other properties as needed
}

export interface BenefitCardProps {
  benefit: BenefitProps;
}
export interface MembershipState {
  plans: PlanProps[];
  benefits: BenefitProps[];
  loading: boolean;
}