import { paymentLabel } from '../../utils/formatters';

export default function StatusBadge({ value, type = 'status' }) {
  const label = type === 'payment' ? paymentLabel(value) : value;

  return (
    <span className={`badge badge-${type} badge-${String(value).toLowerCase()}`}>
      {label}
    </span>
  );
}
