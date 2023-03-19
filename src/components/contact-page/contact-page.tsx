import { Link } from 'react-router-dom';
import { Button, Card, CardBody, CardText, CardTitle } from 'reactstrap';
import style from './contact-page.module.css';

const fagordIssuesUrl = 'https://github.com/isakbjugn/fagord/issues';
const contactEmailUrl = 'mailto:isakbjugn@gmail.com';
const linkedInUrl = 'https://www.linkedin.com/in/isakbjugn';

export const ContactPage = (): JSX.Element => (
  <main className={style.wrapper}>
    <h1>Ta gjerne kontakt!</h1>
    <div className={style.container}>
      <section className={style.text}>
        <p>
          Fagord.no er under kontinuerlig utvikling, og vi tar mer enn gjerne
          imot tilbakemeldinger og bidrag, både til ordboken og til nettsiden!
          Her er noen måter du kan bidra:
        </p>
        <ul>
          <li>Legg ord inn i termbasen</li>
          <li>Foreslå oversettelser til eksisterende termer</li>
          <li>Legg inn definisjoner på termer</li>
          <li>
            Legg inn oppgaver til utvikling på{' '}
            <a className={style.link} href={fagordIssuesUrl}>
              GitHub
            </a>
          </li>
          <li>
            Opplever du feil? Dette kan også legges inn på{' '}
            <a className={style.link} href={fagordIssuesUrl}>
              GitHub
            </a>
          </li>
          <li>Vi tar også imot kodeforslag!</li>
          <li>
            Til sist: Er du fornøyd med Fagord, og ønsker å bidra finansielt?
            Kontakt oss på{' '}
            <a className={style.link} href={contactEmailUrl}>
              isakbjugn@gmail.com
            </a>
          </li>
        </ul>
      </section>
      <aside className={style.cards}>
        <Card className={style.card + ' ' + style['link-card']}>
          <CardBody>
            <CardTitle tag="h5">Kontaktinformasjon</CardTitle>
            <CardText>
              E-post:{' '}
              <a className={style.link} href={contactEmailUrl}>
                isakbjugn@gmail.com
              </a>
            </CardText>
            <CardText>
              LinkedIn:{' '}
              <a className={style.link} href={linkedInUrl}>
                in/isakbjugn
              </a>
            </CardText>
          </CardBody>
        </Card>
        <Card className={style.card + ' ' + style['term-card']}>
          <CardBody>
            <CardTitle tag="h5">Legg inn ny term</CardTitle>
            <CardText>
              Har du forslag til nye termer, eller kanskje en term du ønsker
              oversatt?
            </CardText>
            <CardText>
              <Link to="/ny-term">
                <Button color="light" outline>
                  Legg inn her!
                </Button>
              </Link>
            </CardText>
          </CardBody>
        </Card>
      </aside>
    </div>
  </main>
);
