import React, { useState } from 'react';
import { Drawer, Input, Button, Upload, message, Typography, Space, Spin } from 'antd';
import { RobotOutlined, SendOutlined, UploadOutlined, UserOutlined } from '@ant-design/icons';
import axiosClient from '../api/axiosClient';

const { Text } = Typography;

export default function AITutorDrawer({ visible, onClose }) {
    const [file, setFile] = useState(null);
    const [question, setQuestion] = useState('');
    const [loading, setLoading] = useState(false);
    const [chatHistory, setChatHistory] = useState([
        { sender: 'ai', text: 'Xin chào! Hãy tải lên tài liệu bài giảng và đặt câu hỏi cho tôi nhé.' }
    ]);

    const handleSend = async () => {
        if (!file) {
            message.warning('Vui lòng tải lên tài liệu PDF trước khi hỏi!');
            return;
        }
        if (!question.trim()) return;

        const userMsg = question;
        setChatHistory(prev => [...prev, { sender: 'user', text: userMsg }]);
        setQuestion('');
        setLoading(true);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('question', userMsg);

        try {
            const response = await axiosClient.post('/api/ai/ask-tutor', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            // Xử lý dữ liệu trả về từ Axios an toàn tuyệt đối
            let aiAnswer = 'Đã có phản hồi từ AI.';
            if (typeof response === 'string') {
                aiAnswer = response;
            } else if (response && typeof response.data === 'string') {
                aiAnswer = response.data;
            } else if (response && response.data) {
                aiAnswer = JSON.stringify(response.data);
            }
            
            setChatHistory(prev => [...prev, { sender: 'ai', text: aiAnswer }]);
} catch (error) {
            console.error('Lỗi AI Tutor:', error);
            // THÊM: Hiện lỗi trực tiếp từ Backend trả về
            const errorMsg = error.response?.data || 'Xin lỗi, hệ thống đang bận hoặc không đọc được tệp.';
            setChatHistory(prev => [...prev, { sender: 'ai', text: errorMsg }]);
        } finally {
            setLoading(false);
        }
    };

    const uploadProps = {
        beforeUpload: (uploadedFile) => {
            if (uploadedFile.type !== 'application/pdf') {
                message.error('Chỉ hỗ trợ tệp định dạng PDF!');
                return Upload.LIST_IGNORE;
            }
            setFile(uploadedFile);
            message.success(`Đã chọn tài liệu: ${uploadedFile.name}`);
            return false;
        },
        maxCount: 1,
        onRemove: () => setFile(null),
    };

    return (
        <Drawer
            title={
                <Space>
                    <RobotOutlined style={{ color: '#722ed1', fontSize: 22 }} />
                    <span>Trợ giảng Ảo AI (RAG Tutor)</span>
                </Space>
            }
            placement="right"
            size="large"
            onClose={onClose}
            open={visible}
            destroyOnHidden
        >
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ marginBottom: 15, padding: 10, background: '#f9f0ff', borderRadius: 8, border: '1px dashed #d3adf7' }}>
                    <Text strong style={{ display: 'block', marginBottom: 5, color: '#531dab' }}>1. Tải tài liệu nguồn cho Trợ giảng:</Text>
                    <Upload {...uploadProps}>
                        <Button icon={<UploadOutlined />} size="small">Chọn tệp PDF bài giảng</Button>
                    </Upload>
                    {file && <div style={{ fontSize: 12, marginTop: 5, color: '#389e0d' }}>Đang dùng: {file.name}</div>}
                </div>

                <div style={{ flex: 1, overflowY: 'auto', padding: '10px 0', borderTop: '1px solid #f0f0f0', borderBottom: '1px solid #f0f0f0', marginBottom: 15 }}>
                    {chatHistory.map((msg, index) => (
                        <div key={index} style={{ 
                            marginBottom: 12, 
                            display: 'flex', 
                            justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start' 
                        }}>
                            <div style={{ 
                                maxWidth: '80%', 
                                padding: '10px 14px', 
                                borderRadius: 12, 
                                background: msg.sender === 'user' ? '#722ed1' : '#f5f5f5', 
                                color: msg.sender === 'user' ? '#fff' : '#000',
                                fontSize: 14,
                                boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                            }}>
                                <div style={{ fontSize: 11, opacity: 0.7, marginBottom: 2 }}>
                                    {msg.sender === 'user' ? <><UserOutlined /> Bạn</> : <><RobotOutlined /> Trợ giảng AI</>}
                                </div>
                                <div style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</div>
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div style={{ textAlign: 'center', padding: 10 }}>
                            <Spin size="small" description="Trợ giảng đang đọc tài liệu và trả lời..." />
                        </div>
                    )}
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                    <Input
                        placeholder="Nhập câu hỏi về tài liệu..."
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        onPressEnter={handleSend}
                        disabled={!file || loading}
                    />
                    <Button 
                        type="primary" 
                        icon={<SendOutlined />} 
                        onClick={handleSend} 
                        disabled={!file || loading}
                        style={{ backgroundColor: '#722ed1' }}
                    >
                        Gửi
                    </Button>
                </div>
            </div>
        </Drawer>
    );
}