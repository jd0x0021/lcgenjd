import { DisplayTableType } from "~/components/Common/DisplayTable/DisplayTable";
import { useChangeLogContext } from "~/contexts/ChangeLogContextProvider";
import { getDisplayTableFromDML } from "~/utils/tableUtils";

type RemoveRowProps = {
	rowId: string; // the row that will be removed from a DisplayTableType
	parentDMLId: string; // to determine which DML this DisplayTableType row belongs to
	displayTableId: string; // to determine which DisplayTableType will have a row removed
};

/**
 * This component renders the button that removes a whole row in a {@link DisplayTable} component.
 * This component is appended at the first cell of each row in a {@link DisplayTable} component.
 *
 * @param props
 * @returns
 */
const RemoveTableRow = (props: RemoveRowProps) => {
	const { changeLog, setChangeLog } = useChangeLogContext();

	/**
	 * Removes 1 row from a {@link DisplayTableType}. All the row cells
	 * that belongs to the _deleted_ row will get removed as well.
	 *
	 * @param rowId the row to be removed
	 */
	const removeTableRow = (rowId: string) => {
		const filteredChangeSets = changeLog.changeSets.map((changeSet) => {
			changeSet.databaseTables.forEach((databaseTable) => {
				const currentDMLIsTheParentDML: boolean =
					databaseTable.dml.id === props.parentDMLId;

				if (!currentDMLIsTheParentDML) {
					return; // do nothing
				}

				const displayTable: DisplayTableType = getDisplayTableFromDML(
					databaseTable.dml,
					props.displayTableId
				);

				if (props.displayTableId !== displayTable.id) {
					return; // do nothing
				}

				// remove a WHOLE row from a DML's display table
				displayTable.dbRowValues = displayTable.dbRowValues.filter(
					(row) => row.id != rowId
				);
			});

			return changeSet;
		});

		setChangeLog((prevState) => ({
			...prevState,
			changeSets: filteredChangeSets,
		}));
	};

	return (
		<td
			scope="row"
			className={`row-cell w-24 max-w-[85px] cursor-pointer border-b-2 border-r-2 border-neutral-700 bg-gray-401 px-4 py-3`}
			onClick={() => removeTableRow(props.rowId)}
		>
			<span className="font-bold tracking-wide text-red-500">remove</span>
		</td>
	);
};

export default RemoveTableRow;
