import { AddCircle, GitHub, Mail } from '@mui/icons-material';
import { Button, Card, CardActions, CardContent, List, ListItem, Typography } from '@mui/material';
import { Link } from '@remix-run/react';

import style from './contact-page.module.css';

const fagordIssuesUrl = 'https://github.com/isakbjugn/fagord/issues';
const contactEmailUrl = 'mailto:isakbjugn@gmail.com';
const linkedInUrl = 'https://www.linkedin.com/in/isakbjugn';

export const ContactPage = (): JSX.Element => (
  <main className={style.container}>
    <h1>Ta gjerne kontakt!</h1>
    <p>
      Fagord.no er under kontinuerlig utvikling, og vi tar mer enn gjerne imot tilbakemeldinger og bidrag, både til
      ordboken og til nettsiden! Her er noen måter du kan bidra:
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
          <List style={{ textAlign: 'start' }} >
            <ListItem>
              <Typography variant="body2" color="white">
                Legg ord inn i termbasen
              </Typography>
            </ListItem>
            <ListItem>
              <Typography variant="body2" color="white">
                Foreslå oversettelser til eksisterende termer
              </Typography>
            </ListItem>
            <ListItem>
              <Typography variant="body2" color="white">
                Legg inn definisjoner på termer
              </Typography>
            </ListItem>
          </List>
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
          <List style={{ textAlign: 'start' }} >
            <ListItem>
              <Typography variant="body2" color="white">
                Legg inn oppgaver til utvikling på GitHub
              </Typography>
            </ListItem>
            <ListItem>
              <Typography variant="body2" color="white">
                Opplever du feil? Dette kan også legges inn på GitHub
              </Typography>
            </ListItem>
            <ListItem>
              <Typography variant="body2" color="white">
                Vi tar også imot kodeforslag!
              </Typography>
            </ListItem>
          </List>
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
            Vi tar også gjerne imot direktehenvendelser, enten om du har andre tanker om Fagord eller bare vil slå av en
            prat:
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
        Til sist: Hvis du er fornøyd med Fagord eller har hatt stor nytte av ordboken, er det også mulig å støtte den
        videre utviklingen finansielt. Vi har enda ingen etablert måte å gjøre dette, så ta gjerne kontakt på{' '}
        <a className={style.link} href={contactEmailUrl}>
          isakbjugn@gmail.com
        </a>
        .
      </p>
    </section>
  </main>
);
