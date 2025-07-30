import { alpha } from "@theme-ui/color";
import { ThemeUICSSObject } from "theme-ui";
import useMatchTheme from "../../../hooks/useMatchTheme";
import { ThemeMode } from "../../../themes";
import Button, { ButtonProps } from "../Button";
import ReactIcon from "../IconReact";

type StyledButtonProps = ButtonProps & {
  /** Search for icon name at https://react-icons.github.io/react-icons. */
  iconName?: string;
};

export default function StyledButton({ iconName, children, ...props }: StyledButtonProps) {
  const buttonStyle: ThemeUICSSObject = {
    bg: alpha("primary", 0.06),
    color: "text",
    transition: "0.2s ease",
    alignItems: "center",
    minWidth: 150,

    "&:hover, &:focus": {
      bg: "primary",
      color: "textReverse",
    },

    "& > span": { display: "flex" },

    // Apply Mac-style 6px border radius to all button themes
    borderRadius: "6px",

    ...(useMatchTheme(ThemeMode.Flat) && {
      borderBottom: "4px solid",
      borderBottomColor: alpha("primary", 0.1),
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    }),

    ...(useMatchTheme(ThemeMode.Soft) && {
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
    }),

    ...(useMatchTheme(ThemeMode.Classic) && {
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.1)",
      "&:hover, &:focus": { bg: "primary", color: "text" },
    }),

    ...(useMatchTheme(ThemeMode.Tron) && {
      boxShadow: (theme) => `0 2px 8px rgba(40, 142, 159, 0.2), 0 0 0 1px ${theme.colors?.shadow}`,
      color: "textReverse",
      "&:hover, &:focus": { bg: "green", color: "text" },
    }),
  };

  const iconStyle: ThemeUICSSObject = {
    px: 4,
    py: 1,
    borderRight: "1px solid",
    borderRightColor: alpha("textReverse", 0.2),
    display: "flex",
    alignItems: "center",
  };

  return (
    <Button unsetStyle unsetFocus sx={buttonStyle} {...props}>
      <span sx={{ display: "flex", alignItems: "center" }}>
        {iconName && (
          <span sx={iconStyle}>
            <ReactIcon iconName={iconName} size={24} />
          </span>
        )}
        <span sx={{ px: 4, py: 3 }}>{children}</span>
      </span>
    </Button>
  );
}
