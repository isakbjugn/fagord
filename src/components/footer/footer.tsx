import { GitHub } from '@mui/icons-material';

import style from './footer.module.css';

const fagordGitHubUrl = 'https://github.com/isakbjugn/fagord';

export const Footer = () => (
  <footer className={'container-fluid ' + style.footer}>
    <div className="row justify-content-center">
      <div className="col-auto">
        <a href={fagordGitHubUrl}>
          <GitHub color="secondary" fontSize="large" />
        </a>
      </div>
    </div>
  </footer>
);
