import { useState } from "react";
import Split from "react-split";
import { DEFAULT_PANEL_SIZES } from "~/components/FloatingActionButtons/Hooks/utils/panelExpanderUtils";
import ChangeLogContextProvider from "~/contexts/ChangeLogContextProvider";
import ChangeLogDataPanel from "~/panels/ChangeLogDataPanel";
import XmlVisualizerPanel from "~/panels/XmlVisualizerPanel";

const App = () => {
	const [panelSizes, setPanelSizes] = useState<[number, number]>(DEFAULT_PANEL_SIZES);

	return (
		<ChangeLogContextProvider>
			<Split
				sizes={panelSizes}
				className="flex min-h-screen w-screen max-w-full text-gray-200"
			>
				<ChangeLogDataPanel />
				<XmlVisualizerPanel panelSizes={panelSizes} setPanelSizes={setPanelSizes} />
			</Split>
		</ChangeLogContextProvider>
	);
};

export default App;
