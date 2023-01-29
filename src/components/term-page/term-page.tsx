import { Link, useParams } from 'react-router-dom';
import { Term } from '../../types/term';
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';
import TermComponent from '../common/term-component/term-component';
import InfoMessage from '../common/info-message/info-message';
import VariantCloud from './variant-cloud/variant-cloud';
import { useMutation, useQueryClient } from 'react-query';
import { useState } from 'react';
import { voteForVariant } from '../../lib/fetch';
import useDictionary from '../utils/use-dictionary';
import Spinner from '../common/spinner/spinner';
import useToggle from '../utils/use-toggle';
import Modal from '../common/modal/modal';

const TermPage = () => {
  const { termId } = useParams();

  const { isLoading, isError, data: dictionary } = useDictionary();
  const queryClient = useQueryClient();
  const [isModalOpen, toggleModal] = useToggle(false);
  const [votedTerm, setVotedTerm] = useState<string>('');

  const { mutate } = useMutation(voteForVariant, {
    onSuccess: (data) => {
      queryClient.invalidateQueries('dictionary');
      setVotedTerm(data.term);
      toggleModal();
    },
  });

  if (isLoading) return <Spinner />;
  if (isError) return <p>Kunne ikke laste termside.</p>;

  const term = dictionary.find((term: Term) => term._id === termId);

  if (!term)
    return (
      <InfoMessage>
        <p>Termen finnes ikke enda!</p>
      </InfoMessage>
    );

  return (
    <div className="container my-3">
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
    </div>
  );
};

export default TermPage;
