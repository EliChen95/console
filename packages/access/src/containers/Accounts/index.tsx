import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { noop } from 'lodash';
import { Banner, Field } from '@kubed/components';
import { Human } from '@kubed/icons';
import { DataTable, formatTime, StatusIndicator } from '@ks-console/shared';
import type { Column } from '@ks-console/shared';

import { getResourceUrl } from '../../stores/user';
import UserCreateModal from './UserCreateModal';
import { Avatar, CreateButton, BatchActionButton } from './styles';

export default function Accounts() {
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

  const [userCreateModalVisible, setUserCreateModalVisible] = useState(false);
  const ref = useRef<{ refetch: () => void }>(null);
  const refetchData = ref.current?.refetch ?? noop;

  return (
    <>
      <Banner icon={<Human />} title={t('USER_PL')} description={t('USER_DESC')} className="mb12" />
      <DataTable
        ref={ref}
        columns={columns}
        tableName="users"
        rowKey="name"
        url={url}
        batchActions={batchActions}
        disableRowSelect={row => {
          const name = row?.metadata?.name;
          return globals.config.presetUsers.includes(name) || globals.user.username === name;
        }}
        toolbarRight={
          <CreateButton color="secondary" shadow onClick={() => setUserCreateModalVisible(true)}>
            {t('CREATE')}
          </CreateButton>
        }
      />
      {userCreateModalVisible && (
        <UserCreateModal
          visible={userCreateModalVisible}
          refetchData={refetchData}
          onCancel={() => setUserCreateModalVisible(false)}
        />
      )}
    </>
  );
}
