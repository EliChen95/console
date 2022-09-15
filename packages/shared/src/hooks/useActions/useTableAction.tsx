import { useMemo } from 'react';
import { TableActionButton } from './style';
import { GetActionsProps, renderByActions, TableAction, useEnabledActions } from './utils';

type Props = {
  actions: TableAction[];
} & GetActionsProps;

export default function useTableActions({ authKey, params, actions }: Props) {
  const enabledActions = useEnabledActions({ authKey, params });
  const enabledTableActions = useMemo(
    () => actions.filter(({ action }) => !action || enabledActions.includes(action)),
    [enabledActions, actions],
  );
  return renderByActions(enabledTableActions, TableActionButton);
}
