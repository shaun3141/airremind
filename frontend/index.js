import React, { useState } from 'react';
import _ from 'lodash';
import {
  initializeBlock,
  useBase,
  useRecords,
  useGlobalConfig,
  Icon,
  useWatchable
} from '@airtable/blocks/ui';
import { cursor } from '@airtable/blocks';
import Settings from './Settings';
import Reminder from './Reminder';
import { isRecordEmpty } from './utils/recordHelpers';

function ReminderBlock() {
  const base = useBase();

  useWatchable(cursor, ['activeTableId', 'activeViewId']);
  const tableId = cursor.activeTableId;
  const viewId = cursor.activeViewId;

  const globalConfig = useGlobalConfig();

  // const tableId = globalConfig.get('selectedTableId');
  // const viewId = globalConfig.get('selectedViewId');
  const table = base.getTableByIdIfExists(tableId);
  const view = table ? table.getViewByIdIfExists(viewId) : null;
  const records = useRecords(view);

  const [isSettingsVisible, setShowSettings] = useState(
    !(tableId && viewId && globalConfig.get([viewId, 'subjectField']))
  );

  const tasks = records
    ? records
        .filter(r => !isRecordEmpty(r))
        .map(record => {
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
          <Icon name="settings" size={16} />
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
