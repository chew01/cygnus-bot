import { parsedCharacterData } from '../../../../types/rank';
import { calculateEXPAverages } from '../../../../utils/helpers';
import characterCacheHelper from '../../../../cache/helpers';

async function getCharRank(characterName: string): Promise<parsedCharacterData | undefined> {
  const data = await characterCacheHelper(characterName);
  if (!data) return undefined;
  const {
    Name,
    Class,
    CharacterImageURL,
    Server,
    Level,
    EXP,
    EXPPercent,
    GlobalRanking,
    GraphData,
    ServerRank,
    LegionLevel,
    LegionRank,
    LegionPower,
  } = data;

  const { WeekAverage, FortnightAverage } = GraphData ? calculateEXPAverages(GraphData) : {
    WeekAverage: 0n,
    FortnightAverage: 0n,
  };
  const ImportTime = GraphData ? new Date(GraphData[14].ImportTime * 1000) : undefined;

  return {
    Name,
    Class,
    CharacterImageURL,
    Server,
    Level,
    EXP,
    EXPPercent,
    WeekAverage,
    FortnightAverage,
    GlobalRanking,
    ServerRank,
    LegionLevel,
    LegionRank,
    LegionPower: BigInt(LegionPower),
    ImportTime,
  };
}

export default getCharRank;
