import React, { useState } from 'react';
import { Button, Card, Space, message } from 'antd';
import { RobotOutlined } from '@ant-design/icons';
import AssignmentForm from '../../../components/assignments/AssignmentForm';
import AIQuizGenerator from '../../../components/AIQuizGenerator';
import { assignmentService } from '../../../services/assignmentService';

export default function AssignmentCreatePage({ classId, onCreated }) {
  const [aiModalVisible, setAiModalVisible] = useState(false);
  const [aiQuizData, setAiQuizData] = useState(null);
  const [descriptionText, setDescriptionText] = useState('');

  // Hàm chuyển đổi 15 câu hỏi AI thành văn bản trình bày đẹp mắt
  const formatQuizToText = (quizList) => {
    if (!Array.isArray(quizList) || quizList.length === 0) return '';

    const bodyText = quizList.map((q, i) => {
      // 1. Lấy tên câu hỏi
      const title = q.question || q.questionText || q.content || q.title || `Câu ${i + 1}`;
      
      // 2. Lấy danh sách đáp án
      const rawOptions = Array.isArray(q.options) ? q.options : (Array.isArray(q.choices) ? q.choices : []);
      const optionsFormatted = rawOptions.map((opt, oIdx) => {
        const letter = String.fromCharCode(65 + oIdx); // A, B, C, D
        const optText = typeof opt === 'object' ? (opt.text || opt.content || JSON.stringify(opt)) : opt;
        
        // Nếu đáp án đã có tiền tố A., B., C. thì giữ nguyên
        if (typeof optText === 'string' && /^[A-D]\./i.test(optText.trim())) {
          return `   ${optText}`;
        }
        return `   ${letter}. ${optText}`;
      }).join('\n');

      // 3. Lấy đáp án đúng (nếu có)
      const answer = q.answer || q.correctAnswer || q.correct_answer || q.rightAnswer;
      const answerText = answer ? `\n   -> Đáp án đúng: ${typeof answer === 'object' ? JSON.stringify(answer) : answer}` : '';

      return `Câu ${i + 1}: ${title}\n${optionsFormatted}${answerText}`;
    }).join('\n\n');

    return `--- ĐỀ THI TRẮC NGHIỆM AI GENERATED (${quizList.length} CÂU) ---\n\n${bodyText}`;
  };

  // Hàm hứng dữ liệu khi bấm nút ở Modal AI
  const handleAiQuizGenerated = (quizList) => {
    console.log('>>> [AssignmentCreatePage] Nhận danh sách câu hỏi từ AI:', quizList);
    
    if (!Array.isArray(quizList) || quizList.length === 0) {
      message.warning('Không nhận được câu hỏi từ AI!');
      return;
    }

    // Chuyển mảng câu hỏi thành văn bản
    const formattedText = formatQuizToText(quizList);
    console.log('>>> [AssignmentCreatePage] Văn bản đã tạo:', formattedText);

    // Cập nhật State
    setAiQuizData(quizList);
    setDescriptionText(formattedText);
    setAiModalVisible(false);
    
    message.success(`Đã tự động trích xuất ${quizList.length} câu hỏi AI vào phần Mô tả!`);
  };

  const handleSubmit = (formData) => {
    const finalPayload = {
      ...formData?.payload,
      classId,
      // Lưu câu hỏi vào ô description và đính kèm mảng JSON bên dưới nếu cần xử lý backend
      description: aiQuizData 
        ? `${formData?.payload?.description || ''}\n\n--- QUIZ_DATA_START ---\n${JSON.stringify(aiQuizData)}\n--- QUIZ_DATA_END ---`
        : formData?.payload?.description
    };

    return assignmentService.save({ ...formData, payload: finalPayload }).then(onCreated);
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      <Card 
        title="Tạo mới Bài tập" 
        extra={
          <Button 
            type="primary" 
            icon={<RobotOutlined />} 
            style={{ backgroundColor: '#722ed1', borderColor: '#722ed1' }}
            onClick={() => setAiModalVisible(true)}
          >
            Soạn đề thi bằng AI
          </Button>
        }
      >
        {/* Dùng key={descriptionText} để khi có nội dung mới, Form sẽ lập tức remount và điền ngay */}
        <AssignmentForm 
          key={descriptionText || 'empty-form'}
          onSubmit={handleSubmit} 
          initialValue={{ description: descriptionText }}
          initialValues={{ description: descriptionText }}
        />
      </Card>

      {/* Truyền cả 3 tên event callback phổ biến để đảm bảo luôn bắt được sự kiện từ AIQuizGenerator */}
      <AIQuizGenerator 
        visible={aiModalVisible} 
        onClose={() => setAiModalVisible(false)}
        onSaveSuccess={handleAiQuizGenerated}
        onSave={handleAiQuizGenerated}
        onSubmit={handleAiQuizGenerated}
      />
    </Space>
  );
}