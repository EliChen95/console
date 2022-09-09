interface WebSocketClientOptions<T> {
  subProtocols?: string | string[];
  reopenLimit?: number;
  onopen?: (ev: Event) => any;
  onmessage?: (data: T, ev: MessageEvent<T>) => any;
  onclose?: (ev: CloseEvent) => any;
  onerror?: (ev: Event) => any;
}

interface OptionsProp<T> extends Omit<WebSocketClientOptions<T>, 'reopenLimit'> {
  reopenLimit: number;
}

const DEFAULT_OPTIONS = {
  reopenLimit: 5,
};

export type { WebSocketClientOptions };

export default class WebSocketClient<T> {
  public readonly url: string | URL;

  public readonly options: OptionsProp<T>;

  public client: WebSocket | undefined;

  private reopenCount: number;

  private immediately: boolean;

  private timer?: ReturnType<typeof setTimeout>;

  public constructor(url: string | URL, options?: WebSocketClientOptions<T>) {
    this.url = url;

    if (!this.url) {
      throw Error(`invalid WebSocket url: ${this.url}`);
    }

    this.options = { ...DEFAULT_OPTIONS, ...options };
    this.reopenCount = 0;
    this.immediately = false;
    this.timer = undefined;
    this.setUp();
  }

  private setUp() {
    this.initClient();
    this.attachEvents();
  }

  private initClient() {
    const subProtocols = this.options?.subProtocols;

    if (!this.client) {
      this.client = new WebSocket(this.url, subProtocols);
    }

    if (this.client && this.client.readyState > 1) {
      this.client.close();
      this.client = new WebSocket(this.url, subProtocols);
    }

    return this.client;
  }

  private attachEvents() {
    const { onopen, onmessage, onclose, onerror } = this.options;

    this.client?.addEventListener('open', ev => {
      if (!this.immediately && this.reopenCount < this.options.reopenLimit) {
        this.timer = setTimeout(this.setUp.bind(this), 1000 * 2 ** this.reopenCount);
        this.reopenCount++;
      }

      if (typeof onopen === 'function') {
        onopen(ev);
      }
    });

    this.client?.addEventListener('message', (ev: MessageEvent<T>) => {
      let { data } = ev;
      if (typeof data === 'string') {
        try {
          data = JSON.parse(data);
        } catch (e) {}
      }

      if (typeof onmessage === 'function') {
        onmessage(data, ev);
      }
    });

    this.client?.addEventListener('close', ev => {
      if (typeof onclose === 'function') {
        onclose(ev);
      }
    });

    this.client?.addEventListener('error', ev => {
      console.error('socket error: ', ev);

      if (typeof onerror === 'function') {
        onerror(ev);
      }
    });
  }

  public send(data: string | ArrayBufferLike | Blob | ArrayBufferView) {
    return this.client?.send(data);
  }

  public close(flag?: boolean) {
    if (flag) {
      this.immediately = true;
    }

    this.client?.close();

    if (!!this.timer) {
      clearTimeout(this.timer);
    }
  }
}
