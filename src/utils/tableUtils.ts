import { nanoid } from "nanoid";
import { TableColumnHeaderType } from "~/components/Common/DisplayTable/ColumnHeader/TableColumnHeader";
import { DisplayTableType } from "~/components/Common/DisplayTable/DisplayTable";
import { TableRowCellType } from "~/components/Common/DisplayTable/Row/TableRow";
import { DMLType, DMLVariant } from "~/types/DML";

export type RowCellBorderRightStyle = "border-r-2" | "";

/**
 * Don't add 'border-r-2' class if it's the last cell in a row
 * to remove outer borders in the Table component.
 *
 * @param cells - expects an array of cells from headers/row cells
 * @param cellId
 * @returns
 */
export const applyBorderRightStyle = (
	cells: TableRowCellType[] | TableColumnHeaderType[],
	cellId: string
): RowCellBorderRightStyle => {
	return cells[cells.length - 1]?.id === cellId ? "" : "border-r-2";
};

/**
 * Creates a new {@link TableRowCell} object.
 *
 * @param colId The column that this 'new' cell will be a part of.
 * @returns
 */
export const newRowCell = (colId: string): TableRowCellType => {
	return {
		id: nanoid(),
		colId: colId,
		text: "",
	};
};

/**
 * Creates a new {@link TableColumnHeaderType} object.
 *
 * @returns
 */
export const newColHeader = (): TableColumnHeaderType => {
	return {
		id: nanoid(),
		text: "",
	};
};

/**
 * Returns a specific display table (via id) that belongs to a DML ({@link DMLType}).
 *
 * @param dml a DML holds n tables depending on their dmlVariant
 * @param displayTableId the display table that will be returned
 * @returns
 */
export const getDisplayTableFromDML = (dml: DMLType, displayTableId: string): DisplayTableType => {
	switch (dml.dmlVariant) {
		case DMLVariant.INSERT_DML:
			return dml.valuesToInsert;
		case DMLVariant.UPDATE_DML:
			return [dml.valuesToUpdate, dml.oldValuesToRollback, dml.whereClause].find(
				(displayTable) => displayTable.id === displayTableId
			) as DisplayTableType;
		case DMLVariant.DELETE_DML:
			return [dml.whereClause, dml.whereClause].find(
				(displayTable) => displayTable.id === displayTableId
			) as DisplayTableType;
		default:
			const neverReachedDMLVariant: never = dml;
			throw new Error(
				`ERROR! A new DMLVariant case was not handled by the exhaustive switch in
				${getDisplayTableFromDML.name} with unexpected value:
				${JSON.stringify(neverReachedDMLVariant)}`
			);
	}
};

export const defaultDisplayTableValues = (): DisplayTableType => {
	return {
		id: nanoid(),
		dbColumnNames: [],
		dbRowValues: [],
	};
};

/**
 * To check if a {@link DisplayTableType} has rows.
 *
 * @param displayTableType
 * @returns
 */
export const displayTableHasRows = (displayTableType: DisplayTableType): boolean => {
	return displayTableType.dbRowValues.length > 0;
};
