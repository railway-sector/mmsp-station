import React, { createContext, useState } from "react";
import "./App.css";
import "./index.css";
import "@arcgis/map-components/dist/components/arcgis-map";
import "@arcgis/map-components/components/arcgis-map";
import "@arcgis/map-components/components/arcgis-zoom";
import "@arcgis/map-components/components/arcgis-legend";
import "@esri/calcite-components/dist/components/calcite-shell";
import "@esri/calcite-components/dist/calcite/calcite.css";
import { CalciteShell } from "@esri/calcite-components-react";
import UndergroundSwitch from "./components/UndergroundSwitch";
import Chart from "./components/Chart";
import Header from "./components/Header";
import ActionPanel from "./components/ActionPanel";
import MapDisplay from "./components/MapDisplay";

type MyDropdownContextType = {
  stations: any;
  updateStations: any;
};

const initialState = {
  stations: undefined,
  updateStations: undefined,
};

export const MyContext = createContext<MyDropdownContextType>({
  ...initialState,
});

function App() {
  const [stations, setStations] = useState<any>();

  const updateStations = (newContractcp: any) => {
    setStations(newContractcp);
  };

  return (
    <div>
      <CalciteShell>
        <MyContext
          value={{
            stations,
            updateStations,
          }}
        >
          <ActionPanel />
          <UndergroundSwitch />
          <Chart />
          <MapDisplay />
          <Header />
        </MyContext>
      </CalciteShell>
    </div>
  );
}

export default App;
