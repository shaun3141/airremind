import React, { useState } from 'react';
import _ from 'lodash';
import {
  initializeBlock,
  useBase,
  useRecords,
  useGlobalConfig,
  useWatchable,
  ViewportConstraint
} from '@airtable/blocks/ui';
import { cursor } from '@airtable/blocks';
import Settings from './Settings';
import Reminder from './Reminder';
import { isRecordEmpty } from './utils/recordHelpers';
import { Button } from '@airtable/blocks/ui';

function ReminderBlock() {
  const base = useBase();

  useWatchable(cursor, ['activeTableId', 'activeViewId']);

  const globalConfig = useGlobalConfig();

  const table = base.getTableByIdIfExists(cursor.activeTableId);
  const view = table ? table.getViewByIdIfExists(cursor.activeViewId) : null;
  const records = useRecords(view);

  const [isSettingsVisible, setShowSettings] = useState(
    !globalConfig.get([cursor.activeViewId, 'subjectField'])
  );

  const tasks = records
    ? records
        .filter((r) => !isRecordEmpty(r))
        .map((record) => {
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
      <ViewportConstraint minSize={{ width: 330 }} />
      {/* Settings Toggle */}
      <div style={{ width: '100%', display: 'inline-block' }}>
        <div
          style={{
            float: 'right',
            display: 'inline-block',
            padding: 5,
            color: '#4D4D4D',
            cursor: 'pointer'
          }}
          onClick={() => {
            setShowSettings(isSettingsVisible ? false : true);
          }}
        >
          <Button variant="secondary" icon="cog">
            Settings
          </Button>
        </div>
      </div>

      {/* Settings */}
      <Settings isOpen={isSettingsVisible} table={table} />

      {/* Array of Reminders */}
      {tasks}
    </>
  );
}

initializeBlock(() => <ReminderBlock />);
// TODO:
// If only 1 view exists, don't ask for view
// Make Card View with Flex
// Make card with dynamic sizes
