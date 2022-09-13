import React from 'react';
import { get } from 'lodash';
import { useStore } from '@kubed/stook';
import { Icon } from '@ks-console/shared';
import { Field, Switch, FormItem } from '@kubed/components';

import { CssContainer } from '../../styles';

type Props = {
  id: string;
  title: string;
  name: string[];
};

function EnableService({ id, name, title }: Props): JSX.Element {
  const [store] = useStore('NotificationConfigStore');
  const checked = get(store[id], name.join('.'));

  return (
    <CssContainer className="mb-12 horizon">
      <Field
        avatar={<Icon name={id === 'email' ? 'mail' : id} size={40} />}
        label={t(`${id.toUpperCase()}_DESC`)}
        value={t(title)}
      />
      <FormItem name={name}>
        <Switch
          variant="button"
          label={t(checked ? t('ENABLED') : t('DISABLED'))}
          checked={checked}
        />
      </FormItem>
    </CssContainer>
  );
}

export default EnableService;
