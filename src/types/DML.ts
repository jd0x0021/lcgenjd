import { AuditFieldVariant } from "~/components/AuditField";
import { ChangeSetType } from "~/components/ChangeSet";
import { DisplayTableType } from "~/components/Common/DisplayTable/DisplayTable";
import { DatabaseTableType } from "~/components/DatabaseTable/DatabaseTableContent";

/**
 * All the child {@link DatabaseTableType}[ ] objects that belongs to a {@link ChangeSetType}
 * SHOULD share the same variant - which is determined by this type ({@link DMLVariant}).
 * (e.g.: if a {@link ChangeSetType}'s databaseTablesDMLVariant is {@link DMLVariant.INSERT_DML},
 * then all of the {@link DatabaseTableType}[ ] objects that belongs to a {@link ChangeSetType}
 * will only be of type {@link DMLVariant.INSERT_DML})
 */
export enum DMLVariant {
	INSERT_DML = "insertDML",
	UPDATE_DML = "updateDML",
	DELETE_DML = "deleteDML",
}

export type DMLType = InsertDmlType | UpdateDmlType | DeleteDmlType;

export type InsertDmlType = {
	id: string;
	auditFieldVariant: AuditFieldVariant;
	dmlVariant: DMLVariant.INSERT_DML;
	valuesToInsert: DisplayTableType;
};

type UpdateDmlType = {
	id: string;
	auditFieldVariant: AuditFieldVariant;
	dmlVariant: DMLVariant.UPDATE_DML;
	valuesToUpdate: DisplayTableType;
	oldValuesToRollback: DisplayTableType;
	whereClause: DisplayTableType;
};

type DeleteDmlType = {
	id: string;
	auditFieldVariant: AuditFieldVariant;
	dmlVariant: DMLVariant.DELETE_DML;
	whereClause: DisplayTableType;
	oldValuesToInsert: DisplayTableType;
};
