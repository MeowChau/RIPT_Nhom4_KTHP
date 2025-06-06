import React, { useEffect } from 'react';
import {
  Modal,
  Form,
  Input,
  Upload,
  TimePicker,
  Space,
  InputNumber,
  Button,
  Switch,
} from 'antd';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import moment from 'moment';

const daysOfWeek = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const AddGymForm: React.FC<{
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  initialValues?: any;
}> = ({ visible, onCancel, onSubmit, initialValues }) => {
  const [form] = Form.useForm();

  useEffect(() => {
  if (initialValues) {
    const workingHoursValues: any = {};
    daysOfWeek.forEach((day) => {
      const wh = initialValues.workingHours?.[day];
      if (wh) {
        workingHoursValues[`workingHours_${day}`] = [
          wh.open ? moment(wh.open, 'HH:mm') : null,
          wh.close ? moment(wh.close, 'HH:mm') : null,
        ];
        workingHoursValues[`active_${day}`] = wh.active ?? true;
      } else {
        workingHoursValues[`workingHours_${day}`] = null;
        workingHoursValues[`active_${day}`] = false;
      }
    });

    const imageUploadValue = initialValues.image
      ? [
          {
            uid: '-1',
            name: 'image',
            status: 'done',
            url: initialValues.image,
          },
        ]
      : [];

    const equipmentValues = (initialValues.equipment || []).map((eq: any) => ({
      ...eq,
      imageUpload: eq.image
        ? [
            {
              uid: '-1',
              name: 'image',
              status: 'done',
              url: eq.image,
            },
          ]
        : [],
      imageUrl: '',
    }));

    form.setFieldsValue({
      ...initialValues,
      imageUpload: imageUploadValue,
      equipment: equipmentValues.length ? equipmentValues : [{}],
      ...workingHoursValues,
    });
  } else {
    form.resetFields();
    form.setFieldsValue({ equipment: [{}] });
    const defaultHours: any = {};
    daysOfWeek.forEach((day) => {
      defaultHours[`workingHours_${day}`] = null;
      defaultHours[`active_${day}`] = false;
    });
    form.setFieldsValue(defaultHours);
  }
}, [initialValues, form]);

  const getBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      let image = '';
      if (values.imageUpload && values.imageUpload.length > 0) {
        const file = values.imageUpload[0].originFileObj;
        if (file) {
          image = await getBase64(file);
        } else if (values.imageUpload[0].url) {
          image = values.imageUpload[0].url;
        }
      }

      const workingHours: Record<string, { open: string; close: string; active: boolean }> = {};
      daysOfWeek.forEach((day) => {
  const range = values[`workingHours_${day}`];
  const active = values[`active_${day}`] ?? false;
  if (active && range && range.length === 2) {
    workingHours[day] = {
      open: range[0].format('HH:mm'),
      close: range[1].format('HH:mm'),
      active,
    };
  } else {
    workingHours[day] = {
      open: '',
      close: '',
      active,
    };
  }
});

      const equipment = await Promise.all(
        (values.equipment || []).map(async (eq: any) => {
          let eqImage = '';
          if (eq.imageUpload && eq.imageUpload.length > 0) {
            const file = eq.imageUpload[0].originFileObj;
            if (file) {
              eqImage = await getBase64(file);
            } else if (eq.imageUpload[0].url) {
              eqImage = eq.imageUpload[0].url;
            }
          }
          return {
            name: eq.name,
            quantity: eq.quantity,
            image: eqImage,
          };
        }),
      );

      const gymData = {
        ...values,
        workingHours,
        image,
        equipment,
      };
      console.log('Dữ liệu gửi lên backend (gymData):', gymData);  // <-- Thêm dòng này để kiểm tra
      onSubmit(gymData);
      form.resetFields();
    } catch (error) {
      console.log('Validate Failed:', error);
    }
  };

  return (
    <Modal
      visible={visible}
      title={initialValues ? 'Sửa cơ sở Gym' : 'Thêm cơ sở Gym'}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      onOk={handleOk}
      width={800}
      destroyOnClose
    >
      <Form form={form} layout="vertical" initialValues={{ equipment: [{}] }}>
        <Form.Item
          name="name"
          label="Tên cơ sở"
          rules={[{ required: true, message: 'Vui lòng nhập tên cơ sở' }]}
        >
          <Input />
        </Form.Item>

        {/* Chỉ giữ phần Upload ảnh cơ sở */}
        <Form.Item
          label="Upload ảnh cơ sở"
          name="imageUpload"
          valuePropName="fileList"
          getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
          rules={[
            {
              required: true,
              message: 'Vui lòng upload ảnh',
            },
          ]}
        >
          <Upload listType="picture" maxCount={1} beforeUpload={() => false}>
            <Button icon={<UploadOutlined />}>Chọn ảnh từ máy</Button>
          </Upload>
        </Form.Item>

        <Form.Item
          name="address"
          label="Địa chỉ"
          rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="area"
          label="Diện tích (m²)"
          rules={[{ required: true, message: 'Vui lòng nhập diện tích' }]}
        >
          <InputNumber min={1} style={{ width: '100%' }} />
        </Form.Item>

        <h3>Giờ hoạt động theo ngày (có thể bật/tắt)</h3>
        {daysOfWeek.map((day) => (
          <Space
            key={day}
            style={{ display: 'flex', marginBottom: 8 }}
            align="baseline"
          >
            <Form.Item
              name={`workingHours_${day}`}
              label={day}
              dependencies={[`active_${day}`]}
              rules={[
                {
                  validator(_, value) {
                    const active = form.getFieldValue(`active_${day}`);
                    if (!active) {
                      return Promise.resolve();
                    }
                    if (!value || value.length !== 2) {
                      return Promise.reject(
                        new Error('Vui lòng chọn giờ hoạt động'),
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
              style={{ flex: 1 }}
            >
              <TimePicker.RangePicker format="HH:mm" />
            </Form.Item>

            <Form.Item
              name={`active_${day}`}
              valuePropName="checked"
              style={{ marginLeft: 8 }}
            >
              <Switch checkedChildren="ON" unCheckedChildren="OFF" />
            </Form.Item>
          </Space>
        ))}

        <h3>Danh sách dụng cụ</h3>
        <Form.List name="equipment">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space
                  key={key}
                  style={{ display: 'flex', marginBottom: 8 }}
                  align="baseline"
                >
                  <Form.Item
                    {...restField}
                    name={[name, 'name']}
                    rules={[{ required: true, message: 'Nhập tên dụng cụ' }]}
                  >
                    <Input placeholder="Tên dụng cụ" />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, 'quantity']}
                    rules={[{ required: true, message: 'Nhập số lượng' }]}
                  >
                    <InputNumber min={1} placeholder="Số lượng" />
                  </Form.Item>

                  {/* Chỉ giữ phần Upload ảnh dụng cụ */}
                  <Form.Item
                    {...restField}
                    label="Upload ảnh dụng cụ"
                    name={[name, 'imageUpload']}
                    valuePropName="fileList"
                    getValueFromEvent={(e) =>
                      Array.isArray(e) ? e : e?.fileList
                    }
                    rules={[
                      {
                        required: true,
                        message: 'Vui lòng upload ảnh',
                      },
                    ]}
                  >
                    <Upload listType="picture" maxCount={1} beforeUpload={() => false}>
                      <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                    </Upload>
                  </Form.Item>

                  <Button type="link" danger onClick={() => remove(name)}>
                    Xóa
                  </Button>
                </Space>
              ))}

              <Form.Item>
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  Thêm dụng cụ mới
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form>
    </Modal>
  );
};

export default AddGymForm;
