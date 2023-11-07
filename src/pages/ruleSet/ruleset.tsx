import { useEffect, useState } from 'react';
import { Table, Button, Modal, Space, Tag, Form, Row, Input } from 'antd';
import styles from './ruleset.module.scss';
import RulesetForm from '../../components/RulesetForm/RulesetForm';
import { v4 as uuidv4 } from 'uuid';

const RuleSet = () => {
  const [ruleset, setRuleset] = useState([]);
  const [currentRuleset, setCurrentRuleSet] = useState<any>(null);
  const [rulesetForm] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  const handleSearch = (text: string) => {
    setSearchText(text);
    const filteredRules = ruleset.filter((ruleset: any) =>
      ruleset.ruleSetName.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredData(filteredRules);
  };

  const createRuleset = (submitType: any) => {
    rulesetForm
      .validateFields()
      .then(() => {
        const savedData = localStorage.getItem('ruleset');
        const values = rulesetForm.getFieldsValue();

        let allData = [];
        if (savedData) {
          allData = JSON.parse(savedData);
        }
        allData.push({ ...values, id: uuidv4(), isDraft: submitType !== 'submit' });
        localStorage.setItem('ruleset', JSON.stringify(allData));
        setIsModalVisible(false);
        setRuleset(allData);
        rulesetForm.resetFields();
      })
      .catch(errorInfo => {
        // Form has validation errors
      });
  };

  const editRuleSet = ({ record = undefined }: any) => {
    rulesetForm
      .validateFields()
      .then(() => {
        const values = record ? record : rulesetForm.getFieldsValue();

        const currentRuleSetId = record ? record.id : currentRuleset.id;
        const savedData = localStorage.getItem('ruleset');

        let allData = [];
        if (savedData) {
          allData = JSON.parse(savedData).map((ruleset: any) => {
            if (ruleset.id === currentRuleSetId) {
              return { ...ruleset, ...values };
            }
            return ruleset;
          });
        }
        localStorage.setItem('ruleset', JSON.stringify(allData));
        setIsModalVisible(false);
        setRuleset(allData);
        rulesetForm.resetFields();
      })
      .catch(errorInfo => {
        // Form has validation errors
      });
  };

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
          {record.isDraft && (
            <button
              onClick={() => {
                record.isDraft = false;
                editRuleSet({ record });
              }}
            >
              Submit Draft
            </button>
          )}
        </Space>
      ),
    },
  ];

  useEffect(() => {
    // Load saved enttities from localStorage
    const savedData = localStorage.getItem('ruleset');
    if (savedData) {
      setRuleset(JSON.parse(savedData));
    }
  }, []);

  useEffect(() => {
    setFilteredData(ruleset);
  }, [ruleset]);

  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div>
      <Row style={{ float: 'right' }}>
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
      </Row>
      <div>
        <Input
          placeholder='Search Ruleset Name'
          value={searchText}
          onChange={e => handleSearch(e.target.value)}
          style={{ width: 300 }}
        />
        <Table columns={columns} dataSource={filteredData} />
      </div>

      <Modal
        title='Create Ruleset'
        open={isModalVisible}
        onCancel={handleCancel}
        width={'70%'}
        key={uuidv4()}
        footer={null}
      >
        <RulesetForm
          editRuleSet={editRuleSet}
          rulesetForm={rulesetForm}
          createRuleset={createRuleset}
          currentRuleset={currentRuleset}
        />
      </Modal>
    </div>
  );
};

export default RuleSet;
