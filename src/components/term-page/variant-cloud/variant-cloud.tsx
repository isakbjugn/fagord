import { useState } from "react"
import { useMutation, useQueryClient } from "react-query"
import { TagCloud } from "react-tagcloud"
import { Button, Modal, ModalBody, ModalFooter } from "reactstrap"
import { voteForVariant } from "../../../lib/fetch"
import { Variant } from "../../../types/term"
import styles from "./variant-cloud.module.css";

interface VariantCloudProps {
  termId: string;
  variants: Variant[];
}

const VariantCloud = ({ termId, variants }: VariantCloudProps) => {

  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [votedTerm, setVotedTerm] = useState<string>("");

  const { mutate } = useMutation(voteForVariant, {
    onSettled: () => {
      queryClient.invalidateQueries('dictionary');
    }
  })

  const options = {
    luminosity: 'light',
    hue: 'red',
  }

  const renderTermNoDuplicates = (variant: Variant) => {
    if (variants.filter(v => v.term === variant.term).length > 1)
      return variant.term + ' (' + variant.dialect + ')';
    return variant.term;
  }
  
  return (
    <>
      <TagCloud
        className={styles.cloud}
        minSize={20}
        maxSize={40}
        colorOptions={options}
        tags={variants.map(v => {
          return {
            value: renderTermNoDuplicates(v),
            term: v.term,
            dialect: v.dialect,
            count: v.votes,        
          }
        })}
        onClick={(tag: any) => {
          setVotedTerm(tag.value);
          mutate( {
            termId: termId,
            variant: {
              term: tag.term,
              dialect: tag.dialect
            }
          });
          setModalOpen(true);
        }}
      />
      <Modal animation={false} isOpen={modalOpen} toggle={() => setModalOpen(false)}>
        <ModalBody>
          Du har gitt én stemme til {votedTerm}.
        </ModalBody>
        <ModalFooter>
          <Button color="primary">
            Lukk
          </Button>
        </ModalFooter>
      </Modal>
    </>
  )
}

export default VariantCloud;