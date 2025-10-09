import style from '~/styles/term.module.css';
import type { Term } from '~/types/term';

interface Props {
  term: Term;
}

export const ShareTermButton = ({ term }: Props) => {
  const fieldSpec = term.subfield !== '' ? term.subfield : term.field;
  const fieldSpecStr = fieldSpec !== '' ? ' (' + fieldSpec + ')' : '';
  const termShareData = {
    title: 'Fagord',
    text: term.en + fieldSpecStr,
    url: 'https://www.fagord.no/term/' + term.slug,
  };

  return (
    <button
      className={style.share}
      onClick={() => {
        try {
          navigator.share(termShareData);
        } catch {
          navigator.clipboard.writeText(termShareData.url);
        }
      }}
    >
      <i className="fa-solid fa-arrow-up-from-bracket fa-lg" />
    </button>
  );
};
