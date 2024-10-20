import style from '~/styles/footer.module.css';

const fagordGitHubUrl = 'https://github.com/isakbjugn/fagord';

export const Footer = () => (
  <footer className={'container-fluid ' + style.footer}>
    <div className="row justify-content-center">
      <div className="col-auto">
        <a href={fagordGitHubUrl} className={style.link}>
          <i aria-hidden className="fa-brands fa-github fa-2xl" />
        </a>
      </div>
    </div>
  </footer>
);
