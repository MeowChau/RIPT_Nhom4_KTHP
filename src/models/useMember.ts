import { useState, useCallback } from 'react';
import { message } from 'antd';
import { memberService, gymService } from '@/services/Member/index';
import type { Member, MemberFormData, Gym } from '@/services/Member/types';

export const useMember = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [currentMember, setCurrentMember] = useState<Member | null>(null);

  // Lấy danh sách hội viên từ API
  const fetchMembers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await memberService.getMembers();
      setMembers(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('Failed to fetch members:', error);
      message.error('Không thể tải danh sách hội viên');
    } finally {
      setLoading(false);
    }
  }, []);

  // Lấy danh sách phòng tập
  const fetchGyms = useCallback(async () => {
    try {
      const response = await gymService.getGyms();
      setGyms(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('Failed to fetch gyms:', error);
      message.error('Không thể tải danh sách phòng tập');
    }
  }, []);

  // Mở modal để thêm/sửa hội viên
  const openEditModal = useCallback((member: Member | null) => {
    setCurrentMember(member);
    setModalVisible(true);
    // Khi mở modal, lấy danh sách phòng tập nếu chưa có
    if (gyms.length === 0) {
      fetchGyms();
    }
  }, [gyms.length, fetchGyms]);

  // Đóng modal
  const closeModal = useCallback(() => {
    setCurrentMember(null);
    setModalVisible(false);
  }, []);

  // Thêm hội viên mới
  const handleAddMember = useCallback(async (data: MemberFormData) => {
    setLoading(true);
    try {
      const response = await memberService.createMember(data);
      message.success('Thêm hội viên thành công');
      closeModal();
      return response;
    } catch (error: any) {
      console.error('Failed to add member:', error);
      message.error(error.response?.data?.message || 'Không thể thêm hội viên');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [closeModal]);

  // Cập nhật thông tin hội viên
  const handleUpdateMember = useCallback(async (id: string, data: Partial<MemberFormData>) => {
    setLoading(true);
    try {
      const response = await memberService.updateMember(id, data);
      message.success('Cập nhật hội viên thành công');
      closeModal();
      return response;
    } catch (error: any) {
      console.error('Failed to update member:', error);
      message.error(error.response?.data?.message || 'Không thể cập nhật thông tin hội viên');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [closeModal]);

  // Xóa hội viên
  const handleDeleteMember = useCallback(async (id: string) => {
    setLoading(true);
    try {
      await memberService.deleteMember(id);
      message.success('Xóa hội viên thành công');
      return true;
    } catch (error) {
      console.error('Failed to delete member:', error);
      message.error('Không thể xóa hội viên');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    members,
    gyms,
    loading,
    modalVisible,
    currentMember,
    fetchMembers,
    fetchGyms,
    openEditModal,
    closeModal,
    handleAddMember,
    handleUpdateMember,
    handleDeleteMember,
  };
};

export default useMember;