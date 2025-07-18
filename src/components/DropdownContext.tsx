import { useEffect, useState, use } from "react";
import Select from "react-select";
import "../index.css";
import "../App.css";
import { DropDownData } from "../customClass";
import { MyContext } from "../App";
import { stationStructureLayerForDropDown } from "../layers";

const primaryLabelColor = "#9ca3af";

export function DropdownData() {
  const { updateStations } = use(MyContext);

  // For dropdown filter
  const [initContractPacakgeCompType, setInitContractPacakgeCompType] =
    useState([]);

  const [stations, setContractPackage] = useState<any>(null);
  const [companys, setCompany] = useState(null);
  const [utilityType, setUtilityType] = useState<null | undefined | string>(
    null
  );

  const [companyList, setCompanyList] = useState([]);
  const [utilityTypeList, setUtilityTypeList] = useState([]);
  const [companySelected, setCompanySelected] = useState({ name: "" });

  useEffect(() => {
    const dropdownData = new DropDownData({
      featureLayers: [stationStructureLayerForDropDown],
      fieldNames: ["Station1"],
    });

    dropdownData.dropDownQuery().then((response: any) => {
      setInitContractPacakgeCompType(response);
    });
  }, []);

  const handleContractPackageChange = (obj: any) => {
    setContractPackage(obj);
    updateStations(obj.field1);
  };

  return (
    <>
      <DropdownListDisplay
        handleContractPackageChange={handleContractPackageChange}
        initContractPacakgeCompType={initContractPacakgeCompType}
        stations={stations}
      ></DropdownListDisplay>
    </>
  );
}

export function DropdownListDisplay({
  handleContractPackageChange,
  initContractPacakgeCompType,
  stations,
}: any) {
  // Style CSS
  const customstyles = {
    option: (styles: any, { data, isDisabled, isFocused, isSelected }: any) => {
      // const color = chroma(data.color);
      return {
        ...styles,
        backgroundColor: isFocused
          ? "#555555"
          : isSelected
          ? "#2b2b2b"
          : "#2b2b2b",
        color: "#ffffff",
      };
    },

    control: (defaultStyles: any) => ({
      ...defaultStyles,
      backgroundColor: "#2b2b2b",
      borderColor: "#949494",
      height: 35,
      width: "170px",
      color: "#ffffff",
    }),
    singleValue: (defaultStyles: any) => ({ ...defaultStyles, color: "#fff" }),
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          marginTop: "auto",
          marginBottom: "auto",
        }}
      >
        <b
          style={{
            color: primaryLabelColor,
            fontSize: "0.9vw",
            marginRight: "10px",
            marginTop: "auto",
            marginBottom: "auto",
          }}
        >
          Station
        </b>
        <Select
          placeholder="Select Station"
          value={stations}
          options={initContractPacakgeCompType}
          onChange={handleContractPackageChange}
          getOptionLabel={(x: any) => x.field1}
          styles={customstyles}
        />
      </div>
    </>
  );
}
