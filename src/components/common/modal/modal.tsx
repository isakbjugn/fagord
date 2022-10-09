import { ReactElement } from "react"
import {
  Button,
  Modal as ReactstrapModal,
  ModalBody,
  ModalFooter,
} from "reactstrap";

interface ModalProps {
  isOpen: boolean;
  toggle: () => void;
  children: ReactElement;
}

const Modal = ({ isOpen, toggle, children }: ModalProps) =>
  <ReactstrapModal fade={false} isOpen={isOpen}>
    <ModalBody>
      {children}
    </ModalBody>
    <ModalFooter>
      <Button color="secondary" onClick={toggle}>
        Lukk
      </Button>
    </ModalFooter>
  </ReactstrapModal>

export default Modal;