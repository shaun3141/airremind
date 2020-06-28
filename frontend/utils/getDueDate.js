import moment from 'moment';

export function getDueDate(config, table, record) {
  let dueDateMessage = '';
  if (
    config.get('dueDateField') &&
    table.getFieldById(config.get('dueDateField'))
  ) {
    let now = moment().startOf('day');
    let dueDate = moment(
      record.getCellValueAsString(config.get('dueDateField'))
    ).startOf('day');
    let daysDiff =
      moment.duration(dueDate - now, 'millisecond') / 1000 / 60 / 60 / 24;
    console.log(daysDiff);
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
