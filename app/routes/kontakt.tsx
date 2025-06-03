import { Link } from 'react-router';

import { contactEmailUrl, fagordIssuesUrl, linkedInUrl } from '~/lib/constants';
import style from '~/styles/kontakt.module.css';

export default function Kontakt() {
  return (
    <div className={style.container}>
      <h1>Ta gjerne kontakt!</h1>
      <p>
        Fagord.no er under kontinuerlig utvikling, og vi tar mer enn gjerne imot tilbakemeldinger og bidrag, både til
        ordboken og til nettsiden! Her er noen måter du kan bidra:
      </p>
      <section className={style.categories}>
        <div className={style.card}>
          <div className={style.cardHeader}>
            <i aria-hidden className="fa-solid fa-circle-plus fa-2xl" />
          </div>
          <h4>Bidra til ordboken</h4>
          <ul style={{ textAlign: 'start' }}>
            <li>Legg ord inn i termbasen</li>
            <li>Foreslå oversettelser til eksisterende termer</li>
            <li>Legg inn definisjoner på termer</li>
          </ul>
          <Link className="btn btn-fagord-blue btn-lg" to="/ny-term" style={{ textDecoration: 'none' }}>
            Legg til ny term
          </Link>
        </div>
        <div className={style.card}>
          <div className={style.cardHeader}>
            <i aria-hidden className="fa-brands fa-github fa-2xl" />
          </div>
          <h4>Vær med og utvikle</h4>
          <ul style={{ textAlign: 'start' }}>
            <li>Legg inn oppgaver til utvikling på GitHub</li>
            <li>Opplever du feil? Dette kan også legges inn på GitHub</li>
            <li>Vi tar også imot kodeforslag!</li>
          </ul>
          <a className="btn btn-fagord-blue btn-lg" href={fagordIssuesUrl} style={{ textDecoration: 'none' }}>
            Åpne GitHub
          </a>
        </div>
        <div className={style.card}>
          <div className={style.cardHeader}>
            <i aria-hidden className="fa-solid fa-envelope fa-2xl" />
          </div>
          <h4>Kom i kontakt med oss</h4>
          <p className={style.smallParagraph}>
            Vi tar også gjerne imot direktehenvendelser, enten om du har andre tanker om Fagord eller bare vil slå av en
            prat:
          </p>
          <p className={style.smallParagraph}>
            E-post:{' '}
            <a className={style.link} href={contactEmailUrl}>
              isakbjugn@gmail.com
            </a>
            <br />
            LinkedIn:{' '}
            <a className={style.link} href={linkedInUrl}>
              in/isakbjugn
            </a>
          </p>
        </div>
      </section>
      <section>
        <p>
          Til sist: Hvis du er fornøyd med Fagord eller har hatt stor nytte av ordboken, er det også mulig å støtte den
          videre utviklingen finansielt. Vi har enda ingen etablert måte å gjøre dette, så ta gjerne kontakt på{' '}
          <a className={style.link} href={contactEmailUrl}>
            isakbjugn@gmail.com
          </a>
          .
        </p>
      </section>
    </div>
  );
}
