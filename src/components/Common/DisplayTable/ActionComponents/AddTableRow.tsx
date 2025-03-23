import { ChangeSetType } from "~/components/ChangeSet";
import { TableColumnHeaderType } from "~/components/Common/DisplayTable/ColumnHeader/TableColumnHeader";
import DisplayTable, { DisplayTableType } from "~/components/Common/DisplayTable/DisplayTable";
import { TableRowType } from "~/components/Common/DisplayTable/Row/TableRow";
import { useChangeLogContext } from "~/contexts/ChangeLogContextProvider";
import { getDisplayTableFromDML, newColHeader, newRowCell } from "~/utils/tableUtils";

import { nanoid } from "nanoid";
import { BiPlusCircle } from "react-icons/bi";

type AddTableRowProps = {
	// to determine which DML this DisplayTableType belongs to
	parentDMLId: string;
	// to determine which DisplayTableType is the new row going to be added
	displayTableId: string;
	// this prop is just used to fill the empty row cell/s of the
	// last row of a DisplayTable component
	dbColumnNames: TableColumnHeaderType[];
};

/**
 * Returns a new empty row cell for each {@link TableColumnHeaderType}
 * that belongs to a {@link DisplayTableType}.
 *
 * @param dbColumnNames
 * @returns
 */
const generateEmptyRowCells = (dbColumnNames: TableColumnHeaderType[]) => {
	return dbColumnNames.map((colHeader) => newRowCell(colHeader.id));
};

const currentDisplayTableHasNoHeadersAndRows = (displayTable: DisplayTableType): boolean => {
	let currentDisplayTableHasNoHeaders = displayTable.dbColumnNames.length === 0;
	let currentDisplayTableHasNoRows = displayTable.dbRowValues.length === 0;

	return currentDisplayTableHasNoHeaders && currentDisplayTableHasNoRows;
};

/**
 * This component renders the button that adds a whole row to a {@link DisplayTable} component.
 * This component is appended at the last row of a {@link DisplayTable} component.
 *
 * @param props
 * @returns
 */
const AddTableRow = (props: AddTableRowProps) => {
	const { changeLog, setChangeLog } = useChangeLogContext();

	/**
	 * The number of row cells a _newly added_ row can hold will depend on the
	 * current column header count (dbColumnNames) of a {@link DisplayTableType},
	 * so when we add a new row, the row cell count for that new row should match the
	 * column header count to avoid having empty cells in our {@link DisplayTable}
	 * component when we're adding a new row.
	 *
	 * @param props
	 * @returns
	 */
	const addTableRow = () => {
		let newChangeSets: ChangeSetType[] = changeLog.changeSets.map((changeSet) => {
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

				// add 1 column header if current display table has no column headers and rows
				// because we shouldn't add a row if it doesn't belong to a column header
				// (so that the newly added row will belong to this newly added column header)
				if (currentDisplayTableHasNoHeadersAndRows(displayTable)) {
					const newlyAddedColumnHeader: TableColumnHeaderType = newColHeader();

					displayTable.dbColumnNames = [
						...displayTable.dbColumnNames,
						newlyAddedColumnHeader,
					];
				}

				// add the new row to the DML's display table
				let newRow: TableRowType = {
					id: nanoid(),
					cells: generateEmptyRowCells(displayTable.dbColumnNames),
				};

				displayTable.dbRowValues = [...displayTable.dbRowValues, newRow];
			});

			return changeSet;
		});

		setChangeLog((prevState) => ({
			...prevState,
			changeSets: newChangeSets,
		}));
	};

	return (
		<tr>
			<td
				scope="row"
				className="row-cell w-24 max-w-[85px] cursor-pointer border-r-2 border-neutral-700 bg-gray-401 px-4 py-3"
				onClick={addTableRow}
			>
				<div className="inline-flex items-center space-x-1">
					<BiPlusCircle size="1.5em" className="cursor-pointer text-gray-200" />
					<span className="font-bold">row</span>
				</div>
			</td>

			{/* Extend the last row in the display table every time a column header is added 
          		so that there will be no gaps at the last row of the display table. */}
			{props.dbColumnNames.map((header) => (
				<td
					key={header.id}
					scope="row"
					className="row-cell cursor-pointer bg-gray-401 px-6 py-3"
				></td>
			))}
		</tr>
	);
};

export default AddTableRow;
