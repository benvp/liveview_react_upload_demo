/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useContext } from 'react';
import { HookProperties, LiveSocket } from '~/types/phoenix_live_view';

type LiveViewContext = {
  liveSocket: LiveSocket;
  el: Element;
  pushEvent: (event: string, payload?: any, callback?: (reply: any, ref: any) => any) => void;
  pushEventTo: (
    selectorOrTarget: string | Element,
    event: string,
    payload?: any,
    callback?: (reply: any, ref: any) => any,
  ) => void;
  handleEvent: HookProperties['handleEvent'];
  upload: HookProperties['upload'];
};

const LiveViewContext = createContext<LiveViewContext | null>(null);

export const LiveViewProvider = LiveViewContext.Provider;

export function useLiveView() {
  const context = useContext(LiveViewContext);

  if (!context) {
    throw new Error('useLiveView must be used within an LiveViewProvider');
  }

  return context;
}
