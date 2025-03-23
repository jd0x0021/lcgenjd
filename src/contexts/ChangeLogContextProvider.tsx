import { nanoid } from "nanoid";
import { Dispatch, ReactNode, SetStateAction, createContext, useContext, useState } from "react";
import { ChangeLogMetadataType } from "~/components/ChangeLogMetadata";
import { ChangeSetType, DEFAULT_DATABASE_TABLE_DML_VARIANT } from "~/components/ChangeSet";

const LCGEN_CHANGE_LOG_DATA = "lcgenjd-changeLog-data" as const;

export type ChangeLogType = {
	metaData: ChangeLogMetadataType;
	changeSets: ChangeSetType[];
};

// These are the values the ChangeLogContext can have
export type ChangeLogContextType = {
	changeLog: ChangeLogType;
	setChangeLog: Dispatch<SetStateAction<ChangeLogType>>;
};

// createContext: this is the value that the context will have when there is no
// matching context provider in the tree above the component that reads a context.
// (This context is going to hold a ChangeLogContextType. The actual ChangeLogContextType
// is assigned in the context provider's (ChangeLogContext.Provider) value property)
const ChangeLogContext = createContext<ChangeLogContextType | undefined>(undefined);

/**
 * This is the context consumer for the ChangeLogContext.Provider
 * (this is used to ACCESS the values provided by the ChangeLogContext).
 *
 * @returns
 */
export const useChangeLogContext = (): ChangeLogContextType => {
	// This is going to be undefined if the context provider has not been declared in the
	// tree above the component that needs the context (ChangeLogContextType) values.
	const changeLogContext: ChangeLogContextType | undefined = useContext(ChangeLogContext);

	if (changeLogContext === undefined) {
		throw new Error(
			"No ChangeLogContext.Provider was found when calling useChangeLogContext()."
		);
	}

	return changeLogContext;
};

/**
 * This ensures we always get a new {@link ChangeLogType} object.
 *
 * @returns
 */
export const getDefaultChangeLogData = (): ChangeLogType => {
	return {
		metaData: {
			author: "",
			logicalFilePath: "",
		},
		changeSets: [
			{
				id: nanoid(),
				databaseTablesDMLVariant: DEFAULT_DATABASE_TABLE_DML_VARIANT,
				databaseTables: [],
			},
		],
	};
};

/**
 * Retrieve the changelog data's JSON string ({@link LCGEN_CHANGE_LOG_DATA}) that is stored from the
 * **localStorage** and convert it to a {@link ChangeLogType}. If there is no changelog data
 * string in the **localStorage**, return a **default** {@link ChangeLogType} instead. This
 * function is responsible for _**retaining**_ changelog data when the page is refreshed.
 *
 * @returns
 */
const getChangeLogData = (): ChangeLogType => {
	const changeLogInLocalStorage: string | null = localStorage.getItem(LCGEN_CHANGE_LOG_DATA);

	if (changeLogInLocalStorage === null) {
		return getDefaultChangeLogData();
	}

	const asdfasfasd: ChangeLogType = JSON.parse(
		localStorage.getItem(LCGEN_CHANGE_LOG_DATA) as string
	);

	return asdfasfasd;
};

const ChangeLogContextProvider = ({ children }: { children: ReactNode }) => {
	const [changeLog, setChangeLog] = useState<ChangeLogType>(getChangeLogData());

	// Set the changelog data in the localStorage so we can pull it later
	// once the page is refreshed, and retain the current changelog data.
	localStorage.setItem(LCGEN_CHANGE_LOG_DATA, JSON.stringify(changeLog));

	return (
		<ChangeLogContext.Provider value={{ changeLog, setChangeLog }}>
			{children}
		</ChangeLogContext.Provider>
	);
};

export default ChangeLogContextProvider;
