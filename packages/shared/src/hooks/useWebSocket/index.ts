import { useState, useEffect } from 'react';

import { WebSocketClient, urlHelper } from '../../utils';

const { getWebSocketProtocol, getClusterUrl } = urlHelper;

interface UseWebSocketOptions {
  url: string;
}

export function useWebSocket<T>({ url }: UseWebSocketOptions) {
  const protocol = getWebSocketProtocol(window.location.protocol);
  const { host } = window.location;
  const pathname = getClusterUrl(`/${url}`);

  const [message, setMessage] = useState<T>();

  const websocketClient = new WebSocketClient<T>(`${protocol}://${host}${pathname}`, {
    onmessage: setMessage,
  });

  useEffect(() => {
    return websocketClient.close(true);
  }, []);

  return { websocketClient, message };
}
