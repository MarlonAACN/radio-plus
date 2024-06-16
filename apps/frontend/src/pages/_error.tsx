import { NextPageContext } from 'next';

import Error from 'next/error';

type StaticErrorPageProps = {
  statusCode: number;
};

function Page({ statusCode }: StaticErrorPageProps) {
  return <Error statusCode={statusCode}></Error>;
}

Page.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Page;
