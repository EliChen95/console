import type { UseWebSocketOptions } from './useWebSocket';
import { useWebSocket } from './useWebSocket';

interface UseListWebSocketOptions<T> extends UseWebSocketOptions<T> {}

export type { UseListWebSocketOptions };

export function useListWebSocket<T>(options: UseListWebSocketOptions<T>) {
  return useWebSocket(options);
}
