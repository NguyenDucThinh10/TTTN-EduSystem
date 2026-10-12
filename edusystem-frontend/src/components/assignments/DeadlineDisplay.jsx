import { formatDate, isPastDate } from '../../utils/dateUtils';

export default function DeadlineDisplay({ dueDate }) {
  return <span className={isPastDate(dueDate) ? 'deadline past' : 'deadline'}>{formatDate(dueDate)}</span>;
}
