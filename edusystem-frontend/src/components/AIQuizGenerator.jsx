import React, { useState } from 'react';
import { Modal, Button, Upload, message, Typography, Card, Space, Spin, Radio, Tag } from 'antd';
import { InboxOutlined, RobotOutlined, CheckCircleOutlined, SaveOutlined, DownloadOutlined } from '@ant-design/icons';
import axiosClient from '../api/axiosClient';

const { Title, Text } = Typography;
const { Dragger } = Upload;

export default function AIQuizGenerator({ visible, onClose }) {
    const [loading, setLoading] = useState(false);
    const [quizList, setQuizList] = useState([]);
    const [fileList, setFileList] = useState([]);

    // Xử lý gửi file PDF cho AI
    const handleUpload = async () => {
        if (fileList.length === 0) {
            message.warning('Vui lòng chọn một tệp PDF bài giảng!');
            return;
        }

        const formData = new FormData();
        formData.append('file', fileList[0]);

        setLoading(true);
        try {
            const response = await axiosClient.post('/api/ai/generate-quiz', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            let data = typeof response === 'string' ? JSON.parse(response) : response;
            
            if (!data || data.length === 0) {
                message.error('AI không tạo được câu hỏi. Có thể do lỗi API Key ở Backend hoặc file PDF không có chữ!');
                return;
            }

            setQuizList(data);
            message.success('AI đã phân tích và tạo đề thi thành công!');
        } catch (error) {
            console.error('Lỗi tạo quiz:', error);
            message.error('Có lỗi xảy ra khi AI phân tích tệp. Vui lòng thử lại!');
        } finally {
            setLoading(false);
        }
    };

    // Cấu hình khung Kéo/Thả file
    const uploadProps = {
        onRemove: () => setFileList([]),
        beforeUpload: (file) => {
            const isPDF = file.type === 'application/pdf';
            if (!isPDF) {
                message.error('Hệ thống AI hiện tại chỉ hỗ trợ đọc tệp PDF!');
                return Upload.LIST_IGNORE;
            }
            setFileList([file]);
            return false;
        },
        fileList,
        maxCount: 1,
    };

    // --- TÍNH NĂNG MỚI: XUẤT VÀ TẢI XUỐNG PDF ---
    const handleDownloadPDF = () => {
        const printWindow = window.open('', '_blank');
        let htmlContent = `
            <html>
                <head>
                    <title>De Thi Trac Nghiem - EduSystem AI</title>
                    <style>
                        body { font-family: 'Times New Roman', Times, serif; padding: 30px; color: #000; line-height: 1.5; }
                        h1 { text-align: center; color: #1f1f1f; font-size: 22px; margin-bottom: 5px; }
                        .subtitle { text-align: center; font-size: 14px; margin-bottom: 30px; color: #555; }
                        .question { margin-bottom: 20px; page-break-inside: avoid; }
                        .question-title { font-weight: bold; font-size: 16px; margin-bottom: 8px; }
                        .option { margin-left: 20px; margin-bottom: 6px; font-size: 15px; }
                        .correct { color: #237804; font-weight: bold; }
                    </style>
                </head>
                <body>
                    <h1>ĐỀ THI TRẮC NGHIỆM ĐỀ XUẤT BỞI AI</h1>
                    <div class="subtitle">Hệ thống Quản lý Học tập EduSystem</div>
                    <hr style="border: 0; border-top: 1px solid #ccc; margin-bottom: 20px;"/>
        `;

        quizList.forEach((q, index) => {
            htmlContent += `
                <div class="question">
                    <div class="question-title">Câu ${index + 1}: ${q.question}</div>
            `;
            q.options.forEach((opt) => {
                const isCorrect = opt === q.correctAnswer;
                htmlContent += `
                    <div class="option ${isCorrect ? 'correct' : ''}">
                        - ${opt} ${isCorrect ? ' (Đáp án đúng)' : ''}
                    </div>
                `;
            });
            htmlContent += `</div>`;
        });

        htmlContent += `
                </body>
            </html>
        `;

        printWindow.document.write(htmlContent);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 600);
    };

    // Xử lý khi Giảng viên duyệt xong và muốn Lưu
    const handleSaveQuiz = () => {
        console.log("Dữ liệu chuẩn bị lưu:", quizList);
        message.success('Đã lưu toàn bộ câu hỏi vào Ngân hàng đề thi!');
        onClose(); 
        setQuizList([]); 
        setFileList([]);
    };

    return (
        <Modal
            title={
                <Space>
                    <RobotOutlined style={{ color: '#722ed1', fontSize: 28 }}/> 
                    <span style={{ fontSize: 22, fontWeight: 600, color: '#1f1f1f' }}>Giảng viên AI: Tự động ra đề thi</span>
                </Space>
            }
            open={visible}
            onCancel={onClose}
            width={850}
            footer={null}
            destroyOnHidden
        >
            {/* TRẠNG THÁI 1: KHUNG UPLOAD TÀI LIỆU */}
            {!quizList.length && !loading && (
                <div style={{ padding: '20px 0' }}>
                    <Dragger {...uploadProps} style={{ padding: '40px 0', background: '#f9f0ff', borderColor: '#d3adf7' }}>
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined style={{ color: '#9254de' }} />
                        </p>
                        <p className="ant-upload-text" style={{ fontSize: 18, fontWeight: 500 }}>Nhấp hoặc kéo thả tệp PDF bài giảng vào đây</p>
                        <p className="ant-upload-hint" style={{ color: '#8c8c8c' }}>
                            Trí tuệ nhân tạo Gemini sẽ đọc nội dung tài liệu và tự động sinh ra bộ 10 câu hỏi trắc nghiệm bám sát bài học.
                        </p>
                    </Dragger>
                    <Button
                        type="default" 
                        size="large"
                        block
                        icon={<RobotOutlined />}
                        style={{ 
                            marginTop: 24, 
                            height: 50, 
                            fontSize: 16, 
                            backgroundColor: '#ffffff', 
                            color: '#722ed1',           
                            borderColor: '#722ed1'      
                        }}
                        onClick={handleUpload}
                        disabled={fileList.length === 0}
                    >
                        Bắt đầu Phân tích & Ra đề
                    </Button>
                </div>
            )}

            {/* TRẠNG THÁI 2: HIỆU ỨNG LOADING CHỜ AI */}
            {loading && (
                <div style={{ textAlign: 'center', padding: '80px 0' }}>
                    <Spin size="large" description={<div style={{ marginTop: 15, fontSize: 16, color: '#722ed1' }}>AI đang đọc tài liệu và suy nghĩ câu hỏi... Vui lòng đợi nhé!</div>} />
                </div>
            )}

            {/* TRẠNG THÁI 3: HIỂN THỊ KẾT QUẢ ĐỂ REVIEW */}
            {quizList.length > 0 && !loading && (
                <div style={{ maxHeight: '65vh', overflowY: 'auto', paddingRight: 10, marginTop: 10 }}>
                    <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10, background: '#fff', paddingBottom: 10 }}>
                        <Text type="success" strong style={{ fontSize: 16 }}><CheckCircleOutlined /> Phân tích hoàn tất! Đã tạo {quizList.length} câu hỏi.</Text>
                        <Space>
                            <Button onClick={() => { setQuizList([]); setFileList([]); }}>Tải file khác</Button>
                            {/* Nút Tải xuống PDF */}
                            <Button type="default" icon={<DownloadOutlined />} style={{ color: '#1677ff', borderColor: '#1677ff' }} onClick={handleDownloadPDF}>
                                Tải xuống PDF
                            </Button>
                            <Button type="primary" style={{ backgroundColor: '#52c41a' }} icon={<SaveOutlined />} onClick={handleSaveQuiz}>
                                Lưu vào Ngân hàng
                            </Button>
                        </Space>
                    </div>

                    {/* Vòng lặp render 10 câu hỏi */}
                    {quizList.map((quiz, index) => (
                        <Card key={index} size="small" style={{ marginBottom: 16, borderLeft: '5px solid #722ed1', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                            <Title level={5} style={{ marginTop: 0 }}>Câu {index + 1}: {quiz.question}</Title>
                            <Radio.Group value={quiz.correctAnswer} style={{ width: '100%', marginTop: 10 }}>
                                <Space direction="vertical" style={{ width: '100%' }}>
                                    {quiz.options.map((opt, i) => {
                                        const isCorrect = opt === quiz.correctAnswer;
                                        return (
                                            <Radio 
                                                key={i} 
                                                value={opt} 
                                                style={{ 
                                                    width: '100%', 
                                                    padding: '8px 12px', 
                                                    borderRadius: 6, 
                                                    backgroundColor: isCorrect ? '#f6ffed' : '#f5f5f5',
                                                    border: isCorrect ? '1px solid #b7eb8f' : '1px solid transparent',
                                                    pointerEvents: 'none'
                                                }}
                                            >
                                                <Text strong={isCorrect} style={{ color: isCorrect ? '#389e0d' : '#595959' }}>{opt}</Text>
                                                {isCorrect && <Tag color="success" style={{ marginLeft: 10, borderRadius: 12 }}>Đáp án đúng</Tag>}
                                            </Radio>
                                        );
                                    })}
                                </Space>
                            </Radio.Group>
                        </Card>
                    ))}
                </div>
            )}
        </Modal>
    );
}