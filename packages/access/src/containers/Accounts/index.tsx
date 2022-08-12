import React from 'react';
import { Link } from 'react-router-dom';
import { Banner, Field, StatusDot } from '@kubed/components';
import { Human } from '@kubed/icons';
import { DataTable, formatTime } from '@ks-console/shared';
import type { Column } from '@ks-console/shared';

import { Avatar } from './styles';

export default function Accounts() {
  const columns: Column[] = [
    {
      title: t('NAME'),
      field: 'metadata.name',
      render: (value, row) => (
        <Field
          value={<Link to={value}>{value}</Link>}
          label={row.spec?.email || ''}
          avatar={<Avatar src={row.avatar_url || '/assets/default-user.svg'} alt={value} />}
        />
      ),
    },
    {
      title: t('STATUS'),
      field: 'status.state',
      canHide: true,
      width: '20%',
      render: value => (
        <StatusDot color="primary">{t(`USER_${(value ?? '').toUpperCase()}`)}</StatusDot>
      ),
    },
    {
      title: t('PLATFORM_ROLE'),
      canHide: true,
      width: '20%',
      render: (value, row) => row?.metadata?.annotations?.['iam.kubesphere.io/globalrole'] ?? '-',
    },
    {
      title: t('LAST_LOGIN'),
      field: 'status.lastLoginTime',
      canHide: true,
      width: '20%',
      render: value => (value ? formatTime(value) : t('NOT_LOGIN_YET')),
    },
  ];

  return (
    <>
      <Banner icon={<Human />} title={t('USER_PL')} description={t('USER_DESC')} className="mb12" />
      <DataTable
        columns={columns}
        tableName="users"
        rowKey="name"
        url="kapis/iam.kubesphere.io/v1alpha2/users"
      />
    </>
  );
}
