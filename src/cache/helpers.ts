import axios from 'axios';
import characterCache from './index';
import { CHARACTER_ENDPOINT } from '../config';
import { rawCharacterData } from '../types/rank';

async function characterCacheHelper(characterName: string) {
  const cachedCopy = characterCache[characterName];
  if (!cachedCopy) {
    try {
      const res = await axios.get(`${CHARACTER_ENDPOINT}/${characterName}`);
      const data = res.data.CharacterData as rawCharacterData;
      characterCache[characterName] = data;
      return data;
    } catch {
      return undefined;
    }
  }
  if (cachedCopy && (Date.now() - (cachedCopy.GraphData[14].ImportTime * 1000)) > 43200000) {
    try {
      const res = await axios.get(`${CHARACTER_ENDPOINT}/${characterName}`);
      const data = res.data.CharacterData as rawCharacterData;
      characterCache[characterName] = data;
      return data;
    } catch {
      return undefined;
    }
  }
  return cachedCopy;
}

export default characterCacheHelper;
