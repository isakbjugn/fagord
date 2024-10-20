import style from '~/styles/om-oss.module.css';
import { team } from '~/lib/team';
import type { Person } from '~/types/person';
import { Card, CardActions, CardContent, CardMedia, IconButton, Typography } from '@mui/material';

export default function OmOss() {
  return (
    <main className={style.wrapper}>
      <article className={style.content}>
        <h1>Om oss</h1>
        <section>
          <p>
            Idéen om Fagord oppstod mens vi begge studerte nanoteknologi ved NTNU i Trondheim. Etter andreåret på
            studiet foregikk nærmest all undervisning på engelsk, og det ble stadig vanskeligere å ha faglige samtaler
            på norsk fordi vi rett og slett manglet ordene. Obskure ordbøker, premierte professorer og flittig fantasti
            kunne noen ganger gi oss nye ord, men disse var det vanskelig å systematisere og dele.
          </p>
        </section>
        <section>
          <p>
            Med Fagord ønsker vi å gjøre det enkelt å finne fagtermer på bokmål og nynorsk, lage et sted hvor en kan
            etterspørre nye oversettelser (gjennom å legge inn kun den engelske termen) og å få utløp for sine egne
            oversetterevner – gode som dårlige! I Fagord kan du fritt legge inn egne oversettelser, og det beste man kan
            gjøre dersom man er uenig er å legge inn bedre ord selv.
          </p>
        </section>
        <section>
          <p>
            Fagord er altså ikke en ordbok med noe fasitsvar, men stedet du kan finne, skape og samarbeide om norsk
            fagspråk. Vel bekomme!
          </p>
        </section>
      </article>
      <section className={style.grid}>
        {team.map((member: Person) => (
          <Card sx={{ backgroundColor: '#29648a' }} key={member.key}>
            <CardMedia component="img" image={member.image} />
            <CardContent>
              <Typography gutterBottom variant="h5" color="white">
                {member.name}
              </Typography>
              <Typography variant="subtitle1" color="white">
                {member.title}
              </Typography>
              <Typography variant="body2" color="white">
                {member.description}
              </Typography>
            </CardContent>
            <CardActions disableSpacing>
              <IconButton
                aria-label="write email"
                href={'mailto:' + member.email}
                sx={{ '&:hover': { color: '#2e9cca' } }}
              >
                <i aria-hidden className="fa-solid fa-envelope fa-md" />
              </IconButton>
              <IconButton
                aria-label="visit LinkedIn profile"
                href={'https://www.linkedin.com/in/' + member.linkedin}
                sx={{ '&:hover': { color: '#2e9cca' } }}
              >
                <i aria-hidden className="fa-brands fa-linkedin fa-md" />
              </IconButton>
            </CardActions>
          </Card>
        ))}
      </section>
    </main>
  );
}
