import React from 'react';
import { FieldPickerSynced, useGlobalConfig } from '@airtable/blocks/ui';
import { cursor } from '@airtable/blocks';
import { FieldType } from '@airtable/blocks/models';

function FieldPickerTitle({ title }) {
  return <td style={{ fontWeight: 'bold', padding: 3 }}>{title}</td>;
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

  // Auto-pick best fields for the view:
  // Get list of all fields from table
  // Double check field is in view
  // If globalConfig is empty, set it there

  for (let field of table.fields) {
    console.log(field.name + ' ' + field.type);
  }

  if (!globalConfig.get([cursor.activeViewId, 'subjectField'])) {
    globalConfig.setAsync(
      [cursor.activeViewId, 'subjectField'],
      table.primaryField.id
    );
  }

  const defaultOwnerFields = table.fields.filter((f) =>
    allowedOwnerTypes.includes(f.type)
  );
  if (
    !globalConfig.get([cursor.activeViewId, 'ownerField']) &&
    defaultOwnerFields.length
  ) {
    globalConfig.setAsync(
      [cursor.activeViewId, 'ownerField'],
      defaultOwnerFields[0].id
    );
  }

  const defaultDueDateFields = table.fields.filter((f) =>
    allowedDateTypes.includes(f.type)
  );
  if (
    !globalConfig.get([cursor.activeViewId, 'dueDateField']) &&
    defaultDueDateFields.length
  ) {
    globalConfig.setAsync(
      [cursor.activeViewId, 'dueDateField'],
      defaultDueDateFields[0].id
    );
  }

  const defaultSummaryFields = table.fields.filter(
    (f) =>
      allowedStringTypes.includes(f.type) &&
      !allowedDateTypes.includes(f.type) &&
      !allowedOwnerTypes.includes(f.type) &&
      table.primaryField.id != f.id
  );
  if (!globalConfig.get([cursor.activeViewId, 'summaryField'])) {
    globalConfig.setAsync(
      [cursor.activeViewId, 'summaryField'],
      defaultSummaryFields[0].id
    );
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
                globalConfigKey={[cursor.activeViewId, 'summaryField']}
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
