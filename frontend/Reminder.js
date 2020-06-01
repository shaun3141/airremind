import React from "react";
import { expandRecord, CellRenderer, Icon } from "@airtable/blocks/ui";
import { sendReminder } from "./utils/sendReminder";
import ActionButton from "./ActionButton";
import { getDueDate } from "./utils/getDueDate";

// TODO: Figure out stylesheet + hover
// background-color: rgba(0,0,0,0.05);
// transition: .085s background-color ease-in;
function Reminder({ record, config, table }) {
  const ownerField =
    config.get("ownerField") && table.getFieldById(config.get("ownerField"))
      ? table.getFieldById(config.get("ownerField"))
      : null;

  return (
    <div
      style={{
        padding: 12,
        borderBottom: "1px solid #ddd",
        color: "#4D4D4D",
        fontWeight: 600,
      }}
    >
      <div style={{ width: "60%", display: "inline-block", fontSize: ".9rem" }}>
        {/* MOVE TO ONLY RENDER CONDITIONALLY */}
        {/* <CellRenderer
          field={statusField}
          record={record}
          style={{ display: 'inline-block', marginRight: 5 }}
        /> */}
        {/* <Icon name="checkboxUnchecked" size={16} /> */}
        {config.get("subjectField")
          ? record.getCellValueAsString(config.get("subjectField")) ||
            "(Untitled)"
          : record.primaryCellValueAsString || "(Untitled)"}
      </div>

      <ActionButton
        actionText="Remind"
        iconName="bell"
        record={record}
        clickAction={() => sendReminder(record, config)}
      />

      <ActionButton
        actionText="Edit"
        iconName="edit"
        record={record}
        clickAction={expandRecord}
      />
      <div style={{ display: "inline-block", width: "100%", paddingTop: 5 }}>
        {/* Summary */}
        <div
          style={{
            width: "60%",
            display: "inline-block",
            fontSize: ".7rem",
            color: "#666",
            fontWeight: 400,
            float: "left",
          }}
        >
          {config.get("ownerField") ? (
            record.getCellValueAsString(config.get("ownerField")) ? (
              <CellRenderer
                field={ownerField}
                record={record}
                style={{ display: "inline-block", marginRight: 5 }}
              />
            ) : (
              "Unassigned"
            )
          ) : (
            " "
          )}
          {config.get("summaryField") ? (
            <div style={{ width: "100%", fontStyle: "italic" }}>
              {record.getCellValueAsString(config.get("summaryField"))}
            </div>
          ) : (
            " "
          )}
        </div>

        {/* Due in X Days */}
        <div
          style={{
            width: "40%",
            display: "inline-block",
            fontSize: ".7rem",
            textAlign: "center",
            float: "right",
          }}
        >
          {config.get("dueDateField") ? getDueDate(config, table, record) : " "}
        </div>
      </div>
    </div>
  );
}

export default Reminder;
