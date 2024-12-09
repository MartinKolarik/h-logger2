declare module 'date-format' {

	/**
	 * Formats a date object into a string based on the provided format.
	 * @param format - The format string.
	 * @param date - The date to format. If not provided, the current date is used.
	 * @returns A formatted date string.
	 */
	export function asString(format?: string, date?: Date): string;

	/**
	 * Parses a date string into a Date object based on the provided pattern.
	 * @param pattern - The pattern to use for parsing.
	 * @param str - The date string to parse.
	 * @param missingValuesDate - An optional date to fill in missing values.
	 * @returns A Date object.
	 */
	export function parse(pattern: string, str: string, missingValuesDate?: Date): Date;

	/**
	 * Returns the current date.
	 * Used for testing - replace this function with a fixed date.
	 * @returns The current date as a Date object.
	 */
	export function now(): Date;

	export const ISO8601_FORMAT: string;
	export const ISO8601_WITH_TZ_OFFSET_FORMAT: string;
	export const DATETIME_FORMAT: string;
	export const ABSOLUTETIME_FORMAT: string;

	// Default export
	export default asString;
}
