import { Email, LinkedIn } from '@mui/icons-material';
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  IconButton,
  Typography,
} from '@mui/material';
import { Person } from '../../types/person';
import style from './about-page.module.css';

const team: Person[] = [
  {
    key: 'isak',
    name: 'Isak Kyrre Lichtwarck Bjugn',
    title: 'Sivilingeniør',
    image: '/isak.jpg',
    email: 'isakbjugn@gmail.com',
    linkedin: 'isakbjugn',
    description:
      'Isak har mastergrad i Nanoteknologi og Entreprenørskap, utvekslet til Berkeley, og jobber i dag som frontend-utvikler hos SpareBank 1 utvikling i Oslo. Under studietiden sang han i TSS og Pirum, og synger nå i Uranienborg Vokalensemble.',
  },
  {
    key: 'simen',
    name: 'Simen Ringdahl',
    title: 'Sivilingeniør',
    image: '/simen.jpg',
    email: 'simen.ringdahl@gmail.com',
    linkedin: 'simen-ringdahl-01b237159',
    description:
      'Simen har mastergrad i Nanoteknologi, ledet konferansen INASCON i 2018, tilbrakte et år på Stanford University, og var studentrepresentant i NTNU-styret et år etter endt studium. Han jobber nå som dataanalytiker hos Aker Carbon Capture.',
  },
];

export const AboutPage = (): JSX.Element => {
  return (
    <div className={style.wrapper}>
      <div className={style.content}>
        <h1>Om oss</h1>
        <section>
          <p>
            Idéen om Fagord oppstod mens vi begge studerte nanoteknologi ved
            NTNU i Trondheim. Etter andreåret på studiet foregikk nærmest all
            undervisning på engelsk, og det ble stadig vanskeligere å ha faglige
            samtaler på norsk fordi vi rett og slett manglet ordene. Obskure
            ordbøker, premierte professorer og flittig fantasti kunne noen
            ganger gi oss nye ord, men disse var det vanskelig å systematisere
            og dele.
          </p>
        </section>
        <section>
          <p>
            Med Fagord ønsker vi å gjøre det enkelt å finne fagtermer på bokmål
            og nynorsk, lage et sted hvor en kan etterspørre nye oversettelser
            (gjennom å legge inn kun den engelske termen) og å få utløp for sine
            egne oversetterevner – gode som dårlige! I Fagord kan du fritt legge
            inn egne oversettelser, og det beste man kan gjøre dersom man er
            uenig er å legge inn bedre ord selv.
          </p>
        </section>
        <section>
          <p>
            Fagord er altså ikke en ordbok med noe fasitsvar, men stedet du kan
            finne, skape og samarbeide om norsk fagspråk. Vel bekomme!
          </p>
        </section>
      </div>
      <div className={style.grid}>
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
                <Email />
              </IconButton>
              <IconButton
                aria-label="visit LinkedIn profile"
                href={'https://www.linkedin.com/in/' + member.linkedin}
                sx={{ '&:hover': { color: '#2e9cca' } }}
              >
                <LinkedIn />
              </IconButton>
            </CardActions>
          </Card>
        ))}
      </div>
    </div>
  );
};
