import Head from 'next/head';

import { ApiRouter } from '@/router/api/ApiRouter';

function Base() {
  async function triggerFetch(): Promise<void> {
    const res = await fetch(
      new ApiRouter('http://localhost:3333').get('Auth').build({
        v: 'v1',
      }),
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    const data = await res.json();
    console.log(data);

    return;
  }

  return (
    <>
      <Head>
        <title>Radio⁺</title>
      </Head>
      <main>
        <h2 className="font-arizonia text-6xl">Radio⁺</h2>
        <button onClick={triggerFetch}>Trigger</button>
      </main>
    </>
  );
}

export default Base;
