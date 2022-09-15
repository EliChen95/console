import {
  ComponentClass,
  FunctionComponent,
  createElement,
  MouseEvent,
  ReactNode,
  useMemo,
} from 'react';
import { isEmpty, isFunction } from 'lodash';
import { getActions } from '../../utils';

export interface BaseAction<P = Record<string, any>> {
  key: string;
  action?: string;
  props?: P;
}

export interface TableAction<P = Record<string, any>> extends BaseAction<P> {
  render?: () => ReactNode;
  disabled?: boolean | (() => boolean);
  text?: ReactNode | (() => ReactNode);
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
}

export interface ItemAction<T = Record<string, any>, P = Record<string, any>>
  extends BaseAction<P> {
  render?: (record: T) => ReactNode;
  disabled?: boolean | ((record: T) => boolean);
  icon?: ReactNode | ((record: T) => ReactNode);
  text?: ReactNode | ((record: T) => ReactNode);
  show?: boolean | ((record: T) => boolean);
  onClick?: (e: MouseEvent<HTMLButtonElement>, record: T) => void;
}

export interface GetActionsProps {
  authKey: string;
  params?: Record<string, string>;
}

export function useEnabledActions({ authKey, params = {} }: GetActionsProps) {
  return useMemo(
    () =>
      getActions({
        module: authKey,
        ...params,
        project: params.namespace,
        devops: params.devops,
      }),
    [authKey, params],
  );
}

export function renderByActions<P extends Record<string, any>>(
  actionList: TableAction<P>[],
  component: FunctionComponent<P> | ComponentClass<P> | string,
) {
  return function () {
    if (isEmpty(actionList)) {
      return null;
    }

    return actionList.map(({ render, key, onClick, props = {}, ...rest }) => {
      if (render) {
        return render();
      }
      const disabled = isFunction(rest.disabled) ? rest.disabled() : !!rest.disabled;
      const text = isFunction(rest.text) ? rest.text() : rest.text;
      // TODO:
      return createElement<any>(
        component,
        {
          key,
          disabled,
          onClick,
          ...props,
        },
        [text],
      );
    });
  };
}
