import { LocalStorageItemInterface } from "@models/app";
import { AnyToString } from "./converters";

export const LocalStorageDefaultTtl: number = 604800;

export const LocalStorageSet = <T>(key: string, value: T, ttl: number = LocalStorageDefaultTtl): void => {
  const now: number = (new Date()).getTime();
  const expiry: number = !!ttl ? now + (ttl * 1000) : 0;

  localStorage.setItem(key, JSON.stringify({ value, expiry }));
};

// Удалить данные
export const LocalStorageRemove = (key: string): void => localStorage.removeItem(key);

// Извлеч данные
export const LocalStorageGet = <T extends any = any>(key: string, typeCallback: (d: any) => T = d => d as T): T => {
  const itemStr: string = AnyToString(localStorage.getItem(key));
  const now: number = +new Date();

  if (itemStr) {
    try {
      const item = JSON.parse(itemStr) as LocalStorageItemInterface;

      if (now <= item.expiry || item.expiry <= 0) {
        try {
          return typeCallback(item.value);
        }
        // Вернуть в виде строки
        catch (_) {
          LocalStorageRemove(key);
        }
      }

      LocalStorageRemove(key);
    }

    catch (_) {
      LocalStorageRemove(key);
    }
  }

  return typeCallback(undefined);
};
