import React, { useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
import styled from 'styled-components';

import { ClusterWrapper, ClusterStore } from '@ks-console/clusters';
import { getListUrl, workspaceMapper } from '../../stores/workspace';

const { fetchList } = ClusterStore;

export const CreateButton = styled(Button)`
  min-width: 96px;
  margin-left: 12px;
`;

export const BatchActionButton = styled(Button)`
  min-width: 96px;
  & + button {
    margin-left: 12px;
  }
`;

export default function Workspaces(): JSX.Element {
  const url = getListUrl();
  const tableRef = useRef();
  const { isLoading: isClusterLoading, data: clustersData = [] } = fetchList({
    limit: -1,
  });
  const isSystemWorkspaces = (row?: Record<string, any>) =>
    get(row, 'name') === globals.config.systemWorkspace;

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
      render: (value, row) =>
        !isSystemWorkspaces(row) ? (
          <Dropdown
            placement="bottom-end"
            content={
              <Menu>
                <MenuItem icon={<Pen />}>{t('EDIT_INFORMATION')}</MenuItem>
                <MenuItem icon={<Trash />}>{t('DELETE')}</MenuItem>
              </Menu>
            }
          >
            <Button variant="text" radius="lg">
              <More size={16} />
            </Button>
          </Dropdown>
        ) : null,
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
        batchActions={<BatchActionButton color="error">{t('DELETE')}</BatchActionButton>}
        useStorageState={false}
        toolbarRight={
          <CreateButton color="secondary" shadow>
            {t('CREATE')}
          </CreateButton>
        }
        onSelect={onSelect}
        disableRowSelect={isSystemWorkspaces}
        ref={tableRef}
      />
    </>
  );
}
