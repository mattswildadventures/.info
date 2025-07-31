import React from "react";
import research from "../../../data/research";
import { List } from "../../atoms/Container";
import NavigationPaneItem from "../../atoms/NavigationPaneItem";
import { H3 } from "../../atoms/Typography";

type NavigationPaneProps = {
  title?: string;
  onNavigate: (item: string) => void;
};

export default function NavigationPane({ title, onNavigate }: NavigationPaneProps) {
  return (
    <div sx={{ minWidth: 200 }}>
      {Object.keys(research).map((category, i) => (
        <React.Fragment key={i}>
          <H3>{category}</H3>
          <List sx={{ mb: 5, display: ["grid", null, "block"], gridTemplateColumns: "1fr 1fr 1fr" }}>
            {research[category].map((paper, j) => (
              <NavigationPaneItem
                key={j}
                icon={["FcFile", "FcOpenedFolder"]} // Use file icons from React Icons (Flat Color)
                text={paper.title}
                isActive={title === paper.title}
                onClick={() => onNavigate(paper.title)}
              />
            ))}
          </List>
        </React.Fragment>
      ))}
    </div>
  );
}