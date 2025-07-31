import { AnimatePresence } from "framer-motion";
import { ThemeUICSSObject } from "theme-ui";
import { fade } from "../../../animations/fade";
import research from "../../../data/research";
import useMatchTheme from "../../../hooks/useMatchTheme";
import { parseLinks } from "../../../misc/utils";
import { ThemeMode } from "../../../themes";
import { MotionBox } from "../../atoms/Container";
import { H2, P, SubTitle } from "../../atoms/Typography";

export default function ContentPane({ title }: { title?: string }) {
  const alignment: ThemeUICSSObject = { textAlign: ["center", null, "unset"] };
  const listStyle: ThemeUICSSObject = { listStyle: "initial", ml: 5 };

  let content = (
    <MotionBox {...fade} sx={{ color: "muted", textAlign: "center" }}>
      Select a research paper to view
    </MotionBox>
  );

  if (title) {
    const paper = Object.values(research)
      .flat()
      .find((paper) => paper.title === title);

    content = (
      <MotionBox key={title} {...fade} sx={{ textAlign: "justify" }}>
        <H2 style={alignment}>{paper?.title}</H2>
        <SubTitle style={alignment}>{paper?.timeline}</SubTitle>
        <P style={{ fontStyle: "italic", mb: 5 }}>{paper?.description}</P>
        {paper?.remark && <P>{parseLinks(paper.remark, paper.links)}</P>}
        {paper?.findings && (
          <>
            <P style={{ mt: 4, mb: 2 }}>Key findings and contributions:</P>
            <ul sx={{ ...listStyle, mb: 4 }}>
              {paper.findings.map((finding, i) => (
                <li key={i}>{parseLinks(finding, paper.links)}</li>
              ))}
            </ul>
          </>
        )}
        {paper?.methodology &&
          (typeof paper.methodology === "string" ? (
            <P>Methodology: {parseLinks(paper.methodology, paper.links)}</P>
          ) : (
            <>
              <P>Methodology: </P>
              <ul sx={listStyle}>
                {paper.methodology.map((method, i) => (
                  <li key={i}>{parseLinks(method, paper.links)}</li>
                ))}
              </ul>
            </>
          ))}
      </MotionBox>
    );
  }

  return (
    <div
      sx={{
        bg: useMatchTheme(ThemeMode.Tron) ? "transparent" : "background",
        px: 5,
        py: 4,
        flex: 1,
        zIndex: 1,
      }}
    >
      <AnimatePresence exitBeforeEnter>{content}</AnimatePresence>
    </div>
  );
}