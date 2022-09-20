import React, { useImperativeHandle, forwardRef, Ref, UIEvent } from 'react';
import { debounce, merge } from 'lodash';
import { FormItem, useForm, Input, Select, FormInstance } from '@kubed/components';
import { Pattern } from '@ks-console/shared';
import { nameValidator } from '../../../stores/workspace';
import { useUsers } from '../../../stores/user';
import type { OriginalWorkspace, WorkspaceFormValues } from '../../../types/workspaces';

import { StyledForm } from '../styles';

interface Props {
  initialValue?: OriginalWorkspace;
  onOk?: (value: WorkspaceFormValues) => void;
  isEdit?: boolean;
}

export interface FormRef {
  form: FormInstance<WorkspaceFormValues>;
}

function WorkspaceBaseInfomation(
  { initialValue, isEdit, onOk }: Props,
  ref: Ref<FormRef> | undefined,
): JSX.Element {
  const initialValues = initialValue ?? {};
  const [form] = useForm<WorkspaceFormValues>();

  const {
    data = [],
    nextPage,
    reFetch,
    isLast,
  } = useUsers({
    mode: 'infinity',
    params: {
      limit: 10,
    },
  });

  // TODO: Select onFetch
  const onSearch = debounce((val: string) => reFetch({ name: val }));
  const onScroll = (e: UIEvent<HTMLDivElement>) => {
    if (isLast) {
      return;
    }
    //@ts-ignore
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollTop + clientHeight - scrollHeight >= 0) {
      nextPage();
    }
  };
  const manager = globals.user.username;
  const options = data.map(({ username }) => {
    return {
      label: username,
      value: username,
    };
  });
  if (options.every(user => user.value !== manager)) {
    options.unshift({
      value: manager,
      label: manager,
    });
  }

  useImperativeHandle(ref, () => {
    return {
      form,
    };
  });

  return (
    <StyledForm
      form={form}
      initialValues={initialValues}
      onFinish={(formValues: WorkspaceFormValues) => {
        let baseData: Record<string, any> = {
          apiVersion: 'iam.kubesphere.io/v1alpha2',
          kind: 'Workspaces',
        };
        if (isEdit) {
          baseData = {};
        }
        const params = merge(baseData, formValues);
        onOk?.(params);
      }}
    >
      <FormItem
        name={['metadata', 'name']}
        label={t('NAME')}
        help={t('NAME_DESC')}
        rules={[
          {
            required: true,
            message: t('WORKSPACE_NAME_EMPTY_DESC'),
          },
          {
            pattern: Pattern.PATTERN_NAME,
            message: t('INVALID_NAME_DESC'),
          },
          {
            validator: (rule, value) => {
              if (value === 'workspaces') {
                return Promise.reject(t('current name is not available'));
              }

              return nameValidator({ name: value });
            },
          },
        ]}
      >
        <Input autoComplete="off" autoFocus={true} maxLength={63} disabled={isEdit} />
      </FormItem>
      <FormItem
        label={t('ALIAS')}
        help={t('ALIAS_DESC')}
        name={['metadata', 'annotations', 'kubesphere.io/alias-name']}
      >
        <Input autoComplete="off" maxLength={63} />
      </FormItem>
      {!isEdit && (
        <FormItem label={t('ADMINISTRATOR')} name={['spec', 'template', 'spec', 'manager']}>
          <Select
            showSearch
            options={options}
            onPopupScroll={debounce(onScroll)}
            defaultValue={globals.user.username}
            onSearch={onSearch}
          />
        </FormItem>
      )}
      <FormItem
        label={t('DESCRIPTION')}
        help={t('DESCRIPTION_DESC')}
        name={['metadata', 'annotations', 'kubesphere.io/description']}
      >
        {/*TODO: textarea*/}
        <textarea maxLength={256} rows={3} />
      </FormItem>
    </StyledForm>
  );
}

export default forwardRef(WorkspaceBaseInfomation);
