import { Spinner } from '@/icons';

type FilterFormSubmitBtnProps = {
  isLoading: boolean;
};

function ConfigFormSubmitBtnView({ isLoading }: FilterFormSubmitBtnProps) {
  return (
    <button
      className="w-full flex flex-col justify-center items-center px-5 py-2 mx-auto mt-10 bg-primary-500 rounded-full transition-colors cursor-pointer disabled:bg-base-700 disabled:cursor-default enabled:hover:bg-primary-400 max-w-xl"
      disabled={isLoading}
      type="submit"
    >
      {isLoading ? <Spinner className="w-6 h-6 py-0.5" /> : 'Save'}
    </button>
  );
}

export { ConfigFormSubmitBtnView };
