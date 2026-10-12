import { Card, Col, Input, Row, Select, Typography } from 'antd';

const { Text } = Typography;

export default function ClassSelectorPanel({ classes, selectedClassId, onClassChange }) {
  const options = classes.map((item) => ({
    value: item.id,
    label: `${item.name} - ${item.courseCode || item.courseTitle || 'Học phần'} - ${item.semester || 'Học kỳ'}`,
  }));

  return (
    <Card className="class-selector-card" bordered={false}>
      <Row align="middle" gutter={[20, 16]}>
        <Col xs={24} md={12} lg={8}>
          <Text strong>Lớp học</Text>
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
              placeholder="Nhập classId, ví dụ 1"
              value={selectedClassId}
              onChange={(event) => onClassChange(event.target.value)}
            />
          )}
        </Col>
      </Row>
    </Card>
  );
}
