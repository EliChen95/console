import React, { useState, useRef } from 'react';
import { merge } from 'lodash';
import { Modal, Steps, Button, TabStep } from '@kubed/components';
import { Cluster, Enterprise, Appcenter } from '@kubed/icons';
import { isMultiCluster } from '@ks-console/shared';
import WorkspaceBaseInfo from '../WorkspaceBaseInfomation';
import WorkspaceClusterSettings from '../WorkspaceClusterSettings';
import type { FormRef } from '../WorkspaceBaseInfomation';
import type { ClusterFormRef, ClusterFormValue } from '../WorkspaceClusterSettings';
import type { WorkspaceFormValues } from '../../../types/workspaces';

export interface UserBaseModalProps {
  visible: boolean;
  confirmLoading: boolean;
  onOk: (data: WorkspaceFormValues) => void;
  onCancel: () => void;
}

export default function WorkspacesCreateModal({
  visible,
  confirmLoading,
  onOk,
  onCancel,
}: UserBaseModalProps) {
  const [active, setActive] = useState(0);
  const [baseInfo, setBaseInfo] = useState<WorkspaceFormValues>();
  const formRef = useRef<FormRef>(null);
  const clusterFormRef = useRef<ClusterFormRef>(null);
  const nextStep = () => setActive(current => (current < 1 ? current + 1 : current));
  const prevStep = () => setActive(current => (current > 0 ? current - 1 : current));
  const handleOk = (value: ClusterFormValue) => {
    onOk?.(merge(baseInfo, value));
  };

  const handleNext = (value: WorkspaceFormValues) => {
    setBaseInfo(value);
    nextStep();
  };

  const renderStepsModalFooter = () => {
    if (!isMultiCluster()) {
      return (
        <>
          <Button onClick={onCancel} radius="xl">
            {t('CANCEL')}
          </Button>
          <Button
            loading={confirmLoading}
            onClick={() => formRef?.current?.form.submit()}
            radius="xl"
            shadow
            color="secondary"
          >
            {t('OK')}
          </Button>
        </>
      );
    }

    return (
      <>
        <Button onClick={onCancel} radius="xl">
          {t('CANCEL')}
        </Button>
        {active !== 0 && (
          <Button onClick={prevStep} disabled={active <= 0}>
            {t('PREVIOUS')}
          </Button>
        )}
        {active !== 1 ? (
          <Button
            onClick={() => formRef?.current?.form.submit()}
            color="secondary"
            disabled={active >= 1}
          >
            {t('NEXT')}
          </Button>
        ) : (
          <Button
            loading={confirmLoading}
            onClick={() => clusterFormRef.current?.form.submit()}
            radius="xl"
            shadow
            color="secondary"
          >
            {t('OK')}
          </Button>
        )}
      </>
    );
  };
  return (
    <Modal
      visible={visible}
      titleIcon={<Enterprise size={20} />}
      title={t('CREATE_WORKSPACE')}
      width={691}
      footer={renderStepsModalFooter()}
      confirmLoading={confirmLoading}
      onCancel={onCancel}
    >
      {isMultiCluster() ? (
        <Steps active={active} onStepClick={setActive} variant="tab">
          <TabStep
            label={t('BASIC_INFORMATION')}
            description={t('WORKSPACE_CREATE_DESC')}
            completedDescription={t('FINISHED')}
            progressDescription={t('IN_PROGRESS')}
            icon={<Appcenter size={24} />}
          >
            <WorkspaceBaseInfo ref={formRef} onOk={handleNext} />
          </TabStep>
          <TabStep
            label={t('CLUSTER_SETTINGS')}
            description={t('SELECT_CLUSTERS_DESC')}
            completedDescription={t('FINISHED')}
            progressDescription={t('IN_PROGRESS')}
            icon={<Cluster size={24} />}
          >
            <WorkspaceClusterSettings ref={clusterFormRef} onOk={handleOk} />
          </TabStep>
        </Steps>
      ) : (
        <WorkspaceBaseInfo ref={formRef} onOk={onOk} />
      )}
    </Modal>
  );
}
