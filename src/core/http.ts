import { getFieldFromObject, mergeObjectsTo, splitAndGet } from '../helpers';
import { settings } from './settings';

export interface Http {
  get: <T>(url: string) => Promise<T>;
  post: <T>(url: string, data: unknown) => Promise<T>;
  delete: <T>(url: string) => Promise<T>;
  put: <T>(url: string, data: unknown) => Promise<T>;
  patch: <T>(url: string, data: unknown) => Promise<T>;
}

export interface RequestOptions {
  method?: string;
  url?: string;
  requestBody?: string | object;
  responseQueryPath?: string | null;
}

export function requestOptionsToString(options: RequestOptions): string {
  let bodyString = '';
  if (options.requestBody) {
    if (typeof options.requestBody === 'string') {
      bodyString = options.requestBody;
    }
    if (typeof options.requestBody === 'object') {
      bodyString = JSON.stringify(options.requestBody);
    }
  }
  return `${options.method}>>${options.url}${bodyString ? `>>${bodyString}` : ''}`;
}

export function parseUrlPattern(pattern: string): RequestOptions {
  const requestOptions: RequestOptions = {
    method: 'get',
  };
  try {
    mergeObjectsTo(requestOptions, JSON.parse(pattern));
  } catch {
    const items = pattern.split(/>>/g);
    if (items.length === 1) {
      requestOptions.url = pattern;
    } else {
      requestOptions.method = items[0].toLowerCase();
      requestOptions.url = items[1];
      requestOptions.requestBody = items.length >= 3 ? JSON.parse(items[2]) : null;
    }
  }

  if (requestOptions.url?.indexOf('#')) {
    const url = requestOptions.url;
    requestOptions.url = splitAndGet(url, '#', 0) || undefined;
    requestOptions.responseQueryPath = splitAndGet(url, '#', 'last');
  }

  return requestOptions;
}

export function requestFromPattern<T>(pattern: string): Promise<T> {
  if (!settings.http) {
    throw new Error('You did not set the http client.');
  }
  const options = parseUrlPattern(pattern);
  if (!options.method) {
    options.method = 'get';
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fn = (<any>settings.http)[options.method] as any;
  if (!fn) {
    throw new Error(`Invalid method "${options.method}" for http.`);
  }
  let fnPromise;
  if (options.method === 'get') {
    fnPromise = fn(options.url);
  } else {
    fnPromise = fn(
      options.url,
      options.requestBody
        ? typeof options.requestBody === 'string'
          ? JSON.parse(options.requestBody)
          : options.requestBody
        : undefined,
    );
  }
  return fnPromise.then(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (response: any) => {
      if (options.responseQueryPath) {
        return getFieldFromObject(response, options.responseQueryPath);
      }
      return response;
    },
  ) as Promise<T>;
}
