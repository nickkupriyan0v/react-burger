import { API_DOMAIN, WS_HOST } from '@/utils/api';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import type {
  TOrder,
  TOrderRequest,
  TOrderResponse,
  TWSMessage,
  TWSOrder,
} from '@/utils/types';

type TOrdersQueryResponse = {
  orders: TWSOrder[];
  total: number;
  totalToday: number;
  isConnected: boolean;
  isLoading: boolean;
  error: unknown;
};

type TUserOrdersQueryResponse = {
  orders: TWSOrder[];
  total: number;
  totalToday: number;
  isConnected: boolean;
  isLoading: boolean;
  error: unknown;
  isTokenInvalid: boolean;
};

const WS_CONFIG = {
  BASE_URL: WS_HOST,
  ORDERS_PATH: '/orders/all',
  USER_ORDERS_PATH: '/orders',
  MAX_RECONNECT_ATTEMPTS: 5,
  RECONNECT_DELAY_MS: 1000,
} as const;

abstract class BaseWebSocketManager {
  protected ws: WebSocket | null = null;
  protected reconnectAttempts = 0;
  protected reconnectTimeoutId: ReturnType<typeof setTimeout> | null = null;

  abstract getUrl(): string;
  abstract getLogPrefix(): string;
  abstract handleMessage(
    data: unknown,
    onMessage: (data: TWSMessage) => void,
    onError: (error: Event) => void
  ): void;
  abstract onClose(
    onMessage: (data: TWSMessage) => void,
    onError: (error: Event) => void
  ): void;

  protected cleanup(): void {
    if (this.reconnectTimeoutId !== null) {
      clearTimeout(this.reconnectTimeoutId);
      this.reconnectTimeoutId = null;
    }

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  protected resetReconnectAttempts(): void {
    this.reconnectAttempts = 0;
  }

  protected handleReconnect(
    onMessage: (data: TWSMessage) => void,
    onError: (error: Event) => void
  ): void {
    if (this.reconnectAttempts < WS_CONFIG.MAX_RECONNECT_ATTEMPTS) {
      this.reconnect(onMessage, onError);
    }
  }

  protected reconnect(
    onMessage: (data: TWSMessage) => void,
    onError: (error: Event) => void
  ): void {
    this.reconnectAttempts++;
    const delay = WS_CONFIG.RECONNECT_DELAY_MS * Math.pow(2, this.reconnectAttempts - 1);

    console.log(
      `${this.getLogPrefix()} Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${WS_CONFIG.MAX_RECONNECT_ATTEMPTS})`
    );

    this.reconnectTimeoutId = setTimeout(() => {
      this.reconnectTimeoutId = null;
      this.baseConnect(onMessage, onError);
    }, delay);
  }

  protected baseConnect(
    onMessage: (data: TWSMessage) => void,
    onError: (error: Event) => void
  ): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      return;
    }

    this.cleanup();

