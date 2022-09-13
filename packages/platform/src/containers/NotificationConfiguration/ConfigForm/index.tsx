import React, { useEffect, useMemo } from 'react';
import { useStore } from '@kubed/stook';
import { cloneDeep, mergeWith } from 'lodash';
import { Form, Button } from '@kubed/components';

import FooterBtn from './components/footer';
import type { NavItem } from '../../../types';
import EnableService from './components/enable-service';
import { customMerge, initNotificationConfigStore } from './utils';

import Email from './Email';
import WeCom from './WeCom';
import Slack from './Slack';
import FeiShu from './FeiShu';
import Webhook from './Webhook';
import DingTalk from './DingTalk';
import ControlSetting from './components/ControlSetting';

const FORM_MAP: Record<string, React.ReactNode> = {
  email: <Email />,
  feishu: <FeiShu />,
  dingtalk: <DingTalk />,
  wecom: <WeCom />,
  slack: <Slack />,
  webhook: <Webhook />,
};

type Props = {
  currentTab: string;
  tabs: Array<NavItem>;
};

function ConfigForm({ currentTab, tabs }: Props): JSX.Element {
  const isLoading = false;
  const tabType = useMemo(() => {
    if (!currentTab) {
      return 'email';
    }
    return currentTab === 'mail' ? 'email' : currentTab;
  }, [currentTab]);
  const [store, setStore] = useStore<Record<string, any>>('NotificationConfigStore', initNotificationConfigStore(tabs));
  const currentFormData = useMemo(() => {
    return store[tabType];
  }, [store]);

  function onValuesChange(data: any, values: Record<string, any>): void {
    const formData = cloneDeep(store);
    setStore(mergeWith(formData, { [tabType]: values }, customMerge));
  }

  function handleVerify(): void {
    console.log('should verify form data');
  }

  function handleSubmit(): void {
    console.log('form submit', store[tabType]);
  }

  function onCancel(): void {
    console.log('form change cancel');
  }

  useEffect(() => {
    // todo fetch data
    // loading = true
    // console.log(`should fetch ${tabType} data`, store[tabType]);
    // loading = false
    // todo merge response data to currentFormData
    // const newData = cloneDeep(store)
    // setStore({...newData, [tabType]: merged(newData[tabType], responseData)})
  }, [tabType]);

  return (
    <Form autoComplete="off" initialValues={currentFormData} onValuesChange={onValuesChange}>
      <EnableService
        id={tabType}
        name={['receiver', 'spec', tabType, 'enabled']}
        title={tabs.find(item => item.name === currentTab)?.title ?? 'Mail'}
      />
      <div className="mb-12 content">
        {FORM_MAP[tabType]}
        <ControlSetting
          id={tabType}
          name={['receiver', 'spec', tabType, 'alertSelector', 'matchExpressions']}
        />
      </div>
      <div className="mb-12 content horizon">
        <p>{t('SEND_TEST_MESSAGE_DESC')}</p>
        <Button onClick={handleVerify}>{t('SEND_TEST_MESSAGE')}</Button>
      </div>
      <FooterBtn isLoading={isLoading} onCancel={onCancel} handleSubmit={handleSubmit} />
    </Form>
  );
}

export default ConfigForm;
