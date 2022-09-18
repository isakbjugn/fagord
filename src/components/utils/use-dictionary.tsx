import { fetchTerms } from "../../lib/fetch"
import { useQuery } from 'react-query'

const useDictionary = () => useQuery('dictionary', fetchTerms);

export default useDictionary;