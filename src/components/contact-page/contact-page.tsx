import { Link } from 'react-router-dom';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from '@mui/material';
import style from './contact-page.module.css';
import { AddCircle, Mail, GitHub } from '@mui/icons-material';

const fagordIssuesUrl = 'https://github.com/isakbjugn/fagord/issues';
const contactEmailUrl = 'mailto:isakbjugn@gmail.com';
const linkedInUrl = 'https://www.linkedin.com/in/isakbjugn';

export const ContactPage = (): JSX.Element => (
  <main className={style.container}>
    <h1>Ta gjerne kontakt!</h1>
    <p>
      Fagord.no er under kontinuerlig utvikling, og vi tar mer enn gjerne imot
      tilbakemeldinger og bidrag, både til ordboken og til nettsiden! Her er
      noen måter du kan bidra:
    </p>
    <section className={style.categories}>
      <Card className={style.card}>
        <CardContent>
          <div className={style['card-header']}>
            <AddCircle color="primary" fontSize="large" />
          </div>
          <Typography gutterBottom variant="h5" color="white">
            Bidra til ordboken
          </Typography>
          <ul style={{ textAlign: 'start' }}>
            <Typography variant="body2" color="white">
              <li>Legg ord inn i termbasen</li>
              <li>Foreslå oversettelser til eksisterende termer</li>
              <li>Legg inn definisjoner på termer</li>
            </Typography>
          </ul>
        </CardContent>
        <CardActions style={{ justifyContent: 'center' }}>
          <Link to="/ny-term" style={{ textDecoration: 'none' }}>
            <Button variant="contained">Legg til ny term</Button>
          </Link>
        </CardActions>
      </Card>
      <Card className={style.card}>
        <CardContent>
          <div className={style['card-header']}>
            <GitHub color="primary" fontSize="large" />
          </div>
          <Typography gutterBottom variant="h5" color="white">
            Vær med og utvikle
          </Typography>
          <ul style={{ textAlign: 'start' }}>
            <Typography variant="body2" color="white">
              <li>Legg inn oppgaver til utvikling på GitHub</li>
              <li>Opplever du feil? Dette kan også legges inn på GitHub</li>
              <li>Vi tar også imot kodeforslag!</li>
            </Typography>
          </ul>
        </CardContent>
        <CardActions style={{ justifyContent: 'center' }}>
          <a href={fagordIssuesUrl} style={{ textDecoration: 'none' }}>
            <Button variant="contained">Åpne GitHub</Button>
          </a>
        </CardActions>
      </Card>
      <Card className={style.card}>
        <CardContent>
          <div className={style['card-header']}>
            <Mail color="primary" fontSize="large" />
          </div>
          <Typography gutterBottom variant="h5" color="white">
            Kom i kontakt med oss
          </Typography>
          <Typography variant="body2" color="white" sx={{ mb: 2 }}>
            Vi tar også gjerne imot direktehenvendelser, enten om du har andre
            tanker om Fagord eller bare vil slå av en prat:
          </Typography>
          <Typography variant="body2" color="white">
            E-post:{' '}
            <a className={style.link} href={contactEmailUrl}>
              isakbjugn@gmail.com
            </a>
          </Typography>
          <Typography variant="body2" color="white">
            LinkedIn:{' '}
            <a className={style.link} href={linkedInUrl}>
              in/isakbjugn
            </a>
          </Typography>
        </CardContent>
      </Card>
    </section>
    <section>
      <p>
        Til sist: Hvis du er fornøyd med Fagord eller har hatt stor nytte av
        ordboken, er det også mulig å støtte den videre utviklingen finansielt.
        Vi har enda ingen etablert måte å gjøre dette, så ta gjerne kontakt på{' '}
        <a className={style.link} href={contactEmailUrl}>
          isakbjugn@gmail.com
        </a>
        .
      </p>
    </section>
  </main>
);
