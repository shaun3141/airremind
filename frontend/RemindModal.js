import React, { useState } from 'react';
import { Button, Dialog, Heading, Text, Input, Box } from '@airtable/blocks/ui';

import { sendReminder } from './utils/sendReminder';
import ActionButton from './ActionButton';

const RemindModal = ({ record, config }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [message, setMessage] = useState('');

  return (
    <>
      <ActionButton
        actionText="Remind"
        iconName="bell"
        record={record}
        onClick={() => setIsDialogOpen(true)}
        marginRight={2}
      />
      {isDialogOpen && (
        <Dialog onClose={() => setIsDialogOpen(false)} width="320px">
          <Dialog.CloseButton />
          <Heading>Send Reminder</Heading>
          <Text variant="paragraph">
            {`This will immediately send an email to the owner. You can optionally include a custom message below.`}
          </Text>
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter message"
            width="100%"
            marginBottom={3}
          />
          <Box justifyContent="flex-start" display="flex">
            <Button
              variant="primary"
              icon="envelope"
              marginRight={1}
              onClick={() => {
                sendReminder(record, config, message);
                setIsDialogOpen(false);
              }}
            >
              Send
            </Button>
            <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
          </Box>
        </Dialog>
      )}
    </>
  );
};

export default RemindModal;
