import { cursor } from '@airtable/blocks';
import * as request from 'request';
import { getDueDate } from '../utils/getDueDate';

const ENV = {
  DEV: {
    BASE_API: 'https://airreminder.herokuapp.com/'
  },
  PROD: {
    BASE_API: 'https://airreminder.herokuapp.com/'
  }
};

export function sendReminder(record, config, table, message) {
  // console.log(record._data.cellValuesByFieldId);
  // console.log(globalConfig._kvStore);

  const payload = {
    config: config._kvStore,
    recordId: record.id,
    viewId: cursor.activeViewId,
    tableId: cursor.activeTableId,
    record: record._data.cellValuesByFieldId,
    dueDateMessage: getDueDate(config, table, record),
    message,
    base: _.pick(record._baseData, [
      'id',
      'name',
      'currentUserId',
      'collaboratorsById'
    ])
  };

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
