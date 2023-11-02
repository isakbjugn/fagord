const { deriveTermId } = require('../_utils/term-utils');

describe('Utleder riktig id', () => {
    it('Starter på indeks 2 ved ett treff', () => {
        const array = ['grace_sub'];
        const searchTerm = 'grace';
        const id = deriveTermId(searchTerm, array);

        expect(id).toEqual('grace_2');
    });

    it('Skiller mellom ord og sammensatte ord', () => {
        const array = [
            'grace_sub',
            'grace_1',
            'grace_note_sub',
            'grace_note_1',
            'grace_other_3',
        ];

        const searchTerm1 = 'grace';
        const searchTerm2 = 'grace note';

        const id_1 = deriveTermId(searchTerm1, array);
        const id_2 = deriveTermId(searchTerm2, array);

        expect(id_1).toEqual('grace_3');
        expect(id_2).toEqual('grace_note_3');
    });

    it('Godtar sammensatt indeks', () => {
        const array = [
            'grace_sub',
            'grace_sub2',
            'jagger_sub2',
        ];
        const searchTerm = 'grace';
        const id = deriveTermId(searchTerm, array);

        expect(id).toEqual('grace_3');
    });

    it('Starter på indeks 1 ved manglende treff', () => {
        const array = ['apple_1', 'banana_2'];
        const searchTerm = 'grape';
        const id = deriveTermId(searchTerm, array);

        expect(id).toEqual('grape_1');
    });
});