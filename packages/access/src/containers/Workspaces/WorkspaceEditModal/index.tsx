import React, { useRef } from 'react';
import { Modal } from '@kubed/components';
import { Enterprise } from '@kubed/icons';
import WorkspaceBaseInfo from '../WorkspaceBaseInfomation';
import type { FormRef } from '../WorkspaceBaseInfomation';
import type { OriginalWorkspace, WorkspaceFormValues } from 'packages/access/src/types/workspaces';

export interface WorkspaceEditModalProps {
  editWorkspace?: OriginalWorkspace;
  visible: boolean;
  confirmLoading: boolean;
  onOk: (value: WorkspaceFormValues) => void;
  onCancel: () => void;
}

export default function WorkspacesEditModal({
  editWorkspace,
  visible,
  confirmLoading,
  onOk,
  onCancel,
}: WorkspaceEditModalProps) {
  const formRef = useRef<FormRef>(null);
  return (
    <Modal
      visible={visible}
      titleIcon={<Enterprise size={20} />}
      title={t('EDIT_INFORMATION')}
      width={691}
      confirmLoading={confirmLoading}
      onOk={() => formRef.current?.form.submit()}
      onCancel={onCancel}
    >
      <WorkspaceBaseInfo ref={formRef} initialValue={editWorkspace} onOk={onOk} isEdit={true} />
    </Modal>
  );
}
