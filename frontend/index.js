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
import { cursor, session } from '@airtable/blocks';
import Settings from './Settings';
import Reminder from './Reminder';
import { isRecordEmpty } from './utils/recordHelpers';
import { Button, Box } from '@airtable/blocks/ui';

function ReminderBlock() {
  const base = useBase();

  useWatchable(cursor, ['activeTableId', 'activeViewId']);

  const globalConfig = useGlobalConfig();

  const table = base.getTableByIdIfExists(cursor.activeTableId);
  const view = table ? table.getViewByIdIfExists(cursor.activeViewId) : null;
  const records = useRecords(view);

  const [isSettingsVisible, setShowSettings] = useState(false);

  const reminders = records
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

      {/* Settings */}
      {session.hasPermissionToCreateRecords() && (
        <Box>
          {/* Settings Toggle */}
          <Box style={{ width: '100%', display: 'inline-block' }}>
            <Box
              style={{
                float: 'right',
                display: 'inline-block'
              }}
              onClick={() => {
                setShowSettings(isSettingsVisible ? false : true);
              }}
            >
              <Button variant="secondary" icon="cog" style={{ margin: '5px' }}>
                Settings
              </Button>
            </Box>
          </Box>
          {/* Actual Settings */}
          <Settings isOpen={isSettingsVisible} table={table} />
        </Box>
      )}

      {/* Reminders */}
      {reminders}
    </>
  );
}

initializeBlock(() => <ReminderBlock />);
