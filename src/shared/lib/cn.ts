/**
 * Class Name Utility (cn)
 * Utility for conditionally joining classNames together
 * Similar to classnames/clsx but simpler
 */

type ClassValue = string | number | boolean | undefined | null | ClassValue[];

/**
 * Merge class names conditionally
 */
export function cn(...classes: ClassValue[]): string {
  return classes
    .flat()
    .filter((x) => typeof x === 'string' && x.trim() !== '')
    .join(' ')
    .trim();
}

/**
 * Example Usage:
 *
 * // Simple
 * cn('text-red-500', 'font-bold') // 'text-red-500 font-bold'
 *
 * // Conditional
 * cn('base-class', isActive && 'active-class', isError && 'error-class')
 *
 * // With arrays
 * cn(['text-sm', 'font-medium'], isDisabled && 'opacity-50')
 *
 * // In components
 * <button className={cn(
 *   'px-4 py-2 rounded',
 *   variant === 'primary' && 'bg-blue-500 text-white',
 *   variant === 'secondary' && 'bg-gray-200 text-gray-800',
 *   isDisabled && 'opacity-50 cursor-not-allowed'
 * )}>
 *   Click me
 * </button>
 */
