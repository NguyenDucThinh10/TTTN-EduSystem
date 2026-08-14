import { BookOutlined, CalendarOutlined, UserOutlined } from '@ant-design/icons';
import { Card, Col, Input, Row, Select, Space, Tag, Typography } from 'antd';
import { statusLabel } from '../utils/dashboardDisplay';

const { Text, Title } = Typography;

export default function ClassSelectorPanel({ classes, selectedClass, selectedClassId, onClassChange }) {
  const options = classes.map((item) => ({
    value: item.id,
    label: `${item.name} - ${item.courseCode || item.courseTitle || 'Hoc phan'} - ${item.semester || 'Hoc ky'}`,
  }));

  return (
    <Card className="class-selector-card" bordered={false}>
      <Row align="middle" gutter={[20, 16]}>
        <Col xs={24} md={9} lg={7}>
          <Text strong>Lop hoc</Text>
          {classes.length > 0 ? (
            <Select
              size="large"
              value={selectedClassId}
              onChange={onClassChange}
              options={options}
              className="class-select"
              showSearch
              optionFilterProp="label"
            />
          ) : (
            <Input
              size="large"
              type="number"
              min="1"
              placeholder="Nhap classId, vi du 1"
              value={selectedClassId}
              onChange={(event) => onClassChange(event.target.value)}
            />
          )}
        </Col>

        <Col xs={24} md={15} lg={17}>
          {selectedClass ? (
            <div className="selected-class-summary">
              <Space size="middle" wrap>
                <span className="class-icon"><BookOutlined /></span>
                <div>
                  <Title level={4}>{selectedClass.name}</Title>
                  <Space wrap>
                    <Text strong>{selectedClass.courseCode || 'N/A'} - {selectedClass.courseTitle}</Text>
                    {selectedClass.courseCredits && <Text type="secondary">{selectedClass.courseCredits} tín chỉ</Text>}
                    <Text type="secondary"><UserOutlined /> {selectedClass.teacherName}</Text>
                    <Text type="secondary"><CalendarOutlined /> {selectedClass.semester || 'Hoc ky'}</Text>
                    <Tag color={selectedClass.status === 'ONGOING' ? 'green' : 'default'}>
                      {statusLabel(selectedClass.status)}
                    </Tag>
                  </Space>
                </div>
              </Space>
            </div>
          ) : (
            <Text type="secondary">Chon lop hoc de xem du lieu.</Text>
          )}
        </Col>
      </Row>
    </Card>
  );
}
