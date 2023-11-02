import React, { Dispatch, SetStateAction } from 'react';
import { Form, Input, Button, Row, Col } from 'antd';

type RulesetFormProps = {
    setIsModalVisible: Dispatch<SetStateAction<boolean>>
    setData: Dispatch<SetStateAction<any>>
}
const RuleForm = (props: RulesetFormProps) => {
    const { setIsModalVisible, setData} = props;
  const [form] = Form.useForm();
  
  const createRuleset = (values: any) => {
    const savedData = localStorage.getItem('ruleset');
    let allData = [];
    if(savedData){
       allData = JSON.parse(savedData);
    }
    allData.push(values);
    localStorage.setItem('ruleset', JSON.stringify(allData));
    setIsModalVisible(false)
    setData(allData)
    form.resetFields();
  };
  
  return (
    <Form layout='vertical' form={form} name="rulesetForm" onFinish={createRuleset}>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="ruleSetName"
            label="Ruleset Name"
            rules={[
              {
                required: true,
                message: 'Ruleset Name is required',
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="rulesetDescription"
            label="Ruleset Description"
            rules={[
              {
                required: true,
                message: 'Ruleset Description is required',
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
            name="notificationEmail"
            label="Notification Email"
            rules={[
              {
                required: true,
                message: 'Notification Email is required',
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
              Submit Ruleset
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default RuleForm;
