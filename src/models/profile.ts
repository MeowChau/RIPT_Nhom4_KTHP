import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import { history } from 'umi';
import { getMemberById, updateMember, getGymById, renewMembership } from '@/services/Member/index';
import moment from 'moment';

export interface ProfileState {
  loading: boolean;
  submitting: boolean;
  error: string | null;
  memberData: MemberAPI.MemberData | null;
  gymData: MemberAPI.GymData | null;
}

export default function useProfile(userId?: string) {
  const [state, setState] = useState<ProfileState>({
    loading: true,
    submitting: false,
    error: null,
    memberData: null,
    gymData: null,
  });

  // Lấy userId từ localStorage nếu không được truyền vào
  const getUserId = useCallback((): string | null => {
    if (userId) return userId;
    
    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      return userData.id || userData._id || null;
    } catch (e) {
      return null;
    }
  }, [userId]);
  
  // Thêm function logout
  const logout = useCallback(() => {
    try {
      // Xóa token và thông tin người dùng khỏi localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Reset state
      setState({
        loading: false,
        submitting: false,
        error: null,
        memberData: null,
        gymData: null,
      });
      
      // Hiển thị thông báo thành công
      message.success('Đăng xuất thành công');
      
      // Chuyển hướng về trang đăng nhập
      history.push('/user/login');
    } catch (error) {
      console.error('Lỗi khi đăng xuất:', error);
      message.error('Có lỗi xảy ra khi đăng xuất');
    }
  }, []);
  
  // Lấy thông tin hội viên
  const fetchMemberData = useCallback(async () => {
    const id = getUserId();
    if (!id) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Không tìm thấy thông tin người dùng',
      }));
      return;
    }

    try {
      setState(prev => ({ ...prev, loading: true }));
      const memberData = await getMemberById(id);
      
      // Cập nhật state với dữ liệu hội viên
      setState(prev => ({
        ...prev,
        memberData,
        loading: false,
      }));

      // Lấy thông tin gym nếu có gymId
      if (memberData.gymId) {
        try {
          const gymData = await getGymById(memberData.gymId);
          setState(prev => ({
            ...prev,
            gymData,
          }));
        } catch (error) {
          console.error('Lỗi khi lấy thông tin gym:', error);
        }
      }
    } catch (error) {
      console.error('Lỗi khi lấy thông tin hội viên:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Có lỗi xảy ra khi tải thông tin',
      }));
    }
  }, [getUserId]);

  // Cập nhật thông tin hội viên
  const updateMemberData = useCallback(async (data: MemberAPI.UpdateMemberParams) => {
    const id = getUserId();
    if (!id) {
      message.error('Không tìm thấy thông tin người dùng');
      return false;
    }

    try {
      setState(prev => ({ ...prev, submitting: true }));
      
      // Format startDate nếu có
      const formattedData = {
        ...data,
        startDate: data.startDate && moment.isMoment(data.startDate) 
          ? data.startDate.format('YYYY-MM-DD') 
          : data.startDate,
      };
      
      const result = await updateMember(id, formattedData);
      
      // Cập nhật state với dữ liệu mới
      setState(prev => ({
        ...prev,
        memberData: result,
        submitting: false,
      }));
      
      // Cập nhật thông tin user trong localStorage
      try {
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        localStorage.setItem('user', JSON.stringify({
          ...currentUser,
          name: result.name,
          email: result.email,
          phone: result.phone
        }));
      } catch (e) {
        console.error('Lỗi khi cập nhật localStorage:', e);
      }
      
      message.success('Cập nhật thông tin thành công');
      return true;
    } catch (error) {
      console.error('Lỗi khi cập nhật thông tin:', error);
      
      if (
        typeof error === 'object' &&
        error !== null &&
        'response' in error &&
        (error as any).response?.data?.message
      ) {
        message.error((error as any).response.data.message);
      } else {
        message.error('Có lỗi xảy ra khi cập nhật thông tin');
      }
      
      setState(prev => ({
        ...prev,
        submitting: false,
      }));
      return false;
    }
  }, [getUserId]);

  // Gia hạn gói tập
  const renewMembershipData = useCallback(async (
    packageName: string, 
    startDate: moment.Moment
  ) => {
    const id = getUserId();
    if (!id) {
      message.error('Không tìm thấy thông tin người dùng');
      return false;
    }

    try {
      setState(prev => ({ ...prev, submitting: true }));
      // Chuẩn bị dữ liệu gia hạn
      const renewalData: MemberAPI.RenewMembershipParams = {
        membershipPackage: packageName,
        startDate: startDate.format('YYYY-MM-DD'),
        renewalHistory: [
          ...(state.memberData?.renewalHistory || []),
          {
            date: new Date().toISOString(),
            package: packageName,
            status: 'active'
          }
        ]
      };
      
      const result = await renewMembership(id, renewalData);
      
      // Cập nhật state với dữ liệu mới
      setState(prev => ({
        ...prev,
        memberData: result,
        submitting: false,
      }));
      
      message.success('Gia hạn gói tập thành công');
      return true;
    } catch (error) {
      console.error('Lỗi khi gia hạn gói tập:', error);
      
      if (
        typeof error === 'object' &&
        error !== null &&
        'response' in error &&
        (error as any).response?.data?.message
      ) {
        message.error((error as any).response.data.message);
      } else {
        message.error('Có lỗi xảy ra khi gia hạn gói tập');
      }
      
      setState(prev => ({
        ...prev,
        submitting: false,
      }));
      return false;
    }
  }, [getUserId, state.memberData]);

  // Lấy dữ liệu khi component mount
  useEffect(() => {
    fetchMemberData();
  }, [fetchMemberData]);

  // Trả về state và các methods
  return {
    ...state,
    fetchMemberData,
    updateMemberData,
    renewMembershipData,
    logout, // Thêm function logout vào return
  };
}