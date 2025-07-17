import { Signal, WritableSignal } from "@angular/core";

/**
 * Проверка переменной на инициализацию
 * Если значение равно null или undefined, возвращает false.
 *
 * @param value Проверяемое значение
 * @returns Результат проверки TRUE/FALSE
 * @template D - Тип значения
 */
export const IsDefined = <T>(value?: T): boolean => value !== undefined && value !== null;

export type SignalizedType<T> = { [K in keyof T]?: Signal<T[K]> | WritableSignal<T[K]>; };
