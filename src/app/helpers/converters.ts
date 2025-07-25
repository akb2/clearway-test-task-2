import { Nullable } from "@models/app";
import { IsDefined } from "./app";

/**
 * Преобразует значение в массив.
 * Если значение уже является массивом, возвращает его без изменений.
 * Если значение не является массивом, возвращает массив, содержащий это значение.
 * Если значение равно null или undefined, возвращает пустой массив.
 *
 * @param value - Значение, которое нужно преобразовать в массив.
 * @returns Преобразованное значение в виде массива.
 * @template D - Тип значения.
 */
export const AnyToArray = <D>(value: Nullable<D | D[] | Set<D>>): D[] => IsDefined(value)
  ? Array.isArray(value)
    ? value
    : value instanceof Set
      ? Array.from(value)
      : [value!]
  : [] as D[];


/**
 * Преобразует любое значение в целое число.
 * Если значение не может быть преобразовано в число, возвращает значение по умолчанию.
 *
 * @param value Значение, которое нужно преобразовать в целое число
 * @param defaultValue Значение по умолчанию, которое будет возвращено, если преобразование не удалось
 * @returns Целое число, полученное из значения, или значение по умолчанию, если преобразование не удалось
 */
export const AnyToInt = (value: any, defaultValue: number = 0): number => {
  const result = parseInt(value, 10);
  // Если результат не число, возвращаем значение по умолчанию
  return isNaN(result)
    ? defaultValue
    : result;
}

/**
 * Преобразует любое значение в строку.
 *
 * @param value - Значение, которое нужно преобразовать в строку
 * @param defaultValue - Значение по умолчанию, которое будет использовано, если переданное значение равно null или undefined
 * @returns Преобразованное значение в виде строки
 */
export const AnyToString = (value: any, defaultValue: string = ""): string => value?.toString() ?? defaultValue;
