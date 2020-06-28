import React from 'react';
import { Button } from '@airtable/blocks/ui';

function ActionButton({ actionText, iconName, record, clickAction, ...rest }) {
  return (
    <Button
      variant="secondary"
      size="small"
      style={{
        transition: '0.15s all ease',
        padding: '0 4px'
      }}
      icon={iconName}
      onClick={() => {
        clickAction(record);
      }}
      {...rest}
    >
      {actionText}
    </Button>
  );
}

export default ActionButton;
