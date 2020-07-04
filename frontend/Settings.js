import React from 'react';
import { FieldPickerSynced, useGlobalConfig } from '@airtable/blocks/ui';
import { cursor } from '@airtable/blocks';
import { FieldType } from '@airtable/blocks/models';

function FieldPickerTitle({ title }) {
  return (
    <td style={{ fontWeight: 'bold', padding: 3, width: '50%' }}>{title}</td>
  );
}

function Settings({ table, isOpen }) {
  const globalConfig = useGlobalConfig();

  const allowedStringTypes = [
    FieldType.AUTO_NUMBER,
    FieldType.CHECKBOX,
    FieldType.CHECKBOX,
    FieldType.CURRENCY,
    FieldType.DATE,
    FieldType.DATE_TIME,
    FieldType.DURATION,
    FieldType.EMAIL,
    FieldType.FORMULA,
    FieldType.MULTILINE_TEXT,
    FieldType.MULTIPLE_COLLABORATORS,
    FieldType.MULTIPLE_SELECTS,
    FieldType.NUMBER,
    FieldType.PERCENT,
    FieldType.PHONE_NUMBER,
    FieldType.RATING,
    FieldType.RICH_TEXT,
    FieldType.ROLLUP,
    FieldType.SINGLE_COLLABORATOR,
    FieldType.SINGLE_LINE_TEXT,
    FieldType.SINGLE_SELECT,
    FieldType.URL
  ];
  const allowedDateTypes = [FieldType.DATE, FieldType.DATE_TIME];
  // const allowedStatusTypes = [
  //   FieldType.CHECKBOX,
  //   FieldType.SINGLE_SELECT,
  //   FieldType.MULTIPLE_SELECTS
  // ];
  const allowedOwnerTypes = [
    FieldType.EMAIL,
    FieldType.SINGLE_COLLABORATOR,
    FieldType.MULTIPLE_COLLABORATORS
  ];

  const settingsDiplay = isOpen ? 'block' : 'none';

  // First time initializing this table view, try to auto-pick fields:
  if (!globalConfig.get([cursor.activeViewId, 'subjectField'])) {
    globalConfig.setAsync(
      [cursor.activeViewId, 'subjectField'],
      table.primaryField.id
    );

    const defaultOwnerFields = table.fields.filter((f) =>
      allowedOwnerTypes.includes(f.type)
    );
    if (defaultOwnerFields.length) {
      globalConfig.setAsync(
        [cursor.activeViewId, 'ownerField'],
        defaultOwnerFields[0].id
      );
    }

    const defaultDueDateFields = table.fields.filter((f) =>
      allowedDateTypes.includes(f.type)
    );
    if (defaultDueDateFields.length) {
      globalConfig.setAsync(
        [cursor.activeViewId, 'dueDateField'],
        defaultDueDateFields[0].id
      );
    }

    const defaultDetailsFields = table.fields.filter(
      (f) =>
        allowedStringTypes.includes(f.type) &&
        !allowedDateTypes.includes(f.type) &&
        !allowedOwnerTypes.includes(f.type) &&
        f.type != 'checkbox' && // checkbox just looks bad when unchecked
        table.primaryField.id != f.id
    );
    if (defaultDetailsFields.length) {
      globalConfig.setAsync(
        [cursor.activeViewId, 'detailsField'],
        defaultDetailsFields[0].id
      );
    }
  }

  return (
    <div style={{ display: settingsDiplay }}>
      <table style={{ width: '100%' }}>
        <tbody>
          <tr>
            <FieldPickerTitle title="Subject" />
            <FieldPickerTitle title="Owner" />
          </tr>
          <tr>
            <td>
              <FieldPickerSynced
                table={table}
                globalConfigKey={[cursor.activeViewId, 'subjectField']}
                allowedTypes={allowedStringTypes}
              />
            </td>
            <td>
              <FieldPickerSynced
                table={table}
                shouldAllowPickingNone={true}
                globalConfigKey={[cursor.activeViewId, 'ownerField']}
                allowedTypes={allowedOwnerTypes}
              />
            </td>
          </tr>
          <tr>
            <FieldPickerTitle title="Due Date" />
            <FieldPickerTitle title="Summary" />
          </tr>
          <tr>
            <td>
              <FieldPickerSynced
                table={table}
                shouldAllowPickingNone={true}
                globalConfigKey={[cursor.activeViewId, 'dueDateField']}
                allowedTypes={allowedDateTypes}
              />
            </td>
            <td>
              <FieldPickerSynced
                table={table}
                shouldAllowPickingNone={true}
                globalConfigKey={[cursor.activeViewId, 'detailsField']}
                allowedTypes={allowedStringTypes}
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Settings;
