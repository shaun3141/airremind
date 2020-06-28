import React from 'react';
import {
  TablePickerSynced,
  ViewPickerSynced,
  FieldPickerSynced
} from '@airtable/blocks/ui';
import { FieldType } from '@airtable/blocks/models';

function FieldPickerTitle({ title }) {
  return <td style={{ fontWeight: 'bold', padding: 3 }}>{title}</td>;
}

function Settings({ table, isOpen }) {
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

  return (
    <div style={{ display: settingsDiplay }}>
      <TablePickerSynced globalConfigKey="selectedTableId" />
      <ViewPickerSynced table={table} globalConfigKey="selectedViewId" />
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
                globalConfigKey="subjectField"
                allowedTypes={allowedStringTypes}
              />
            </td>
            <td>
              <FieldPickerSynced
                table={table}
                shouldAllowPickingNone={true}
                globalConfigKey="ownerField"
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
                globalConfigKey="dueDateField"
                allowedTypes={allowedDateTypes}
              />
            </td>
            <td>
              <FieldPickerSynced
                table={table}
                shouldAllowPickingNone={true}
                globalConfigKey="summaryField"
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
