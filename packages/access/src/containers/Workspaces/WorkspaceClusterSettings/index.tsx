import React, { forwardRef, Ref, useImperativeHandle } from 'react';
import { FormInstance, FormItem, useForm } from '@kubed/components';
import { ClusterSelect } from '@ks-console/clusters';

import { StyledForm } from '../styles';

export interface ClusterFormValue {
  spec: {
    placement: {
      cluster: string;
    };
  };
}

interface Props {
  onOk: (formValues: ClusterFormValue) => void;
}

export interface ClusterFormRef {
  form: FormInstance<ClusterFormValue>;
}

function WorkspaceClusterSettings({ onOk }: Props, ref: Ref<ClusterFormRef>) {
  const [form] = useForm<ClusterFormValue>();
  useImperativeHandle(ref, () => {
    return { form };
  });
  return (
    <StyledForm
      form={form}
      onFinish={(values: ClusterFormValue) => {
        onOk?.(values);
      }}
    >
      <FormItem label={t('AVAILABLE_CLUSTERS')} name={['spec', 'placement', 'cluster']}>
        <ClusterSelect></ClusterSelect>
      </FormItem>
    </StyledForm>
  );
}

export default forwardRef(WorkspaceClusterSettings);
