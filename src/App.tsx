import { useState, useEffect, useCallback } from "react";
import "./index.css";
import "@arcgis/map-components/dist/components/arcgis-map";
import "@arcgis/map-components/components/arcgis-map";
import "@arcgis/map-components/components/arcgis-zoom";
import "@arcgis/map-components/components/arcgis-legend";
import "@esri/calcite-components/dist/components/calcite-shell";
import MapDisplay from "./components/MapDisplay";
import ActionPanel from "./components/ActionPanel";
import Header from "./components/Header";
import Chart from "./components/Chart";
import { authenticate } from "./autho";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MyContext } from "./contexts/MyContext";

const queryClient = new QueryClient();

export function App(): React.JSX.Element {
  const [loggedInState, setLoggedInState] = useState<boolean>(false);
  useEffect(() => {
    authenticate(setLoggedInState, "yW9wxWjdggIw1jyP");
  }, []);

  //--- Parameter update using hook
  const [station, setStation] = useState<any>(null);
  const updateStation = useCallback((newStation: any) => {
    setStation(newStation);
  }, []);

  return (
    <>
      {loggedInState === true ? (
        <div>
          <calcite-shell
            style={{ scrollbarWidth: "thin", scrollbarColor: "#888 #555" }}
          >
            <MyContext value={{ station, updateStation }}>
              <QueryClientProvider client={queryClient}>
                <ActionPanel />
                <MapDisplay />
                <Chart />
                <Header />
              </QueryClientProvider>
            </MyContext>
          </calcite-shell>
        </div>
      ) : (
        <div></div>
      )}
    </>
  );
}

export default App;
