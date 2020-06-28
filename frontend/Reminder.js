import React from 'react';
import {
  expandRecord,
  CellRenderer,
  Box,
  Text,
  Icon
} from '@airtable/blocks/ui';
import { sendReminder } from './utils/sendReminder';
import ActionButton from './ActionButton';
import { getDueDate } from './utils/getDueDate';

function Reminder({ record, config, table }) {
  const ownerField =
    config.get('ownerField') && table.getFieldById(config.get('ownerField'))
      ? table.getFieldById(config.get('ownerField'))
      : null;

  const subjectField = config.get('subjectField');

  return (
    <div
      style={{
        padding: 12,
        borderBottom: '1px solid #ddd',
        color: '#4D4D4D',
        fontWeight: 600
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Text size="large" fontWeight="600">
          {/* <Icon name="checkboxUnchecked" size={16} /> */}
          {subjectField
            ? record.getCellValueAsString(subjectField) || '(Untitled)'
            : record.primaryCellValueAsString || '(Untitled)'}
        </Text>
        <Box>
          <ActionButton
            actionText="Remind"
            iconName="bell"
            record={record}
            clickAction={() => sendReminder(record, config)}
            marginRight={2}
          />
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
          {config.get('ownerField') ? (
            record.getCellValueAsString(config.get('ownerField')) ? (
              <CellRenderer
                field={ownerField}
                record={record}
                cellStyle={{
                  'margin-left': '-6px'
                }}
              />
            ) : (
              'Unassigned'
            )
          ) : (
            ' '
          )}
          <Text fontStyle="italic" textColor="light" marginTop={2}>
            {config.get('summaryField')
              ? record.getCellValueAsString(config.get('summaryField'))
              : ' '}
          </Text>
        </Box>
        <Text fontWeight="600" minWidth="110px">
          {config.get('dueDateField') ? getDueDate(config, table, record) : ' '}
        </Text>
      </Box>
    </div>
  );
}

export default Reminder;
