
export default [
	

	///////////////////////////////////
	// DEFAULT MENU
 {
    path: '/',
    name: 'Trang chủ',
    icon: 'home',
    component: './TrangChu/index',
  },
{
	path: '/gym',
	name: 'Cơ sở gym',
	icon: 'bank',
	component: './Gym/index',
},

 {
    path: '/gym/:id',
    component: './Gym/id',
    // Thêm dòng này nếu không muốn hiển thị trên menu
    hideInMenu: true,
  },

  {
    path: '/pt',
    name: 'Huấn luyện viên',
    icon: 'team', // hoặc bất kỳ icon nào khác phù hợp
    component: './PTList/index',
},

	{
    path: '/user',
    name: 'Tài khoản',
    icon: 'user',
    routes: [
       {
        path: '/user/login',
        name: 'Đăng nhập',
        icon: 'login',
        component: './user/Login',
        access: 'canSeeLoginPage', // Sử dụng access để kiểm soát
      },
      {
        path: '/user/register',
        name: 'Đăng ký',
        icon: 'user-add',
        component: './user/Register',
        access: 'canSeeRegisterPage', // Sử dụng access để kiểm soát
      },
      {
        path: '/user/profile',
        name: 'Thông tin cá nhân',
        icon: 'idcard',
        component: './Profile/index',
        wrappers: ['@/wrappers/auth'],
        access: 'canSeeProfilePage', // Sử dụng access để kiểm soát
      },
	  {
  		path: '/user/tdee',
  		name: 'BMI - TDEE',
  		icon: 'calculator',
  		component: './TDEE/index',
  		wrappers: ['@/wrappers/auth'],
  		access: 'canSeeTDEEPage',
		},
		{
  		path: '/user/forum',
  		name: 'Diễn đàn',
  		icon: 'message',
  		component: './Forum/index',
  		wrappers: ['@/wrappers/auth'],
  		access: 'canSeeForumPage',
		},
		 {
    	path: '/user/forum/bai-viet',
    	component: './Forum/bai-viet/index',
    	// Thêm dòng này nếu không muốn hiển thị trên menu
    	hideInMenu: true,
		wrappers: ['@/wrappers/auth'],
 		 },
		 {
  		path: '/user/forum/bai-viet/:id',
 		component: './Forum/components/ChiTietBaiViet',
  		// Thêm dòng này nếu không muốn hiển thị trên menu
  		hideInMenu: true,
  		wrappers: ['@/wrappers/auth'],
		},
		 {
  		path: '/user/AI',
		name: 'AI tư vấn',
 		component: './AI/index',
  		// Thêm dòng này nếu không muốn hiển thị trên menu
  		wrappers: ['@/wrappers/auth'],
		access: 'canSeeAIPage',
		},
		{
		path: '/user/Exercise',
		name: 'Thư viện bài tập',
		icon: 'book',
		component: './Exercise/index',
		wrappers: ['@/wrappers/auth'],
		access: 'canSeeExercisePage',
		},
        {
            path: '/user',
            redirect: '/user/login',
        },
	],
},
	// DANH MUC HE THONG
	// {
	// 	name: 'DanhMuc',
	// 	path: '/danh-muc',
	// 	icon: 'copy',
	// 	routes: [
	// 		{
	// 			name: 'ChucVu',
	// 			path: 'chuc-vu',
	// 			component: './DanhMuc/ChucVu',
	// 		},
	// 	],
	// },

	{
		path: '/notification',
		routes: [
			{
				path: './subscribe',
				exact: true,
				component: './ThongBao/Subscribe',
			},
			{
				path: './check',
				exact: true,
				component: './ThongBao/Check',
			},
			{
				path: './',
				exact: true,
				component: './ThongBao/NotifOneSignal',
			},
		],
		layout: false,
		hideInMenu: true,
	},
	{
		path: '/',
	},
	{
		path: '/403',
		component: './exception/403/403Page',
		layout: false,
	},
	{
		path: '/hold-on',
		component: './exception/DangCapNhat',
		layout: false,
	},
	{
		component: './exception/404',
	},
];
