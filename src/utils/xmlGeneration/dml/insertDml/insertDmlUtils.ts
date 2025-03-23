/*============================================================
  Utilities to help generate xml strings for the Insert DML.
============================================================*/

import { DatabaseTableType } from "~/components/DatabaseTable/DatabaseTableContent";
import { DMLVariant } from "~/types/DML";
import { displayTableHasRows } from "~/utils/tableUtils";

export const insertDmlDisplayTableHasRows = (databaseTable: DatabaseTableType): boolean => {
	return (
		databaseTable.dml.dmlVariant === DMLVariant.INSERT_DML &&
		displayTableHasRows(databaseTable.dml.valuesToInsert)
	);
};
