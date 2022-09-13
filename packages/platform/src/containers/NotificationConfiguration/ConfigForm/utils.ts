import { isArray } from 'lodash';

import { NavItem } from '../../../types';

export const getNotificationConfigTemplate = ({ name }: any) => ({
  apiVersion: 'notification.kubesphere.io/v2beta2',
  kind: 'Config',
  metadata: {
    name,
  },
  spec: {},
});

export const getNotificationReceiverTemplate = ({ name, type }: any) => ({
  apiVersion: 'notification.kubesphere.io/v2beta2',
  kind: 'Receiver',
  metadata: {
    name,
  },
  spec: {
    [type]: {
      enabled: false,
    },
  },
});

export const getGlobalSecretTemplate = ({ name }: any) => ({
  apiVersion: 'v1',
  kind: 'Secret',
  metadata: {
    name,
  },
  type: 'Opaque',
});

export function getInitFormDataByTab(tab: string): Record<string, any> {
  return {
    config: getNotificationConfigTemplate({
      name: `default-${tab}-config`,
    }),
    receiver: getNotificationReceiverTemplate({
      name: `'global-${tab}-receiver'`,
      type: tab,
    }),
    secret: getGlobalSecretTemplate({
      name: `global-${tab}-config-secret`,
    }),
  };
}

export const DEFAULT_FORM_DATA = {
  notificationconfigs: getNotificationConfigTemplate,
  notificationreceivers: getNotificationReceiverTemplate,
  globalsecret: getGlobalSecretTemplate,
};

export function initNotificationConfigStore(tabs: NavItem[]): Record<string, any> {
  return tabs.reduce((acc, { name }: NavItem) => {
    const key = name === 'mail' ? 'email' : name;
    acc[key] = getInitFormDataByTab(key);
    return acc;
  }, {} as Record<string, any>);
}

export function customMerge(objValue: Record<string, any>, srcValue: Record<string, any>): any {
  if (isArray(objValue)) {
    return srcValue;
  }
}
