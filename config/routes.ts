export default [

  // Trang quản lý Gym
  {
    name: 'Gym',
    path: '/gyms',
    icon: 'shop',
    routes: [
      {
        path: '/gyms',
        exact: true,
        component: './gyms/index',
      },
    ],
  },

  // Trang quản lý Hội viên (Members)
  {
    name: 'Hội viên',
    path: '/members',
    icon: 'team',
    component: './members/index',
  },

   // Menu quản lý huấn luyện viên (PT)
  {
    name: 'Huấn luyện viên',
    path: '/personalTrainers',
    icon: 'user',
    routes: [
      {
        path: '/personalTrainers',
        exact: true,
        component: './personalTrainers/index',
      },
      {
        path: '/personalTrainers/edit',
        exact: true,
        component: './personalTrainers/edit',
        hideInMenu: true,
      },
    ],
  },

   {
    name: 'Thư viện bài tập',
    path: '/exercises',
    icon: 'read',
    routes: [
      {
        path: '/exercises',
        exact: true,
        component: './exercise/index',
      },
      {
        path: '/exercises/edit',
        exact: true,
        component: './exercise/edit',
        hideInMenu: true,
      },
      {
        path: '/exercises/detail',
        exact: true,
        component: './exercise/detail',
        hideInMenu: true,
      }
    ],
  },
  // Menu báo cáo & thống kê
{
  name: 'Báo cáo',
  path: '/reports',
  icon: 'pie-chart',
  component: './reports/index',
},

  // Các route thông báo
  {
    path: '/notification',
    layout: false,
    hideInMenu: true,
    routes: [
      {
        path: '/notification/subscribe',
        exact: true,
        component: './ThongBao/Subscribe',
      },
      {
        path: '/notification/check',
        exact: true,
        component: './ThongBao/Check',
      },
      {
        path: '/notification',
        exact: true,
        component: './ThongBao/NotifOneSignal',
      },
    ],
  },

  // Trang chủ, có thể redirect đến dashboard hoặc gyms
  {
    path: '/',
    redirect: '/gyms',
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
