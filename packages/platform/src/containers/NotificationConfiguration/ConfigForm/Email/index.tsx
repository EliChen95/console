import React from 'react';
import { get } from 'lodash';
import { useStore } from '@kubed/stook';
import { Pattern } from '@ks-console/shared';
import { Text, Input, FormItem, InputPassword } from '@kubed/components';

import EmailReceivers from './email-receivers';
import RequireTLS from './require-tsl';
import UrlInput from '../components/url-input';

import { CssContainer } from './styles';

export const initMail = {
  config: {
    apiVersion: 'notification.kubesphere.io/v2beta2',
    kind: 'Config',
    metadata: {
      name: 'default-email-config',
    },
    spec: {
      email: {
        smartHost: {
          host: '192.168.1.20',
          port: '25',
        },
        requireTLS: false,
        authUsername: 'admin',
        from: '674497150@qq.com',
      },
    },
  },
  receiver: {
    apiVersion: 'notification.kubesphere.io/v2beta2',
    kind: 'Receiver',
    metadata: {
      name: "'global-email-receiver'",
    },
    spec: {
      email: {
        enabled: false,
        to: ['674497150@qq.com', '526620562@qq.com', '626620562@qq.com'],
      },
    },
  },
  secret: {
    apiVersion: 'v1',
    kind: 'Secret',
    metadata: {
      name: 'global-email-config-secret',
    },
    type: 'Opaque',
    data: {
      authPassword: 'P@88w0rd',
    },
  },
};

function Email(): JSX.Element {
  const [store] = useStore('NotificationConfigStore');
  const defaultRequireTLS = get(store.email, 'config.spec.email.requireTLS', false);

  return (
    <CssContainer>
      <Text className="title">{t('SERVER_SETTINGS')}</Text>
      <div className="items mb-12">
        <FormItem label={t('SMTP_SERVER_ADDRESS')}>
          <UrlInput
            hostName={['config', 'spec', 'email', 'smartHost', 'host']}
            portName={['config', 'spec', 'email', 'smartHost', 'port']}
            hostRules={[
              { required: true, message: t('ADDRESS_EMPTY_DESC') },
              { pattern: Pattern.PATTERN_HOST, message: t('INVALID_ADDRESS_DESC') },
            ]}
            portRules={[
              { required: true, message: t('ENTER_PORT_NUMBER') },
              { pattern: Pattern.PATTERN_PORT, message: t('INVALID_PORT_DESC') },
            ]}
            defaultPort={25}
          />
        </FormItem>
        <FormItem name={['config', 'spec', 'email', 'requireTLS']}>
          <RequireTLS defaultChecked={defaultRequireTLS} />
        </FormItem>
        <FormItem
          label={t('SMTP_USER')}
          name={['config', 'spec', 'email', 'authUsername']}
          rules={[{ required: true, message: t('SMTP_USER_EMPTY_DESC') }]}
        >
          <Input className="input-item" placeholder={'admin@example.com'} />
        </FormItem>
        <FormItem
          label={t('SMTP_PASSWORD')}
          name={['secret', 'data', 'authPassword']}
          rules={[{ required: true, message: t('ENTER_PASSWORD_TIP') }]}
        >
          <InputPassword className="input-item" />
        </FormItem>
        <FormItem
          label={t('SENDER_EMAIL')}
          name={['config', 'spec', 'email', 'from']}
          rules={[
            { required: true, message: t('EMAIL_EMPTY_DESC') },
            { type: 'email', message: t('INVALID_EMAIL_ADDRESS_DESC') },
          ]}
        >
          <Input className="input-item" placeholder={'admin@example.com'} />
        </FormItem>
      </div>
      <Text className="title">{t('RECIPIENT_SETTINGS')}</Text>
      <div className="items mb-12">
        <FormItem
          name={['receiver', 'spec', 'email', 'to']}
          rules={[
            {
              required: true,
              message: t('ENTER_RECIPIENT_EMAIL_DESC'),
            },
          ]}
        >
          <EmailReceivers />
        </FormItem>
      </div>
    </CssContainer>
  );
}

export default Email;
