import { UseMutateFunction } from 'react-query';
import { TagCloud } from 'react-tagcloud';
import { VoteForVariantArguments } from '../../../lib/fetch';
import { Variant } from '../../../types/term';
import styles from './variant-cloud.module.css';

interface VariantCloudProps {
  termId: string;
  variants: Variant[];
  mutate: UseMutateFunction<any, unknown, VoteForVariantArguments, unknown>;
}

const VariantCloud = ({ termId, variants, mutate }: VariantCloudProps) => {
  const options = {
    luminosity: 'light',
    hue: 'red',
  };

  const renderTermNoDuplicates = (variant: Variant) => {
    if (variants.filter((v) => v.term === variant.term).length > 1)
      return variant.term + ' (' + variant.dialect + ')';
    return variant.term;
  };

  return (
    <TagCloud
      className={styles.cloud}
      minSize={20}
      maxSize={40}
      colorOptions={options}
      tags={variants.map((v) => {
        return {
          value: renderTermNoDuplicates(v),
          term: v.term,
          dialect: v.dialect,
          count: v.votes,
        };
      })}
      onClick={(tag: any) =>
        mutate({
          termId: termId,
          variant: {
            term: tag.term,
            dialect: tag.dialect,
          },
        })
      }
    />
  );
};

export default VariantCloud;
