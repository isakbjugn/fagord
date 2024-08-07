import type { UseMutateFunction } from '@tanstack/react-query';
import { TagCloud } from 'react-tagcloud';

import type { VoteForVariantArguments } from '../../../lib/fetch';
import type { Variant, VariantVote } from '~/types/term';
import style from './variant-cloud.module.css';

interface VariantCloudProps {
  termId: string;
  variants: Variant[];
  mutate: UseMutateFunction<Variant, unknown, VoteForVariantArguments, unknown>;
}

export const VariantCloud = ({ termId, variants, mutate }: VariantCloudProps) => {
  const options = {
    luminosity: 'light',
    hue: 'red',
  };

  const renderTermNoDuplicates = (variant: Variant): string => {
    if (variants.filter((v) => v.term === variant.term).length > 1) return variant.term + ' (' + variant.dialect + ')';
    return variant.term;
  };

  return (
    <TagCloud
      className={style.cloud}
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
      onClick={(tag: VariantVote) => {
        mutate({
          termId,
          variant: {
            term: tag.term,
            dialect: tag.dialect,
          },
        });
      }}
    />
  );
};
