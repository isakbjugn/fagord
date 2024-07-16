import type { NavItem } from '~/types/nav-item';
import { featureToggles } from '../../utils/feature-toggles.client';

const generateNavLinks = (): NavItem[] => {
  const baseLinks = [
    {
      address: '/hjem',
      icon: 'fa-home',
      text: 'Hjem',
    },
    {
      address: '/termliste',
      icon: 'fa-book',
      text: 'Termliste',
    },
    {
      address: '/ny-term',
      icon: 'fa-lightbulb',
      text: 'Ny term',
    },
    {
      address: '/om-oss',
      icon: 'fa-info',
      text: 'Om oss',
    },
    {
      address: '/kontakt',
      icon: 'fa-address-card',
      text: 'Kontakt',
    },
  ];

  if (featureToggles('articles')) {
    baseLinks.splice(1, 0, {
      address: '/artikler',
      icon: 'fa-newspaper',
      text: 'Artikler',
    });
  }

  return baseLinks;
};

export const NavLinks = generateNavLinks();
