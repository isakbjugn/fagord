import styles from './footer.module.css';

const Footer = (): JSX.Element => {
  const fagordGitHubUrl = 'https://github.com/isakbjugn/fagord';
  return (
    <div className={'container-fluid ' + styles.footer}>
      <div className="row justify-content-center">
        <div className="col-auto">
          <a href={fagordGitHubUrl}>
            <span className="fa fa-github fa-inverse fa-2x"></span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Footer;
