import { nanoid } from "nanoid";
import { BiPlusCircle } from "react-icons/bi";
import { ChangeSetType } from "~/components/ChangeSet";
import { TableColumnHeaderType } from "~/components/Common/DisplayTable/ColumnHeader/TableColumnHeader";
import { DisplayTableType } from "~/components/Common/DisplayTable/DisplayTable";
import { useChangeLogContext } from "~/contexts/ChangeLogContextProvider";
import { getDisplayTableFromDML, newRowCell } from "~/utils/tableUtils";

type AddTableColProps = {
	parentDMLId: string; // to determine which DML this DisplayTableType belongs to
	displayTableId: string; // to determine which DisplayTableType is the new column header going to be added
};

/**
 * This component renders the button that adds a new column header to a {@link DisplayTable} component.
 * This component is prepended at the first row of a {@link DisplayTable} component.
 *
 * @param props
 * @returns
 */
const AddTableCol = (props: AddTableColProps) => {
	const { changeLog, setChangeLog } = useChangeLogContext();

	/**
	 * Adds a new column header for a {@link DisplayTableType}.
	 */
	const addTableCol = () => {
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

				const newColumnHeaderId = nanoid();
				const newColumnHeader: TableColumnHeaderType = {
					id: newColumnHeaderId,
					text: "",
				};

				// add a new column
				displayTable.dbColumnNames = [...displayTable.dbColumnNames, newColumnHeader];

				// if displayTableType has rows, add a new row cell at the end of each row so that
				// the new column can have row cells below it, and the row/s will not have cell gaps
				// whenever a new column will be added to a displayTableType
				if (displayTable.dbRowValues.length > 0) {
					displayTable.dbRowValues.forEach((row) => {
						row.cells = [...row.cells, newRowCell(newColumnHeaderId)];
					});
				}
			});

			return changeSet;
		});

		setChangeLog((prevState) => ({
			...prevState,
			changeSets: newChangeSets,
		}));
	};

	return (
		<th
			scope="row"
			className="row-cell w-24 max-w-[85px] cursor-pointer border-b-2 border-r-2 border-neutral-700 bg-gray-901 px-4 py-3"
			onClick={addTableCol}
		>
			<div className="inline-flex items-center space-x-1">
				<BiPlusCircle size="1.5em" className="cursor-pointer text-gray-200" />
				<span className="font-bold">col</span>
			</div>
		</th>
	);
};

export default AddTableCol;
