import React, { ChangeEvent, useEffect, useState } from 'react';
import { get } from 'lodash';
import { useStore } from '@kubed/stook';
import { Icon } from '@ks-console/shared';
import { RuleObject } from 'rc-field-form/lib/interface';
import { Checkbox, Field, FormItem } from '@kubed/components';

import { Condition } from './types';
import ConditionEditor from './ConditionEditor';

import { Desc, Annotation } from './styles';
import { ItemWrapper } from '../../styles';

type Props = {
  id: string;
  name: string[];
};

function ControlSetting({ id, name }: Props): JSX.Element {
  const [store] = useStore('NotificationConfigStore');
  const [checked, setChecked] = useState<boolean>(!!get(store[id], name.join('.')));

  function handleChange({ target }: ChangeEvent<HTMLInputElement>): void {
    setChecked(target.checked);
  }

  function checkItemValid(item: Condition): boolean {
    return !!item.key && !!item.operator;
  }

  function itemValidator(rule: RuleObject, value: Condition[], callback: (error?: string) => void) {
    if (!value) {
      return callback();
    }
    if (value.some((item: Condition) => !checkItemValid(item))) {
      return callback({ message: t('INVALID_NOTIFICATION_CONDITION') } as any);
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
        // todo check rules on submit
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
