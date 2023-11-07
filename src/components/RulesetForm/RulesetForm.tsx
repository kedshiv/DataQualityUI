import React, { Dispatch, SetStateAction, useEffect } from 'react';
import { Form, Input, Select, Button, Row, Col, FormInstance } from 'antd';
import { v4 as uuidv4 } from 'uuid';

type RulesetFormProps = {
  currentRuleset: any;
  createRuleset: (submitType: string) => void;
  rulesetForm: FormInstance<any>;
  editRuleSet: ({ record }: any) => void;
};
const RulesetForm = (props: RulesetFormProps) => {
  const { currentRuleset, rulesetForm, createRuleset, editRuleSet } = props;

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
                onClick={currentRuleset ? editRuleSet : () => createRuleset('submit')}
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
