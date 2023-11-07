import { useEffect, useState } from 'react';
import { Table, Button, Modal, Space, Tag } from 'antd';
import styles from './ruleset.module.scss';
import RulesetForm from '../../components/RulesetForm/RulesetForm';
import { v4 as uuidv4 } from 'uuid';

const RuleSet = () => {
  const [data, setData] = useState([]);
  const [currentRuleset, setCurrentRuleSet] = useState<any>(null);

  const columns = [
    {
      title: 'Ruleset Name',
      dataIndex: 'ruleSetName',
      key: 'ruleSetName',
    },
    {
      title: 'Ruleset Description',
      dataIndex: 'rulesetDescription',
      key: 'rulesetDescription',
    },
    {
      title: 'Notification Email',
      dataIndex: 'notificationEmail',
      key: 'notificationEmail',
    },
    {
      title: 'Status',
      dataIndex: 'isDraft',
      key: 'isDraft',
      render: (_: any, record: any) => (
        <Space size='middle'>
          <Tag color={`${record.isDraft ? 'red' : 'blue'}`}>
            {record.isDraft ? 'Drafted' : 'Submitted'}
          </Tag>
        </Space>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space size='middle'>
          <button
            onClick={() => {
              setCurrentRuleSet(record);
              showModal();
            }}
          >
            Edit
          </button>{' '}
          <a>Delete</a>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    // Load saved enttities from localStorage
    const savedData = localStorage.getItem('ruleset');
    if (savedData) {
      setData(JSON.parse(savedData));
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
      <Button
        type='primary'
        onClick={() => {
          setCurrentRuleSet(null);
          showModal();
        }}
        className={styles.createButton}
      >
        Create Ruleset
      </Button>
      <Table columns={columns} dataSource={data} />
      <Modal
        title='Create Ruleset'
        open={isModalVisible}
        onCancel={handleCancel}
        width={'70%'}
        footer={null}
      >
        <RulesetForm
          key={uuidv4()}
          currentRuleset={currentRuleset}
          setIsModalVisible={setIsModalVisible}
          setData={setData}
        />
      </Modal>
    </div>
  );
};

export default RuleSet;
