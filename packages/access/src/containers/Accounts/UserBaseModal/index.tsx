import React from 'react';
import { Modal, FormItem, Input } from '@kubed/components';
import type { FormItemProps } from '@kubed/components';
import { Human } from '@kubed/icons';

import { useRoles } from '../../../stores/role';
import { StyledForm } from './styles';

type Rules = FormItemProps['rules'];

interface FormFields {
  'metadata.name': {
    disabled?: boolean;
    rules: Rules;
  };
  'spec.email': {
    rules: Rules;
  };
}

export interface UserBaseModalProps {
  title: string;
  formFields: FormFields;
}

export default function UserBaseModal({ title, formFields }: UserBaseModalProps) {
  useRoles({
    params: { limit: -1, sortBy: 'createTime' },
  });

  return (
    <Modal visible titleIcon={<Human size={20} />} title={title} width={691}>
      <StyledForm>
        <FormItem
          name="metadata.name"
          label={t('USERNAME')}
          help={t('USERNAME_DESC')}
          rules={formFields['metadata.name'].rules}
        >
          <Input
            name="metadata.name"
            autoComplete="off"
            autoFocus={true}
            maxLength={32}
            disabled={formFields['metadata.name'].disabled}
          />
        </FormItem>
        <FormItem
          name="spec.email"
          label={t('EMAIL')}
          help={t('EMAIL_DESC')}
          rules={formFields['spec.email'].rules}
        >
          <Input name="spec.email" placeholder="user@example.com" autoComplete="off" />
        </FormItem>
      </StyledForm>
    </Modal>
  );
}
