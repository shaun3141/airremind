import * as request from 'request';
const ENV = {
  DEV: {
    BASE_API: 'https://airreminder.herokuapp.com/'
  },
  PROD: {}
};

export function sendReminder(record, config, message) {
  // console.log(record._data.cellValuesByFieldId);
  // console.log(globalConfig._kvStore);
  // console.log(`${ENV.DEV.BASE_API}send_reminder`);

  const payload = {
    config: config._kvStore,
    record: record._data.cellValuesByFieldId,
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
    function (error, response, body) {
      if (error) {
        console.error(error);
      } else {
        console.log(body);
      }
    }
  );
}
