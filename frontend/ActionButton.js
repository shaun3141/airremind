import React from "react";
import { Icon } from "@airtable/blocks/ui";

function ActionButton({ actionText, iconName, record, clickAction }) {
  return (
    <div style={{ width: "20%", display: "inline-block", textAlign: "center" }}>
      <a
        style={{
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onClick={() => {
          clickAction(record);
        }}
      >
        <Icon name={iconName} size={16} />
        <div
          style={{ display: "inline-block", paddingLeft: 3 }}
        >{` ${actionText}`}</div>
      </a>
    </div>
  );
}

export default ActionButton;
