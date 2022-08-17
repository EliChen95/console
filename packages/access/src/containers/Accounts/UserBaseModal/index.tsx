import React from 'react';
import { Modal, FormItem, Input, Select } from '@kubed/components';
import type { FormItemProps } from '@kubed/components';
import { Human } from '@kubed/icons';
// import { isSystemRole } from '@ks-console/shared';

import { useRoles } from '../../../stores/role';
import { StyledForm } from './styles';
import { OptionsType } from 'rc-select/lib/interface';

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
  const result = useRoles({
    params: { limit: -1, sortBy: 'createTime' },
  });
  console.log(result);
  const roleOptions: OptionsType | undefined = [];

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
        <FormItem
          name="metadata.annotations['iam.kubesphere.io/globalrole']"
          label={t('PLATFORM_ROLE')}
          help={t('PLATFORM_ROLE_DESC')}
        >
          <Select options={roleOptions} />
        </FormItem>
      </StyledForm>
    </Modal>
  );
}
