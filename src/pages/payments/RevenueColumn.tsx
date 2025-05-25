// src/components/RevenueColumn.tsx
import React from 'react';

type PackageType = '1 month' | '3 months' | '6 months' | '12 months';

interface RevenueColumnProps {
  packageType: PackageType;
  memberCount: number;
  pricing: Record<string, number>;
}

const RevenueColumn: React.FC<RevenueColumnProps> = ({ packageType, memberCount }) => {
  const membershipPricing: Record<PackageType, number> = {
    '1 month': 500,
    '3 months': 1000,
    '6 months': 1500,
    '12 months': 2000,
  };

  const membershipCost = membershipPricing[packageType];
  const totalRevenue = membershipCost * memberCount;

  return <span>{totalRevenue.toLocaleString()}</span>;
};

export default RevenueColumn;
