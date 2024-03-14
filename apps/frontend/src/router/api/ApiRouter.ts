import { ApiRoutes } from '@/router/api/ApiRoutes';
import { parseTemplate } from '@/util/url-template';

export class ApiRouter {
  private readonly apiBaseURL: URL;

  constructor(apiBase: string) {
    this.apiBaseURL = new URL(apiBase);
  }

  public get<T extends keyof typeof ApiRoutes>(
    name: T
  ): {
    name: T;
    build: (
      vars?: Partial<(typeof ApiRoutes)[T]['vars']>,
      query?: Partial<(typeof ApiRoutes)[T]['query']>
    ) => string;
  } {
    const rawRoute = ApiRoutes[name];

    if (!rawRoute) {
      throw new Error(`Api route with name '${name}' doesn't exist`);
    }

    return {
      name: name,
      build: (
        vars?: Partial<typeof rawRoute.vars>,
        query?: Partial<typeof rawRoute.query>
      ) => {
        if (vars && Object.keys(vars).length > 0) {
          const route = parseTemplate(rawRoute.path).expand(vars);
          const basePath = this.apiBaseURL.pathname + route;
          const url = new URL(basePath.replace(/\/\//g, '/'), this.apiBaseURL);

          if (query) {
            url.search = new URLSearchParams(query).toString();
          }

          return url.toString();
        } else {
          throw new Error('Missing path variables');
        }
      },
    };
  }
}
