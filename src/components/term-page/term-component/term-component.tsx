import { IosShare } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import type { Term } from '../../../types/term';
import Definition from './definition/definition';
import TranslationCard from './translation-card/translation-card';
import style from './term-component.module.css';

interface TermComponentProps {
  term: Term;
}

const TermComponent = ({ term }: TermComponentProps): JSX.Element => {
  if (term === null) return <></>;

  const fieldSpec = term.subfield !== '' ? term.subfield : term.field;
  const fieldSpecStr = fieldSpec !== '' ? ' (' + fieldSpec + ')' : '';
  const termShareData = {
    title: 'Fagord',
    text: term.en + fieldSpecStr,
    url: 'https://www.fagord.no/term/' + term._id,
  };

  return (
    <div>
      <div className="row">
        <span className={style.title}>
          <h1>{term.en} </h1>
          <h3 className={style.field}>{fieldSpecStr}</h3>
          <IconButton
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
        </span>
        <hr />
      </div>
      <div className="row">
        <div className="col-12 col-md-6">
          <Definition termId={term._id} definition={term.definition} />
        </div>
        <div className="col-8 col-sm-8 col-md-6 mt-2">
          <TranslationCard term={term} />
        </div>
      </div>
    </div>
  );
};

export default TermComponent;
