import { ChangeEvent } from "react";
import { useChangeLogContext } from "~/contexts/ChangeLogContextProvider";

export type ChangeLogMetadataType = {
	author: string;
	logicalFilePath: string;
};

/**
 * This component renders and sets the changelog's metadata.
 *
 * @returns
 */
const ChangeLogMetadata = () => {
	const { changeLog, setChangeLog } = useChangeLogContext();

	const udpateAuthor = (e: ChangeEvent<HTMLInputElement>) => {
		setChangeLog((prevState) => ({
			...prevState,
			metaData: {
				...prevState.metaData,
				author: e.target.value,
			},
		}));
	};

	const updateLogicalFilePath = (e: ChangeEvent<HTMLInputElement>) => {
		setChangeLog((prevState) => ({
			...prevState,
			metaData: {
				...prevState.metaData,
				logicalFilePath: e.target.value,
			},
		}));
	};

	return (
		<div className="flex gap-3 rounded-md bg-gray-501 p-5">
			<div className="flex w-1/2 items-center">
				<label htmlFor="author" className="mr-3 text-sm font-bold">
					Author:
				</label>
				<input
					type="text"
					id="author"
					value={changeLog.metaData.author}
					onChange={udpateAuthor}
					className="w-full rounded-md bg-gray-601 px-2 py-1.5 text-sm"
				/>
			</div>

			<div className="flex w-1/2 items-center">
				<label
					htmlFor="logical-file-path"
					className="mr-3 whitespace-nowrap text-sm font-bold"
				>
					Logical File Path:
				</label>
				<input
					type="text"
					id="logical-file-path"
					value={changeLog.metaData.logicalFilePath}
					onChange={updateLogicalFilePath}
					className="w-full rounded-md bg-gray-601 px-2 py-1.5 text-sm"
				/>
			</div>
		</div>
	);
};

export default ChangeLogMetadata;
