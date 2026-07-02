import type { StylesConfig } from "react-select";

const themeColors = {
  primary: "#FF7335",
  primaryHover: "#E65C2E",
  lightBackground: "#FFF3EB",
  textColor: "black",
  white: "white",
};

export
 const dropdownStyles = <Option,>(
  _borderRadius: string
): StylesConfig<Option, false> => ({
  control: (provided, state) => ({
    ...provided,
    fontSize: "14px",
    padding: "4px 8px",
    minWidth: "180px",
    borderRadius: _borderRadius,
    cursor: "pointer",
    borderColor: state.isFocused ? themeColors.primary : "#e0e0e0",
    boxShadow: state.isFocused
      ? "0 0 0 2px rgba(255, 115, 53, 0.3)"
      : "none",
    "&:hover": {
      borderColor: themeColors.primary,
    },
    transition: "border-color 0.2s, box-shadow 0.2s",
    zIndex: 50,
  }),
  option: (provided, state) => ({
    ...provided,
    fontSize: "14px",
    backgroundColor: state.isSelected
      ? themeColors.primary
      : state.isFocused
        ? themeColors.lightBackground
        : themeColors.white,
    borderRadius: "5px",
    cursor: "pointer",
    borderColor: state.isFocused ? themeColors.primary : "#e0e0e0",
    color: state.isSelected
      ? themeColors.white
      : state.isFocused
        ? themeColors.primary
        : themeColors.textColor,
    "&:hover": {
      backgroundColor: themeColors.lightBackground,
      color: themeColors.primary,
    },
    "&:active": {
      backgroundColor: themeColors.primary,
      color: themeColors.white,
    },
    transition: "background-color 0.2s, color 0.2s",
    zIndex: 50,
  }),
  singleValue: (provided) => ({
    ...provided,
    color: themeColors.textColor,
    zIndex: 50,
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: "5px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    marginTop: "4px",
    zIndex: 50,
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    color: themeColors.primary,
    "&:hover": {
      color: themeColors.primaryHover,
    },
    zIndex: 50,
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
});
