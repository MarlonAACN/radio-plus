import Link from 'next/link';

import { appRouter } from '@/router/app/AppRouter';

function ServerErrorPage() {
  return (
    <>
      <main>
        <h1>500 - Internal Server Error</h1>
        <Link
          href={appRouter.get('Base').build()}
          className="px-2 py-1 mx-1 text-white bg-primary-500 rounded"
          aria-label="Go back to the landing page"
        >
          Home
        </Link>
      </main>
    </>
  );
}

export default ServerErrorPage;
