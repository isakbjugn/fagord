const termMapper = (row) => {
  return {
    _id: row._id,
    en: row.en,
    nb: row.nb,
    nn: row.nn,
    variants: parseVariants(row.variants),
    field: row.field,
    subfield: row.subfield,
    pos: row.pos,
    reference: row.reference,
    _added: row._added,
    _modified: row._modified,
    _active: row._active,
    definition: row.definition,
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
  termMapper: termMapper,
  termArrayMapper: termArrayMapper,
  posMapper: posMapper,
};
