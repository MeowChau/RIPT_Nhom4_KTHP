// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import routes from './routes';
import proxy from './proxy';

// Xác định môi trường (dev | test | pre)
const { REACT_APP_ENV = 'dev' } = process.env;
// Đảm bảo kiểu an toàn khi truy cập proxy
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

  // Inject biến môi trường cho client
  define: {
    'process.env.UMI_APP_API_URL': process.env.UMI_APP_API_URL,
  },
});
