import type { Term } from '~/types/term';
import { Link } from 'react-router';

export const TermDetaljer = ({ term }: { term: Term }) => {
  const isValidUrl = (reference: string) => {
    try {
      let url = new URL(reference);
      return url.protocol == 'http:' || url.protocol == 'https:';
    } catch {
      return false;
    }
  };

  return (
    <table>
      <tbody>
        {term.field && (
          <tr>
            <td>Fagfelt</td>
            <td>{term.field}</td>
          </tr>
        )}
        {term.subfield && (
          <tr>
            <td>Underområde</td>
            <td>{term.subfield}</td>
          </tr>
        )}
        {term.definition && (
          <tr>
            <td>Definisjon</td>
            <td>{term.definition}</td>
          </tr>
        )}
        {term.reference && (
          <tr>
            <td>Referanse</td>
            <td>
              {isValidUrl(term.reference) ? (
                <a href={term.reference} target="_blank" rel="noopener noreferrer">
                  {term.reference}
                </a>
              ) : (
                term.reference
              )}
            </td>
          </tr>
        )}
        <tr>
          <td colSpan={2}>
            <Link className="btn btn-outline-dark btn-sm" to={'/term/' + term.slug} role="button">
              Til termside
            </Link>
          </td>
        </tr>
      </tbody>
    </table>
  );
};
