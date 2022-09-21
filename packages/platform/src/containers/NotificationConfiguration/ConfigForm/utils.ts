import { isArray } from 'lodash';

import type { NavItem } from '../../../types';
import type { BaseTemplate, BaseTemplateParam, ReceiverTemplateParam } from './types';

export const getNotificationConfigTemplate = ({ name }: BaseTemplateParam): BaseTemplate => ({
  apiVersion: 'notification.kubesphere.io/v2beta2',
  kind: 'Config',
  metadata: {
    name,
  },
  spec: {},
});

export const getNotificationReceiverTemplate = ({
  name,
  type,
}: ReceiverTemplateParam): BaseTemplate => ({
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

export const getGlobalSecretTemplate = ({ name }: BaseTemplateParam): BaseTemplate => ({
  apiVersion: 'v1',
  kind: 'Secret',
  metadata: {
    name,
  },
  type: 'Opaque',
});

export function getInitFormDataByTab(tab: string): Record<string, BaseTemplate> {
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

export function initNotificationConfigStore(tabs: NavItem[]): Record<string, BaseTemplate> {
  return tabs.reduce((acc, { name }: NavItem) => {
    const key = name === 'mail' ? 'email' : name;
    acc[key] = getInitFormDataByTab(key);
    return acc;
  }, {} as Record<string, any>);
}

export function customMerge(objValue: unknown, srcValue: unknown): unknown {
  if (isArray(objValue)) {
    return srcValue;
  }
}
