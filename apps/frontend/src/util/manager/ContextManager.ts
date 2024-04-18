import { GetServerSidePropsContext } from 'next';

class ContextManager {
  public static setNoStoreCacheHeader(ctx: GetServerSidePropsContext): void {
    ctx.res.setHeader('Cache-Control', 'no-store, must-revalidate');
  }

  /**
   * Get a single param from the context url.
   * @param ctx {GetServerSidePropsContext} getServerSide context object.
   * @param name declared param name.
   * @returns the param value or undefined if not found.
   */
  public static getSingleParam(
    ctx: GetServerSidePropsContext,
    name: string
  ): string | undefined {
    let param = ctx.params?.[name];

    if (param && Array.isArray(param)) {
      param = param[0];
    }

    return param;
  }

  /**
   * Get an object containing the data of the query params that were defined in the names attribute. Undefined values will be omitted from the final object.
   * @param ctx {GetServerSidePropsContext} getServerSide context object.
   * @param names {Array<string>} A list of all query names that should be looked up and returned.
   * @returns { [K in T]?: string } An object with all desired query parameters, where undefined values are not present in the final object.
   */
  public static getDefinedParams<T extends string>(
    ctx: GetServerSidePropsContext,
    names: Array<T>
  ): { [K in T]?: string } {
    const result: { [K in T]?: string } = {};

    for (const name of names) {
      const value = ctx.query[name];

      if (Array.isArray(value)) {
        result[name] = value[0]; // Push first item of array.
      } else if (value) {
        result[name] = value;
      }
    }

    return result;
  }

  public static deleteCookieOnClient(
    name: string,
    ctx: GetServerSidePropsContext
  ): void {
    const deleteCookie = `${name}=undefined; Max-Age=0; path=/`;
    const setCookieHeader = ctx.res.getHeader('Set-Cookie');

    // check if cookie header in res exists
    if (!setCookieHeader) {
      ctx.res.setHeader('Set-Cookie', deleteCookie);
    } else {
      // check if cookie header is an array
      if (Array.isArray(setCookieHeader)) {
        ctx.res.setHeader('Set-Cookie', setCookieHeader.push(deleteCookie));
      } else {
        // turn cookie header string into an array and push
        ctx.res.setHeader('Set-Cookie', [
          setCookieHeader.toString(),
          deleteCookie,
        ]);
      }
    }
  }
}

export { ContextManager };
