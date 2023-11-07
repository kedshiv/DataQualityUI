import { useEffect, useState } from 'react';
import { Table, Button, Space, Tag, Input, Row, Form } from 'antd';
import styles from './rule.module.scss';
import { v4 as uuidv4 } from 'uuid';
import RuleDetailsModal from '../../components/RuleForm/RuleDetailsModal';
import RuleFormModal from '../../components/RuleForm/RuleFormModal';

export type CreateRule = {
  submitType: string;
  record?: any;
};
const Rule = () => {
  const [rule, setRule] = useState<any>([]);
  const [currentRule, setCurrentRule] = useState<any>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isRuleModalVisible, setIsRuleModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState(rule);
  const [ruleForm] = Form.useForm();

  const handleSearch = (text: string) => {
    setSearchText(text);
    const filteredRules = rule.filter((rule: any) =>
      rule.ruleName.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredData(filteredRules);
  };

  const editRule = ({ record = undefined }: any) => {
    ruleForm
      .validateFields()
      .then(() => {
        const savedData = localStorage.getItem('rule');
        const values = record ? record : ruleForm.getFieldsValue();
        const currentRuleId = record ? record.id : currentRule.id;

        let allData = [];
        if (savedData) {
          allData = JSON.parse(savedData).map((rule: any) => {
            if (rule.id === currentRuleId) {
              return { ...rule, ...values };
            }
            return rule;
          });
        }
        localStorage.setItem('rule', JSON.stringify(allData));
        setIsModalVisible(false);
        setRule(allData);
        ruleForm.resetFields();
      })
      .catch(errorInfo => {
        // Form has validation errors
      });
  };

  const createRule = ({ submitType, record = undefined }: CreateRule) => {
    ruleForm
      .validateFields()
      .then(() => {
        const savedData = localStorage.getItem('rule');
        const values = record ? record : ruleForm.getFieldsValue();
        let allData = [];
        if (savedData) {
          allData = JSON.parse(savedData);
        }

        allData.push({ ...values, id: uuidv4(), isDraft: submitType !== 'submit' });
        localStorage.setItem('rule', JSON.stringify(allData));
        setIsModalVisible(false);
        setRule(allData);
        ruleForm.resetFields();
      })
      .catch(errorInfo => {
        // Form has validation errors
      });
  };

  const columns = [
    {
      title: 'Rule Name',
      dataIndex: 'ruleName',
      key: 'ruleName',
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
              setCurrentRule(record);
              showRuleModalDetails();
            }}
          >
            View
          </button>
          <button
            onClick={() => {
              setCurrentRule(record);
              showRuleFormModal();
            }}
          >
            Edit
          </button>
          {record.isDraft && (
            <button
              onClick={() => {
                record.isDraft = false;
                editRule({ record });
              }}
            >
              Submit Draft
            </button>
          )}
          {/* <a>Delete</a> */}
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

  useEffect(() => {
    setFilteredData(rule);
  }, [rule]);

  const showRuleFormModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const showRuleModalDetails = () => {
    setIsRuleModalVisible(true);
  };

  const handleRuleModalCancel = () => {
    setIsRuleModalVisible(false);
  };

  return (
    <div>
      <Row style={{ float: 'right' }}>
        <Button
          type='primary'
          onClick={() => {
            setCurrentRule(null);
            showRuleFormModal();
          }}
          className={styles.createButton}
        >
          Create Rule
        </Button>
      </Row>
      <div>
        <Input
          placeholder='Search Rule Name'
          value={searchText}
          onChange={e => handleSearch(e.target.value)}
          style={{ width: 300 }}
        />
        <Table columns={columns} dataSource={filteredData} />
      </div>

      <RuleFormModal
        createRule={createRule}
        editRule={editRule}
        ruleForm={ruleForm}
        isModalVisible={isModalVisible}
        handleCancel={handleCancel}
        key={uuidv4()}
        currentRule={currentRule}
      />

      <RuleDetailsModal
        isModalVisible={isRuleModalVisible}
        ruleData={currentRule}
        handleModalClose={handleRuleModalCancel}
      />
    </div>
  );
};

export default Rule;
