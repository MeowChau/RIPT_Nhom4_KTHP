// src/components/ProfitColumn.tsx

type PackageType = '1 month' | '3 months' | '6 months' | '12 months';

interface ProfitColumnProps {
  packageType: PackageType;
  memberCount: number;
  expenses: {
    rent: number;
    salaries: number;
    maintenance: number;
    marketing: number;
  };
  pricing: Record<string, number>;
}

const ProfitColumn: React.FC<ProfitColumnProps> = ({ packageType, memberCount, expenses }) => {
  const membershipPricing: Record<PackageType, number> = {
    '1 month': 500,
    '3 months': 1000,
    '6 months': 1500,
    '12 months': 2000,
  };

  const membershipCost = membershipPricing[packageType];
  const totalRevenue = membershipCost * memberCount;
  const totalExpenses = expenses.rent + expenses.salaries + expenses.maintenance + expenses.marketing;
  const profit = totalRevenue - totalExpenses;

  return (
    <span style={{ color: profit < 0 ? 'red' : 'green' }}>
      {profit.toLocaleString()}
    </span>
  );
};

export default ProfitColumn;
