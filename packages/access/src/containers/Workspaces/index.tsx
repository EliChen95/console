import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Banner, Field, Checkbox, notify } from '@kubed/components';
import { Enterprise, Trash, Pen } from '@kubed/icons';
import {
  DataTable,
  Column,
  formatTime,
  isMultiCluster,
  getDisplayName,
  DeleteConfirmModal,
} from '@ks-console/shared';
import { get } from 'lodash';

import { DescribleWrapper } from './styles';
import { useAction } from '../../hooks/useAction';
import { ClusterWrapper, ClusterStore } from '@ks-console/clusters';
import { name, getListUrl, workspaceMapper, deleteWorkspace } from '../../stores/workspace';
import { MappedWorkspace } from '../../stores/workspace/types';

const { fetchList } = ClusterStore;

export default function Workspaces(): JSX.Element {
  const url = getListUrl();
  const tableRef = useRef<any>();
  const [workspaces, setWorkspaces] = useState<MappedWorkspace[]>([]);
  const [shouldDeleteResource, setShouldDeleteResource] = useState<boolean>(false);
  const [deleteVisible, setDeleteVisible] = useState<boolean>(false);
  const { data: clustersData = [] } = fetchList({ limit: -1 });
  const isSystemWorkspaces = (row?: Record<string, any>) =>
    get(row, 'name') === globals.config.systemWorkspace;

  const handleDelete = async () => {
    const data = {
      kind: 'DeleteOptions',
      apiVersion: 'v1',
      propagationPolicy: 'Orphan',
    };
    await Promise.all(
      workspaces?.map(workspace =>
        deleteWorkspace({
          params: workspace,
          data: !shouldDeleteResource ? data : {},
        }),
      ),
    );
    setDeleteVisible(false);
    notify.success(t('DELETE_SUCCESSFUL'));
    tableRef?.current?.refetch();
  };

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
        onClick: (e, record) => {
          setWorkspaces([record as MappedWorkspace]);
          setDeleteVisible(true);
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
        onClick: () => {
          const selectedFlatRows = tableRef?.current?.getSelectedFlatRows() || [];
          setWorkspaces(selectedFlatRows);
          setDeleteVisible(true);
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
      id: 'more',
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
        disableRowSelect={isSystemWorkspaces}
        ref={tableRef}
      />
      <DeleteConfirmModal
        visible={deleteVisible}
        type={name}
        resource={workspaces?.map(item => item.name)}
        onOk={handleDelete}
        onCancel={() => setDeleteVisible(false)}
        desc={
          <DescribleWrapper>
            <Checkbox
              onChange={e => setShouldDeleteResource(e.target.checked)}
              checked={shouldDeleteResource}
              label={t('DELETE_WORKSPACE_PROJECTS_DESC')}
            />
          </DescribleWrapper>
        }
      />
    </>
  );
}
