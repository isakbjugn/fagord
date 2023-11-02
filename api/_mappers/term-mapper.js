const termMapper = (row) => {
  return {
    _id: row.get('_id'),
    en: row.get('en'),
    nb: row.get('nb'),
    nn: row.get('nn'),
    variants: parseVariants(row.get('variants')),
    field: row.get('field'),
    subfield: row.get('subfield'),
    pos: row.get('pos'),
    reference: row.get('reference'),
    _added: row.get('_added'),
    _modified: row.get('_modified'),
    _active: row.get('_active'),
    definition: row.get('definition'),
  };
};

const parseVariants = (variants) => {
  try {
    return JSON.parse(variants);
  } catch (err) {
    return [];
  }
};

const termArrayMapper = (rows) => rows.map((row) => termMapper(row));

module.exports = {
  termMapper: termMapper,
  termArrayMapper,
};
