export const createId = (en: string, pos: POS) => {
  return en + posMapper(pos)
}

const posMapper = (pos: POS) => {
  switch(pos) {
    case 'substantiv': return '_sub';
    case 'verb': return '_ver';
    case 'adjektiv': return '_adj';
    case 'pronomen': return '_pro';
    case 'determinativ': return '_det';
    case 'preposisjon': return '_pre';
    case 'adverb': return '_adv';
    case 'subjunksjon': return '_sbj';
    case 'konjunksjon': return '_knj';
    case 'interjeksjon': return '_int';
  }
}

type POS = 
  'substantiv' | 'verb' | 'adjektiv' | 'pronomen' | 'determinativ' |
  'preposisjon' | 'adverb' | 'subjunksjon' | 'konjunksjon' | 'interjeksjon';