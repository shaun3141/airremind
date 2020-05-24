import {
  initializeBlock,
  useBase,
  useRecords,
  expandRecord,
  TablePickerSynced,
  ViewPickerSynced,
  FieldPickerSynced,
  useGlobalConfig,
  CellRenderer
} from '@airtable/blocks/ui';
import { FieldType } from '@airtable/blocks/models';
import { Icon } from '@airtable/blocks/ui';
import * as request from 'request';
import React, { useState } from 'react';
import _ from 'lodash';

const ENV = {
  DEV: {
    BASE_API: 'https://airreminder.herokuapp.com/'
  },
  PROD: {}
};

function TodoBlock() {
  const base = useBase();

  const globalConfig = useGlobalConfig();
  const tableId = globalConfig.get('selectedTableId');
  const viewId = globalConfig.get('selectedViewId');
  const table = base.getTableByIdIfExists(tableId);
  const view = table ? table.getViewByIdIfExists(viewId) : null;
  const records = useRecords(view);

  const [showSettings, setShowSettings] = useState(
    !(tableId && viewId && globalConfig.get('subjectField'))
  );

  const tasks = records
    ? records.map(record => {
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
    <div>
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
            setShowSettings(showSettings ? false : true);
          }}
        >
          <Icon name="settings" size={16} />
        </div>
      </div>
      <Settings table={table} />
      {tasks}
    </div>
  );

  function Settings({ table }) {
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

    const settingsDiplay = showSettings ? 'block' : 'none';

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

  // TODO: Figure out stylesheet + hover
  // background-color: rgba(0,0,0,0.05);
  // transition: .085s background-color ease-in;
  function Reminder({ record, config, table }) {
    const ownerField =
      config.get('ownerField') && table.getFieldById(config.get('ownerField'))
        ? table.getFieldById(config.get('ownerField'))
        : null;

    return (
      <div
        style={{
          padding: 12,
          borderBottom: '1px solid #ddd',
          color: '#4D4D4D',
          fontWeight: 600
        }}
      >
        <div
          style={{ width: '60%', display: 'inline-block', fontSize: '.9rem' }}
        >
          {/* MOVE TO ONLY RENDER CONDITIONALLY */}
          {/* <CellRenderer
          field={statusField}
          record={record}
          style={{ display: 'inline-block', marginRight: 5 }}
        /> */}
          {/* <Icon name="checkboxUnchecked" size={16} /> */}
          {config.get('subjectField')
            ? record.getCellValueAsString(config.get('subjectField')) ||
              '(Untitled)'
            : record.primaryCellValueAsString || '(Untitled)'}
        </div>

        <ActionButton
          actionText="Remind"
          iconName="bell"
          record={record}
          clickAction={sendReminder}
        />

        <ActionButton
          actionText="Edit"
          iconName="edit"
          record={record}
          clickAction={expandRecord}
        />
        <div style={{ display: 'inline-block', width: '100%', paddingTop: 5 }}>
          {/* Summary */}
          <div
            style={{
              width: '60%',
              display: 'inline-block',
              fontSize: '.7rem',
              color: '#666',
              fontWeight: 400,
              float: 'left'
            }}
          >
            {config.get('ownerField') ? (
              record.getCellValueAsString(config.get('ownerField')) ? (
                <CellRenderer
                  field={ownerField}
                  record={record}
                  style={{ display: 'inline-block', marginRight: 5 }}
                />
              ) : (
                'Unassigned'
              )
            ) : (
              ' '
            )}
            {config.get('summaryField') ? (
              <div style={{ width: '100%', fontStyle: 'italic' }}>
                {record.getCellValueAsString(config.get('summaryField'))}
              </div>
            ) : (
              ' '
            )}
          </div>

          {/* Due in X Days */}
          <div
            style={{
              width: '40%',
              display: 'inline-block',
              fontSize: '.4rem',
              textAlign: 'center',
              float: 'right'
            }}
          >
            {'Due in X days'}
          </div>
        </div>
      </div>
    );
  }

  function sendReminder(record) {
    console.log(record);
    // console.log(record._data.cellValuesByFieldId);
    // console.log(globalConfig._kvStore);
    // console.log(`${ENV.DEV.BASE_API}send_reminder`);

    const payload = {
      config: globalConfig._kvStore,
      record: record._data.cellValuesByFieldId,
      base: _.pick(record._baseData, [
        'id',
        'name',
        'currentUserId',
        'collaboratorsById'
      ])
    };
    console.log(JSON.stringify(payload));

    request.post(
      {
        headers: { 'content-type': 'application/json' },
        url: `${ENV.DEV.BASE_API}send_reminder`,
        body: JSON.stringify(payload)
      },
      function(error, response, body) {
        if (error) {
          console.error(error);
        } else {
          console.log(body);
        }
      }
    );
  }

  function FieldPickerTitle({ title }) {
    return <td style={{ fontWeight: 'bold', padding: 3 }}>{title}</td>;
  }

  function ActionButton({ actionText, iconName, record, clickAction }) {
    return (
      <div
        style={{ width: '20%', display: 'inline-block', textAlign: 'center' }}
      >
        <a
          style={{
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onClick={() => {
            clickAction(record);
          }}
        >
          <Icon name={iconName} size={16} />
          <div
            style={{ display: 'inline-block', paddingLeft: 3 }}
          >{` ${actionText}`}</div>
        </a>
      </div>
    );
  }
}

initializeBlock(() => <TodoBlock />);
// TODO:
// If only 1 view exists, don't ask for view
// Make Card View with Flex
// Make card with dynamic sizes
