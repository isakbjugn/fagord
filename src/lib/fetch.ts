const baseApiUri = process.env.NODE_ENV === 'development' ? 'http://localhost:8080' : '';

export const fetchTerms = async () => {
  const res = await fetch(baseApiUri + '/api/termer');
  const json = await res.json();

  if (res.ok) {
    return json;
  }
  throw Error(res.statusText);
}