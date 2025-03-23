import DisplayTable from "~/components/Common/DisplayTable/DisplayTable";

/**
 * This component will get displayed in a {@link DisplayTable} when the display table
 * has no data (no column/s or row/s). (The {@link DisplayTable}'s default state)
 *
 * @returns
 */
const NoTableData = () => {
	return (
		<td scope="row" rowSpan={2} className="bg-gray-501 px-6 py-3 text-center">
			<span className="text-lg font-bold text-red-501">No Data</span>
		</td>
	);
};

export default NoTableData;
