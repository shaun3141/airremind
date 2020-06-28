import React from 'react';
import { expandRecord, CellRenderer, Box, Text } from '@airtable/blocks/ui';

import { getDueDate } from './utils/getDueDate';
import { cursor } from '@airtable/blocks';
import ActionButton from './ActionButton';
import RemindModal from './RemindModal';

function Reminder({ record, config, table }) {
  const ownerField =
    config.get([cursor.activeViewId, 'ownerField']) &&
    table.getFieldById(config.get([cursor.activeViewId, 'ownerField']))
      ? table.getFieldById(config.get([cursor.activeViewId, 'ownerField']))
      : null;

  const subjectField = config.get([cursor.activeViewId, 'subjectField']);

  return (
    <Box padding={3} borderBottom="1px solid #ddd">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Text size="large" fontWeight="600">
          {subjectField
            ? record.getCellValueAsString(subjectField) || '(Untitled)'
            : record.primaryCellValueAsString || '(Untitled)'}
        </Text>
        <Box>
          <RemindModal record={record} config={config} />
          <ActionButton
            actionText="Edit"
            iconName="edit"
            record={record}
            clickAction={expandRecord}
          />
        </Box>
      </Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="flex-start"
        paddingTop={1}
      >
        <Box>
          {config.get([cursor.activeViewId, 'ownerField']) ? (
            record.getCellValueAsString(
              config.get([cursor.activeViewId, 'ownerField'])
            ) ? (
              <CellRenderer
                field={ownerField}
                record={record}
                cellStyle={{
                  marginLeft: '-6px'
                }}
              />
            ) : (
              'Unassigned'
            )
          ) : (
            ' '
          )}
        </Box>
        <Text fontWeight="600" minWidth="110px" textColor="light" marginTop={1}>
          {config.get([cursor.activeViewId, 'dueDateField'])
            ? getDueDate(config, table, record)
            : ' '}
        </Text>
      </Box>
      <Text fontStyle="italic" textColor="light" marginTop={2}>
        {config.get([cursor.activeViewId, 'summaryField'])
          ? record.getCellValueAsString(
              config.get([cursor.activeViewId, 'summaryField'])
            )
          : ' '}
      </Text>
    </Box>
  );
}

export default Reminder;
