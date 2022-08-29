import React from 'react';
import { merge } from 'lodash';
import { notify } from '@kubed/components';
import { Pattern, validator } from '@ks-console/shared';

import type { UserFormValues } from '../../../types/user';
import type { UserBaseModalProps } from '../UserBaseModal';
import UserBaseModal from '../UserBaseModal';
import { useUserCreateMutation } from '../../../stores/user';

interface UserCreateModalProps {
  visible: boolean;
  refetchData: () => void;
  onCancel: () => void;
}

export default function UserCreateModal({ visible, refetchData, onCancel }: UserCreateModalProps) {
  const formFields: UserBaseModalProps['formFieldProps'] = {
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
  const { mutate, isLoading } = useUserCreateMutation({
    onSuccess: () => {
      refetchData();
      onCancel();
      notify.success(t('CREATE_SUCCESSFUL'));
    },
  });

  const handleSubmit = (formValues: UserFormValues) => {
    const baseValues = {
      apiVersion: 'iam.kubesphere.io/v1alpha2',
      kind: 'User',
      metadata: {
        annotations: {
          'iam.kubesphere.io/uninitialized': 'true',
        },
      },
    } as const;
    const params = merge({}, baseValues, formValues);
    mutate(params);
  };

  return (
    <UserBaseModal
      visible={visible}
      title={t('CREATE_USER')}
      formFieldProps={formFields}
      confirmLoading={isLoading}
      onOk={handleSubmit}
      onCancel={onCancel}
    />
  );
}
