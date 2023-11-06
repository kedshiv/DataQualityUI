import { useEffect, useState } from 'react';
import { Table, Button, Modal, Space, Tag } from 'antd';
import styles from './rule.module.scss';
import RuleForm from '../../components/RuleForm/RuleForm';
import { v4 as uuidv4 } from 'uuid';
const Rule = () => {
  const [rule, setRule] = useState([]);

  const [visibleProperties, setVisibleProperties] = useState(false);
  const [selectedProperties, setSelectedProperties] = useState([]);
  const [currentRule, setCurrentRule] = useState(null);
  const showPropertiesModal = (properties: any) => {
    setSelectedProperties(properties);
    setVisibleProperties(true);
  };

  const handlePropertiesCancel = () => {
    setVisibleProperties(false);
  };
  const columns = [
    {
      title: 'Rule Name',
      dataIndex: 'ruleName',
      key: 'ruleName',
    },
    {
      title: 'Rule Description',
      dataIndex: 'ruleDescription',
      key: 'ruleDescription',
    },
    {
      title: 'Rule Template Name',
      dataIndex: 'ruleTemplateName',
      key: 'ruleTemplateName',
    },
    {
      title: 'DQ Metric',
      dataIndex: 'dqMetric',
      key: 'dqMetric',
    },

    {
      title: 'Ruleset Name',
      dataIndex: 'rulesetName',
      key: 'rulesetName',
    },
    {
      title: 'Primary Source Entity',
      dataIndex: 'primarySourceEntity',
      key: 'primarySourceEntity',
    },
    {
      title: 'Primary Target Entity',
      dataIndex: 'primaryTargetEntity',
      key: 'primaryTargetEntity',
    },
    {
      title: 'Secondary Source Entity',
      dataIndex: 'secondarySourceEntity',
      key: 'secondarySourceEntity',
    },
    {
      title: 'Secondary Target Entity',
      dataIndex: 'secondaryTargetEntity',
      key: 'secondaryTargetEntity',
    },
    {
      title: 'Properties',
      key: 'properties',
      render: (_: any, record: any) => (
        <Button onClick={() => showPropertiesModal(record.properties)}>View Properties</Button>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space size='middle'>
          <button
            onClick={() => {
              setCurrentRule(record);
              showModal();
            }}
          >
            Edit
          </button>
          <a>Delete</a>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    // Load saved enttities from localStorage
    const savedData = localStorage.getItem('rule');
    if (savedData) {
      setRule(JSON.parse(savedData));
    }
  }, []);

  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div>
      <Button type='primary' onClick={showModal} className={styles.createButton}>
        Create Rule
      </Button>
      <Table columns={columns} dataSource={rule} />
      <Modal
        title='Create Rule'
        open={isModalVisible}
        key={uuidv4()}
        onCancel={handleCancel}
        width={'70%'}
        footer={null}
      >
        <RuleForm
          currentRule={currentRule}
          setIsModalVisible={setIsModalVisible}
          setRule={setRule}
        />
      </Modal>

      <Modal
        title='Properties'
        open={visibleProperties}
        onCancel={handlePropertiesCancel}
        footer={null}
        width={'60%'}
      >
        <Table
          columns={[
            {
              title: 'Property Key',
              dataIndex: 'propertyKey',
              key: 'propertyKey',
            },
            {
              title: 'Property Type',
              dataIndex: 'propertyType',
              key: 'propertyType',
              render: propertyType => <Tag>{propertyType}</Tag>,
            },
            {
              title: 'Property Value',
              dataIndex: 'propertyValue',
              key: 'propertyValue',
            },
          ]}
          dataSource={selectedProperties}
          pagination={false}
        />
      </Modal>
    </div>
  );
};

export default Rule;
