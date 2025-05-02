import { team } from '~/lib/team';
import style from '~/styles/om-oss.module.css';
import type { Person } from '~/types/person';

export default function OmOss() {
  return (
    <>
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
          <div style={{ backgroundColor: '#29648a' }} key={member.key}>
            <img src={member.image} alt={member.name} style={{ width: '100%' }} />
            <div style={{ padding: '16px' }}>
              <h4>{member.name}</h4>
              <p>{member.title}</p>
              <p>{member.description}</p>
              <span style={{ display: 'inline-flex', gap: '16px' }}>
                <a className={style.contactInfo} href={'mailto:' + member.email} style={{ textDecoration: 'none' }}>
                  <i aria-hidden className="fa-solid fa-envelope fa-xl" />
                </a>
                <a
                  className={style.contactInfo}
                  href={'https://www.linkedin.com/in/' + member.linkedin}
                  style={{ textDecoration: 'none' }}
                >
                  <i aria-hidden className="fa-brands fa-linkedin fa-xl" />
                </a>
              </span>
            </div>
          </div>
        ))}
      </section>
    </>
  );
}
