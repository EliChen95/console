import React from 'react';
import { FormItem, Input, Select } from '@kubed/components';

function Webhook(): JSX.Element {
  return (
    <>
      <FormItem
        label={t('Webhook URL')}
        name={['receiver', 'spec', 'webhook', 'url']}
        rules={[{ required: true, message: t('WEBHOOK_URL_DESC') }]}
      >
        <Input />
      </FormItem>
      <FormItem
        label={t('VERIFICATION_TYPE')}
        name={['receiver', 'metadata', 'annotations', 'kubesphere.io/verify-type']}
        rules={[
          {
            required: true,
            message: t('VERIFICATION_TYPE_DESC'),
          },
        ]}
      >
        <Select options={[]} placeholder=" " />
      </FormItem>
    </>
  );
}

export default Webhook;
