import classNames from "classnames";
import { BiChevronDown } from "react-icons/bi";
import AuditField from "~/components/AuditField";
import DisplayTable from "~/components/Common/DisplayTable/DisplayTable";
import { DMLType, DMLVariant } from "~/types/DML";
import { useToggle } from "~/utils/toggleContent";

type InsertDmlProps = {
	currentDML: DMLType;
};

/**
 * This component represents the DML variant for {@link DMLVariant.INSERT_DML}, and will
 * display the appropriate data for {@link DMLVariant.INSERT_DML}.
 *
 * @param props
 * @returns
 */
const InsertDML = (props: InsertDmlProps) => {
	const [contentIsVisible, setContentIsVisible] = useToggle(true);

	const insertDmlContentStyles = classNames(
		"dml-content",
		"relative overflow-x-auto",
		"shadow-md sm:rounded-lg",
		`${contentIsVisible ? "" : "hidden"}`
	);

	return (
		<div className="insert-dml space-y-6 rounded-md border border-amber-500 p-2.5 text-sm">
			<div className="dml-header flex items-center justify-between">
				<div className="dml-header-label flex items-center">
					<BiChevronDown
						color="#F59E0B"
						size="1.8em"
						onClick={setContentIsVisible}
						className="cursor-pointer"
					/>

					<b className="text-amber-500">&lt;insert&gt; DML</b>
				</div>

				{props.currentDML ? (
					<AuditField
						parentDmlId={props.currentDML.id}
						auditFieldVariant={props.currentDML.auditFieldVariant}
					/>
				) : null}
			</div>

			<div className={insertDmlContentStyles}>
				{props.currentDML && DMLVariant.INSERT_DML === props.currentDML.dmlVariant ? (
					<DisplayTable
						displayTable={{
							id: props.currentDML.valuesToInsert.id,
							dbColumnNames: props.currentDML.valuesToInsert.dbColumnNames,
							dbRowValues: props.currentDML.valuesToInsert.dbRowValues,
						}}
						parentDMLId={props.currentDML.id}
					/>
				) : null}
			</div>
		</div>
	);
};

export default InsertDML;
