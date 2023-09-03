import type { ReactElement } from 'react';
import { Button, Modal as ReactstrapModal, ModalBody, ModalFooter } from 'reactstrap';

interface ModalProps {
  isOpen: boolean;
  toggle: () => void;
  children: ReactElement;
}

export const Modal = ({ isOpen, toggle, children }: ModalProps): JSX.Element => (
  <ReactstrapModal fade={false} isOpen={isOpen}>
    <ModalBody>{children}</ModalBody>
    <ModalFooter>
      <Button onClick={toggle}>Lukk</Button>
    </ModalFooter>
  </ReactstrapModal>
);
