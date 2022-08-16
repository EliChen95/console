import React from 'react';
import { Modal, FormItem, Input } from '@kubed/components';
import { Human } from '@kubed/icons';

import { StyledForm } from './styles';

interface FormFields {
  username?: {
    hide?: Boolean;
    rules?: [];
  };
}

interface UserBaseModalProps {
  title: string;
  formFields?: FormFields;
}

export default function UserBaseModal({ title }: UserBaseModalProps) {
  return (
    <Modal visible titleIcon={<Human size={20} />} title={title} width={691}>
      <StyledForm>
        <FormItem
          name="username"
          label={t('USERNAME')}
          help={t('USERNAME_DESC')}
          rules={[
            {
              required: true,
              message: 'Please input your username!',
            },
          ]}
        >
          <Input />
        </FormItem>
      </StyledForm>
    </Modal>
  );
}
