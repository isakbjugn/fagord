const fieldMapper = (rows) => {
  const fields = [];
  for (const row of rows) {
    if (!row.field || !row._active) continue;
    if (!fields.some((field) => field.field === row.field)) {
      fields.push({ field: row.field, subfields: [] });
    }
    if (row.subfield)
      if (
        !fields
          .filter((field) => field.field === row.field)[0]
          .subfields.includes(row.subfield)
      )
        fields
          .filter((field) => field.field === row.field)[0]
          .subfields.push(row.subfield);
  }
  return fields;
};

module.exports = {
  fieldMapper,
};
