import { useEffect, useMemo, useState } from 'react';
import { Button, Form, Input, InputNumber, message, Modal, Popconfirm, Select, Space, Table, Tag } from 'antd';
import { CheckOutlined, DeleteOutlined, DollarOutlined, ReloadOutlined, StopOutlined } from '@ant-design/icons';
import {
  confirmTuitionPayment,
  deleteTuitionPayment,
  getAdminTuitionSummaries,
  recordAdminPayment,
  rejectTuitionPayment,
} from '../api/tuitionApi';

const formatMoney = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0);

const statusMeta = {
  PAID: { color: 'green', label: 'Đã đóng đủ' },
  PARTIAL: { color: 'gold', label: 'Đóng một phần' },
  UNPAID: { color: 'red', label: 'Chưa đóng' },
};

const paymentStatusMeta = {
  PENDING: { color: 'blue', label: 'Chờ xác nhận' },
  CONFIRMED: { color: 'green', label: 'Đã xác nhận' },
  REJECTED: { color: 'red', label: 'Từ chối' },
};

export default function TuitionManagement() {
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [form] = Form.useForm();

  const fetchSummaries = async () => {
    setLoading(true);
    try {
      const data = await getAdminTuitionSummaries();
      setSummaries(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      message.error('Không thể tải dữ liệu học phí');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummaries();
  }, []);

  const totals = useMemo(() => summaries.reduce((acc, item) => ({
    totalAmount: acc.totalAmount + (item.totalAmount || 0),
    paidAmount: acc.paidAmount + (item.paidAmount || 0),
    debtAmount: acc.debtAmount + (item.debtAmount || 0),
    pendingAmount: acc.pendingAmount + (item.pendingAmount || 0),
  }), { totalAmount: 0, paidAmount: 0, debtAmount: 0, pendingAmount: 0 }), [summaries]);

  const openPaymentModal = (student) => {
    setSelectedStudent(student);
    form.resetFields();
    form.setFieldsValue({ studentId: student.studentId });
    setIsPaymentOpen(true);
  };

  const submitPayment = async (values) => {
    try {
      await recordAdminPayment(values);
      message.success('Đã ghi nhận thanh toán');
      setIsPaymentOpen(false);
      fetchSummaries();
    } catch (error) {
      console.error(error);
      message.error(error.response?.data?.message || 'Ghi nhận thanh toán thất bại');
    }
  };

  const updatePayment = async (paymentId, action) => {
    try {
      if (action === 'confirm') {
        await confirmTuitionPayment(paymentId);
        message.success('Đã xác nhận thanh toán');
      } else {
        await rejectTuitionPayment(paymentId);
        message.success('Đã từ chối thanh toán');
      }
      fetchSummaries();
    } catch (error) {
      console.error(error);
      message.error('Không thể cập nhật giao dịch');
    }
  };

  const removePayment = async (paymentId) => {
    try {
      await deleteTuitionPayment(paymentId);
      message.success('Đã xóa khoản nộp học phí');
      fetchSummaries();
    } catch (error) {
      console.error(error);
      message.error('Không thể xóa khoản nộp học phí');
    }
  };

  const columns = [
    { title: 'Sinh viên', dataIndex: 'studentName', render: (name) => <strong>{name}</strong> },
    { title: 'Tín chỉ', dataIndex: 'totalCredits', width: 100 },
    { title: 'Tổng học phí', dataIndex: 'totalAmount', render: formatMoney },
    { title: 'Đã nộp', dataIndex: 'paidAmount', render: formatMoney },
    { title: 'Chờ duyệt', dataIndex: 'pendingAmount', render: formatMoney },
    { title: 'Còn nợ', dataIndex: 'debtAmount', render: formatMoney },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (status) => <Tag color={statusMeta[status]?.color}>{statusMeta[status]?.label || status}</Tag>,
    },
    {
      title: 'Hành động',
      width: 180,
      render: (_, record) => <Button icon={<DollarOutlined />} onClick={() => openPaymentModal(record)}>Ghi nhận nộp</Button>,
    },
  ];

  const expandedRowRender = (record) => (
    <Space direction="vertical" style={{ width: '100%' }} size="middle">
      <Table
        size="small"
        rowKey={(line) => `${line.classId}-${line.courseId}`}
        pagination={false}
        dataSource={record.lines || []}
        columns={[
          { title: 'Học phần', render: (_, line) => `${line.courseCode} - ${line.courseTitle}` },
          { title: 'Lớp', dataIndex: 'className' },
          { title: 'Học kỳ', dataIndex: 'semester' },
          { title: 'Tín chỉ', dataIndex: 'credits', width: 90 },
          { title: 'Học phí', dataIndex: 'amount', render: formatMoney },
        ]}
      />
      <Table
        size="small"
        rowKey="id"
        pagination={false}
        dataSource={record.payments || []}
        columns={[
          { title: 'Ngày tạo', dataIndex: 'createdAt', render: (value) => value ? new Date(value).toLocaleString('vi-VN') : '' },
          { title: 'Số tiền', dataIndex: 'amount', render: formatMoney },
          { title: 'Ghi chú', dataIndex: 'note' },
          {
            title: 'Trạng thái',
            dataIndex: 'status',
            render: (status) => <Tag color={paymentStatusMeta[status]?.color}>{paymentStatusMeta[status]?.label || status}</Tag>,
          },
          {
            title: 'Xử lý',
            render: (_, payment) => (
              <Space>
                {payment.status === 'PENDING' && (
                  <>
                    <Button size="small" icon={<CheckOutlined />} onClick={() => updatePayment(payment.id, 'confirm')}>Xác nhận</Button>
                    <Button size="small" danger icon={<StopOutlined />} onClick={() => updatePayment(payment.id, 'reject')}>Từ chối</Button>
                  </>
                )}
                <Popconfirm
                  title="Xóa khoản nộp này?"
                  okText="Xóa"
                  cancelText="Hủy"
                  onConfirm={() => removePayment(payment.id)}
                >
                  <Button size="small" danger icon={<DeleteOutlined />}>Xóa</Button>
                </Popconfirm>
              </Space>
            ),
          },
        ]}
      />
    </Space>
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20, gap: 16, flexWrap: 'wrap' }}>
        <h3 style={{ margin: 0, fontSize: 18 }}><DollarOutlined /> Quản lý học phí</h3>
        <Space wrap>
          <Tag color="blue">Tổng: {formatMoney(totals.totalAmount)}</Tag>
          <Tag color="green">Đã nộp: {formatMoney(totals.paidAmount)}</Tag>
          <Tag color="red">Còn nợ: {formatMoney(totals.debtAmount)}</Tag>
          <Button icon={<ReloadOutlined />} onClick={fetchSummaries} loading={loading}>Làm mới</Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={summaries}
        rowKey="studentId"
        loading={loading}
        bordered
        expandable={{ expandedRowRender }}
        pagination={{ pageSize: 8 }}
      />

      <Modal
        title={`Ghi nhận học phí - ${selectedStudent?.studentName || ''}`}
        open={isPaymentOpen}
        onCancel={() => setIsPaymentOpen(false)}
        onOk={() => form.submit()}
        destroyOnHidden
      >
        <Form form={form} layout="vertical" onFinish={submitPayment}>
          <Form.Item name="studentId" label="Sinh viên" rules={[{ required: true }]}>
            <Select
              options={summaries.map((item) => ({ value: item.studentId, label: item.studentName }))}
              disabled={Boolean(selectedStudent)}
            />
          </Form.Item>
          <Form.Item name="amount" label="Số tiền" rules={[{ required: true, message: 'Vui lòng nhập số tiền' }]}>
            <InputNumber min={1000} step={100000} style={{ width: '100%' }} formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
          </Form.Item>
          <Form.Item name="note" label="Ghi chú">
            <Input.TextArea rows={3} placeholder="VD: Nộp học phí học kỳ này" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
