import React from 'react';
import { merge } from 'lodash';
import { notify } from '@kubed/components';

import type { UserActionValues } from '../../../types/user';
import type { UserBaseModalProps } from '../UserBaseModal';
import UserBaseModal from '../UserBaseModal';
import type { FormattedUser } from '../../../stores/user';
import { useUserEditMutation } from '../../../stores/user';

interface UserCreateModalProps {
  visible: boolean;
  detail: FormattedUser;
  refetchData: () => void;
  onCancel: () => void;
}

export default function UserEditModal({
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
  const { mutate, isLoading } = useUserEditMutation({
    detail,
    onSuccess: () => {
      refetchData();
      onCancel();
      notify.success(t('UPDATE_SUCCESSFUL'));
    },
  });

  const handleSubmit = (formValues: UserActionValues) => {
    const params = merge(
      {},
      detail._originData,
      {
        metadata: {
          resourceVersion: detail.resourceVersion,
        },
      },
      formValues,
    );
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
