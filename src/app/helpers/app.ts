import { Type } from "@angular/core";
import { Route } from "@angular/router";
import { BaseTypes, Nullable, TypeOrArray } from "@models/app";

/**
 * Проверка переменной на инициализацию
 * Если значение равно null или undefined, возвращает false.
 *
 * @param value Проверяемое значение
 * @returns Результат проверки TRUE/FALSE
 * @template D - Тип значения
 */
export const IsDefined = <T>(value: Nullable<T>): boolean => value !== undefined && value !== null;

export const DeepClone = <U extends TypeOrArray<BaseTypes>>(value: Nullable<U>): U => {
  if (!!value) {
    if (Array.isArray(value)) {
      return value.map(item => DeepClone(item)) as U;
    }

    else if (typeof value === "object") {
      if (value instanceof Set) {
        return new Set(Array.from(value).map(item => DeepClone(item))) as U;
      }

      const obj = <Record<string, U[keyof U]>>value;

      return Object.entries(obj).reduce(
        (acc, [key, item]: [string, U[keyof U]]) => {
          (acc as Record<string, U[keyof U]>)[key] = DeepClone(item);

          return acc;
        },
        {} as U
      );
    }
  }

  return value as U;
};

/**
 * Возвращает массив маршрутов без подмаршрутов.
 *
 * @param component Компонент, который будет отображаться для данного маршрута.
 * @returns Массив маршрутов без подмаршрутов.
 * @template C Тип компонента.
 */
export const NoSubRoutes = <C>(component: Type<C>): Route[] => ([{ path: "", component }]);

export const IsMacOs = () => /mac\s?os/i.test(navigator.userAgent);

export const IsSafari = () => /^Mozilla\/.*AppleWebKit\/.*\(KHTML, like Gecko\)(?!.*Chrome\/)(?!.*Chromium\/).*Version\/[\d.]+ Safari\/[\d.]+$/i.test(navigator.userAgent);

export const CreateNewId = <T>(table: Record<number, T>): number => {
  let id = 1;

  while (id in table) {
    id++;
  }

  return id;
};

export const CompareObjects = <T extends Record<string, any>>(a: T, b: T) => !Object
  .keys(a)
  .some(key => a[key] !== b[key]);
