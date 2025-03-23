/**
 * This function generates n tab characters where
 * n = number of tabs that will be generated.
 *
 * @param numberOfTabs
 * @returns
 */
export const tab = (numberOfTabs: number): string => {
	const TAB = "\t";
	return Array(numberOfTabs)
		.fill("")
		.map(() => TAB)
		.join("");
};

/**
 * This function generates n newLine characters where
 * n = number of newLines that will be generated.
 *
 * @param numberOfNewLines
 * @returns
 */
export const newLine = (numberOfNewLines: number): string => {
	const NEW_LINE = "\r\n";
	return Array(numberOfNewLines)
		.fill("")
		.map(() => NEW_LINE)
		.join("");
};
