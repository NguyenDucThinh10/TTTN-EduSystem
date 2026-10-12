/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from 'react';
import { CalendarOutlined, DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, message, Modal, Popconfirm, Select, Space, Table, Tag, TimePicker, Typography } from 'antd';
import dayjs from 'dayjs';
import axiosClient from '../api/axiosClient';

const { Title, Text } = Typography;
const { Option } = Select;

const dayOptions = [
  { value: 'MONDAY', label: 'Thứ 2' },
  { value: 'TUESDAY', label: 'Thứ 3' },
  { value: 'WEDNESDAY', label: 'Thứ 4' },
  { value: 'THURSDAY', label: 'Thứ 5' },
  { value: 'FRIDAY', label: 'Thứ 6' },
  { value: 'SATURDAY', label: 'Thứ 7' },
  { value: 'SUNDAY', label: 'Chủ nhật' },
];

const dayLabel = (value) => dayOptions.find((item) => item.value === value)?.label || value;

export default function ScheduleManagement() {
  const [schedules, setSchedules] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [form] = Form.useForm();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [scheduleRes, classRes] = await Promise.all([
        axiosClient.get('/api/admin/schedules'),
        axiosClient.get('/api/admin/classes'),
      ]);
      setSchedules(Array.isArray(scheduleRes) ? scheduleRes : []);
      setClasses(Array.isArray(classRes) ? classRes : []);
    } catch (error) {
      console.error(error);
      message.error('Không thể tải dữ liệu thời khóa biểu!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreate = () => {
    setEditingSchedule(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEdit = (record) => {
    setEditingSchedule(record);
    form.setFieldsValue({
      classId: record.classId,
      dayOfWeek: record.dayOfWeek,
      timeRange: [dayjs(record.startTime, 'HH:mm:ss'), dayjs(record.endTime, 'HH:mm:ss')],
      room: record.room,
      subject: record.subject,
      note: record.note,
    });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        classId: values.classId,
        dayOfWeek: values.dayOfWeek,
        startTime: values.timeRange[0].format('HH:mm:ss'),
        endTime: values.timeRange[1].format('HH:mm:ss'),
        room: values.room,
        subject: values.subject,
        note: values.note,
      };
      setSubmitting(true);
      if (editingSchedule) {
        await axiosClient.put(`/api/admin/schedules/${editingSchedule.id}`, payload);
        message.success('Đã cập nhật thời khóa biểu!');
      } else {
        await axiosClient.post('/api/admin/schedules', payload);
        message.success('Đã thêm buổi học mới!');
      }
      setModalOpen(false);
      fetchData();
    } catch (error) {
      if (error.errorFields) return;
      console.error(error);
      message.error(error.response?.data?.message || error.response?.data || 'Lưu thời khóa biểu thất bại!');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosClient.delete(`/api/admin/schedules/${id}`);
      message.success('Đã xóa buổi học!');
      fetchData();
    } catch (error) {
      console.error(error);
      message.error('Không thể xóa buổi học!');
    }
  };

  const columns = [
    { title: 'Lớp', dataIndex: 'className', render: (text, record) => <Text strong>{text || record.courseTitle}</Text> },
    { title: 'Học phần', render: (_, record) => <Tag color="cyan">{record.courseCode || 'N/A'} - {record.courseTitle}</Tag> },
    { title: 'Giảng viên', dataIndex: 'teacherName' },
    { title: 'Ngày', dataIndex: 'dayOfWeek', render: dayLabel },
    { title: 'Giờ học', render: (_, record) => `${record.startTime?.slice(0, 5)} - ${record.endTime?.slice(0, 5)}` },
    { title: 'Phòng', dataIndex: 'room' },
    { title: 'Nội dung', dataIndex: 'subject' },
    {
      title: 'Hành động',
      width: 180,
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => openEdit(record)}>Sửa</Button>
          <Popconfirm title="Xóa buổi học này?" okText="Xóa" cancelText="Hủy" onConfirm={() => handleDelete(record.id)}>
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card bordered={false} style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <Title level={4} style={{ margin: 0 }}>Quản lý thời khóa biểu</Title>
          <Text type="secondary">Chỉ admin được thêm, sửa và xóa lịch học của các lớp</Text>
        </div>
        <Button type="primary" size="large" icon={<PlusOutlined />} onClick={openCreate}>Thêm lịch học</Button>
      </div>

      <Table columns={columns} dataSource={schedules} rowKey="id" loading={loading} pagination={{ pageSize: 8 }} />

      <Modal
        title={editingSchedule ? 'Sửa lịch học' : 'Thêm lịch học'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleSubmit}
        confirmLoading={submitting}
        okText="Lưu"
        cancelText="Hủy"
        destroyOnHidden
      >
        <Form form={form} layout="vertical">
          <Form.Item name="classId" label="Lớp học" rules={[{ required: true, message: 'Chọn lớp học!' }]}>
            <Select placeholder="Chọn lớp" showSearch optionFilterProp="label">
              {classes.map((classItem) => (
                <Option key={classItem.id} value={classItem.id} label={`${classItem.name} - ${classItem.courseTitle}`}>
                  {classItem.name} - {classItem.courseTitle}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="dayOfWeek" label="Ngày học" rules={[{ required: true, message: 'Chọn ngày học!' }]}>
            <Select options={dayOptions} />
          </Form.Item>
          <Form.Item name="timeRange" label="Giờ học" rules={[{ required: true, message: 'Chọn giờ học!' }]}>
            <TimePicker.RangePicker format="HH:mm" style={{ width: '100%' }} suffixIcon={<CalendarOutlined />} />
          </Form.Item>
          <Form.Item name="room" label="Phòng học"><Input placeholder="VD: P.204 hoặc Online" /></Form.Item>
          <Form.Item name="subject" label="Nội dung buổi học"><Input placeholder="VD: Đại số, Hình học..." /></Form.Item>
          <Form.Item name="note" label="Ghi chú"><Input.TextArea rows={3} /></Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}
