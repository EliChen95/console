import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Banner, Button, Dropdown, Field, Menu, MenuItem } from '@kubed/components';
import { Enterprise, More, Trash, Pen } from '@kubed/icons';
import {
  DataTable,
  Column,
  getServedVersion,
  formatTime,
  useUrl,
  isMultiCluster,
  getDisplayName,
} from '@ks-console/shared';
import { get } from 'lodash';

import { useAction } from './useAction';
import { ClusterWrapper, ClusterStore } from '@ks-console/clusters';
import { getListUrl, workspaceMapper } from '../../stores/workspace';

const { fetchList } = ClusterStore;

export default function Workspaces(): JSX.Element {
  const url = getListUrl();
  const tableRef = useRef();
  const { isLoading: isClusterLoading, data: clustersData = [] } = fetchList({
    limit: -1,
  });
  const isSystemWorkspaces = (row?: Record<string, any>) =>
    get(row, 'name') === globals.config.systemWorkspace;
  const { renderBatchAction, renderItemAction, renderTableAction } = useAction({
    authKey: 'workspaces',
    itemAction: [
      {
        key: 'edit',
        icon: <Pen />,
        text: t('EDIT_INFORMATION'),
        action: 'edit',
        show: !isSystemWorkspaces,
        onClick: (...args) => {
          console.log(args);
        },
      },
      {
        key: 'delete',
        icon: <Trash />,
        text: t('DELETE'),
        action: 'delete',
        show: !isSystemWorkspaces,
        onClick: (...args) => {
          console.log(args);
        },
      },
    ],
    tableAction: [
      {
        key: 'create',
        text: t('CREATE'),
        action: 'create',
        onClick: (...args) => {
          console.log(args);
        },
        props: {
          color: 'secondary',
          shadow: true,
        },
      },
    ],
    batchAction: [
      {
        key: 'delete',
        text: t('DELETE'),
        action: 'delete',
        onClick: (...args) => {
          console.log(args);
        },
        props: {
          color: 'error',
        },
      },
    ],
  });

  const columns: Column[] = [
    {
      title: t('NAME'),
      field: 'name',
      sortable: true,
      searchable: true,
      render: (value, row) => {
        return (
          <Field
            value={getDisplayName(row)}
            avatar={<Enterprise size={40} />}
            label={row.description || '-'}
            as={Link}
            to={`/workspaces/${value}`}
          />
        );
      },
    },
    {
      title: t('CREATION_TIME_TCAP'),
      field: 'createTime',
      sortable: true,
      canHide: true,
      width: 250,
      render: time => formatTime(time),
    },
    {
      id: 'option',
      title: '',
      width: 20,
      render: renderItemAction,
    },
  ];
  if (isMultiCluster()) {
    columns.splice(1, 0, {
      title: t('CLUSTER_PL'),
      field: 'clusters',
      width: '30%',
      render: clusters => <ClusterWrapper clusters={clusters} clustersDetail={clustersData} />,
    });
  }

  const onSelect = (selectedRowKey?: string[], selectedRows?: Record<string, unknown>[]) => {
    console.log(selectedRowKey, selectedRows);
  };

  return (
    <>
      <Banner
        icon={<Enterprise />}
        title={t('WORKSPACE_PL')}
        description={t('WORKSPACE_DESC')}
        className="mb12"
      />
      <DataTable
        columns={columns}
        tableName="workspaces"
        rowKey="name"
        url={url}
        format={workspaceMapper}
        batchActions={renderBatchAction()}
        useStorageState={false}
        toolbarRight={renderTableAction()}
        onSelect={onSelect}
        disableRowSelect={isSystemWorkspaces}
        ref={tableRef}
      />
    </>
  );
}
