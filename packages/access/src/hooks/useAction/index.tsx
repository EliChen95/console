import React, {
  ComponentClass,
  FunctionComponent,
  createElement,
  MouseEvent,
  ReactNode,
  useMemo,
} from 'react';
import { isEmpty, isFunction, isNull } from 'lodash';
import { getActions } from '@ks-console/shared';
import { More } from '@kubed/icons';
import { BatchActionButton, TableActionButton } from './style';
import { Dropdown, Menu, MenuItem, Button } from '@kubed/components';

interface Action<T extends Record<string, unknown>> {
  key: string;
  action?: string;
  icon?: ReactNode | ((record: T) => ReactNode);
  text?: ReactNode | ((record: T) => ReactNode);
  disabled?: boolean | ((record?: T) => boolean);
  show?: boolean | ((record: T) => boolean);
  onClick?: (e: MouseEvent<HTMLButtonElement>, record: T) => void;
  render?: (record?: T) => ReactNode;
  props?: Record<string, any>;
}

interface Props<T extends Record<string, unknown>> {
  authKey: string;
  params?: Record<string, string>;
  itemAction?: Action<T>[];
  tableAction?: Action<T>[];
  batchAction?: Action<T>[];
}

function renderByActionList<T extends Record<string, unknown>>(
  actionList: Action<T>[],
  component: FunctionComponent<any> | ComponentClass<any> | string,
) {
  return function () {
    if (isEmpty(actionList)) {
      return null;
    }

    return actionList.map(action => {
      if (action.render) {
        return action.render();
      }

      return createElement(
        component,
        {
          key: action.key,
          disabled: isFunction(action.disabled) ? action.disabled() : action.disabled,
          onClick: action.onClick,
          ...(action.props || {}),
        },
        [action.text],
      );
    });
  };
}

export function useAction<T extends Record<string, any>>({
  authKey,
  params = {},
  itemAction = [],
  tableAction = [],
  batchAction = [],
}: Props<T>) {
  const enabledActions = useMemo(
    () =>
      getActions({
        module: authKey,
        ...params,
        project: params.namespace,
        devops: params.devops,
      }),
    [authKey, params],
  );
  const actionFilter = ({ action }: Action<T>) => !action || enabledActions.includes(action);
  const enabledItemActions = useMemo(
    () => itemAction.filter(actionFilter),
    [enabledActions, itemAction],
  );
  const enabledbatchActions = useMemo(
    () => batchAction.filter(actionFilter),
    [enabledActions, itemAction],
  );
  const enabledTableActions = useMemo(
    () => tableAction.filter(actionFilter),
    [enabledActions, tableAction],
  );

  const renderMoreMenu = (record: T): ReactNode => {
    const menuItems = enabledItemActions.map(action => {
      if (action.render) {
        return action.render(record);
      }
      const shouldRender = isFunction(action.show) ? action.show(record) : action.show || true;
      const icon = isFunction(action.icon) ? action.icon(record) : action.icon;
      const text = isFunction(action.text) ? action.text(record) : action.text;
      const disabled = isFunction(action.disabled) ? action.disabled(record) : action.disabled;
      if (!shouldRender) return null;

      return (
        <MenuItem
          key={action.key}
          icon={icon}
          disabled={disabled}
          onClick={action.onClick ? e => action.onClick?.(e, record) : undefined}
          {...(action.props || {})}
        >
          {text}
        </MenuItem>
      );
    });

    return menuItems.every(menuItem => isNull(menuItem)) ? null : <Menu>{menuItems}</Menu>;
  };

  const renderItemAction = (field: string, record: T) => {
    if (isEmpty(enabledItemActions)) {
      return null;
    }

    const content = renderMoreMenu(record);

    return isNull(content) ? null : (
      <Dropdown placement="bottom-end" content={content}>
        <Button variant="text" radius="lg">
          <More size={16} />
        </Button>
      </Dropdown>
    );
  };

  const renderBatchAction = renderByActionList(enabledbatchActions, BatchActionButton);
  const renderTableAction = renderByActionList(enabledTableActions, TableActionButton);

  return {
    renderItemAction,
    renderBatchAction,
    renderTableAction,
  };
}
