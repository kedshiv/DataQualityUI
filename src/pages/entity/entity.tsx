import { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Modal,
  Space,
  message,
  Popconfirm,
  Typography,
  Tag,
  Row,
  Input,
} from 'antd';
import styles from './entity.module.scss';
import EntityForm from '../../components/EntityForm/EntityForm';
import { formatString } from '../../common/utilities/utils';
import NiceModal from '@ebay/nice-modal-react';
import { IEntity } from '../../interfaces';
import EntityDetailsModal from '../../components/EntityDetails/EntityDetailsModal';
import { ACTIONS, modalTitle } from '../../common/constants';

const { Text } = Typography;

const Entity = () => {
  const [entity, setEntity] = useState<IEntity[]>([]);
  const [editingEntity, setEditingEntity] = useState<IEntity | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [action, setAction] = useState<ACTIONS>(ACTIONS.CREATE);
  const [searchText, setSearchText] = useState('');
  const [filteredEntities, setFilteredEntities] = useState(entity);
  useEffect(() => {
    // Load saved enttities from localStorage
    const savedData = localStorage.getItem('entities');
    if (savedData) {
      setEntity(JSON.parse(savedData));
    }
  }, []);

  useEffect(() => {
    setFilteredEntities(entity);
  }, [entity]);

  const showModal = () => {
    setAction(ACTIONS.CREATE);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setEditingEntity(null); // Ensure no entity is set for editing
    setIsModalVisible(false);
  };

  const handleSearch = (text: string) => {
    setSearchText(text);
    const filteredEntities = entity.filter((data: IEntity) =>
      data.entityName.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredEntities(filteredEntities);
  };

  const showEntityDetails = (entity: any) => {
    NiceModal.show(EntityDetailsModal, { entity });
  };

  const editOrCloneEntityModal = (entity: IEntity, action: ACTIONS) => {
    setAction(action);
    const entityDetails = {
      ...entity,
      ...(action === ACTIONS.CLONE && { entityName: `${entity.entityName}_clone` }),
    };
    setEditingEntity(entityDetails); // Set the entity to edit
    setIsModalVisible(true); // Show the form modal
  };

  const deleteEntity = (entity: IEntity) => {
    let entities: string | null | [IEntity] = localStorage.getItem('entities');
    const parsedEntities = JSON.parse(entities || '') || [];
    if (parsedEntities) {
      let filteredEntities = parsedEntities.filter(
        (ent: IEntity) => ent.entityName !== entity.entityName
      );
      localStorage.setItem('entities', JSON.stringify(filteredEntities));
      setEntity(filteredEntities);
      message.success('Entity deleted successfully!');
    }
  };

  const columns = [
    {
      title: 'Entity Name',
      dataIndex: 'entityName',
      key: 'entityName',
      render: (name: string, record: IEntity) => (
        <>
          <Text>{name}</Text> {record?.isDraft ? <Tag>Draft</Tag> : null}
        </>
      ),
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
      render: (type: string) => formatString(type),
    },
    {
      title: 'Entity SubType',
      dataIndex: 'entity_subtype',
      key: 'entity_subtype',
      render: (subtype: string) => formatString(subtype),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: IEntity) => (
        <Space size='middle'>
          <a onClick={() => showEntityDetails(record)}>View</a>
          <a onClick={() => editOrCloneEntityModal(record, ACTIONS.CLONE)}>clone</a>
          <a
            onClick={() => {
              editOrCloneEntityModal(record, ACTIONS.EDIT);
            }}
          >
            Edit
          </a>
          <Popconfirm
            title='Delete the Entity'
            description='Are you sure to delete this entity?'
            onConfirm={() => {
              deleteEntity(record);
            }}
            onCancel={() => {}}
            okText='Delete'
            cancelText='Cancel'
          >
            <a> Delete</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Row style={{ float: 'right' }}>
        <Button type='primary' onClick={showModal} className={styles.createButton}>
          Create Entity
        </Button>
      </Row>
      <div>
        <Input
          placeholder='Search Entity Name'
          value={searchText}
          onChange={e => handleSearch(e.target.value)}
          style={{ width: 300 }}
        />
        <Table columns={columns} dataSource={filteredEntities} />
      </div>
      <Modal
        title={`${modalTitle[action]} entity`}
        open={isModalVisible}
        onCancel={handleCancel}
        width={'70%'}
        footer={null}
      >
        <EntityForm
          action={action}
          setIsModalVisible={setIsModalVisible}
          setEntity={setEntity}
          entityToEdit={editingEntity}
        />
      </Modal>
    </div>
  );
};

export default Entity;
