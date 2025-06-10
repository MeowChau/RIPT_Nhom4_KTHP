// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import routes from './routes';
import proxy from './proxy';

// Xác định môi trường (dev | test | pre)
const { 
  REACT_APP_ENV = 'dev', 
  UMI_APP_API_URL = '', 
  APP_CONFIG_TEN_TRUONG = '', 
  APP_CONFIG_TEN_TRUONG_VIET_TAT_TIENG_ANH = '', 
  APP_CONFIG_TIEN_TO_TRUONG = '',
  APP_CONFIG_TITLE_CONNECT = 'Connect' // Thêm biến này với giá trị mặc định
} = process.env;
// Kiểu an toàn cho proxy keys
type ProxyEnv = keyof typeof proxy;
const env = REACT_APP_ENV as ProxyEnv;

export default defineConfig({
  hash: true,
  antd: {},
  dva: { hmr: true },
  layout: {
    locale: true,
    ...defaultSettings,
  },
  locale: {
    default: 'vi-VN',
    antd: true,
    baseNavigator: false,
  },
  dynamicImport: {
    loading: '@ant-design/pro-layout/es/PageLoading',
  },
  targets: { ie: 11 },
  routes,

  // Proxy: tự chọn config theo môi trường
  proxy: proxy[env],

  // Theme cho antd
  theme: {
    'primary-color': defaultSettings.primaryColor,
    'border-radius-base': defaultSettings.borderRadiusBase,
  },

  esbuild: {},
  title: false,
  ignoreMomentLocale: true,
  manifest: { basePath: '/' },
  fastRefresh: {},
  nodeModulesTransform: { type: 'none' },
  webpack5: {},
  exportStatic: {},

  // Inject biến môi trường cho client và document.ejs
  define: {
    // Các biến cấu hình trường học
    APP_CONFIG_TEN_TRUONG: APP_CONFIG_TEN_TRUONG,
    APP_CONFIG_TEN_TRUONG_VIET_TAT_TIENG_ANH: APP_CONFIG_TEN_TRUONG_VIET_TAT_TIENG_ANH,
    APP_CONFIG_TIEN_TO_TRUONG: APP_CONFIG_TIEN_TO_TRUONG,
    // Biến API URL
    UMI_APP_API_URL: UMI_APP_API_URL,
    // Thêm biến bị thiếu
    APP_CONFIG_TITLE_CONNECT: APP_CONFIG_TITLE_CONNECT,
  },
});