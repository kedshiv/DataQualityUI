import React, { Dispatch, SetStateAction } from 'react';
import { Form, Input, Select, Button, Row, Col } from 'antd';
import { entitySubType, entityType } from '../../pages/entity/entityTypeMap';

const { Option } = Select;
type EntityFormProps = {
    setIsModalVisible: Dispatch<SetStateAction<boolean>>
    setData: Dispatch<SetStateAction<any>>
}
const EntityForm = (props: EntityFormProps) => {
    const { setIsModalVisible, setData} = props;
  const [form] = Form.useForm();
  
  const createEntities = (values: any) => {
    const savedData = localStorage.getItem('entities');
    let allData = [];
    if(savedData){
       allData = JSON.parse(savedData);
    }
    allData.push(values);
    localStorage.setItem('entities', JSON.stringify(allData));
    setIsModalVisible(false)
    setData(allData)
    form.resetFields();

  };
  
  const handleEntitySubTypeChange = (value:string) => {
    const selectedSubType = entitySubType.filter(subType => subType.value === value);
    form.setFieldsValue({ entityType: selectedSubType[0].entityTypeValue });
   
  };
  
  return (
    <Form layout='vertical' form={form} name="entityForm" onFinish={createEntities}>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="entityName"
            label="Entity Name"
            rules={[
              {
                required: true,
                message: 'Entity Name is required',
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="entityPhysicalName"
            label="Entity Physical Name"
            rules={[
              {
                required: true,
                message: 'Entity Physical Name is required',
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="entitySubType"
            label="Entity SubType"
            rules={[
              {
                required: true,
                message: 'Entity SubType is required',
              },
            ]}
          >
            <Select  onChange={(value) => handleEntitySubTypeChange(value)}>
                {entitySubType.map(subType => 
                  <Option key={subType.value} value={subType.value}>{subType.label}</Option>
                )}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="entityType"
            label="Entity Type"
            rules={[
              {
                required: true,
                message: 'Entity Type is required',
              },
            ]}
          >
              <Select disabled>
                {entitySubType.map(type => 
                  <Option key={type.entityTypeValue} value={type.entityTypeValue}>{type.entityTypeLabel}</Option>
                )}
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="primaryKey"
            label="Primary Key"
            rules={[
              {
                required: true,
                message: 'Primary Key is required',
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="property1"
            label="Property 1"
            rules={[
              {
                required: true,
                message: 'Property 1 is required',
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="value1"
            label="Value_1"
            rules={[
              {
                required: true,
                message: 'Value_1 is required',
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}></Col>
      </Row>

      <Row gutter={16}>
        <Col span={24}>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ float: 'right' }}>
              Submit
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default EntityForm;
