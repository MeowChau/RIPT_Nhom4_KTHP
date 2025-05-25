import React, { useEffect, useState } from 'react';
import { message, Spin } from 'antd';
import SummaryCards from './SummaryCards';
import MembersPieChart from './MembersPieChart';
import PTPieChart from './PTPieChart';
import ExportButton from './ExportButton';
import ActiveMembersChart from './ActiveMembersChart'; // Bổ sung import

const ReportsPage: React.FC = () => {
  const [summary, setSummary] = useState<any>(null);
  const [membersByGym, setMembersByGym] = useState<any[]>([]);
  const [ptsByGym, setPtsByGym] = useState<any[]>([]);

  // Thêm state mới cho active members
  const [activeMembersByGym, setActiveMembersByGym] = useState<any[]>([]);
  const [loadingActiveMembers, setLoadingActiveMembers] = useState(false);

  useEffect(() => {
    fetchSummary();
    fetchMembersByGym();
    fetchPtsByGym();
    fetchActiveMembersByGym(); // Bổ sung gọi fetch
  }, []);

  const fetchSummary = async () => {
    try {
      const res = await fetch('/api/reports/summary');
      if (!res.ok) throw new Error('Failed to fetch summary');
      const data = await res.json();
      setSummary(data);
    } catch {
      message.error('Không tải được báo cáo');
    }
  };

  const fetchMembersByGym = async () => {
    try {
      const res = await fetch('/api/reports/members-by-gym');
      if (!res.ok) throw new Error('Failed to fetch members by gym');
      const data = await res.json();
      setMembersByGym(data);
    } catch {
      message.error('Không tải được dữ liệu hội viên theo cơ sở');
    }
  };

  const fetchPtsByGym = async () => {
    try {
      const res = await fetch('/api/reports/pts-by-gym');
      if (!res.ok) throw new Error('Failed to fetch PT by gym');
      const data = await res.json();
      setPtsByGym(data);
    } catch {
      message.error('Không tải được dữ liệu PT theo cơ sở');
    }
  };

  // Hàm fetch mới cho active members
  const fetchActiveMembersByGym = async () => {
    setLoadingActiveMembers(true);
    try {
      const res = await fetch('/api/reports/active-members-by-gym');
      if (!res.ok) throw new Error('Failed to fetch active members by gym');
      const data = await res.json();
      setActiveMembersByGym(data);
    } catch {
      message.error('Không tải được dữ liệu hội viên hoạt động theo cơ sở');
    } finally {
      setLoadingActiveMembers(false);
    }
  };

  const exportExcel = () => {
    window.open('/api/reports/export-overview', '_blank');
  };

  return (
  <div style={{ padding: 24 }}>
    <h1>Báo cáo & Thống kê</h1>

    <SummaryCards
      gyms={summary?.gyms || 0}
      members={summary?.members || 0}
      personalTrainers={summary?.personalTrainers || 0}
      totalEquipment={summary?.totalEquipment || 0}
      totalRevenue={summary?.totalRevenue || 0}
    />
    <ExportButton onClick={exportExcel} />
    <MembersPieChart data={membersByGym} />
    <PTPieChart data={ptsByGym} />

    {/* Hiển thị biểu đồ active members có loading */}
    {loadingActiveMembers ? (
      <Spin tip="Đang tải dữ liệu..." />
    ) : activeMembersByGym.length > 0 ? (
      <ActiveMembersChart data={activeMembersByGym} />
    ) : (
      <div style={{ textAlign: 'center', padding: 20, color: '#999' }}>
        Không có dữ liệu hội viên hoạt động để hiển thị
      </div>
    )}
  </div>
);
};

export default ReportsPage;
