/* eslint-disable @typescript-eslint/no-explicit-any */
export interface LiveSocket {
  execJS(el: HTMLElement, js: any): void;
  historyRedirect: (href: string, linkState: 'push' | 'replace', flash?: any) => void;
  pushHistoryPatch: (href: string, linkState: 'push' | 'replace', sourceEl?: HTMLElement) => void;
  isDebugEnabled(): boolean;
}

export interface HookLifecycle {
  mounted?(): void;
  updated?(): void;
  destroyed?(): void;
  disconnected?(): void;
  reconnected?(): void;
}

export interface HookProperties {
  el: HTMLElement;
  liveSocket: LiveSocket;
  pushEvent(event: string, payload?: any, onReply?: (reply: any, ref: any) => void): void;
  pushEventTo(
    selectorOrTarget: string | Element,
    event: string,
    payload?: any,
    onReply?: (reply: any, ref: any) => void,
  ): void;
  handleEvent(event: string, callback: (payload?: any) => void): void;
  upload(name: string, files: (File | Blob)[]): void;
  uploadTo(selectorOrTarget: string | Element, name: string, files: (File | Blob)[]): void;
}

export type Hook<T> = HookLifecycle & Partial<T> & ThisType<HookProperties & HookLifecycle & T>;
