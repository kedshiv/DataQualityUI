import {  useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, Space, Row, Col } from 'antd';
import styles from './entity.module.scss'
import EntityForm from '../../components/EntityForm/EntityForm';


const Entity = () => {
  const [data,setData] = useState([])
  
  const columns = [
    {
      title: 'Entity Name',
      dataIndex: 'entityName',
      key: 'entityName',
    },
    {
      title: 'Entity Physical Name',
      dataIndex: 'entityPhysicalName',
      key: 'entityPhysicalName',
    },
    {
      title: 'Entity Type',
      dataIndex: 'entityType',
      key: 'entityType',
    },
    {
      title: 'Entity SubType',
      dataIndex: 'entitySubType',
      key: 'entitySubType',
    },
    {
      title: 'Primary Key',
      dataIndex: 'primaryKey',
      key: 'primaryKey',
    },
    {
      title: 'Property_1',
      dataIndex: 'property1',
      key: 'property1',
    },
    {
      title: 'Value_1',
      dataIndex: 'value1',
      key: 'value1',
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
    const savedData = localStorage.getItem('entities');
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
        Create Entity
      </Button>
      <Table columns={columns} dataSource={data} />
      <Modal
        title="Create Entity"
        visible={isModalVisible}
        // onOk={handleCreateRules}
        onCancel={handleCancel}
        width={'70%'} // Set the desired width
        footer={null}
      >
        <EntityForm setIsModalVisible={setIsModalVisible} setData={setData} />
      </Modal>

    </div>
  );
};

export default Entity;
