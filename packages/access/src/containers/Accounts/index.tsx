import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { noop } from 'lodash';
import { Banner, Field, notify } from '@kubed/components';
import { Human, Pen, Stop, Star, Trash } from '@kubed/icons';
import type { Column, TableRef, DeleteConfirmModalProps } from '@ks-console/shared';
import { DataTable, formatTime, StatusIndicator, DeleteConfirmModal } from '@ks-console/shared';

import type { OriginalUser, FormattedUser } from '../../types/user';
import { useAction } from '../../hooks/useAction';
import {
  module,
  getResourceUrl,
  formatUser,
  useUserStatusMutation,
  useUserDeleteMutation,
  validateUserDelete,
  showAction,
} from '../../stores/user';
import UserCreateModal from './UserCreateModal';
import UserEditModal from './UserEditModal';
import { Avatar } from './styles';

export default function Accounts() {
  const [userCreateModalVisible, setUserCreateModalVisible] = useState(false);
  const [userEditModalVisible, setUserEditModalVisible] = useState(false);
  const [userDeleteModalVisible, setUserDeleteModalVisible] = useState(false);
  const [detail, setDetail] = useState<FormattedUser>();
  const [resource, setResource] = useState<DeleteConfirmModalProps['resource']>();
  const tableRef = useRef<TableRef<OriginalUser>>(null);
  const refetchData = tableRef.current?.refetch ?? noop;

  // TODO: onSelect has a bug, need Improvement
  let selectedFlatRows: FormattedUser[] = [];

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

  const { renderTableAction, renderItemAction, renderBatchAction } = useAction({
    authKey: module,
    itemAction: [
      {
        key: 'edit',
        action: 'edit',
        icon: <Pen />,
        text: t('EDIT'),
        show: showAction,
        onClick: (event, item) => {
          setDetail(item);
          setUserEditModalVisible(true);
        },
      },
      {
        key: 'status',
        action: 'edit',
        icon: item => (item.status === 'Active' ? <Stop /> : <Star />),
        text: item => (item.status === 'Active' ? t('DISABLE') : t('ENABLE')),
        show: showAction,
        onClick: (event, item) => {
          mutateUserStatus(item);
        },
      },
      {
        key: 'delete',
        action: 'delete',
        icon: <Trash />,
        text: t('DELETE'),
        show: showAction,
        onClick: (event, item) => {
          setDetail(item);
          setResource(item.username);
          setUserDeleteModalVisible(true);
        },
      },
    ],
    tableAction: [
      {
        key: 'create',
        action: 'create',
        text: t('CREATE'),
        props: {
          color: 'secondary',
          shadow: true,
        },
        onClick: () => setUserCreateModalVisible(true),
      },
    ],
    batchAction: [
      {
        key: 'delete',
        action: 'delete',
        text: t('DELETE'),
        props: {
          color: 'error',
        },
      },
      {
        key: 'active',
        action: 'edit',
        text: t('ENABLE'),
        disabled: () => selectedFlatRows.every(item => item.status === 'Active'),
      },
      {
        key: 'disabled',
        action: 'edit',
        text: t('DISABLE'),
        disabled: () => selectedFlatRows.every(item => item.status === 'Disabled'),
      },
    ],
  });

  const columns: Column[] = [
    {
      title: t('NAME'),
      field: 'username',
      render: (value, row) => (
        <Field
          value={<Link to={value}>{value}</Link>}
          label={row.email}
          avatar={<Avatar src={row.avatar_url || '/assets/default-user.svg'} alt={value} />}
        />
      ),
    },
    {
      title: t('STATUS'),
      field: 'status',
      canHide: true,
      width: '20%',
      render: value => (
        <StatusIndicator type={value}>{t(`USER_${value.toUpperCase()}`)}</StatusIndicator>
      ),
    },
    {
      title: t('PLATFORM_ROLE'),
      field: 'globalrole',
      canHide: true,
      width: '20%',
      render: value => value || '-',
    },
    {
      title: t('LAST_LOGIN'),
      field: 'lastLoginTime',
      canHide: true,
      width: '20%',
      render: value => (value ? formatTime(value) : t('NOT_LOGIN_YET')),
    },
    {
      id: 'more',
      title: ' ',
      render: (value, row) => renderItemAction(value, row as FormattedUser),
    },
  ];
  // TODO: missing params ?
  const url = getResourceUrl();

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
        ref={tableRef}
        columns={columns}
        tableName="users"
        rowKey="name"
        url={url}
        format={data => formatUser(data as OriginalUser)}
        placeholder={t('SEARCH_BY_NAME')}
        simpleSearch
        batchActions={renderBatchAction()}
        disableRowSelect={row => !showAction(row as FormattedUser)}
        toolbarRight={renderTableAction()}
        onSelect={(selectedRowIds, selectedRows) => {
          selectedFlatRows = selectedRows as FormattedUser[];
        }}
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
