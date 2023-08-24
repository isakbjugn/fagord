import { OrdbokeneResponse } from "../types/ordbokene";

const ordbokeneApiUrl = 'https://ord.uib.no/api/';

export const fetchSuggestions = async (term: string, dialect: 'nb' | 'nn'): Promise<OrdbokeneResponse> => {
    const dict = dialect === 'nb' ? 'bm' : 'nn';
    const res = await fetch(ordbokeneApiUrl + 'suggest?q=' + term + '&dict=' + dict + '&include=ei&dform=int');

    if (!res.ok) {
        throw Error(res.status.toString() + ' ' + res.statusText);
    }
    return await res.json();
}