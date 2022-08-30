import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { noop } from 'lodash';
import { Banner, Field, notify } from '@kubed/components';
import { Human /*Pen, Stop, Star, Trash*/ } from '@kubed/icons';
import { DataTable, formatTime, StatusIndicator, DeleteConfirmModal } from '@ks-console/shared';
import type { Column, DeleteConfirmModalProps } from '@ks-console/shared';

import type { OriginalUser } from '../../types/user';
import type { FormattedUser } from '../../stores/user';
import {
  getResourceUrl,
  formatUser,
  useUserStatusMutation,
  useUserDeleteMutation,
  validateUserDelete,
} from '../../stores/user';
import UserCreateModal from './UserCreateModal';
import UserEditModal from './UserEditModal';
import { Avatar, CreateButton, BatchActionButton } from './styles';

export default function Accounts() {
  const [userCreateModalVisible, setUserCreateModalVisible] = useState(false);
  const [userEditModalVisible, setUserEditModalVisible] = useState(false);
  const [userDeleteModalVisible, setUserDeleteModalVisible] = useState(false);
  const [detail, setDetail] = useState<FormattedUser>();
  const [resource, setResource] = useState<DeleteConfirmModalProps['resource']>();
  const ref = useRef<{ refetch: () => void }>(null);
  const refetchData = ref.current?.refetch ?? noop;

  const { mutate: mutateUserStatus } = useUserStatusMutation({
    onSuccess: () => {
      refetchData();
      notify.success(t('UPDATE_SUCCESSFUL'));
    },
  });

  const { mutate: mutateUserDelete, isLoading: isUserDeleteLoading } = useUserDeleteMutation({
    onSuccess: () => {
      refetchData();
      notify.success(t('DELETE_SUCCESSFUL'));
      setUserDeleteModalVisible(false);
    },
  });

  const columns: Column[] = [
    {
      title: t('NAME'),
      field: 'metadata.name',
      render: (value, row) => (
        <Field
          value={<Link to={value}>{value}</Link>}
          label={row?.spec?.email || ''}
          avatar={<Avatar src={row?.avatar_url || '/assets/default-user.svg'} alt={value} />}
        />
      ),
    },
    {
      title: t('STATUS'),
      field: 'status.state',
      canHide: true,
      width: '20%',
      render: value => (
        <StatusIndicator type={value}>{t(`USER_${(value ?? '').toUpperCase()}`)}</StatusIndicator>
      ),
    },
    {
      title: t('PLATFORM_ROLE'),
      canHide: true,
      width: '20%',
      render: (value, row) => row?.metadata?.annotations?.['iam.kubesphere.io/globalrole'] || '-',
    },
    {
      title: t('LAST_LOGIN'),
      field: 'status.lastLoginTime',
      canHide: true,
      width: '20%',
      render: value => (value ? formatTime(value) : t('NOT_LOGIN_YET')),
    },
    {
      title: ' ',
      // TODO: temp
      render: (value, row) => {
        const formattedUser = formatUser(row as OriginalUser);

        return (
          <>
            <CreateButton
              onClick={() => {
                setDetail(formattedUser);
                setUserEditModalVisible(true);
              }}
            >
              {t('EDIT')}
            </CreateButton>
            <CreateButton onClick={() => mutateUserStatus(formattedUser)}>
              {formattedUser.status === 'Active' ? t('DISABLE') : t('ENABLE')}
            </CreateButton>
            <CreateButton
              onClick={() => {
                setDetail(formattedUser);
                setResource(formattedUser.username);
                setUserDeleteModalVisible(true);
              }}
            >
              {t('DELETE')}
            </CreateButton>
          </>
        );
      },
    },
  ];
  // TODO: missing params ?
  const url = getResourceUrl();
  const batchActions = [
    <BatchActionButton key="delete" color="error">
      {t('DELETE')}
    </BatchActionButton>,
    <BatchActionButton key="active">{t('ENABLE')}</BatchActionButton>,
    <BatchActionButton key="disabled">{t('DISABLE')}</BatchActionButton>,
  ];

  const handleUserDelete = () => {
    if (!detail) {
      return;
    }

    const result = validateUserDelete(detail);
    if (result) {
      mutateUserDelete(detail);
    }
  };

  return (
    <>
      <Banner icon={<Human />} title={t('USER_PL')} description={t('USER_DESC')} className="mb12" />
      {/* TODO: missing search */}
      <DataTable
        ref={ref}
        columns={columns}
        tableName="users"
        rowKey="name"
        url={url}
        placeholder={t('SEARCH_BY_NAME')}
        simpleSearch
        batchActions={batchActions}
        disableRowSelect={row => {
          const name = row?.metadata?.name;
          return globals.config.presetUsers.includes(name) || globals.user.username === name;
        }}
        toolbarRight={
          <>
            <CreateButton color="secondary" shadow onClick={() => setUserCreateModalVisible(true)}>
              {t('CREATE')}
            </CreateButton>
          </>
        }
      />
      {userCreateModalVisible && (
        <UserCreateModal
          visible={userCreateModalVisible}
          refetchData={refetchData}
          onCancel={() => setUserCreateModalVisible(false)}
        />
      )}
      {userEditModalVisible && detail && (
        <UserEditModal
          visible={userEditModalVisible}
          refetchData={refetchData}
          detail={detail}
          onCancel={() => setUserEditModalVisible(false)}
        />
      )}
      {userDeleteModalVisible && detail && (
        <DeleteConfirmModal
          visible={userDeleteModalVisible}
          type="USER"
          resource={resource}
          confirmLoading={isUserDeleteLoading}
          onOk={handleUserDelete}
          onCancel={() => setUserDeleteModalVisible(false)}
        />
      )}
    </>
  );
}
