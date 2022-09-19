import React, { ReactNode, useEffect, useMemo } from 'react';
import { useStore } from '@kubed/stook';
import { cloneDeep, mergeWith } from 'lodash';
import { Form, Button } from '@kubed/components';

import FooterBtn from './components/FooterBtn';
import type { NavItem } from '../../../types';
import EnableService from './components/EnableService';
import { customMerge, initNotificationConfigStore } from './utils';

import Email from './Email';
import WeCom from './WeCom';
import Slack from './Slack';
import FeiShu from './FeiShu';
import Webhook from './Webhook';
import DingTalk from './DingTalk';
import ControlSetting from './components/ControlSetting';

import { Block, HorizonBlock } from './styles';

const FORM_MAP: Record<string, ReactNode> = {
  email: <Email />,
  feishu: <FeiShu />,
  dingtalk: <DingTalk />,
  wecom: <WeCom />,
  slack: <Slack />,
  webhook: <Webhook />,
};

type Props = {
  currentTab: string;
  tabs: NavItem[];
};

function ConfigForm({ currentTab, tabs }: Props): JSX.Element {
  const isLoading = false;
  const tabType = useMemo(() => {
    if (!currentTab) {
      return 'email';
    }
    return currentTab === 'mail' ? 'email' : currentTab;
  }, [currentTab]);
  const [store, setStore] = useStore<Record<string, any>>(
    'NotificationConfigStore',
    initNotificationConfigStore(tabs),
  );
  const currentFormData = useMemo(() => {
    return store[tabType];
  }, [store]);

  function onValuesChange(data: any, values: Record<string, any>): void {
    const formData = cloneDeep(store);
    setStore(mergeWith(formData, { [tabType]: values }, customMerge));
  }

  function handleVerify(): void {
    // todo: verify form data
  }

  function handleSubmit(): void {
    // todo: submit form data
    console.log('form submit', store[tabType]);
  }

  function onCancel(): void {
    //todo: cancel form change
    console.log('form change cancel');
  }

  useEffect(() => {
    // todo fetch data
    // loading = true
    // loading = false
    // todo merge response data to currentFormData
    // const newData = cloneDeep(store)
    // setStore({...newData, [tabType]: merged(newData[tabType], responseData)})
  }, [tabType]);

  return (
    <Form autoComplete="off" initialValues={currentFormData} onValuesChange={onValuesChange}>
      <EnableService
        id={tabType}
        className="mb12"
        name={['receiver', 'spec', tabType, 'enabled']}
        title={tabs.find(item => item.name === currentTab)?.title ?? 'Mail'}
      />
      <Block className="mb12">
        {FORM_MAP[tabType]}
        <ControlSetting
          id={tabType}
          name={['receiver', 'spec', tabType, 'alertSelector', 'matchExpressions']}
        />
      </Block>
      <HorizonBlock>
        <p>{t('SEND_TEST_MESSAGE_DESC')}</p>
        <Button onClick={handleVerify}>{t('SEND_TEST_MESSAGE')}</Button>
      </HorizonBlock>
      <FooterBtn isLoading={isLoading} onCancel={onCancel} handleSubmit={handleSubmit} />
    </Form>
  );
}

export default ConfigForm;
