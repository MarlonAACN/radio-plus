import { Spinner } from '@/icons';

type FilterFormSubmitBtnProps = {
  /** Submit btn shows a loading spinner and is disabled if true. */
  isLoading: boolean;
  /** Submit btn is disabled if true. */
  formHasErrors: boolean;
  /** Submit btn is disabled if not true. */
  formHoldsNewData: boolean;
  /** Don't allow config submits, before player was successfully transferred to the radio plus instance. */
  playerWasTransferred: boolean;
  /** Don't allow config submits, before user fetch is completed. */
  userFetched: boolean;
  /** Don't allow config submits, if no track origin value is set. */
  radioOriginTrackinputValue: string | null;
  menuIsOpen: boolean;
};

function ConfigFormSubmitBtnView({
  isLoading,
  formHoldsNewData,
  formHasErrors,
  playerWasTransferred,
  userFetched,
  radioOriginTrackinputValue,
  menuIsOpen,
}: FilterFormSubmitBtnProps) {
  // https://github.com/vercel/next.js/issues/35558
  const extraFirefoxProps = {
    autoComplete: 'off',
  };

  return (
    <button
      className="w-full flex flex-col justify-center items-center px-5 py-2 mx-auto mt-10 bg-primary-500 rounded-full transition-colors cursor-pointer disabled:bg-base-700 disabled:cursor-default enabled:hover:bg-primary-400 max-w-xl"
      {...extraFirefoxProps}
      disabled={
        isLoading ||
        !formHoldsNewData ||
        formHasErrors ||
        !playerWasTransferred ||
        !userFetched ||
        !radioOriginTrackinputValue ||
        !menuIsOpen
      }
      type="submit"
    >
      {isLoading || !playerWasTransferred || !userFetched ? (
        <Spinner className="w-6 h-6 py-0.5" />
      ) : (
        'Generate'
      )}
    </button>
  );
}

export { ConfigFormSubmitBtnView };
