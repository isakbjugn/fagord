import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import { Link, useParams } from '@remix-run/react';
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';

import { Dialog } from '../../components/dialog/dialog';
import { InfoMessage } from '../../components/info-message/info-message';
import { Spinner } from '../../components/spinner/spinner';
import { voteForVariant } from '../../lib/fetch';
import type { Term } from '../../types/term';
import { useDictionary } from '../../utils/use-dictionary';
import { TermComponent } from './term-component/term-component';
import { VariantCloud } from './variant-cloud/variant-cloud';

export const TermPage = () => {
  const { termId } = useParams();

  const dictionaryQuery = useDictionary();
  const queryClient = useQueryClient();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [votedTerm, setVotedTerm] = useState<string>('');

  const { mutate } = useMutation({
    mutationFn: voteForVariant,
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ['dictionary'] });
      setVotedTerm(data.term);
      dialogRef.current?.showModal();
    },
  });

  if (dictionaryQuery.isPending) return <Spinner />;
  if (dictionaryQuery.isError)
    return (
      <InfoMessage>
        <p>Kunne ikke laste termside.</p>
      </InfoMessage>
    );

  const term: Term | undefined = dictionaryQuery.data.find((term: Term) => term._id === termId);

  if (term === undefined)
    return (
      <InfoMessage>
        <p>Termen finnes ikke enda!</p>
      </InfoMessage>
    );

  return (
    <main className="container my-3">
      <div className="col-12 col-lg-10 mx-auto ">
        <div className="row" style={{ color: 'white' }}>
          <Breadcrumb>
            <BreadcrumbItem>
              <Link to="/termliste">Termliste</Link>
            </BreadcrumbItem>
            <BreadcrumbItem active>{term.en}</BreadcrumbItem>
          </Breadcrumb>
        </div>
        <TermComponent term={term} />
        <VariantCloud termId={term._id} variants={term.variants} mutate={mutate} />
        <Dialog ref={dialogRef}>
          <p>
            Du har gitt én stemme til <em>«{votedTerm}»</em>.
          </p>
        </Dialog>
      </div>
    </main>
  );
};
