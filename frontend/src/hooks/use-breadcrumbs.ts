import { type Params, useMatches } from "react-router-dom";

type Crumb = (data: unknown) => {
  title: string;
};

type RouteWithHandle<Handle extends string, Value> = {
  id: string;
  pathname: string;
  params: Params<string>;
  data: unknown;
  handle: Record<Handle, Value>;
};

function isRecordWithKey<T extends string>(
  value: unknown,
  key: T,
): value is Record<T, unknown> {
  return !!value && typeof value === "object" && key in value;
}

function hasHandle<Handle extends string, Value>(
  handle: Handle,
  valuePredicate?: (v: unknown) => v is Value,
) {
  return (
    route:
      | {
          handle: unknown;
        }
      | RouteWithHandle<Handle, Value>,
  ): route is RouteWithHandle<Handle, Value> => {
    return (
      !!route.handle &&
      isRecordWithKey(route.handle, handle) &&
      (!valuePredicate ||
        (handle in route.handle && valuePredicate(route.handle[handle])))
    );
  };
}

function isCrumb(value: unknown): value is Crumb {
  return typeof value === "function";
}

export function useBreadcrumbs() {
  const matches = useMatches();

  const crumbs = matches.filter(hasHandle("crumb", isCrumb)).map((match) => {
    const { id: key, pathname: href, handle } = match;
    const { title } = handle.crumb(match.data);

    return {
      key,
      title,
      href,
    };
  });

  return crumbs;
}
