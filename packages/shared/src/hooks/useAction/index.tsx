import React, { ReactNode, useMemo } from 'react';
import { isEmpty, isFunction, get } from 'lodash';
import { getActions } from 'src/utils';

interface Action<T extends Record<string, unknown>> {
  key: string;
  action?: string;
  icon?: ReactNode;
  text?: string;
  disabled?: boolean | ((record?: T) => boolean);
  onClick?: (record?: T) => void;
}

interface Props<T extends Record<string, unknown>> {
  authKey: string;
  params?: Record<string, string>;
  itemAction?: Action<T>[];
  tableAction?: Action<T>[];
  batchAction?: Action<T>[];
}

function useAction<T extends Record<string, unknown>>({ authKey, params = {} }: Props<T>) {
  const enabledActions = useMemo(
    () =>
      getActions({
        module: authKey,
        ...params,
        project: params.namespace,
        devops: params.devops,
      }),
    [],
  );

  
  return {
    useItemAction,
    useTableAction,
    useSelectedAction,
  };
}
