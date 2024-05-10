import { AppRoutes } from '@/router/app/AppRoutes';
import { parseTemplate } from '@/util/url-template';

class AppRouter {
  public get<T extends keyof typeof AppRoutes>(
    name: T
  ): { name: T; build: (vars?: (typeof AppRoutes)[T]['vars']) => string } {
    const rawRoute = AppRoutes[name];

    if (!rawRoute) {
      return {
        name: 'Fallback' as T,
        build: () => {
          return AppRoutes['Fallback'].path;
        },
      };
    }

    return {
      name: name,
      build: (vars?: typeof rawRoute.vars) => {
        if (!vars) {
          return rawRoute.path;
        }

        const template = parseTemplate(rawRoute.path);
        return template.expand(vars);
      },
    };
  }
}

export const appRouter = new AppRouter();
