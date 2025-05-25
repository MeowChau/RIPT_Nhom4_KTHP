import Footer from '@/components/Footer';
import RightContent from '@/components/RightContent';
import { notification } from 'antd';
import 'moment/locale/vi';
import type { RequestConfig, RunTimeLayoutConfig } from 'umi';
import { getIntl, getLocale, history } from 'umi';
import type { RequestOptionsInit, ResponseError } from 'umi-request';
import ErrorBoundary from './components/ErrorBoundary';
// import LoadingPage from './components/Loading';
import { OIDCBounder } from './components/OIDCBounder';
import OneSignalBounder from './components/OneSignalBounder';
import TechnicalSupportBounder from './components/TechnicalSupportBounder';
import NotAccessible from './pages/exception/403';
import NotFoundContent from './pages/exception/404';
import type { IInitialState } from './services/base/typing';
import './styles/global.less';
import { currentRole } from './utils/ip';


/**  loading */
export const initialStateConfig = {
  loading: <></>,
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 */
export async function getInitialState(): Promise<IInitialState> {
  // Tạo một đối tượng giả để bypass authentication
  const fakeUser = {
    name: 'Admin',
    avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
    userid: '00000001',
    email: 'admin@example.com',
    signature: '',
    title: 'Admin',
    group: 'Admin Group',
    role: 'admin',
    permissions: ['*'],
    // Add required IUser fields with fake/default values
    sub: 'fake-sub',
    ssoId: 'fake-sso-id',
    email_verified: true,
    realm_access: { roles: ['admin'] },
    preferred_username: 'admin',
    given_name: 'Admin',
    family_name: 'User',
    locale: 'vi',
    picture: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
  };

  // Tự động lưu token giả vào localStorage và sessionStorage
  if (!localStorage.getItem('token') && !sessionStorage.getItem('token')) {
    const fakeToken = 'fake-auth-token';
    localStorage.setItem('token', fakeToken);
    sessionStorage.setItem('token', fakeToken);
    localStorage.setItem('user', JSON.stringify(fakeUser));
    localStorage.setItem('isAdminLoggedIn', 'true');
  }

  return {
    currentUser: fakeUser,
    permissionLoading: false,
    // Các quyền giả để bypass kiểm tra
    authorizedPermissions: [{
      rsname: currentRole || 'admin',
      scopes: ['*'],
      rsid: 'fake-rsid'
    }]
  };
}

// Thêm interceptor để tự động đính kèm token JWT vào header request
const authHeaderInterceptor = (url: string, options: RequestOptionsInit) => {
  // Luôn trả về token giả nếu không có token thật
  const token = localStorage.getItem('token') || 'fake-auth-token';
  
  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
  };
  return {
    options: { ...options, headers },
  };
};

/**
 * @see https://beta-pro.ant.design/docs/request-cn
 */
export const request: RequestConfig = {
  errorHandler: (error: ResponseError) => {
    const { messages } = getIntl(getLocale());
    const { response } = error;

    if (response && response.status) {
      const { status, url } = response;
      const requestErrorMessage = messages['app.request.error'] || 'Lỗi yêu cầu';
      const errorMessage = `${requestErrorMessage} ${status}: ${url}`;
      const errorDescription = messages[`app.request.${status}`] || response.statusText;
      notification.error({
        message: errorMessage,
        description: errorDescription,
      });

      // Comment phần redirect để tránh chuyển hướng khi gặp lỗi 401
      /* if (status === 401) {
        localStorage.removeItem('token');
        history.push('/user/login');
      } */
    }

    if (!response) {
      notification.error({
        description: 'Yêu cầu gặp lỗi',
        message: 'Bạn hãy thử lại sau',
      });
    }
    throw error;
  },
  requestInterceptors: [authHeaderInterceptor],
};

// ProLayout  https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  return {
    unAccessible: (
      <OIDCBounder>
        <TechnicalSupportBounder>
          <NotAccessible />
        </TechnicalSupportBounder>
      </OIDCBounder>
    ),
    noFound: <NotFoundContent />,
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    footerRender: () => <Footer />,
    
    // THAY ĐỔI: Bỏ qua kiểm tra token và chuyển hướng trang login
    onPageChange: () => {
      // Không làm gì, bỏ qua hoàn toàn kiểm tra token
      console.log('Bypass authentication check');
      
      /* COMMENT CODE XÁC THỰC CŨ
      const token = sessionStorage.getItem('token');

      const path = window.location.pathname;
      const unCheckPermissionPaths = ['/user/login'];
      const isUncheckPath = unCheckPermissionPaths.includes(path);

      if (!token && !isUncheckPath) {
        history.push('/user/login');
      }

      // Nếu không có token, không phải trang public, và cũng không phải trang login, thì redirect về login
      if (!token && !isUncheckPath && location.pathname !== '/user/login') {
        console.log('Redirect về /user/login');
        history.push('/user/login');
      }

      // Nếu đã đăng nhập, xử lý phân quyền dựa trên currentRole và authorizedPermissions
      if (token && initialState?.currentUser) {
        if (
          !isUncheckPath &&
          currentRole &&
          initialState?.authorizedPermissions?.length &&
          !initialState?.authorizedPermissions?.find((item) => item.rsname === currentRole)
        ) {
          history.replace('/403');
        }
      }
      */
    },

    menuItemRender: (item: any, dom: any) => (
      <a
        className="not-underline"
        key={item?.path}
        href={item?.path}
        onClick={(e) => {
          e.preventDefault();
          history.push(item?.path ?? '/');
        }}
        style={{ display: 'block' }}
      >
        {dom}
      </a>
    ),

    childrenRender: (dom) => (
      <OIDCBounder>
        <ErrorBoundary>
          {/* <TechnicalSupportBounder> */}
          <OneSignalBounder>{dom}</OneSignalBounder>
          {/* </TechnicalSupportBounder> */}
        </ErrorBoundary>
      </OIDCBounder>
    ),
    menuHeaderRender: undefined,
    ...initialState?.settings,
  };
};