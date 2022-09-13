import { get } from 'lodash';

import { Constants } from '../../constants';
import type { UseWebSocketOptions } from './useWebSocket';
import { useWebSocket } from './useWebSocket';

const { MODULE_KIND_MAP } = Constants;

interface UseListWebSocketOptions<T> extends UseWebSocketOptions<T> {
  module: string;
  isFederated?: boolean;
  listData: T[];
  // format: (originalData: D) => T;
}

export type { UseListWebSocketOptions };

export function useListWebSocket<T>({
  module,
  isFederated,
  ...useWebSocketOptions
}: UseListWebSocketOptions<T>) {
  let kind: string = get(MODULE_KIND_MAP, module, '');
  if (isFederated) {
    kind = `Federated${kind}`;
  }

  const { message } = useWebSocket<T>(useWebSocketOptions);

  return { kind, message };
}
