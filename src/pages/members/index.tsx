import React, { useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import MemberTable from './components/MemberTable'; // Sửa lại import này
import MemberForm from './components/MemberForm';
import useMember from '@/models/useMember';

const MembersPage: React.FC = () => {
  // Sử dụng custom hook để quản lý state và logic
  const { 
    members,
    gyms,
    loading,
    modalVisible,
    currentMember,
    fetchMembers,
    openEditModal,
    closeModal,
    handleAddMember,
    handleUpdateMember,
    handleDeleteMember,
  } = useMember();

  // Chỉ gọi fetchMembers một lần khi component được mount
  useEffect(() => {
    fetchMembers();
  }, []); // Bỏ fetchMembers khỏi dependencies để tránh vòng lặp vô hạn

  // Xử lý khi submit form (cả thêm mới và cập nhật)
  const handleSubmit = async (values: any) => {
    try {
      if (currentMember) {
        // Cập nhật hội viên
        await handleUpdateMember(currentMember._id, values);
      } else {
        // Thêm mới hội viên
        await handleAddMember(values);
      }
      // Tải lại danh sách hội viên sau khi thêm/cập nhật thành công
      fetchMembers();
      return true; // Trả về true để form biết submit thành công
    } catch (error) {
      console.error('Failed to save member:', error);
      return false; // Trả về false để form biết có lỗi
    }
  };

  return (
    <PageContainer 
      title="Quản lý Hội viên"
      extra={[
        <Button 
          key="add"
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => openEditModal(null)}
        >
          Thêm hội viên mới
        </Button>
      ]}
    >
      <MemberTable
        dataSource={members}
        loading={loading}
        onEdit={openEditModal}
        onDelete={async (id) => {
          const success = await handleDeleteMember(id);
          if (success) {
            // Tải lại danh sách sau khi xóa
            fetchMembers();
          }
          return success;
        }}
      />

      <MemberForm
        visible={modalVisible}
        onCancel={closeModal}
        onSubmit={handleSubmit}
        initialValues={currentMember}
        gyms={gyms}
      />
    </PageContainer>
  );
};

export default MembersPage;