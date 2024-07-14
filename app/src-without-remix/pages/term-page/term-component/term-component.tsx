import { IosShare } from '@mui/icons-material';
import { IconButton } from '@mui/material';

import type { Term } from '~/types/term';
import { Definition } from './definition/definition';
import style from './term-component.module.css';
import { TranslationCard } from './translation-card/translation-card';

interface TermComponentProps {
  term: Term;
}

export const TermComponent = ({ term }: TermComponentProps): JSX.Element => {
  if (term === null) return <></>;

  const fieldSpec = term.subfield !== '' ? term.subfield : term.field;
  const fieldSpecStr = fieldSpec !== '' ? ' (' + fieldSpec + ')' : '';
  const termShareData = {
    title: 'Fagord',
    text: term.en + fieldSpecStr,
    url: 'https://www.fagord.no/term/' + term._id,
  };

  return (
    <article>
      <div className="row">
        <div className={style.header}>
          <div className={style.title}>
            <h1>{term.en}</h1>
            <h3>{fieldSpecStr}</h3>
          </div>
          <IconButton
            className={style.share}
            sx={{ color: '#ffffff' }}
            onClick={() => {
              try {
                navigator.share(termShareData);
              } catch {
                navigator.clipboard.writeText(termShareData.url);
              }
            }}
          >
            <IosShare />
          </IconButton>
        </div>
        <hr />
      </div>
      <div className="row">
        <div className="col-12 col-md-6">
          <Definition termId={term._id} definition={term.definition} />
        </div>
        <div className="col-12 col-sm-8 col-md-6 mt-2">
          <TranslationCard term={term} />
        </div>
      </div>
    </article>
  );
};
