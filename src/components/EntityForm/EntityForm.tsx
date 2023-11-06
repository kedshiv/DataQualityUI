import React, { Dispatch, SetStateAction, useEffect } from 'react';
import { Form, Input, Select, Button, Row, Col } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { ENTITY_TEMPLATES, ENTITY_TEMPLATE_PROPERTIES } from '../../data';
import { IEntityTemplate, IGroupedOption } from '../../interfaces';
import { formatString } from '../../common/utilities/utils';

const { Option, OptGroup } = Select;

type EntityFormProps = {
  setIsModalVisible: Dispatch<SetStateAction<boolean>>;
  setData: Dispatch<SetStateAction<any>>;
};
const EntityForm = (props: EntityFormProps) => {
  const { setIsModalVisible, setData } = props;
  const [form] = Form.useForm();

  const createEntities = (values: any) => {
    console.log(values);
    const savedData = localStorage.getItem('entities');
    let allData = [];
    if (savedData) {
      allData = JSON.parse(savedData);
    }
    allData.push(values);
    localStorage.setItem('entities', JSON.stringify(allData));
    setIsModalVisible(false);
    setData(allData);
    form.resetFields();
  };

  useEffect(() => {
    return () => {
      form.resetFields();
    };
  });

  const handleEntitySubTypeChange = (value: string) => {
    // Clear existing properties
    form.setFieldsValue({ properties: [] });

    // Find the corresponding entity_type for the selected entity_subtype
    const entityType = ENTITY_TEMPLATES.find(template => template.entity_subtype === value)
      ?.entity_type;

    // If an entity_type is found, set it in the form
    if (entityType) {
      form.setFieldsValue({ entity_type: entityType });

      // Filter the JSON data for properties based on the selected subtype
      const filteredProps = ENTITY_TEMPLATE_PROPERTIES.filter(
        prop => prop.entity_type === entityType
      );

      // Set the new properties on the form
      const newProperties = filteredProps.map(prop => ({
        propertyName: prop.entity_template_prop_key,
        propertyValue: '', // Leave value empty
        propertyType: prop.entity_template_prop_type,
        isMandatory: prop.is_mandatory,
      }));

      form.setFieldsValue({ properties: newProperties });
    }
  };

  const generateGroupedOptions = (entityTemplates: IEntityTemplate[]) => {
    const groupedOptions: Record<string, IGroupedOption[]> = {};

    entityTemplates.forEach(template => {
      const { entity_type, entity_subtype } = template;
      if (!groupedOptions[entity_type]) {
        groupedOptions[entity_type] = [];
      }
      groupedOptions[entity_type].push({
        value: entity_subtype,
        label: formatString(entity_subtype),
      });
    });
    return Object.entries(groupedOptions).map(([groupLabel, options]) => (
      <OptGroup key={groupLabel} label={groupLabel}>
        {options.map(option => (
          <Option key={option.value} value={option.value}>
            {option.label}
          </Option>
        ))}
      </OptGroup>
    ));
  };

  return (
    <Form layout='vertical' form={form} name='entityForm' onFinish={createEntities}>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name='entity_subtype'
            label='Entity SubType'
            rules={[
              {
                required: true,
                message: 'Entity SubType is required',
              },
            ]}
          >
            <Select onChange={value => handleEntitySubTypeChange(value)}>
              {generateGroupedOptions(ENTITY_TEMPLATES)}
            </Select>
          </Form.Item>
          <Form.Item name='entity_type' hidden />
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name='entityName'
            label='Entity Name'
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
            name='entityPhysicalName'
            label='Entity Physical Name'
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
      <h3>Properties</h3>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name='primaryKey'
            label='Primary Key'
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
      </Row>
      <Form.List name='properties'>
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }, index) => {
              // Assume 'isMandatory' is a boolean that indicates if the property is mandatory
              const isMandatory = form.getFieldValue(['properties', name, 'isMandatory']);
              return (
                <Row key={key} gutter={16} justify={'center'}>
                  <Col span={8}>
                    <Form.Item
                      {...restField}
                      name={[name, 'propertyName']}
                      label={`Property ${index + 1}`}
                      rules={[
                        {
                          required: isMandatory,
                          message: 'Property Name is required',
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item {...restField} name={[name, 'propertyType']} label='Property Type'>
                      <Select>{<option value={'VARIABLE'} label='Variable'></option>}</Select>
                    </Form.Item>
                  </Col>
                  <Col span={10}>
                    <Form.Item
                      {...restField}
                      name={[name, 'propertyValue']}
                      rules={[
                        {
                          required: isMandatory,
                          message: 'Property Name is required',
                        },
                      ]}
                      label='Property Value'
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  {/* Conditionally render the delete button */}
                  <Col span={2}>
                    {!isMandatory && (
                      <Form.Item label=' '>
                        <Button icon={<MinusCircleOutlined />} onClick={() => remove(name)} />
                      </Form.Item>
                    )}
                  </Col>
                </Row>
              );
            })}
            <Form.Item>
              <Button type='dashed' onClick={() => add()} icon={<PlusOutlined />}>
                Add Property
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>

      <Row gutter={16}>
        <Col span={24}>
          <Form.Item>
            <Button type='primary' htmlType='submit' style={{ float: 'right' }}>
              Submit
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default EntityForm;
