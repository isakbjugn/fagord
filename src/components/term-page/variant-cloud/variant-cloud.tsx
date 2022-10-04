import { useMutation, useQueryClient } from "react-query"
import { TagCloud } from "react-tagcloud"
import { voteForVariant } from "../../../lib/fetch"
import { Variant } from "../../../types/term"
import styles from "./variant-cloud.module.css";

interface VariantCloudProps {
  termId: string;
  variants: Variant[];
}

const VariantCloud = ({ termId, variants }: VariantCloudProps) => {

  const queryClient = useQueryClient();

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
    <TagCloud
      className={styles.cloud}
      minSize={20}
      maxSize={40}
      colorOptions={options}
      tags={variants.map(v => {
        return { value: renderTermNoDuplicates(v), count: v.votes, dialect: v.dialect }
      })}
      onClick={(tag: any) => mutate(
        {
          termId: termId,
          variant: {
            term: tag.value,
            dialect: tag.dialect
          }
        }
      )}
    />
  )
}

export default VariantCloud;