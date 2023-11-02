import {  useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, Space, Row, Col } from 'antd';
import styles from './entity.module.scss'
import EntityForm from '../../components/EntityForm/EntityForm';
import { formatString } from '../../common/utilities/utils';


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
      dataIndex: 'entity_type',
      key: 'entity_type',
      render: (type: string) => formatString(type)
    },
    {
      title: 'Entity SubType',
      dataIndex: 'entity_subtype',
      key: 'entity_subtype',
      render: (subtype: string) => formatString(subtype)
    },
    // {
    //   title: 'Primary Key',
    //   dataIndex: 'primaryKey',
    //   key: 'primaryKey',
    // },
    // {
    //   title: 'Property_1',
    //   dataIndex: 'property1',
    //   key: 'property1',
    // },
    // {
    //   title: 'Value_1',
    //   dataIndex: 'value1',
    //   key: 'value1',
    // },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space size="middle">
          <a>View</a>
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
