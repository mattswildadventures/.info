import Image from "next/image";
import { Box, ThemeUICSSObject } from "theme-ui";
import StyledButton from "../../atoms/styled/Button";

export default function LeftPanel() {
  const avatarSize = 220;
  const avatarUrl = `/mwa_about.jpg`;

  const buttonStyle: ThemeUICSSObject = {
    mt: 3,
    mx: [1, null, 0],
    display: ["inline-block", null, "flex"],
    width: ["unset", null, "100%"],
  };

  return (
    <Box sx={{ textAlign: "center", flexShrink: 0 }}>
      <Image src={avatarUrl} alt="Avatar Khang" width={avatarSize} height={avatarSize} quality={100} priority />
      <Box>
        <StyledButton sx={buttonStyle} iconName="AiOutlineProfile" href="https://www.visualcv.com/khangnd">
          Resume
        </StyledButton>
        <StyledButton
          sx={buttonStyle}
          iconName="AiOutlineMail"
          href="mailto:matt@minnio.com.au?subject=Hey Matt!"
        >
          Email
        </StyledButton>
      </Box>
    </Box>
  );
}
