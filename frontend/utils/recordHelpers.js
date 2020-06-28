export function isRecordEmpty(record) {
  // Even when a row has no records, there's still an "undefined value" for the primary field
  let isEmpty = true;
  Object.keys(record._data.cellValuesByFieldId).forEach(key => {
    if (record._data.cellValuesByFieldId[key]) {
      isEmpty = false;
    }
  });
  return isEmpty;
}
