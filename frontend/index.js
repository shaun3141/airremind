import React, { useState } from "react";
import _ from "lodash";
import {
  initializeBlock,
  useBase,
  useRecords,
  useGlobalConfig,
  Icon,
} from "@airtable/blocks/ui";
import Settings from "./Settings";
import Reminder from "./Reminder";

function ReminderBlock() {
  const base = useBase();

  const globalConfig = useGlobalConfig();
  const tableId = globalConfig.get("selectedTableId");
  const viewId = globalConfig.get("selectedViewId");
  const table = base.getTableByIdIfExists(tableId);
  const view = table ? table.getViewByIdIfExists(viewId) : null;
  const records = useRecords(view);

  const [isSettingsVisible, setShowSettings] = useState(
    !(tableId && viewId && globalConfig.get("subjectField"))
  );
  console.log(`1: ${isSettingsVisible}`);

  const tasks = records
    ? records.map((record) => {
        return (
          <Reminder
            key={record.id}
            record={record}
            config={globalConfig}
            table={table}
          />
        );
      })
    : null;

  return (
    <>
      <div style={{ width: "100%", display: "inline-block" }}>
        <div
          style={{
            float: "right",
            display: "inline-block",
            padding: 5,
            color: "#4D4D4D",
            cursor: "pointer",
          }}
          onClick={() => {
            setShowSettings(isSettingsVisible ? false : true);
          }}
        >
          <Icon name="settings" size={16} />
        </div>
      </div>
      <Settings isOpen={isSettingsVisible} table={table} />
      {tasks}
    </>
  );
}

initializeBlock(() => <ReminderBlock />);
// TODO:
// If only 1 view exists, don't ask for view
// Make Card View with Flex
// Make card with dynamic sizes
