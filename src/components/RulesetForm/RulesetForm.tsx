import React, { Dispatch, SetStateAction, useEffect } from 'react';
import { Form, Input, Select, Button, Row, Col } from 'antd';
import { v4 as uuidv4 } from 'uuid';

type RulesetFormProps = {
  setIsModalVisible: Dispatch<SetStateAction<boolean>>;
  setData: Dispatch<SetStateAction<any>>;
  currentRuleset: any;
};
const RulesetForm = (props: RulesetFormProps) => {
  const { setIsModalVisible, setData, currentRuleset } = props;
  const [rulesetForm] = Form.useForm();

  const createRuleset = (submitType: any) => {
    rulesetForm
      .validateFields()
      .then(() => {
        const savedData = localStorage.getItem('ruleset');
        const values = rulesetForm.getFieldsValue();

        let allData = [];
        if (savedData) {
          allData = JSON.parse(savedData);
        }
        allData.push({ ...values, id: uuidv4(), isDraft: submitType !== 'submit' });
        localStorage.setItem('ruleset', JSON.stringify(allData));
        setIsModalVisible(false);
        setData(allData);
        rulesetForm.resetFields();
      })
      .catch(errorInfo => {
        // Form has validation errors
      });
  };

  const editRule = () => {
    rulesetForm
      .validateFields()
      .then(() => {
        const values = rulesetForm.getFieldsValue();
        const savedData = localStorage.getItem('ruleset');
        let allData = [];
        if (savedData) {
          allData = JSON.parse(savedData).map((ruleset: any) => {
            if (ruleset.id === currentRuleset.id) {
              return { ...ruleset, ...values };
            }
            return ruleset;
          });
        }
        localStorage.setItem('ruleset', JSON.stringify(allData));
        setIsModalVisible(false);
        setData(allData);
        rulesetForm.resetFields();
      })
      .catch(errorInfo => {
        // Form has validation errors
      });
  };

  useEffect(() => {
    if (currentRuleset) {
      rulesetForm.setFieldsValue(currentRuleset);
    }
  }, []);

  return (
    <Form layout='vertical' form={rulesetForm} name='rulesetForm' onFinish={createRuleset}>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name='ruleSetName'
            label='Ruleset Name'
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
            name='rulesetDescription'
            label='Ruleset Description'
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
            name='notificationEmail'
            label='Notification Email'
            rules={[
              {
                required: true,
                message: 'Notification Email is required',
              },
              {
                type: 'email',
                message: 'Please enter a valid email address',
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}></Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}></Col>
        <Col span={12}>
          <Col span={12} style={{ float: 'right' }}>
            {!currentRuleset && (
              <Form.Item>
                <Button type='primary' htmlType='submit' onClick={() => createRuleset('draft')}>
                  Save as Draft
                </Button>
              </Form.Item>
            )}
          </Col>
          <Col span={12} style={{ float: 'right' }}>
            <Form.Item>
              <Button
                type='primary'
                htmlType='submit'
                onClick={currentRuleset ? editRule : () => createRuleset('submit')}
              >
                {currentRuleset ? 'Edit ruleset' : 'Save & Submit Ruleset'}
              </Button>
            </Form.Item>
          </Col>
        </Col>
      </Row>
    </Form>
  );
};

export default RulesetForm;
