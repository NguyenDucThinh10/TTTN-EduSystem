import React, { useState } from 'react';
import { Modal, Button, Upload, message, Typography, Card, Space, Spin, Radio, Tag, Input } from 'antd';
import { InboxOutlined, RobotOutlined, CheckCircleOutlined, SaveOutlined, DownloadOutlined, EditOutlined } from '@ant-design/icons';
import axiosClient from '../api/axiosClient';

const { Text } = Typography;
const { Dragger } = Upload;

export default function AIQuizGenerator({ visible, onClose, onSaveSuccess }) {
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
            const response = await axiosClient.post('/api/ai/generate-quiz', formData);

            let parsedData = response;
            if (typeof response === 'string') {
                try {
                    parsedData = JSON.parse(response);
                } catch (e) {
                    console.error("Lỗi parse JSON:", e);
                }
            }

            if (!Array.isArray(parsedData) || parsedData.length === 0) {
                message.error('AI không tạo được câu hỏi. Vui lòng kiểm tra lại nội dung file PDF!');
                return;
            }

            setQuizList(parsedData);
            message.success(`AI đã phân tích và tạo thành công ${parsedData.length} câu hỏi!`);
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

    // Thay đổi tiêu đề câu hỏi
    const handleQuestionChange = (index, value) => {
        const updated = [...quizList];
        updated[index].question = value;
        setQuizList(updated);
    };

    // Thay đổi đáp án đúng
    const handleCorrectAnswerChange = (qIndex, selectedOption) => {
        const updated = [...quizList];
        updated[qIndex].correctAnswer = selectedOption;
        setQuizList(updated);
    };

    // Thay đổi nội dung từng lựa chọn
    const handleOptionTextChange = (qIndex, optIndex, newValue) => {
        const updated = [...quizList];
        const oldOptionValue = updated[qIndex].options[optIndex];
        updated[qIndex].options[optIndex] = newValue;
        
        if (updated[qIndex].correctAnswer === oldOptionValue) {
            updated[qIndex].correctAnswer = newValue;
        }
        setQuizList(updated);
    };

// Thay hàm handleDownloadPDF cũ bằng hàm nhận tham số includeAnswers
const handleDownloadPDF = (includeAnswers) => {
    const printWindow = window.open('', '_blank');
    let htmlContent = `
        <html>
            <head>
                <title>${includeAnswers ? 'Dap An - EduSystem AI' : 'De Thi Trac Nghiem - EduSystem AI'}</title>
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
                <h1>${includeAnswers ? 'ĐÁP ÁN ĐỀ THI (DÀNH CHO GIẢNG VIÊN)' : 'ĐỀ THI TRẮC NGHIỆM'}</h1>
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
            // Chỉ đánh dấu / tô màu đáp án đúng khi đây là bản dành cho giáo viên
            const showCorrect = includeAnswers && isCorrect;
            htmlContent += `
                <div class="option ${showCorrect ? 'correct' : ''}">
                    - ${opt} ${showCorrect ? ' (Đáp án đúng)' : ''}
                </div>
            `;
        });
        htmlContent += `</div>`;
    });

    htmlContent += `</body></html>`;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
        printWindow.print();
        printWindow.close();
    }, 600);
};

const handleSaveQuiz = () => {
    try {
        console.log(">>> [AIQuizGenerator] Bấm nút Sử dụng bộ câu hỏi này. quizList:", quizList);

        if (!quizList || quizList.length === 0) {
            message.warning("Chưa có câu hỏi nào để sử dụng!");
            return;
        }

        // Tự động chuyển đổi danh sách câu hỏi thành văn bản hiển thị
        const formattedText = `--- ĐỀ THI TRẮC NGHIỆM AI (${quizList.length} CÂU) ---\n\n` +
          quizList.map((q, i) => {
            const questionText = q.question || q.title || `Câu ${i + 1}`;
            const optionsList = Array.isArray(q.options) ? q.options : (Array.isArray(q.choices) ? q.choices : []);
            const optionsText = optionsList.map((o) => `   - ${o}`).join('\n');
            return `${i + 1}. ${questionText}\n${optionsText}`;
          }).join('\n\n') +
          `\n\n--- QUIZ_DATA_START ---\n${JSON.stringify(quizList)}\n--- QUIZ_DATA_END ---`;

        if (onSaveSuccess) {
            onSaveSuccess(quizList, formattedText);
        }

        message.success(`Đã tự động điền ${quizList.length} câu hỏi AI vào bài tập!`);
        onClose();
        setQuizList([]);
        setFileList([]);
    } catch (error) {
        console.error("Lỗi khi áp dụng bộ câu hỏi:", error);
        message.error("Có lỗi xảy ra khi lưu câu hỏi!");
    }
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
            destroyOnClose
        >
            {/* TRẠNG THÁI 1: UPLOAD TÀI LIỆU */}
            {!quizList.length && !loading && (
                <div style={{ padding: '20px 0' }}>
                    <Dragger {...uploadProps} style={{ padding: '40px 0', background: '#f9f0ff', borderColor: '#d3adf7' }}>
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined style={{ color: '#9254de' }} />
                        </p>
                        <p className="ant-upload-text" style={{ fontSize: 18, fontWeight: 500 }}>Nhấp hoặc kéo thả tệp PDF bài giảng vào đây</p>
                        <p className="ant-upload-hint" style={{ color: '#8c8c8c' }}>
                            Trí tuệ nhân tạo Gemini sẽ đọc nội dung tài liệu và tự động sinh ra bộ câu hỏi trắc nghiệm bám sát bài học.
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

            {/* TRẠNG THÁI 2: SPIN LOADING */}
            {loading && (
                <div style={{ textAlign: 'center', padding: '80px 0' }}>
                    <Spin size="large" />
                    <div style={{ marginTop: 15, fontSize: 16, color: '#722ed1' }}>AI đang đọc tài liệu và tạo câu hỏi... Vui lòng đợi nhé!</div>
                </div>
            )}

            {/* TRẠNG THÁI 3: REVIEW & EDIT CÂU HỎI */}
            {quizList.length > 0 && !loading && (
                <div style={{ maxHeight: '65vh', overflowY: 'auto', paddingRight: 10, marginTop: 10 }}>
                    <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10, background: '#fff', paddingBottom: 10 }}>
                        <Text type="success" strong style={{ fontSize: 16 }}>
                            <CheckCircleOutlined /> Đã tạo {quizList.length} câu hỏi. Bạn có thể chỉnh sửa trực tiếp bên dưới!
                        </Text>
               <Space>
                    <Button onClick={() => { setQuizList([]); setFileList([]); }}>Tải file khác</Button>

                    {/* Bản giao cho sinh viên — KHÔNG có đáp án */}
                    <Button
                        type="default"
                        icon={<DownloadOutlined />}
                        style={{ color: '#1677ff', borderColor: '#1677ff' }}
                        onClick={() => handleDownloadPDF(false)}
                    >
                        Tải đề (Sinh viên)
                    </Button>

                    {/* Bản lưu cho giáo viên — CÓ đáp án, để tự chấm/đối chiếu */}
                    <Button
                        type="default"
                        icon={<DownloadOutlined />}
                        style={{ color: '#fa8c16', borderColor: '#fa8c16' }}
                        onClick={() => handleDownloadPDF(true)}
                    >
                        Tải đáp án (Giáo viên)
                    </Button>
                </Space>
                    </div>

                    {quizList.map((quiz, qIndex) => (
                        <Card key={qIndex} size="small" style={{ marginBottom: 16, borderLeft: '5px solid #722ed1', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                            <Space direction="vertical" style={{ width: '100%' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <Text strong style={{ minWidth: 60 }}>Câu {qIndex + 1}:</Text>
                                    <Input 
                                        value={quiz.question} 
                                        onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                                        suffix={<EditOutlined style={{ color: '#bfbfbf' }} />}
                                    />
                                </div>

                                <Radio.Group 
                                    value={quiz.correctAnswer} 
                                    onChange={(e) => handleCorrectAnswerChange(qIndex, e.target.value)}
                                    style={{ width: '100%', marginTop: 8 }}
                                >
                                    <Space direction="vertical" style={{ width: '100%' }}>
                                        {quiz.options.map((opt, optIndex) => {
                                            const isCorrect = opt === quiz.correctAnswer;
                                            return (
                                                <div key={optIndex} style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
                                                    <Radio value={opt} />
                                                    <Input 
                                                        value={opt} 
                                                        onChange={(e) => handleOptionTextChange(qIndex, optIndex, e.target.value)}
                                                        style={{ 
                                                            backgroundColor: isCorrect ? '#f6ffed' : '#ffffff',
                                                            borderColor: isCorrect ? '#b7eb8f' : '#d9d9d9'
                                                        }}
                                                    />
                                                    {isCorrect && <Tag color="success">Đáp án đúng</Tag>}
                                                </div>
                                            );
                                        })}
                                    </Space>
                                </Radio.Group>
                            </Space>
                        </Card>
                    ))}
                </div>
            )}
        </Modal>
    );
}