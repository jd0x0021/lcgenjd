import classNames from "classnames";
import { ChangeEvent, Dispatch, SetStateAction } from "react";
import { BiTrash } from "react-icons/bi";
import ChangeSet, { ChangeSetType } from "~/components/ChangeSet";
import { DatabaseTableType } from "~/components/DatabaseTable/DatabaseTableContent";
import DynamicTextInput from "~/components/DynamicTextInput";
import { ChangeLogType, useChangeLogContext } from "~/contexts/ChangeLogContextProvider";

type DatabaseTableHeaderProps = {
	currentDatabaseTable: DatabaseTableType;
	parentChangeSetId: string; // to determine which ChangeSet this DatabaseTable belongs to
	isSelected: boolean;
	setDatabaseTableContentVisibility: Dispatch<SetStateAction<string>>;
};

const headerStyles = (isSelected: boolean) => {
	return classNames(
		"database-table-header",
		"inline-flex items-center gap-1",
		"border-r-2 border-r-gray-601",
		"px-2 py-1",
		isSelected ? "bg-gray-601" : "bg-gray-501"
	);
};

/**
 * This component represents is a specific database table.
 *
 * @param props
 * @returns
 */
const DatabaseTableHeader = (props: DatabaseTableHeaderProps) => {
	const { changeLog, setChangeLog } = useChangeLogContext();

	/**
	 * Update the current databaseTable's name based on user input (from {@link DynamicTextInput}).
	 *
	 * @param e
	 * @param currentDatabaseTableId The database table that will get have its name updated.
	 */
	const updateDatabaseTableName = (
		e: ChangeEvent<HTMLInputElement>,
		currentDatabaseTableId: string
	) => {
		const newChangeSets = changeLog.changeSets.map((changeSet) => {
			changeSet.databaseTables.map((databaseTable) => {
				if (databaseTable.id === currentDatabaseTableId) {
					databaseTable.name = e.target.value;
				}
			});

			return changeSet;
		});

		setChangeLog((prevState: ChangeLogType) => ({
			...prevState,
			changeSets: newChangeSets,
		}));
	};

	/**
	 * Removes a databaseTable that belongs to a {@link ChangeSet}.
	 *
	 * @param databaseTableId the databaseTable that will be removed
	 */
	const removeDatabaseTable = (databaseTableId: string) => {
		const filteredChangeSets: ChangeSetType[] = changeLog.changeSets.map((changeSet) => {
			if (changeSet.id !== props.parentChangeSetId) {
				return changeSet; // do nothing
			}

			changeSet.databaseTables = changeSet.databaseTables.filter(
				(databaseTable) => databaseTable.id != databaseTableId
			);

			return changeSet;
		});

		setChangeLog((prevState) => ({
			...prevState,
			changeSets: filteredChangeSets,
		}));

		// setting this as blank because the current database table has been deleted,
		// UI will update based on the decision of this function: headerStyles()
		props.setDatabaseTableContentVisibility("");
	};

	return (
		<button className={headerStyles(props.isSelected)} tabIndex={-1}>
			<DynamicTextInput
				id={props.currentDatabaseTable.id}
				value={props.currentDatabaseTable.name}
				placeHolder={props.currentDatabaseTable.name || "DB_TABLE_NAME"}
				onChange={updateDatabaseTableName}
				onFocus={() =>
					props.setDatabaseTableContentVisibility(props.currentDatabaseTable.id)
				}
			/>

			<BiTrash
				color="#E93E30"
				size="2em"
				className="cursor-pointer p-1"
				onClick={() => removeDatabaseTable(props.currentDatabaseTable.id)}
			/>
		</button>
	);
};

export default DatabaseTableHeader;
