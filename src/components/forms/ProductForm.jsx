import { useState } from 'react';
import Button from '../common/Button';
import FormField from '../common/FormField';
import { PRODUCT_CATEGORIES, PRODUCT_UNITS } from '../../utils/constants';
import { fileToDataUrl } from '../../utils/formatters';
import { hasErrors, validateProductForm } from '../../utils/validators';

const defaultValues = {
  name: '',
  category: 'Vegetables',
  price: '',
  unit: 'kg',
  quantity: '',
  location: '',
  description: '',
  image: '',
  status: 'active',
};

export default function ProductForm({ product, onSubmit, onCancel }) {
  const [values, setValues] = useState(() => (product ? { ...defaultValues, ...product } : defaultValues));
  const [errors, setErrors] = useState({});
  const [isReadingImage, setIsReadingImage] = useState(false);

  const updateField = (field, value) => {
    setValues((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => ({ ...previous, [field]: undefined }));
  };

  const handleImageChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsReadingImage(true);
      const dataUrl = await fileToDataUrl(file);
      updateField('image', dataUrl);
    } catch {
      setErrors((previous) => ({ ...previous, image: 'Unable to load this image.' }));
    } finally {
      setIsReadingImage(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validateProductForm(values);
    if (hasErrors(nextErrors)) {
      setErrors(nextErrors);
      return;
    }
    onSubmit(values);
    if (!product) setValues(defaultValues);
  };

  return (
    <form className="form-stack" onSubmit={handleSubmit}>
      <div className="form-grid">
        <FormField label="Product name" name="name" error={errors.name}>
          <input id="name" value={values.name} onChange={(event) => updateField('name', event.target.value)} placeholder="Fresh cabbage" />
        </FormField>
        <FormField label="Category" name="category" error={errors.category}>
          <select id="category" value={values.category} onChange={(event) => updateField('category', event.target.value)}>
            {PRODUCT_CATEGORIES.map((category) => <option key={category}>{category}</option>)}
          </select>
        </FormField>
      </div>

      <div className="form-grid three">
        <FormField label="Price" name="price" error={errors.price}>
          <input id="price" type="number" min="0" step="0.01" value={values.price} onChange={(event) => updateField('price', event.target.value)} placeholder="55.00" />
        </FormField>
        <FormField label="Unit" name="unit" error={errors.unit}>
          <select id="unit" value={values.unit} onChange={(event) => updateField('unit', event.target.value)}>
            {PRODUCT_UNITS.map((unit) => <option key={unit} value={unit}>{unit}</option>)}
          </select>
        </FormField>
        <FormField label="Quantity available" name="quantity" error={errors.quantity}>
          <input id="quantity" type="number" min="0" step="0.01" value={values.quantity} onChange={(event) => updateField('quantity', event.target.value)} placeholder="100" />
        </FormField>
      </div>

      <FormField label="Location" name="location" error={errors.location} helper="Use a clear Cebu city or municipality.">
        <input id="location" value={values.location} onChange={(event) => updateField('location', event.target.value)} placeholder="Carcar City, Cebu" />
      </FormField>

      <FormField label="Description" name="description" error={errors.description}>
        <textarea id="description" rows="4" value={values.description} onChange={(event) => updateField('description', event.target.value)} placeholder="Describe freshness, harvest date, pickup notes, or handling requirements." />
      </FormField>

      <FormField label="Product image" name="image" error={errors.image} helper="Images are stored locally as data URLs for this prototype.">
        <input id="image" type="file" accept="image/*" onChange={handleImageChange} />
      </FormField>

      {values.image ? (
        <div className="image-preview">
          <img src={values.image} alt="Product preview" />
          <Button variant="ghost" onClick={() => updateField('image', '')}>Remove image</Button>
        </div>
      ) : null}

      <div className="form-actions">
        {onCancel ? <Button variant="secondary" onClick={onCancel}>Cancel</Button> : null}
        <Button type="submit" disabled={isReadingImage}>{product ? 'Save changes' : 'Add product'}</Button>
      </div>
    </form>
  );
}
