import React from 'react';
import { Descriptions, Modal, Space } from 'antd';
import type { DescriptionsProps } from 'antd';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { formatString } from '../../common/utilities/utils';

interface EntityProperty {
  propertyName: string;
  propertyValue: string;
  propertyType: string;
  isMandatory: boolean;
}

interface Entity {
  entity_subtype: string;
  entity_type: string;
  entityName: string;
  entityPhysicalName: string;
  primaryKey: string;
  properties: EntityProperty[];
}

interface EntityDetailsModalProps {
  entity: Entity;
}

// Function to convert entity details to description items
const entityToDescriptionsItems = (entity: Entity): DescriptionsProps['items'] => {
  const baseItems: DescriptionsProps['items'] = [
    {
      key: '1',
      label: 'Entity SubType',
      children: entity.entity_subtype,
    },
    {
      key: '2',
      label: 'Entity Type',
      children: entity.entity_type,
    },
    {
      key: '3',
      label: 'Entity Name',
      children: entity.entityName,
    },
    {
      key: '4',
      label: 'Entity Physical Name',
      children: entity.entityPhysicalName,
    },
    {
      key: '5',
      label: 'Primary Key',
      children: entity.primaryKey,
    },
  ];

  // Add entity properties to the items
  const propertyItems: DescriptionsProps['items'] = entity.properties.map((prop, index) => ({
    key: `property-${index}`,
    label: `Property ${index + 1}`,
    children: (
        <Descriptions 
        bordered
        items={[
          {
            key: 'prop-${index}',
            label: `${prop.propertyName}`,
            children: prop.propertyValue
          }
        ]} />
    ),
  }));

  return [...baseItems, ...propertyItems];
};

export const EntityDetailsModal = NiceModal.create(({ entity }: EntityDetailsModalProps) => {
  const modal = useModal();

  const items = entityToDescriptionsItems(entity);

  return (
    <Modal
      title="Entity Details"
      visible={modal.visible}
      onCancel={modal.hide}
      footer={null}
      width={800}
    >
      <Descriptions items={items} column={1} />
    </Modal>
  );
});

export default EntityDetailsModal;
