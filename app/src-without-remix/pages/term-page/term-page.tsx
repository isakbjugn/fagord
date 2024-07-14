import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';
import { Link, useParams } from '@remix-run/react';
import { useDictionary } from '~/src-without-remix/utils/use-dictionary.client';
import { voteForVariant } from '~/src-without-remix/lib/fetch.client';
import { Spinner } from '~/src-without-remix/components/spinner/spinner';
import { InfoMessage } from '~/src-without-remix/components/info-message/info-message';
import type { Term } from '~/types/term';
import { TermComponent } from '~/src-without-remix/pages/term-page/term-component/term-component';
import { VariantCloud } from '~/src-without-remix/pages/term-page/variant-cloud/variant-cloud';
import { Dialog } from '~/src-without-remix/components/dialog/dialog';

export const TermPage = (): JSX.Element => {
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
