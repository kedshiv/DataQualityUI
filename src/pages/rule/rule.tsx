import {  useEffect, useState } from 'react';
import { Table, Button, Modal, Space } from 'antd';
import styles from './rule.module.scss'
import RuleForm from '../../components/RuleForm/RuleForm';


const Rule = () => {
  const [data,setData] = useState([])
  
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
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space size="middle">
          <a>Edit</a>
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
      <Button type="primary" onClick={showModal}  className={styles.createButton}>
        Create Rule
      </Button>
      <Table columns={columns} dataSource={data} />
      <Modal
        title="Create Rule"
        visible={isModalVisible}
        onCancel={handleCancel}
        width={'70%'} 
        footer={null}
      >
        <RuleForm setIsModalVisible={setIsModalVisible} setData={setData} />
      </Modal>

    </div>
  );
};

export default Rule;
