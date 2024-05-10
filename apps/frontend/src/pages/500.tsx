import { useEffect, useState } from 'react';

import Link from 'next/link';

import { appRouter } from '@/router/app/AppRouter';

function ServerErrorPage() {
  // Error pages don't allow getServerSideProps, therefor url data is fetched on load.
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const messageFromUrl = params.get('message');

      if (messageFromUrl !== null) {
        setMessage(messageFromUrl);
      }
    }
  }, []);

  return (
    <main className="w-full min-h-screen flex flex-col justify-start items-center p-5 sm:p-7 md:p-10">
      <div className="radio-plus-content-wrapper flex-1 w-full h-full flex flex-col justify-between items-center px-5 py-8 bg-base-800 rounded-md sm:px-6 md:px-7 max-w-[600px]">
        <div className="flex flex-col justify-start items-center gap-y-5">
          <img
            src="/assets/radio-plus-logo.png"
            alt="Radio plus"
            className="w-32 h-auto mb-3"
          />
          <h1 className="font-arizonia text-7xl">
            Radio<span className="font-dmsans text-secondary-700">⁺</span>
          </h1>
          <div className="mt-2 mb-5 text-center">
            <p className="mb-1.5 text-xl sm:text-2xl">
              Seems like something went wrong here.
            </p>
            <p className="text-xl sm:text-2xl">{message}</p>
          </div>
          <Link
            href={appRouter.get('Base').build()}
            className="px-10 py-1 mx-1 text-lg font-medium text-white bg-primary-500 rounded-full lg:transition-colors lg:hover:bg-primary-400"
            aria-label="Go back to the landing page"
          >
            Home
          </Link>
        </div>
        <div>
          <p className="text-base-600">500 - Internal server error</p>
        </div>
      </div>
    </main>
  );
}

export default ServerErrorPage;
