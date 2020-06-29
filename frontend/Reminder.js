import React from 'react';
import { expandRecord, CellRenderer, Box, Text } from '@airtable/blocks/ui';

import { getDueDate } from './utils/getDueDate';
import { cursor } from '@airtable/blocks';
import ActionButton from './ActionButton';
import RemindModal from './RemindModal';

function Reminder({ record, config, table }) {
  const ownerField = config.get([cursor.activeViewId, 'ownerField']);
  const subjectField = config.get([cursor.activeViewId, 'subjectField']);
  const summaryField = config.get([cursor.activeViewId, 'summaryField']);
  const dueDateField = config.get([cursor.activeViewId, 'dueDateField']);

  const Owner = () => {
    const owner = ownerField && record.getCellValueAsString(ownerField);

    return ownerField && owner ? (
      <CellRenderer
        field={table.getFieldById(ownerField)}
        record={record}
        cellStyle={{
          marginLeft: '-6px'
        }}
      />
    ) : (
      'Unassigned'
    );
  };

  return (
    <Box padding={3} borderBottom="1px solid #ddd">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="flex-start"
      >
        <Text size="large" fontWeight="600" marginTop={1} marginRight={2}>
          {subjectField
            ? record.getCellValueAsString(subjectField) || '(Untitled)'
            : record.primaryCellValueAsString || '(Untitled)'}
        </Text>
        <Box minWidth="134px">
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
          <Owner />
        </Box>
        <Text fontWeight="600" minWidth="110px" textColor="light" marginTop={1}>
          {dueDateField ? getDueDate(config, table, record) : ' '}
        </Text>
      </Box>
      <Text fontStyle="italic" textColor="light" marginTop={2}>
        {summaryField ? record.getCellValueAsString(summaryField) : ' '}
      </Text>
    </Box>
  );
}

export default Reminder;