    try {
      this.ws = new WebSocket(this.getUrl());

      this.ws.onopen = (): void => {
        this.resetReconnectAttempts();
        console.log(`${this.getLogPrefix()} Connected`);
      };

      this.ws.onmessage = (event: MessageEvent<string>): void => {
        try {
          const data = JSON.parse(event.data) as unknown;
          this.handleMessage(data, onMessage, onError);
        } catch (parseError) {
          console.error(`${this.getLogPrefix()} Failed to parse message:`, parseError);
          onError(new Event('parse_error'));
        }
      };

      this.ws.onerror = (error: Event): void => {
        console.error(`${this.getLogPrefix()} Connection error:`, error);
        onError(error);
      };

      this.ws.onclose = (): void => {
        this.onClose(onMessage, onError);
      };
    } catch (error) {
      console.error(`${this.getLogPrefix()} Failed to create connection:`, error);
      onError(new Event('connection_failed'));
    }
  }

  disconnect(): void {
    this.cleanup();
    this.reconnectAttempts = 0;
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

class OrdersWebSocketManager extends BaseWebSocketManager {
  getUrl(): string {
    return `${WS_CONFIG.BASE_URL}${WS_CONFIG.ORDERS_PATH}`;
  }

  getLogPrefix(): string {
    return '[WebSocket]';
  }

  handleMessage(
    data: unknown,
    onMessage: (data: TWSMessage) => void,
    _onError: (error: Event) => void
  ): void {
    onMessage(data as TWSMessage);
  }

  onClose(onMessage: (data: TWSMessage) => void, onError: (error: Event) => void): void {
    this.handleReconnect(onMessage, onError);
  }

  connect(onMessage: (data: TWSMessage) => void, onError: (error: Event) => void): void {
    this.baseConnect(onMessage, onError);
  }
}

class UserOrdersWebSocketManager extends BaseWebSocketManager {
  private isTokenInvalid = false;
  private token = '';

  getUrl(): string {
    const cleanToken = this.token.startsWith('Bearer ')
      ? this.token.slice(7)
      : this.token;
    return `${WS_CONFIG.BASE_URL}${WS_CONFIG.USER_ORDERS_PATH}?token=${cleanToken}`;
  }

  getLogPrefix(): string {
    return '[UserOrders WebSocket]';
  }

  handleMessage(
    data: unknown,
    onMessage: (data: TWSMessage) => void,
    _onError: (error: Event) => void
  ): void {
    const parsedData = data as Record<string, unknown>;

    if (
      typeof parsedData.message === 'string' &&
      parsedData.message === 'Invalid or missing token'
    ) {
      console.error(`${this.getLogPrefix()} Token invalid`);
      this.isTokenInvalid = true;
      this.disconnect();
      return;
    }

    onMessage(parsedData as TWSMessage);
  }

  onClose(onMessage: (data: TWSMessage) => void, onError: (error: Event) => void): void {
    if (!this.isTokenInvalid) {
      this.handleReconnect(onMessage, onError);
    }
  }

  connect(
    token: string,
    onMessage: (data: TWSMessage) => void,
    onError: (error: Event) => void,
    onTokenInvalid: () => void
  ): void {
    this.token = token;
    this.isTokenInvalid = false;
    this.baseConnect(onMessage, onError);
    void onTokenInvalid;
  }

  disconnect(): void {
    super.disconnect();
    this.isTokenInvalid = false;
  }

  getIsTokenInvalid(): boolean {
    return this.isTokenInvalid;
  }
}

const wsManager = new OrdersWebSocketManager();
const userWsManager = new UserOrdersWebSocketManager();

export const ordersApi = createApi({
  reducerPath: 'ordersApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_DOMAIN}/api/`,
    prepareHeaders: (headers, { getState }): Headers => {
      headers.set('Content-Type', 'application/json');

      const state = getState() as { auth: { accessToken: string | null } };
      const token = state.auth.accessToken;

      if (token) {
        const cleanToken = token.startsWith('Bearer ') ? token.slice(7) : token;
        headers.set('Authorization', `Bearer ${cleanToken}`);
      }

      return headers;
    },
  }),
  tagTypes: ['Order'],
  endpoints: (builder) => ({
    createOrder: builder.mutation<TOrder, TOrderRequest>({
      query: (body) => ({
        url: 'orders',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Order'],
    }),

    getOrders: builder.query<TWSMessage, void>({
      queryFn: (): { data: TWSMessage } => ({
        data: { orders: [], total: 0, totalToday: 0 },
      }),
      async onCacheEntryAdded(this: void, _arg, cacheApi) {
        // eslint-disable-next-line @typescript-eslint/unbound-method
        const { updateCachedData, cacheDataLoaded, cacheEntryRemoved } = cacheApi;
        const handleMessage = (data: TWSMessage): void => {
          updateCachedData((): TWSMessage => data);
        };

        const handleError = (error: Event): void => {
          console.error('[Orders Cache] WebSocket error:', error);
        };

        try {
          await cacheDataLoaded;
          wsManager.connect(handleMessage, handleError);

          await cacheEntryRemoved;
          wsManager.disconnect();
        } catch (error) {
          console.error('[Orders Cache] Entry error:', error);
          wsManager.disconnect();
        }
      },
      providesTags: (
        result
      ): ({ type: 'Order'; id: string } | { type: 'Order'; id: 'LIST' })[] =>
        result?.orders
          ? [
              ...result.orders
                .filter((order): order is TWSOrder => Boolean(order._id))
                .map(({ _id }) => ({
                  type: 'Order' as const,
                  id: _id,
                })),
              { type: 'Order', id: 'LIST' },
            ]
          : [{ type: 'Order', id: 'LIST' }],
    }),

    getUserOrders: builder.query<TWSMessage, string>({
      queryFn: (): { data: TWSMessage } => ({
        data: { orders: [], total: 0, totalToday: 0 },
      }),
      async onCacheEntryAdded(this: void, token, cacheApi) {
        // eslint-disable-next-line @typescript-eslint/unbound-method
        const { updateCachedData, cacheDataLoaded, cacheEntryRemoved } = cacheApi;

        const handleMessage = (data: TWSMessage): void => {
          updateCachedData((): TWSMessage => data);
        };

        const handleError = (error: Event): void => {
          console.error('[User Orders Cache] WebSocket error:', error);
        };

        const handleTokenInvalid = (): void => {
          // pass
        };

        try {
          await cacheDataLoaded;
          userWsManager.connect(token, handleMessage, handleError, handleTokenInvalid);

          await cacheEntryRemoved;
          userWsManager.disconnect();
        } catch (error) {
          console.error('[User Orders Cache] Entry error:', error);
          userWsManager.disconnect();
        }
      },
      providesTags: (
        result
      ): ({ type: 'Order'; id: string } | { type: 'Order'; id: 'USER_LIST' })[] =>
        result?.orders
          ? [
              ...result.orders
                .filter((order): order is TWSOrder => Boolean(order._id))
                .map(({ _id }) => ({
                  type: 'Order' as const,
                  id: _id,
                })),
              { type: 'Order', id: 'USER_LIST' },
            ]
          : [{ type: 'Order', id: 'USER_LIST' }],
    }),

    getOrderById: builder.query<TOrderResponse, string>({
      query: (id) => ({
        url: `orders/${id}`,
        method: 'GET',
      }),
      providesTags: (
        result,
        _error,
        id
      ): ({ type: 'Order'; id: string } | { type: 'Order'; id: 'LIST' })[] =>
        result?.orders
          ? [
              ...result.orders
                .filter((order): order is TWSOrder => Boolean(order._id))
                .map(({ _id }) => ({
                  type: 'Order' as const,
                  id: _id,
                })),
              { type: 'Order', id },
            ]
          : [{ type: 'Order', id }],
    }),
  }),
});

export const useGetOrdersWithStatus = (): TOrdersQueryResponse => {
  const { data, error, isLoading } = useGetOrdersQuery();

  return {
    orders: data?.orders ?? [],
    total: data?.total ?? 0,
    totalToday: data?.totalToday ?? 0,
    isConnected: wsManager.isConnected(),
    isLoading,
    error,
  };
};

export const useGetUserOrdersWithStatus = (token: string): TUserOrdersQueryResponse => {
  const { data, error, isLoading } = useGetUserOrdersQuery(token);

  return {
    orders: data?.orders ?? [],
    total: data?.total ?? 0,
    totalToday: data?.totalToday ?? 0,
    isConnected: userWsManager.isConnected(),
    isLoading,
    error,
    isTokenInvalid: userWsManager.getIsTokenInvalid(),
  };
};

export const {
  useCreateOrderMutation,
  useGetOrdersQuery,
  useGetUserOrdersQuery,
  useGetOrderByIdQuery,
} = ordersApi;
