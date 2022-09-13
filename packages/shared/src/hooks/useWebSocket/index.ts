import { useState, useEffect } from 'react';

import type { WebSocketClientOptions } from '../../utils';
import { WebSocketClient, urlHelper } from '../../utils';

const { getWebSocketProtocol, getClusterUrl } = urlHelper;

interface UseWebSocketOptions<T> extends WebSocketClientOptions<T> {
  url: string;
}

export function useWebSocket<T>({ url, ...options }: UseWebSocketOptions<T>) {
  const protocol = getWebSocketProtocol(window.location.protocol);
  const { host } = window.location;
  const pathname = getClusterUrl(`/${url}`);

  const [message, setMessage] = useState<T>();

  const { onmessage, ...rest } = options;
  const websocketClient = new WebSocketClient<T>(`${protocol}://${host}${pathname}`, {
    ...rest,
    onmessage: (data, ev) => {
      setMessage(data);
      if (typeof onmessage === 'function') {
        onmessage(data, ev);
      }
    },
  });

  useEffect(() => {
    return websocketClient.close(true);
  }, []);

  return { websocketClient, message };
}
