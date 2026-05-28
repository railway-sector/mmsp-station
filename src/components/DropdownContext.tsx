import { useState, use, useEffect } from "react";
import Select from "react-select";
import "../index.css";
import { MyContext } from "../contexts/MyContext";
import GenerateDropdownData from "npm-dropdown-package";
import { stationStructureLayerForDropDown } from "../layers";

export default function DropdownData() {
  const { updateStations } = use(MyContext);
  const [initContractPacakge, setInitContractPacakge] = useState([]);
  const [stations, setContractPackage] = useState<any>(null);

  useEffect(() => {
    const dropdownData = new GenerateDropdownData(
      [stationStructureLayerForDropDown],
      ["Station1"],
    );

    dropdownData.dropDownQuery().then((response: any) => {
      setInitContractPacakge(response);
    });
  }, []);

  // handle change event of the Municipality dropdown
  const handleContractPackageChange = (obj: any) => {
    setContractPackage(obj);
    updateStations(obj.field1);
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
        value={stations}
        options={initContractPacakge}
        onChange={handleContractPackageChange}
        getOptionLabel={(x: any) => x.field1}
        styles={customstyles}
      />
    </div>
  );
}
