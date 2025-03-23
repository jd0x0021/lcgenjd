import classNames from "classnames";
import { TableColumnHeaderType } from "~/components/Common/DisplayTable/ColumnHeader/TableColumnHeader";
import { TableRowType } from "~/components/Common/DisplayTable/Row/TableRow";
import InsertDML from "~/components/DmlVisualizer/InsertDML";
import { DMLType, DMLVariant } from "~/types/DML";

export type DatabaseTableType = {
	id: string;
	name: string;
	dml: DMLType;
};

type DatabaseTableProps = {
	currentDML: DMLType;
	isVisible: boolean;
};

/**
 * Returns a {@link JSX.Element} based on the DML's variant to represent
 * a DML type to a component appropriately.
 *
 * @param currentDML
 * @returns
 */
const renderDML = (currentDML: DMLType): JSX.Element => {
	switch (currentDML.dmlVariant) {
		case DMLVariant.INSERT_DML:
			return <InsertDML currentDML={currentDML} />;
		case DMLVariant.UPDATE_DML:
			return <div></div>;
		case DMLVariant.DELETE_DML:
			return <div></div>;
		default:
			const neverReachedDMLVariant: never = currentDML;
			throw new Error(
				`ERROR! A new DMLVariant case was not handled by the exhaustive switch in 
         		${renderDML.name} with unexpected value: 
         		${JSON.stringify(neverReachedDMLVariant)}`
			);
	}
};

/**
 * This component acts as a DML wrapper that is used to diplay the
 * _Database Table's Contents:_ DML type, audit field values, database table column names
 * (columns: {@link TableColumnHeaderType}), and its value/s (rows: {@link TableRowType}).
 *
 * @param props
 * @returns
 */
const DatabaseTableContent = (props: DatabaseTableProps) => {
	const databaseContentStyles = classNames(
		"db-table-content flex flex-col",
		props.isVisible ? "block" : "hidden"
	);

	return <div className={databaseContentStyles}>{renderDML(props.currentDML)}</div>;
};

export default DatabaseTableContent;
