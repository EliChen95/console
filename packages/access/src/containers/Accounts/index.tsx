import React from 'react';
import { Link } from 'react-router-dom';
import { Banner, Field } from '@kubed/components';
import { Human } from '@kubed/icons';
import { DataTable, formatTime, StatusIndicator } from '@ks-console/shared';
import type { Column } from '@ks-console/shared';

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
  const batchActions = [
    <BatchActionButton key="delete" color="error">
      {t('DELETE')}
    </BatchActionButton>,
    <BatchActionButton key="active">{t('ENABLE')}</BatchActionButton>,
    <BatchActionButton key="disabled">{t('DISABLE')}</BatchActionButton>,
  ];

  return (
    <>
      <Banner icon={<Human />} title={t('USER_PL')} description={t('USER_DESC')} className="mb12" />
      <DataTable
        columns={columns}
        tableName="users"
        rowKey="name"
        url="kapis/iam.kubesphere.io/v1alpha2/users"
        batchActions={batchActions}
        disableRowSelect={row => {
          const name = row?.metadata?.name;
          return globals.config.presetUsers.includes(name) || globals.user.username === name;
        }}
        toolbarRight={
          <CreateButton color="secondary" shadow>
            {t('CREATE')}
          </CreateButton>
        }
      />
      <UserCreateModal />
    </>
  );
}
