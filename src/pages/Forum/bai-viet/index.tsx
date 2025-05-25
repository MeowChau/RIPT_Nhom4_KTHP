import { PageContainer } from '@ant-design/pro-layout';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { history } from 'umi';
import FormTaoBaiViet from '@/pages/Forum/components/FormTaoBaiViet';
import useBaiViet from '@/models/forum/useBaiViet';

export default () => {
  const { taoBaiVietMoi, dangTai } = useBaiViet();
  
  return (
    <PageContainer
      header={{
        title: 'Tạo bài viết mới',
        onBack: () => history.push('/user/forum'),
        backIcon: <ArrowLeftOutlined />
      }}
    >
      <FormTaoBaiViet 
        onSubmit={async (values) => {
          console.log('Đang tạo bài viết:', values);
          const result = await taoBaiVietMoi(values);
          console.log('Kết quả tạo bài viết:', result);
          return result;
        }}
        dangTai={dangTai}
      />
    </PageContainer>
  );
};