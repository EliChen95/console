import React, { ChangeEvent } from 'react';
import { Checkbox } from '@kubed/components';

type Props = {
  defaultChecked?: boolean;
  onChange?: (value: boolean) => void;
};

function RequireTLS({ defaultChecked, onChange }: Props): JSX.Element {
  function handleChange({ target }: ChangeEvent<HTMLInputElement>): void {
    onChange?.(target.checked);
  }

  return (
    <Checkbox
      label={t('USE_SSL_SECURE_CONNECTION')}
      defaultChecked={defaultChecked}
      onChange={handleChange}
    />
  );
}

export default RequireTLS;
