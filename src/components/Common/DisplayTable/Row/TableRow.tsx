import classNames from "classnames";
import { ChangeEvent, useState } from "react";
import RemoveTableRow from "~/components/Common/DisplayTable/ActionComponents/RemoveTableRow";
import DisplayTable from "~/components/Common/DisplayTable/DisplayTable";
import DynamicCellTextArea, {
	DEFAULT_TEXT_AREA_HEIGHT,
} from "~/components/Common/DisplayTable/Row/DynamicCellTextArea";
import { RowCellBorderRightStyle, applyBorderRightStyle } from "~/utils/tableUtils";

export type TableRowType = {
	id: string;
	cells: TableRowCellType[]; // row cells that belong to a row
};

export type TableRowCellType = {
	id: string;
	colId: string; // the column which this cell belongs to
	text: string;
};

type TableRowProps = {
	currentRow: TableRowType;
	parentDMLId: string; // to determine which DML this DisplayTableType row belongs to
	tableId: string; // to determine which DisplayTableType will have a row removed
	onChange: (e: ChangeEvent<HTMLTextAreaElement>, id: string) => void;
};

const rowCellStyles = (borderRightStyle: string) => {
	return classNames(
		"row-cell cursor-pointer",
		"border-b-2 border-neutral-700",
		borderRightStyle,
		"bg-gray-401",
		// explicitly define the height so that child elements
		// can take up the full height in a <td> element
		"h-px",
		"overflow"
	);
};

/**
 * This component represents a whole row in a {@link DisplayTable} component.
 *
 * @param props
 * @returns
 */
const TableRow = (props: TableRowProps) => {
	// This is a state to ensure ALL of the row cells (that belongs to a row)
	// will have the same height when ANY of those row cells gets resized.
	// The resizing will happen in the DynamicCellTextArea component (a single row cell).
	const [textAreaHeight, setTextAreaHeight] = useState<string>(DEFAULT_TEXT_AREA_HEIGHT);

	return (
		<tr>
			<RemoveTableRow
				rowId={props.currentRow.id}
				parentDMLId={props.parentDMLId}
				displayTableId={props.tableId}
			/>

			{props.currentRow.cells.map((rowCell) => {
				const borderRightStyle: RowCellBorderRightStyle = applyBorderRightStyle(
					props.currentRow.cells,
					rowCell.id
				);

				// this is a single row cell
				return (
					<td key={rowCell.id} scope="row" className={rowCellStyles(borderRightStyle)}>
						<DynamicCellTextArea
							currentRowCell={rowCell}
							height={textAreaHeight}
							setHeight={setTextAreaHeight}
							onChange={props.onChange}
						/>
					</td>
				);
			})}
		</tr>
	);
};

export default TableRow;
