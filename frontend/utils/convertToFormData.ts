function convertToFormData(
  obj: any,
  formData = new FormData(),
  parentKey = ""
) {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];

      // Create the full key including parent keys for nested structures
      const fullKey = parentKey ? `${parentKey}[${key}]` : key;

      if (
        value !== null &&
        typeof value === "object" &&
        !(value instanceof File)
      ) {
        // Recursively process nested objects
        convertToFormData(value, formData, fullKey);
      } else if (value !== null) {
        // Append non-null values to FormData
        formData.append(fullKey, value);
      }
    }
  }

  return formData;
}

export default convertToFormData;
