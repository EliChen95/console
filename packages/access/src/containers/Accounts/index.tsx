import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { noop } from 'lodash';
import { Banner, Field } from '@kubed/components';
import { Human /*Pen, Stop, Star, Trash*/ } from '@kubed/icons';
import { DataTable, formatTime, StatusIndicator } from '@ks-console/shared';
import type { Column } from '@ks-console/shared';

import type { OriginalUser } from '../../types/user';
import type { FormattedUser } from '../../stores/user';
import { getResourceUrl, formatUser } from '../../stores/user';
import UserCreateModal from './UserCreateModal';
import UserModifyModal from './UserModifyModal';
import { Avatar, CreateButton, BatchActionButton } from './styles';

export default function Accounts() {
  const [userCreateModalVisible, setUserCreateModalVisible] = useState(false);
  const [userModifyModalVisible, setUserModifyModalVisible] = useState(false);
  const [detail, setDetail] = useState<FormattedUser>();
  const ref = useRef<{ refetch: () => void }>(null);
  const refetchData = ref.current?.refetch ?? noop;

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
          <CreateButton
            onClick={() => {
              setDetail(formattedUser);
              setUserModifyModalVisible(true);
            }}
          >
            modify
          </CreateButton>
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

  return (
    <>
      <Banner icon={<Human />} title={t('USER_PL')} description={t('USER_DESC')} className="mb12" />
      {/* TODO: no search */}
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
      {userModifyModalVisible && (
        <UserModifyModal
          visible={userModifyModalVisible}
          refetchData={refetchData}
          detail={detail}
          onCancel={() => setUserModifyModalVisible(false)}
        />
      )}
    </>
  );
}
