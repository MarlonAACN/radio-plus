import { SkipFwdIcon } from '@/icons';

type SkipFwdBtnProps = {
  skipFwdHandler: () => void;
  disabled?: boolean;
};

function SkipFwdBtn({ skipFwdHandler, disabled = false }: SkipFwdBtnProps) {
  // https://github.com/vercel/next.js/issues/35558
  const firefoxProps = {
    autoComplete: 'off',
  };

  return (
    <button
      {...firefoxProps}
      disabled={disabled}
      onClick={() => skipFwdHandler()}
      aria-label="Skip to the next track"
      className="radio-plus-skip-fwd-player-btn group p-2 rounded-full transition-colors hover:enabled:bg-base-800/50"
    >
      <SkipFwdIcon className="group-disabled:fill-base-600 w-7 h-7 fill-base-0" />
    </button>
  );
}

export { SkipFwdBtn };
