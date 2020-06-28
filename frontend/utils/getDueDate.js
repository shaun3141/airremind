import moment from 'moment';
import { cursor } from '@airtable/blocks';

export function getDueDate(config, table, record) {
  let dueDateMessage = '';
  if (
    config.get([cursor.activeViewId, 'dueDateField']) &&
    table.getFieldById(config.get([cursor.activeViewId, 'dueDateField']))
  ) {
    let now = moment().startOf('day');
    let dueDate = moment(
      record.getCellValueAsString(
        config.get([cursor.activeViewId, 'dueDateField'])
      )
    ).startOf('day');
    let daysDiff =
      moment.duration(dueDate - now, 'millisecond') / 1000 / 60 / 60 / 24;
    if (daysDiff > 1) {
      dueDateMessage = `Due in ${daysDiff} days`;
    } else if (daysDiff === 1) {
      dueDateMessage = `Due tomorrow`;
    } else if (daysDiff === 0) {
      dueDateMessage = `Due today`;
    } else if (daysDiff === -1) {
      dueDateMessage = `Due yesterday`;
    } else if (daysDiff < -1) {
      dueDateMessage = `Due ${daysDiff * -1} days ago`;
    } else {
      dueDateMessage = ' ';
    }
  }
  return dueDateMessage;
}
