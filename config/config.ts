// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import routes from './routes';
import proxy from './proxy';

// Môi trường (dev/test/prod)
const { REACT_APP_ENV = 'dev' } = process.env;

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

  // Cấu hình proxy để chuyển /api sang backend
  proxy: proxy[REACT_APP_ENV],

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

  // Inject biến môi trường cho client
  define: {
    'process.env.UMI_APP_API_URL': process.env.UMI_APP_API_URL,
  },
});
