
/**
 * Проверка переменной на инициализацию
 * Если значение равно null или undefined, возвращает false.
 *
 * @param value Проверяемое значение
 * @returns Результат проверки TRUE/FALSE
 * @template D - Тип значения
 */
export const IsDefined = <T>(value?: T): boolean => value !== undefined && value !== null;
