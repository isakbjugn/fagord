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

const posMapper = (pos) => {
  switch (pos) {
    case 'substantiv':
      return '_sub';
    case 'verb':
      return '_ver';
    case 'adjektiv':
      return '_adj';
    case 'pronomen':
      return '_pro';
    case 'determinativ':
      return '_det';
    case 'preposisjon':
      return '_pre';
    case 'adverb':
      return '_adv';
    case 'subjunksjon':
      return '_sbj';
    case 'konjunksjon':
      return '_knj';
    case 'interjeksjon':
      return '_int';
    default:
      return '';
  }
};

module.exports = {
  termMapper,
  termArrayMapper,
  posMapper,
};
