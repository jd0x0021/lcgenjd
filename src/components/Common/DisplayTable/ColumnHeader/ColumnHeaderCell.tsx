import classNames from "classnames";
import { ChangeEvent } from "react";
import { BiTrash } from "react-icons/bi";
import DynamicCellInput from "~/components/Common/DisplayTable/ColumnHeader/DynamicCellInput";
import { TableColumnHeaderType } from "~/components/Common/DisplayTable/ColumnHeader/TableColumnHeader";
import { RowCellBorderRightStyle } from "~/utils/tableUtils";

type ColumnHeaderCellProps = {
	currentColumnHeader: TableColumnHeaderType;
	borderRightStyle: RowCellBorderRightStyle;
	onChange: (e: ChangeEvent<HTMLInputElement>, id: string) => void;
	onDelete: (columnHeaderId: string) => void;
};

const columnHeaderCellStyles = (borderRightStyle: string) => {
	return classNames(
		"row-cell cursor-pointer",
		"border-b-2 border-neutral-700",
		borderRightStyle,
		"bg-gray-901"
	);
};

/**
 * This component represents a single column header cell in a {@link DisplayTable} component.
 *
 * @param props
 * @returns
 */
const ColumnHeaderCell = (props: ColumnHeaderCellProps) => {
	return (
		<th scope="col" className={columnHeaderCellStyles(props.borderRightStyle)}>
			<div className="flex items-center justify-between">
				<DynamicCellInput
					id={props.currentColumnHeader.id}
					text={props.currentColumnHeader.text}
					placeHolder="NULL"
					onChange={props.onChange}
				/>

				<div className="delete-btn">
					<BiTrash
						color="#E93E30"
						size="2.5em"
						className="mr-1 cursor-pointer p-1"
						onClick={() => props.onDelete(props.currentColumnHeader.id)}
					/>
				</div>
			</div>
		</th>
	);
};

export default ColumnHeaderCell;
