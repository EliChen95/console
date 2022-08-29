import React from 'react';
import { merge } from 'lodash';
import { notify } from '@kubed/components';

import type { UserFormValues } from '../../../types/user';
import type { UserBaseModalProps } from '../UserBaseModal';
import UserBaseModal from '../UserBaseModal';
import type { FormattedUser } from '../../../stores/user';
import { useUserCreateMutation } from '../../../stores/user';

interface UserCreateModalProps {
  visible: boolean;
  detail: FormattedUser | undefined;
  refetchData: () => void;
  onCancel: () => void;
}

export default function UserModifyModal({
  visible,
  detail,
  refetchData,
  onCancel,
}: UserCreateModalProps) {
  const formFieldProps: UserBaseModalProps['formFieldProps'] = {
    'metadata.name': {
      disabled: true,
      rules: [{ required: true, message: t('USERNAME_EMPTY_DESC') }],
    },
    'spec.email': {
      rules: [
        {
          required: true,
          message: t('INPUT_USERNAME_OR_EMAIL_TIP'),
        },
      ],
    },
    'spec.password': {
      isExclude: true,
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
      title={t('EDIT_USER')}
      formFieldProps={formFieldProps}
      confirmLoading={isLoading}
      detail={detail}
      onOk={handleSubmit}
      onCancel={onCancel}
    />
  );
}
