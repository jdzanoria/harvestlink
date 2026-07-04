import { useState } from 'react';
import Button from '../common/Button';
import FormField from '../common/FormField';
import { PAYMENT_METHODS } from '../../utils/constants';
import { hasErrors, validateRequestForm } from '../../utils/validators';

export default function RequestForm({ product, currentUser, onSubmit }) {
  const [values, setValues] = useState({ quantity: '', message: '', paymentMethod: 'cash' });
  const [errors, setErrors] = useState({});

  const updateField = (field, value) => {
    setValues((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => ({ ...previous, [field]: undefined, form: undefined }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validateRequestForm(values, product, currentUser);
    if (hasErrors(nextErrors)) {
      setErrors(nextErrors);
      return;
    }
    onSubmit(values);
    setValues({ quantity: '', message: '', paymentMethod: 'cash' });
  };

  return (
    <form className="form-stack" onSubmit={handleSubmit}>
      {errors.form ? <div className="form-alert error">{errors.form}</div> : null}

      <FormField label="Quantity requested" name="quantity" error={errors.quantity} helper={`${product.quantity} ${product.unit} available`}>
        <input
          id="quantity"
          type="number"
          min="0"
          step="0.01"
          value={values.quantity}
          onChange={(event) => updateField('quantity', event.target.value)}
          placeholder="25"
        />
      </FormField>

      <FormField label="Payment method" name="paymentMethod" error={errors.paymentMethod}>
        <div className="segmented-control" role="radiogroup" aria-label="Payment method">
          {PAYMENT_METHODS.map((method) => (
            <button
              key={method.value}
              type="button"
              className={values.paymentMethod === method.value ? 'active' : ''}
              onClick={() => updateField('paymentMethod', method.value)}
            >
              {method.label}
            </button>
          ))}
        </div>
      </FormField>

      <FormField label="Message to farmer" name="message" helper="Optional pickup, delivery, or timing note.">
        <textarea
          id="message"
          rows="4"
          value={values.message}
          onChange={(event) => updateField('message', event.target.value)}
          placeholder="Can we pick this up tomorrow morning?"
        />
      </FormField>

      <Button type="submit" className="full-width">Send purchase request</Button>
    </form>
  );
}
