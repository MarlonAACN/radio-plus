import { Spinner } from '@/icons';

type ErrorOverlayProps = {
  showError: boolean;
};

function ErrorOverlayView({ showError }: ErrorOverlayProps) {
  if (!showError) {
    return null;
  }

  return (
    <div className="radio-plus-error-overlay z-50 absolute inset-0 flex flex-col justify-center items-center bg-base-700/90">
      <div className="mb-10 text-center">
        <p className="text-2xl">Spotify returned an error</p>
        <p className="text-2xl">Please reconnect</p>
      </div>
      <Spinner className="w-8 h-8" />
      <span className="mt-1.5 text-sm text-font-400">Redirecting...</span>
    </div>
  );
}

export { ErrorOverlayView };
