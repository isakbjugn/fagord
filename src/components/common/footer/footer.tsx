import styles from './footer.module.css';

const fagordGitHubUrl = 'https://github.com/isakbjugn/fagord';

const Footer = (): JSX.Element => (
  <footer className={'container-fluid ' + styles.footer}>
    <div className="row justify-content-center">
      <div className="col-auto">
        <a href={fagordGitHubUrl}>
          <span className="fa-brands fa-github fa-inverse fa-2x"></span>
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;
