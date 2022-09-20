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
  useBatchActions,
  useItemActions,
  useTableActions,
} from '@ks-console/shared';
import { get, unset } from 'lodash';
import { ClusterWrapper, ClusterStore } from '@ks-console/clusters';
import {
  name,
  getListUrl,
  workspaceMapper,
  useWorkspaceDeleteMutation,
  useWorkspacesEditMutation,
  useWorkspacesCreateMutation,
} from '../../stores/workspace';
import { FormattedWorkspace, WorkspaceFormValues } from '../../types/workspaces';
import WorkspacesCreateModal from './WorkspaceCreateModal';
import WorkspacesEditModal from './WorkspaceEditModal';

import { DescribleWrapper, FieldLable } from './styles';

const { fetchList } = ClusterStore;

export default function Workspaces(): JSX.Element {
  const url = getListUrl();
  const tableRef = useRef<any>();
  const [workspaces, setWorkspaces] = useState<FormattedWorkspace[]>([]);
  const [shouldDeleteResource, setShouldDeleteResource] = useState<boolean>(false);
  const [deleteVisible, setDeleteVisible] = useState<boolean>(false);
  const [editVisible, setEditVisible] = useState<boolean>(false);
  const [createVisible, setCreateVisible] = useState<boolean>(false);
  const [editWorkspace, setEditWorkspace] = useState<FormattedWorkspace>();
  const { mutate: mutateWorkspaceCreate, isLoading: isCreateLoading } = useWorkspacesCreateMutation(
    {
      onSuccess: () => {
        tableRef.current?.refetch?.();
        notify.success(t('CREATE_SUCCESSFUL'));
        setCreateVisible(false);
      },
    },
  );
  const { mutate: mutateWorkspaceEdit, isLoading: isEditLoading } = useWorkspacesEditMutation({
    onSuccess: () => {
      tableRef.current?.refetch?.();
      notify.success(t('UPDATE_SUCCESSFUL'));
      setEditVisible(false);
    },
  });
  const { mutate: mutateWorkspaceDelete, isLoading: isDeleteLoading } = useWorkspaceDeleteMutation({
    onSuccess: () => {
      setDeleteVisible(false);
      notify.success(t('DELETE_SUCCESSFUL'));
      tableRef?.current?.refetch();
    },
  });

  const { data: clustersData = [] } = fetchList({ limit: -1 });
  const isSystemWorkspaces = (row?: Record<string, FormattedWorkspace>) =>
    get(row, 'name') === globals.config.systemWorkspace;

  const handleCreate = async (value: WorkspaceFormValues) => {
    mutateWorkspaceCreate(value);
  };
  const handleEdit = async (value: WorkspaceFormValues) => {
    unset(value, 'spec.cluster');
    mutateWorkspaceEdit({
      params: editWorkspace,
      data: value,
    });
  };
  const handleDelete = async () => {
    const data = {
      kind: 'DeleteOptions',
      apiVersion: 'v1',
      propagationPolicy: 'Orphan',
    };
    const params = workspaces.map(workspace => {
      return {
        params: workspace,
        data: !shouldDeleteResource ? data : {},
      };
    });
    mutateWorkspaceDelete(params);
  };
  const renderBatchActions = useBatchActions({
    authKey: 'workspaces',
    actions: [
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
  const renderItemActions = useItemActions({
    authKey: 'workspaces',
    actions: [
      {
        key: 'edit',
        icon: <Pen />,
        text: t('EDIT_INFORMATION'),
        action: 'edit',
        show: row => !isSystemWorkspaces(row),
        onClick: (e, record) => {
          setEditVisible(true);
          setEditWorkspace(record as FormattedWorkspace);
        },
      },
      {
        key: 'delete',
        icon: <Trash />,
        text: t('DELETE'),
        action: 'delete',
        show: row => !isSystemWorkspaces(row),
        onClick: (e, record) => {
          setWorkspaces([record as FormattedWorkspace]);
          setDeleteVisible(true);
        },
      },
    ],
  });
  const renderTableActions = useTableActions({
    authKey: 'workspaces',
    actions: [
      {
        key: 'create',
        text: t('CREATE'),
        action: 'create',
        onClick: () => {
          setCreateVisible(true);
        },
        props: {
          color: 'secondary',
          shadow: true,
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
            value={<Link to={value}>{getDisplayName(row)}</Link>}
            avatar={<Enterprise size={40} />}
            label={<FieldLable>{row.description || '-'}</FieldLable>}
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
      render: renderItemActions,
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
        batchActions={renderBatchActions()}
        useStorageState={false}
        placeholder={t('SEARCH_BY_NAME')}
        toolbarRight={renderTableActions()}
        disableRowSelect={isSystemWorkspaces}
        ref={tableRef}
      />
      {deleteVisible && (
        <DeleteConfirmModal
          visible={deleteVisible}
          type={name}
          resource={workspaces?.map(item => item.name)}
          onOk={handleDelete}
          onCancel={() => setDeleteVisible(false)}
          confirmLoading={isDeleteLoading}
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
      )}
      {createVisible && (
        <WorkspacesCreateModal
          visible={createVisible}
          confirmLoading={isCreateLoading}
          onOk={handleCreate}
          onCancel={() => setCreateVisible(false)}
        />
      )}
      {editVisible && (
        <WorkspacesEditModal
          visible={editVisible}
          editWorkspace={editWorkspace?._originData}
          confirmLoading={isEditLoading}
          onOk={handleEdit}
          onCancel={() => setEditVisible(false)}
        />
      )}
    </>
  );
}
