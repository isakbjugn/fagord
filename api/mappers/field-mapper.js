const fieldMapper = (rows) => {
  const fields = [];
  for (const row of rows) {
    if (!row.get('field') || !row.get('_active')) continue;
    if (!fields.some((field) => field.field === row.get('field'))) {
      fields.push({ field: row.get('field'), subfields: [] });
    }
    if (row.get('subfield'))
      if (
        !fields
          .filter((field) => field.field === row.get('field'))[0]
          .subfields.includes(row.get('subfield'))
      )
        fields
          .filter((field) => field.field === row.get('field'))[0]
          .subfields.push(row.get('subfield'));
  }
  return fields;
};

module.exports = {
  fieldMapper,
};
