import { ChangeSetType } from "~/components/ChangeSet";
import Button from "~/components/Common/Button/Button";
import { ChangeLogType, useChangeLogContext } from "~/contexts/ChangeLogContextProvider";

export const AUDIT_FIELD_VARIANT = {
	UNDERSCORE: "UNDERSCORE", // default variant
	NO_UNDERSCORE: "NO_UNDERSCORE",
} as const;

const AUDIT_FIELD_UNDERSCORE_VARIANT = {
	INSERTED_BY: "INSERTED_BY",
	INSERTED_TIMESTAMP: "INSERTED_TIMESTAMP",
	LAST_UPDATED_BY: "LAST_UPDATED_BY",
	LAST_UPDATED_TIMESTAMP: "LAST_UPDATED_TIMESTAMP",
} as const;

const AUDIT_FIELD_NO_UNDERSCORE_VARIANT = {
	INSERTED_BY: "INSERTEDBY",
	INSERTED_TIMESTAMP: "INSERTEDTIMESTAMP",
	LAST_UPDATED_BY: "LASTUPDATEDBY",
	LAST_UPDATED_TIMESTAMP: "LASTUPDATEDTIMESTAMP",
} as const;

type AuditFieldVariantOne = typeof AUDIT_FIELD_UNDERSCORE_VARIANT;

type AuditFieldVariantTwo = typeof AUDIT_FIELD_NO_UNDERSCORE_VARIANT;

export type AuditFieldValues = AuditFieldVariantOne | AuditFieldVariantTwo;

export type AuditFieldVariant = (typeof AUDIT_FIELD_VARIANT)[keyof typeof AUDIT_FIELD_VARIANT];

type AuditFieldProps = {
	parentDmlId: string;
	auditFieldVariant: AuditFieldVariant;
};

/**
 * Populate audit field values based on the {@link AuditFieldVariant}.
 *
 * @param auditFieldVariant
 * @returns
 */
export const populateAuditFieldValues = (
	auditFieldVariant: AuditFieldVariant
): AuditFieldValues => {
	switch (auditFieldVariant) {
		case AUDIT_FIELD_VARIANT.UNDERSCORE:
			return AUDIT_FIELD_UNDERSCORE_VARIANT;
		case AUDIT_FIELD_VARIANT.NO_UNDERSCORE:
			return AUDIT_FIELD_NO_UNDERSCORE_VARIANT;
		default:
			const neverReachedDMLVariant: never = auditFieldVariant;
			throw new Error(
				`ERROR! A new AuditFieldVariant case was not handled by the exhaustive switch in
				${populateAuditFieldValues.name} with unexpected value:
				${JSON.stringify(neverReachedDMLVariant)}`
			);
	}
};

/**
 * Determine's the audit field button's label based on the {@link AuditFieldVariant}.
 *
 * @param auditFieldVariant
 * @returns
 */
const auditFieldButtonLabel = (auditFieldVariant: AuditFieldVariant): string => {
	switch (auditFieldVariant) {
		case AUDIT_FIELD_VARIANT.UNDERSCORE:
			return "Underscore Audit Fields";
		case AUDIT_FIELD_VARIANT.NO_UNDERSCORE:
			return "No Underscore Audit Fields";
		default:
			const neverReachedDMLVariant: never = auditFieldVariant;
			throw new Error(
				`ERROR! A new AuditFieldVariant case was not handled by the exhaustive switch in
         		${auditFieldButtonLabel.name} with unexpected value:
         		${JSON.stringify(neverReachedDMLVariant)}`
			);
	}
};

const AuditField = (props: AuditFieldProps) => {
	const { changeLog, setChangeLog } = useChangeLogContext();

	const auditFieldValues: AuditFieldValues = populateAuditFieldValues(props.auditFieldVariant);

	const updateAuditFieldVariant = (): void => {
		const newChangeSets: ChangeSetType[] = changeLog.changeSets.map((changeSet) => {
			changeSet.databaseTables.map((databaseTable) => {
				const currentDMLIsTheParentDML: boolean =
					databaseTable.dml.id === props.parentDmlId;

				if (!currentDMLIsTheParentDML) {
					return changeSet; // do nothing
				}

				databaseTable.dml.auditFieldVariant =
					databaseTable.dml.auditFieldVariant === AUDIT_FIELD_VARIANT.UNDERSCORE
						? AUDIT_FIELD_VARIANT.NO_UNDERSCORE
						: AUDIT_FIELD_VARIANT.UNDERSCORE;

				return changeSet;
			});

			return changeSet;
		});

		setChangeLog((prevState: ChangeLogType) => ({
			...prevState,
			changeSets: newChangeSets,
		}));
	};

	return (
		<div className="audit-field flex gap-3">
			<div className="audit-field-values grid auto-cols-auto grid-flow-col grid-rows-2 gap-2 text-xs tracking-wide">
				<span>{auditFieldValues.INSERTED_BY}</span>
				<span>{auditFieldValues.INSERTED_TIMESTAMP}</span>
				<span>{auditFieldValues.LAST_UPDATED_BY}</span>
				<span>{auditFieldValues.LAST_UPDATED_TIMESTAMP}</span>
			</div>

			<Button
				text={auditFieldButtonLabel(props.auditFieldVariant)}
				color={{
					background: "bg-stone-901",
					hover: "hover:bg-stone-902",
					focusRing: "focus:ring-stone-700",
				}}
				onClick={updateAuditFieldVariant}
			/>
		</div>
	);
};

export default AuditField;
