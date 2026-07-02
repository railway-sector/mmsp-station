import { useState } from "react";
import Select from "react-select";
import "../index.css";
import GenerateDropdownData from "npm-dropdown-package";
import { stationStructureLayerForDropDown } from "../layers";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { locationKeys } from "../interfaceKeys";
import type { SelectedLocation } from "../interfaceKeys";

export default function DropdownData() {
  const queryClient = useQueryClient();

  const [stationSelected, setStationSelected] = useState<null | any>(null);

  const { data: stationList } = useQuery<any>({
    queryKey: ["dropdownData"], // Do not add lotLayer as a dependency. The dropdown list will not be updated properly.
    queryFn: async () => {
      const dropdownData = new GenerateDropdownData(
        [stationStructureLayerForDropDown],
        ["Station1"],
      );
      return await dropdownData.dropDownQuery();
    },
    staleTime: Infinity, // never refetch in the backround. If not Inifity, it will refetch.
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  // this instantly updates the global cache
  function updateDropdownListValues(
    station_obj_field: SelectedLocation["station"],
  ) {
    return queryClient.setQueryData<SelectedLocation>(locationKeys.selected, {
      station: station_obj_field,
    });
  }

  // handle change event of the Municipality dropdown
  const handleContractPackageChange = (obj: any) => {
    updateDropdownListValues(obj.field1);
    setStationSelected(obj);
  };

  // Style CSS
  const customstyles = {
    option: (styles: any, { isFocused, isSelected }: any) => {
      // const color = chroma(data.color);
      return {
        ...styles,
        backgroundColor: isFocused
          ? "#999999"
          : isSelected
            ? "#2b2b2b"
            : "#2b2b2b",
        color: "#ffffff",
        width: "200px",
      };
    },

    control: (defaultStyles: any) => ({
      ...defaultStyles,
      backgroundColor: "#2b2b2b",
      borderColor: "#949494",
      color: "#ffffff",
      touchUi: false,
      width: "200px",
    }),
    singleValue: (defaultStyles: any) => ({ ...defaultStyles, color: "#fff" }),
  };

  return (
    <div className="dropdownFilterLayout">
      <div
        style={{
          color: "white",
          fontSize: "0.85rem",
          margin: "auto",
          paddingRight: "0.5rem",
        }}
      ></div>
      <Select
        placeholder="Select Station"
        value={stationSelected}
        options={stationList && stationList}
        onChange={handleContractPackageChange}
        getOptionLabel={(x: any) => x.field1}
        styles={customstyles}
      />
    </div>
  );
}
