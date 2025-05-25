// src/components/ExpenseInput.tsx
import React from 'react';
import { Input } from 'antd';

interface ExpenseInputProps {
  value: number;
  onChange: (value: number) => void;
}

const ExpenseInput: React.FC<ExpenseInputProps> = ({ value, onChange }) => {
  return <Input value={value} onChange={(e) => onChange(Number(e.target.value))} />;
};

export default ExpenseInput;
