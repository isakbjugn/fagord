import type { NavItem } from '~/types/nav-item';

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

  return baseLinks;
};

export const NavLinks = generateNavLinks();
