import { ChangeSetType } from "~/components/ChangeSet";
import AddTableRow from "~/components/Common/DisplayTable/ActionComponents/AddTableRow";
import TableColumnHeader, {
	TableColumnHeaderType,
} from "~/components/Common/DisplayTable/ColumnHeader/TableColumnHeader";
import NoTableData from "~/components/Common/DisplayTable/NoTableData";
import TableRow, { TableRowType } from "~/components/Common/DisplayTable/Row/TableRow";
import { DatabaseTableType } from "~/components/DatabaseTable/DatabaseTableContent";
import { ChangeLogType, useChangeLogContext } from "~/contexts/ChangeLogContextProvider";
import { getDisplayTableFromDML } from "~/utils/tableUtils";

import { ChangeEvent } from "react";

export type DisplayTableType = {
	id: string;
	dbColumnNames: TableColumnHeaderType[];
	dbRowValues: TableRowType[];
};

type DisplayTableProps = {
	displayTable: DisplayTableType;
	parentDMLId: string; // to determine which DMLType is using a certain TableType
};

/**
 * This component displays all the DML (INSERT/UPDATE/DELETE) data that is going
 * to be applied to a database table ({@link DatabaseTableType}). This component will hold
 * the actual column names ({@link TableColumnHeaderType}) and row values ({@link TableRowType})
 * for the affected database table ({@link DatabaseTableType}) to a DML operation.
 *
 * @param props
 * @returns
 */
const DisplayTable = (props: DisplayTableProps) => {
	const { changeLog, setChangeLog } = useChangeLogContext();

	/**
	 * Updates a specific row cell that belongs to a DisplayTable component.
	 * That table cell can either be a columnHeader cell
	 * ({@link TableColumnHeader}) or a row cell({@link TableRow}).
	 *
	 * @param e
	 * @param rowCellId the row cell to be updated
	 */
	const updateTableCellValue = (
		e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
		rowCellId: string
	) => {
		const newChangeSets: ChangeSetType[] = changeLog.changeSets.map((changeSet) => {
			changeSet.databaseTables.map((databaseTable) => {
				const currentDMLIsTheParentDML: boolean =
					databaseTable.dml.id === props.parentDMLId;

				if (!currentDMLIsTheParentDML) {
					return changeSet; // do nothing
				}

				const displayTable: DisplayTableType = getDisplayTableFromDML(
					databaseTable.dml,
					props.displayTable.id
				);

				// update the right table cell value
				let cellIsUpdated = false;
				if (props.displayTable.id !== displayTable.id) {
					return; // do nothing
				}

				// update a specific column header
				displayTable.dbColumnNames.forEach((colHeader) => {
					if (colHeader.id === rowCellId) {
						colHeader.text = e.target.value;
						cellIsUpdated = true;
					}
				});

				if (cellIsUpdated) return;

				// update a specific row cell
				displayTable.dbRowValues.forEach((row) => {
					row.cells.forEach((rowCell) => {
						if (rowCell.id === rowCellId) {
							rowCell.text = e.target.value;
						}
					});
				});

				return changeSet;
			});

			return changeSet;
		});

		setChangeLog((prevState: ChangeLogType) => ({
			...prevState,
			changeSets: newChangeSets,
		}));
	};

	return (
		<table className="w-full border-collapse text-left text-gray-200">
			<tbody>
				{/* DATATABLE COLUMN HEADERS */}
				<tr>
					<TableColumnHeader
						parentDMLId={props.parentDMLId}
						displayTableId={props.displayTable.id}
						dbColumnNames={props.displayTable.dbColumnNames}
						onChange={updateTableCellValue}
					/>

					{/* NO DATA DISPLAY */}
					{props.displayTable.dbColumnNames.length === 0 &&
					props.displayTable.dbRowValues.length === 0 ? (
						<NoTableData />
					) : null}
				</tr>

				{/* DATATABLE ROWS */}
				{props.displayTable.dbRowValues.map((row) => (
					<TableRow
						key={row.id}
						currentRow={row}
						parentDMLId={props.parentDMLId}
						tableId={props.displayTable.id}
						onChange={updateTableCellValue}
					/>
				))}

				{/* ADD ROW FUNCTIONALITY */}
				<AddTableRow
					parentDMLId={props.parentDMLId}
					displayTableId={props.displayTable.id}
					dbColumnNames={props.displayTable.dbColumnNames}
				/>
			</tbody>
		</table>
	);
};

export default DisplayTable;
