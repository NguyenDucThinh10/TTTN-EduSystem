import React, { useState } from 'react';
import { Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axiosClient from '../api/axiosClient';

export default function FileUpload({ 
    onUploadSuccess, 
    buttonText = "Tải file lên", 
    accept = "*", 
    uploadUrl = '/api/files/upload' 
}) {
    const [uploading, setUploading] = useState(false);

    // Ghi đè hành vi upload mặc định của Ant Design
    const customUpload = async ({ file, onSuccess, onError }) => {
        setUploading(true);
        
        // Đóng gói file vào FormData
        const formData = new FormData();
        formData.append('file', file);

        try {
            // Sử dụng biến uploadUrl linh hoạt
            const response = await axiosClient.post(uploadUrl, formData);
            
            message.success(`${file.name} tải lên thành công!`);
            
            // Báo cho Ant Design biết upload đã xong để đổi icon thành dấu tick xanh
            onSuccess(response, file);
            
            // Bắn dữ liệu ngược lại cho Component cha
            if (onUploadSuccess) {
                onUploadSuccess(response);
            }
        } catch (error) {
            console.error("Lỗi upload:", error);
            message.error(error.response?.data || `${file.name} tải lên thất bại.`);
            // Báo cho Ant Design biết lỗi để hiện chữ màu đỏ
            onError(error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <Upload 
            customRequest={customUpload} 
            showUploadList={true} 
            accept={accept}       
            maxCount={1}          
        >
            <Button icon={<UploadOutlined />} loading={uploading}>
                {buttonText}
            </Button>
        </Upload>
    );
}