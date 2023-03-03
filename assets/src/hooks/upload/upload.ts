import { Hook } from '~/types/phoenix_live_view';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import React from 'react';

type UploadHookType = {
  cleanup(): void;
};

export type UploadHook = Hook<UploadHookType>;

export const Upload: UploadHook = {
  mounted() {
    const root = createRoot(this.el);

    root.render(
      React.createElement(App, {
        el: this.el,
        liveSocket: this.liveSocket,
        pushEvent: this.pushEvent.bind(this),
        pushEventTo: this.pushEventTo.bind(this),
        handleEvent: this.handleEvent.bind(this),
        upload: this.upload.bind(this),
      }),
    );

    this.cleanup = () => {
      root.unmount();
    };
  },
  destroyed() {
    this.cleanup();
  },
};
