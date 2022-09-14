import React from 'react';
import { get, uniq } from 'lodash';
import { useStore } from '@kubed/stook';
import { notify } from '@kubed/components';
import { Pattern } from '@ks-console/shared';

import List from '../components/List';
import BoxInput from '../components/BoxInput';
import type { ListItem } from '../../../../types';

type Props = {
  onChange?: (val: string[]) => void;
};

function EmailReceivers({ onChange }: Props): JSX.Element {
  const [store] = useStore('NotificationConfigStore');
  const values: string[] = get(store.email, 'receiver.spec.email.to', []);

  function onAdd(newValue: string): void {
    onChange?.(uniq([...values, newValue]));
  }

  function onDelete(item: ListItem): void {
    onChange?.(values.filter(value => value !== item.title));
  }

  function validateMail(email: string): boolean {
    const count = globals.config.notification.wecom.max_number_of_email;

    if (!email) {
      notify.error(t('EMAIL_EMPTY_DESC'), { duration: 6000 });
      return false;
    }
    if (values.length > count - 1) {
      notify.error(t.html('MAX_EAMIL_COUNT', { count }), { duration: 1000 });
      return false;
    }
    if (values.some(item => item === email)) {
      notify.error(t('EMAIL_EXISTS'), { duration: 1000 });
      return false;
    }
    if (!Pattern.PATTERN_EMAIL.test(email)) {
      notify.error(t('INVALID_EMAIL'), { duration: 1000 });
      return false;
    }

    return true;
  }

  return (
    <div className="input-item">
      <BoxInput className="mb-12" onAdd={onAdd} validate={validateMail} />
      {!!values.length && (
        <List items={values.map((value: string) => ({ title: value }))} onDelete={onDelete} />
      )}
    </div>
  );
}

export default EmailReceivers;
