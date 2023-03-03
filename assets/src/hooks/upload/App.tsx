import { useMemo, useState } from 'react';
import { HookProperties, LiveSocket } from '~/types/phoenix_live_view';
import { LiveViewProvider, useLiveView } from './LiveViewContext';

type AppProps = {
  liveSocket: LiveSocket;
  el: Element;
  pushEvent: (event: string, payload: any, callback?: (reply: any, ref: any) => any) => void;
  pushEventTo: (
    selectorOrTarget: string | Element,
    event: string,
    payload: any,
    callback?: (reply: any, ref: any) => any,
  ) => void;
  handleEvent: HookProperties['handleEvent'];
  upload: HookProperties['upload'];
};

export function App({ liveSocket, el, pushEvent, pushEventTo, handleEvent, upload }: AppProps) {
  const liveView = useMemo(
    () => ({ el, liveSocket, pushEvent, pushEventTo, handleEvent, upload }),
    [el, liveSocket, pushEvent, pushEventTo, handleEvent, upload],
  );

  return (
    <LiveViewProvider value={liveView}>
      <UploadField />
    </LiveViewProvider>
  );
}

function UploadField() {
  const [isUploading, setIsUploading] = useState(false);
  const [src, setSrc] = useState('');
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const liveView = useLiveView();

  const upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setIsUploading(true);

    if (file) {
      liveView.handleEvent('Upload:progress', (payload: { progress: number }) => {
        console.log('progress', payload.progress);
        setProgress(payload.progress);
      });

      liveView.handleEvent('Upload:complete', (payload: { url: string }) => {
        setSrc(payload.url);
        setIsUploading(false);
      });

      liveView.handleEvent(`Upload:failed`, () => {
        setError('Upload failed');
        setIsUploading(false);
      });

      liveView.upload('image', [file]);
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (isUploading) {
    return <div>Uploading image. Progress: {progress}%</div>;
  }

  return (
    <div>
      <p>This input is from React (/hooks/uploads/App.tsx)</p>
      <input type="file" name="my-uploaded-file" onChange={upload} />
      <img src={src} />
    </div>
  );
}
