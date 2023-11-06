import React, { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { Form, Input, Button, Row, Col, Select, Table, FormInstance } from 'antd';
import { RULE_TEMPLATES, RULE_TEMPLATE_PROPERTIES } from '../../data';
import { v4 as uuidv4 } from 'uuid';

const { Option } = Select;
type RulesetFormProps = {
  setIsModalVisible: Dispatch<SetStateAction<boolean>>;
  setRule: Dispatch<SetStateAction<any>>;
  currentRule: any;
};

type Properties = Array<{
  propertyKey: string;
  propertyType: string;
  propertyValue: any;
}>;
const RuleForm = (props: RulesetFormProps) => {
  const { setIsModalVisible, setRule, currentRule } = props;
  const [ruleForm] = Form.useForm();
  const [availableDQMetics, setAvailableDQMetics] = useState<string[]>([]);
  const [ruleTemplateId, setRuleTemplateId] = useState<number>(0);
  const [entities, setEntity] = useState<any>([]);
  const [ruleset, setRuleset] = useState<any>([]);
  const [secondaryEntities, setSecondaryEntities] = useState<any[]>([]);

  const handleDQMetricChange = (value: string) => {
    const ruleTemplateId = RULE_TEMPLATES.filter(
      ruleTemplates =>
        ruleTemplates.rule_template_name === ruleForm.getFieldValue('ruleTemplateName') &&
        ruleTemplates.dq_metric === value
    )[0].rule_template_id;

    setRuleTemplateId(ruleTemplateId);
  };

  useEffect(() => {
    if (currentRule) {
      ruleForm.setFieldsValue(currentRule);
      handleDQMetricChange(currentRule.dqMetric);
    }
    const entity = localStorage.getItem('entities');
    if (entity) {
      setEntity(JSON.parse(entity));
    }

    const ruleset = localStorage.getItem('ruleset');
    if (ruleset) {
      setRuleset(JSON.parse(ruleset));
    }

    return () => {
      setRuleTemplateId(0);
      ruleForm.resetFields();
    };
  }, []);

  const handleRuleTemplateChange = (value: string) => {
    // Filter available DQ Metrics based on the selected Rule Template
    const metrics = RULE_TEMPLATES.filter(template => template.rule_template_name === value).map(
      template => template.dq_metric
    );

    setAvailableDQMetics(metrics);
    ruleForm.setFieldsValue({ dqMetric: undefined }); // Reset the DQ Metric
  };

  const handlePrimarySourceChange = (value: string) => {
    // Filter entities for secondary source and target
    const secondaryEntitiesFiltered = entities.filter((entity: any) => entity.entityName !== value);
    setSecondaryEntities(secondaryEntitiesFiltered);

    // Clear secondary source and target selections
    ruleForm.setFieldsValue({ secondarySourceEntity: undefined, secondaryTargetEntity: undefined });
  };

  const createRule = (values: any) => {
    console.log({ values });

    const properties: Properties = Object.keys(values.properties).map(propertyKey => {
      const propertyType = Object.keys(values.properties[propertyKey])[0];
      const propertyValue = values.properties[propertyKey][propertyType];
      return {
        propertyKey,
        propertyType,
        propertyValue,
      };
    });

    const savedData = localStorage.getItem('rule');
    let allData = [];
    if (savedData) {
      allData = JSON.parse(savedData);
    }
    delete values.properties;

    allData.push({ ...values, properties, id: uuidv4() });
    localStorage.setItem('rule', JSON.stringify(allData));
    setIsModalVisible(false);
    setRule(allData);
    ruleForm.resetFields();
  };

  const groupedData: typeof RULE_TEMPLATE_PROPERTIES = useMemo(() => {
    const tempGroupedData: typeof RULE_TEMPLATE_PROPERTIES = [];
    RULE_TEMPLATE_PROPERTIES.forEach(item => {
      if (item.rule_template_id === ruleTemplateId) {
        // Check if the item has a rule_template_prop_key, and set it to an empty string if not defined
        if (!item.rule_template_prop_key) {
          item.rule_template_prop_key = '';
        }
        tempGroupedData.push(item);
      }
    });
    return tempGroupedData;
  }, [ruleTemplateId]);

  const columns = [
    {
      title: 'Property Key',
      dataIndex: 'rule_template_prop_key',
      key: 'rule_template_prop_key',
    },
    {
      title: 'Property Type',
      dataIndex: 'rule_template_prop_type',
      key: 'rule_template_prop_type',
    },
    {
      title: 'Property Value',
      dataIndex: 'rule_template_prop_value',
      key: 'rule_template_prop_value',
      render: (text: any, record: (typeof RULE_TEMPLATE_PROPERTIES)[0]) => {
        const isMandatory = record.is_mandatory;
        return (
          <Form.Item
            key={uuidv4()}
            name={['properties', record.rule_template_prop_key, record.rule_template_prop_type]}
            initialValue={text}
            rules={[
              {
                required: isMandatory,
                message: 'Value is required',
              },
            ]}
          >
            <Input disabled={Boolean(text)} />
          </Form.Item>
        );
      },
    },
  ];
  return (
    <Form layout='vertical' form={ruleForm} name='ruleForm' onFinish={createRule}>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name='ruleName'
            label='Rule Name'
            rules={[
              {
                required: true,
                message: 'Rule Name is required',
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name='ruleDescription'
            label='Rule Description'
            rules={[
              {
                required: true,
                message: 'Rule Description is required',
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label='Rule Template Name' name='ruleTemplateName'>
            <Select placeholder='Select Rule Template Name' onChange={handleRuleTemplateChange}>
              {RULE_TEMPLATES.map(template => (
                <Option key={template.rule_template_id} value={template.rule_template_name}>
                  {template.rule_template_name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label='DQ Metric' name='dqMetric'>
            <Select placeholder='Select DQ Metric' onChange={handleDQMetricChange}>
              {availableDQMetics.map(metric => (
                <Option key={metric} value={metric}>
                  {metric}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label='Ruleset Name' name='ruleSetName'>
            <Select placeholder='Select RuleSet Name'>
              {ruleset.map((ruleset: any) => (
                <Option key={ruleset.ruleSetName} value={ruleset.ruleSetName}>
                  {ruleset.ruleSetName}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}></Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label='Primary Source Entity'
            name='primarySourceEntity'
            rules={[{ required: true, message: 'Primary Source Entity is required' }]}
          >
            <Select placeholder='Select Primary Source Entity' onChange={handlePrimarySourceChange}>
              {entities.map((entity: any, index: any) => (
                <Option key={index} value={entity.entityName}>
                  {entity.entityName}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label='Primary Target Entity' name='primaryTargetEntity'>
            <Select placeholder='Select Primary Target Entity'>
              {entities.map((entity: any, index: any) => (
                <Option key={index} value={entity.entityName}>
                  {entity.entityName}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label='Secondary Source Entity' name='secondarySourceEntity'>
            <Select placeholder='Select Secondary Source Entity'>
              {secondaryEntities.map((entity, index) => (
                <Option key={index} value={entity.entityName}>
                  {entity.entityName}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label='Secondary Target Entity' name='secondaryTargetEntity'>
            <Select placeholder='Select Secondary Target Entity'>
              {secondaryEntities.map((entity, index) => (
                <Option key={index} value={entity.entityName}>
                  {entity.entityName}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <h2>Properties:</h2>
      <Table
        key={uuidv4()}
        columns={columns}
        dataSource={groupedData}
        pagination={false}
        rowKey='rule_template_prop_id'
      />

      <Row gutter={16}>
        <Col span={24}>
          <Form.Item>
            <Button type='primary' htmlType='submit' style={{ float: 'right' }}>
              Submit Ruleset
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default RuleForm;
