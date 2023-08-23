import { Link, useParams } from 'react-router-dom';
import type { Term } from '../../types/term';
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';
import TermComponent from './term-component/term-component';
import InfoMessage from '../common/info-message/info-message';
import VariantCloud from './variant-cloud/variant-cloud';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { voteForVariant } from '../../lib/fetch';
import useDictionary from '../utils/use-dictionary';
import Spinner from '../common/spinner/spinner';
import useToggle from '../utils/use-toggle';
import Modal from '../common/modal/modal';

const TermPage = (): JSX.Element => {
  const { termId } = useParams();

  const dictionaryQuery = useDictionary();
  const queryClient = useQueryClient();
  const [isModalOpen, toggleModal] = useToggle(false);
  const [votedTerm, setVotedTerm] = useState<string>('');

  const { mutate } = useMutation({
    mutationFn: voteForVariant,
    onSuccess: async (data) => {
      await queryClient.invalidateQueries(['dictionary']);
      setVotedTerm(data.term);
      toggleModal();
    },
  });

  if (dictionaryQuery.isLoading) return <Spinner />;
  if (dictionaryQuery.isError)
    return (
      <InfoMessage>
        <p>Kunne ikke laste termside.</p>
      </InfoMessage>
    );

  const term: Term | undefined = dictionaryQuery.data.find(
    (term: Term) => term._id === termId
  );

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
        <VariantCloud
          termId={term._id}
          variants={term.variants}
          mutate={mutate}
        />
        <Modal isOpen={isModalOpen} toggle={toggleModal}>
          <p>
            Du har gitt én stemme til <em>«{votedTerm}»</em>.
          </p>
        </Modal>
      </div>
    </main>
  );
};

export default TermPage;
