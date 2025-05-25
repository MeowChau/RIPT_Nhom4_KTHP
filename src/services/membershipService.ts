import type { PlanProps, BenefitProps } from '../models/membership';

// Mock data - có thể thay thế bằng API call thực tế sau này
export const getMembershipPlans = (): Promise<PlanProps[]> => {
  const plans: PlanProps[] = [
    {
      id: '1month',
      duration: '1 tháng',
      price: 500000,
      features: [
        'Không giới hạn thời gian tập',
        'Tư vấn dinh dưỡng cơ bản',
        'Lịch tập cá nhân',
      ],
    },
    {
      id: '3month',
      duration: '3 tháng',
      price: 1000000,
      originalPrice: 1500000,
      features: [
        'Không giới hạn thời gian tập',
        'Tư vấn dinh dưỡng nâng cao',
        'Lịch tập cá nhân',
        'Hỗ trợ PT 2 buổi/tháng',
      ],
    },
    {
      id: '6month',
      duration: '6 tháng',
      price: 1500000,
      originalPrice: 3000000,
      popular: true,
      features: [
        'Không giới hạn thời gian tập',
        'Tư vấn dinh dưỡng chuyên sâu',
        'Lịch tập cá nhân theo mục tiêu',
        'Hỗ trợ PT 4 buổi/tháng',
        'Đo chỉ số cơ thể định kỳ',
      ],
    },
    {
      id: '12month',
      duration: '12 tháng',
      price: 2000000,
      originalPrice: 6000000,
      features: [
        'Không giới hạn thời gian tập',
        'Tư vấn dinh dưỡng toàn diện',
        'Lịch tập cá nhân theo mục tiêu',
        'Hỗ trợ PT 8 buổi/tháng',
        'Đo chỉ số cơ thể định kỳ',
        'Quà tặng độc quyền',
      ],
    },
  ];
  
  return Promise.resolve(plans);
};

export const getMembershipBenefits = (): Promise<BenefitProps[]> => {
  const benefits: BenefitProps[] = [
    {
      id: 'benefit1',
      icon: 'fire',
      title: 'Thư viện bài tập đa dạng',
      description: 'Hơn 500+ bài tập được phân loại theo nhóm cơ, mức độ, giúp bạn dễ dàng lựa chọn và thực hiện.'
    },
    {
      id: 'benefit2',
      icon: 'thunderbolt',
      title: 'Công cụ tính TDEE',
      description: 'Công cụ tính chỉ số calo chuẩn xác theo cơ thể và mục tiêu, đưa lời khuyên về dinh dưỡng phù hợp.'
    },
    {
      id: 'benefit3',
      icon: 'trophy',
      title: 'Diễn đàn trao đổi riêng',
      description: 'Nơi các hội viên chia sẻ kinh nghiệm, đặt câu hỏi và nhận tư vấn từ chuyên gia.'
    },
  ];
  
  return Promise.resolve(benefits);
};