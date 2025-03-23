import { ChangeEvent } from "react";
import AddTableCol from "~/components/Common/DisplayTable/ActionComponents/AddTableCol";
import ColumnHeaderCell from "~/components/Common/DisplayTable/ColumnHeader/ColumnHeaderCell";
import DisplayTable, { DisplayTableType } from "~/components/Common/DisplayTable/DisplayTable";
import { useChangeLogContext } from "~/contexts/ChangeLogContextProvider";
import {
	RowCellBorderRightStyle,
	applyBorderRightStyle,
	getDisplayTableFromDML,
} from "~/utils/tableUtils";

type TableColumnHeaderProps = {
	parentDMLId: string; // to determine which DML this DisplayTableType column header belongs to
	displayTableId: string; // to determine which DisplayTableType this column header belongs to
	dbColumnNames: TableColumnHeaderType[]; // the columns that will be displayed in the UI
	onChange: (e: ChangeEvent<HTMLInputElement>, id: string) => void;
};

export type TableColumnHeaderType = {
	id: string;
	text: string;
};

/**
 * This component renders all column header cells ({@link ColumnHeaderCell}) in one row
 * (this is the 1st row in a {@link DisplayTable} component).
 *
 * @param props
 * @returns
 */
const TableColumnHeader = (props: TableColumnHeaderProps) => {
	const { changeLog, setChangeLog } = useChangeLogContext();

	/**
	 * Remove the column (associated with the columnHeaderId param), and all
	 * of its associated row cells. (This function basically removes a WHOLE column from a DML's {@link DisplayTable})
	 *
	 * @param columnHeaderId the column to be removed from the DML's display table.
	 */
	const removeTableColumnHeader = (columnHeaderId: string) => {
		const filteredChangeSets = changeLog.changeSets.map((changeSet) => {
			changeSet.databaseTables.map((databaseTable) => {
				const currentDMLIsTheParentDML: boolean =
					databaseTable.dml.id === props.parentDMLId;

				if (!currentDMLIsTheParentDML) {
					return changeSet; // do nothing
				}

				const displayTable: DisplayTableType = getDisplayTableFromDML(
					databaseTable.dml,
					props.displayTableId
				);

				if (props.displayTableId !== displayTable.id) {
					return; // do nothing
				}

				// remove a specific column
				displayTable.dbColumnNames = displayTable.dbColumnNames.filter(
					(colHeader) => colHeader.id != columnHeaderId
				);

				// if there are no more columns, there would essentially be no more rows as well
				// so we should set the rows back to its default state (no data should be displayed
				// if all columns from a display table are deleted)
				if (displayTable.dbColumnNames.length === 0) {
					displayTable.dbRowValues = [];
					return changeSet;
				}

				// if there are still column headers in a display table (e.g. only 1 column was deleted)
				// remove all row cells associated with the columnHeaderId param
				displayTable.dbRowValues = displayTable.dbRowValues.map((row) => {
					row.cells = [...row.cells.filter((row) => row.colId != columnHeaderId)];
					return row;
				});
			});

			return changeSet;
		});

		setChangeLog((prevState) => ({
			...prevState,
			changeSets: filteredChangeSets,
		}));
	};

	return (
		<>
			<AddTableCol parentDMLId={props.parentDMLId} displayTableId={props.displayTableId} />

			{props.dbColumnNames.map((colHeader) => {
				const borderRightStyle: RowCellBorderRightStyle = applyBorderRightStyle(
					props.dbColumnNames,
					colHeader.id
				);

				return (
					<ColumnHeaderCell
						key={colHeader.id}
						currentColumnHeader={colHeader}
						borderRightStyle={borderRightStyle}
						onChange={props.onChange}
						onDelete={removeTableColumnHeader}
					/>
				);
			})}
		</>
	);
};

export default TableColumnHeader;
