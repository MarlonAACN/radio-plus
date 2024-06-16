import { SkipBackIcon } from '@/icons';

type SkipBackBtnProps = {
  skipBackHandler: () => void;
  disabled?: boolean;
};

function SkipBackBtn({ skipBackHandler, disabled = false }: SkipBackBtnProps) {
  // https://github.com/vercel/next.js/issues/35558
  const firefoxProps = {
    autoComplete: 'off',
  };

  return (
    <button
      {...firefoxProps}
      disabled={disabled}
      onClick={() => skipBackHandler()}
      className="radio-plus-skip-back-player-btn group p-2 rounded-full transition-colors hover:enabled:bg-base-800/50"
    >
      <SkipBackIcon className="group-disabled:fill-base-600 w-7 h-7 fill-base-0" />
    </button>
  );
}

export { SkipBackBtn };
