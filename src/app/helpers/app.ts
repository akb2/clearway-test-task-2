import { BaseTypes, TypeOrArray } from "@app/models/app";

/**
 * Проверка переменной на инициализацию
 * Если значение равно null или undefined, возвращает false.
 *
 * @param value Проверяемое значение
 * @returns Результат проверки TRUE/FALSE
 * @template D - Тип значения
 */
export const IsDefined = <T>(value?: T): boolean => value !== undefined && value !== null;

export const DeepClone = <U extends TypeOrArray<BaseTypes>>(value?: U): U => {
  if (!!value) {
    if (Array.isArray(value)) {
      return value.map(item => DeepClone(item)) as U;
    }

    else if (typeof value === "object") {
      const obj = <Record<string, keyof U>>value;

      return Object.entries(obj).reduce(
        (acc, [key, item]: [string, keyof U]) => {
          (acc as Record<string, keyof U>)[key] = DeepClone(item);

          return acc;
        },
        {} as U
      );
    }
  }

  return value as U;
};
