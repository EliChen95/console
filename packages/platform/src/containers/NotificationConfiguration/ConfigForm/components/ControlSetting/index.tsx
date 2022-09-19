import React, { ChangeEvent, useEffect, useState } from 'react';
import { get } from 'lodash';
import { useStore } from '@kubed/stook';
import { Icon } from '@ks-console/shared';
import { Checkbox, Field, FormItem } from '@kubed/components';

import ConditionEditor from './ConditionEditor';

import { Desc, Annotation } from './styles';
import { ItemWrapper } from '../../styles';

type Props = {
  id: string;
  name: string[];
  onChange?: (val: any) => void;
};

function ControlSetting({ id, name }: Props): JSX.Element {
  const [store] = useStore('NotificationConfigStore');
  const [checked, setChecked] = useState<boolean>(!!get(store[id], name.join('.')));

  function handleChange({ target }: ChangeEvent<HTMLInputElement>): void {
    setChecked(target.checked);
  }

  function checkItemValid(item: any): boolean {
    return item.key && item.operator;
  }

  function itemValidator(rule: any, value: any, callback: any) {
    if (!value) {
      return callback();
    }
    if (value.some((item: any) => !checkItemValid(item))) {
      return callback({ message: t('INVALID_NOTIFICATION_CONDITION') });
    }
    callback();
  }

  useEffect(() => {
    setChecked(!!get(store[id], name.join('.')));
  }, [id]);

  return (
    <ItemWrapper>
      <Field
        avatar={<Checkbox checked={checked} onChange={handleChange} />}
        label={t('NOTIFICATION_CONDITION_SETTINGS_DESC')}
        value={t('NOTIFICATION_CONDITIONS')}
      />
      {checked && (
        <FormItem name={name} rules={[{ validator: itemValidator }]}>
          <ConditionEditor
            conditions={get(store[id], name.join('.'), [''])}
            addText={t('ADD')}
            desc={
              <Annotation>
                <Icon name="question" />
                <Desc>{t('NOTIFICATION_CONDITION_SETTING_TIP')}</Desc>
              </Annotation>
            }
          />
        </FormItem>
      )}
    </ItemWrapper>
  );
}

export default ControlSetting;
