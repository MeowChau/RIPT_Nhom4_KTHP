// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import routes from './routes';
import proxy from './proxy';

// Xác định môi trường (dev | test | pre)
const { REACT_APP_ENV = 'dev' } = process.env;
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

  // Inject biến môi trường cho client (bao gồm APP_CONFIG_* và UMI_APP_API_URL)
  define: Object.entries(process.env).reduce((acc, [key, value]) => {
    if (key.startsWith('APP_CONFIG_') || key === 'UMI_APP_API_URL') {
      return {
        ...acc,
        [`process.env.${key}`]: value,
      };
    }
    return acc;
  }, {} as Record<string, any>),
});
