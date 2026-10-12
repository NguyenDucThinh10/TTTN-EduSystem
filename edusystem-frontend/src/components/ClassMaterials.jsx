import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Form, Input, Upload, message, Typography, Tag, Card } from 'antd';
import { UploadOutlined, DownloadOutlined, FilePdfOutlined, FileWordOutlined, FileUnknownOutlined } from '@ant-design/icons';
import axiosClient from '../api/axiosClient';

const { Title, Text } = Typography;

export default function ClassMaterials({ classId, isTeacherOrAdmin }) {
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [form] = Form.useForm();

    // Lấy danh sách tài liệu của lớp
    const fetchMaterials = async () => {
        if (!classId) return;
        setLoading(true);
        try {
            const res = await axiosClient.get(`/api/files/materials/class/${classId}`);
            setMaterials(Array.isArray(res) ? res : (res.data || []));
        } catch (error) {
            console.error("Lỗi tải tài liệu:", error);
            message.error("Không thể tải danh sách tài liệu!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMaterials();
    }, [classId]);

    // Xử lý khi chọn file (ngăn Ant Design tự động upload)
    const handleBeforeUpload = (file) => {
        setFileList([file]);
        return false; 
    };

    const handleRemoveFile = () => {
        setFileList([]);
    };

    // Xử lý Submit Form Upload
    const handleUploadSubmit = async () => {
        if (fileList.length === 0) {
            message.warning("Vui lòng chọn một file để tải lên!");
            return;
        }

        try {
            const values = await form.validateFields();
            setSubmitting(true);

            // Sử dụng FormData để gửi file và dữ liệu text
            const formData = new FormData();
            formData.append('file', fileList[0]);
            formData.append('title', values.title);
            formData.append('description', values.description || '');
            formData.append('classId', classId);
            
            // TODO: Lấy ID của người dùng đang đăng nhập từ LocalStorage/Context
            // Tạm thời hardcode là 1 (Bạn cần thay bằng ID user thực tế)
            const currentUser = JSON.parse(localStorage.getItem('user')) || { id: 1 }; 
            formData.append('uploaderId', currentUser.id);

            await axiosClient.post('/api/files/materials/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            message.success("Tải tài liệu lên thành công!");
            setIsUploadModalVisible(false);
            form.resetFields();
            setFileList([]);
            fetchMaterials(); // Cập nhật lại danh sách

        } catch (error) {
            if (error.errorFields) return;
            console.error("Lỗi upload:", error);
            message.error("Tải tài liệu thất bại!");
        } finally {
            setSubmitting(false);
        }
    };

    // Hàm chọn icon dựa theo đuôi file
    const getFileIcon = (fileName) => {
        if (!fileName) return <FileUnknownOutlined />;
        if (fileName.endsWith('.pdf')) return <FilePdfOutlined style={{ color: '#cf1322' }} />;
        if (fileName.endsWith('.doc') || fileName.endsWith('.docx')) return <FileWordOutlined style={{ color: '#1d39c4' }} />;
        return <FileTextOutlined style={{ color: '#1890ff' }} />;
    };

    const columns = [
        {
            title: 'Tên tài liệu',
            dataIndex: 'title',
            render: (text, record) => (
                <Space>
                    {getFileIcon(record.fileName)}
                    <Text strong>{text}</Text>
                </Space>
            )
        },
        { title: 'Mô tả', dataIndex: 'description' },
        { 
            title: 'Ngày tải lên', 
            dataIndex: 'uploadedAt',
            render: (date) => new Date(date).toLocaleString('vi-VN')
        },
        {
            title: 'Hành động',
            align: 'center',
            width: 150,
            render: (_, record) => (
                // Gọi thẳng URL API Backend để trình duyệt tự bắt link và tải xuống
                <Button 
                    type="primary" 
                    icon={<DownloadOutlined />} 
                    href={`http://localhost:8080${record.fileUrl}`} // Nhớ đổi port nếu backend chạy port khác
                    target="_blank"
                >
                    Tải về
                </Button>
            ),
        },
    ];

    return (
        <Card title={`Tài liệu học tập`} bordered={false} extra={
            isTeacherOrAdmin && (
                <Button type="primary" icon={<UploadOutlined />} onClick={() => setIsUploadModalVisible(true)}>
                    Tải lên tài liệu
                </Button>
            )
        }>
            <Table 
                columns={columns} 
                dataSource={materials} 
                rowKey="id" 
                loading={loading}
                pagination={{ pageSize: 5 }}
            />

            <Modal
                title="Tải lên tài liệu mới"
                open={isUploadModalVisible}
                onCancel={() => {
                    setIsUploadModalVisible(false);
                    form.resetFields();
                    setFileList([]);
                }}
                onOk={handleUploadSubmit}
                confirmLoading={submitting}
                okText="Tải lên"
                cancelText="Hủy"
                destroyOnHidden
            >
                <Form form={form} layout="vertical">
                    <Form.Item 
                        name="title" 
                        label="Tiêu đề tài liệu" 
                        rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
                    >
                        <Input placeholder="VD: Slide Bài 1 - Giới thiệu môn học" />
                    </Form.Item>

                    <Form.Item name="description" label="Mô tả ngắn">
                        <Input.TextArea rows={3} placeholder="Mô tả nội dung file (không bắt buộc)" />
                    </Form.Item>

                    <Form.Item label="Chọn File tải lên" required>
                        <Upload 
                            beforeUpload={handleBeforeUpload}
                            onRemove={handleRemoveFile}
                            fileList={fileList}
                            maxCount={1}
                        >
                            <Button icon={<UploadOutlined />}>Chọn File (PDF, DOCX, PPTX...)</Button>
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    );
}