import React from 'react';
import { Pattern, validator } from '@ks-console/shared';

import UserBaseModal from '../UserBaseModal';
import type { UserBaseModalProps } from '../UserBaseModal';
import { useUserCreateMutation } from '../../../stores/user';

export default function UserCreateModal() {
  const formFields: UserBaseModalProps['formFields'] = {
    'metadata.name': {
      rules: [
        { required: true, message: t('USERNAME_EMPTY_DESC') },
        {
          pattern: Pattern.PATTERN_USER_NAME,
          message: t('USERNAME_INVALID', { message: t('USERNAME_DESC') }),
        },
        {
          validator: (rule, value) => {
            const params = {
              apiVersion: 'kapis/iam.kubesphere.io/v1alpha2',
              name: value,
              module: 'users',
            };
            return validator.nameValidator(params);
          },
        },
      ],
    },
    'spec.email': {
      rules: [
        { required: true, message: t('INPUT_USERNAME_OR_EMAIL_TIP') },
        { type: 'email', message: t('INVALID_EMAIL') },
        { validator: validator.emailValidator },
      ],
    },
  };
  const { mutate, isLoading } = useUserCreateMutation();

  return (
    <UserBaseModal
      title={t('CREATE_USER')}
      formFields={formFields}
      confirmLoading={isLoading}
      onOk={mutate}
    />
  );
}
