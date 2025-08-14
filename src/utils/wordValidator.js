// Dictionary of common English words
// This is a simplified list - in a real app, you'd use a more comprehensive dictionary
const DICTIONARY = new Set([
  'ACE', 'ACT', 'ADD', 'AGE', 'AIR', 'ALL', 'AND', 'ANY', 'ARM', 'ART', 'ASK',
  'BAD', 'BAG', 'BAR', 'BED', 'BET', 'BIG', 'BIT', 'BOX', 'BOY', 'BUG', 'BUY',
  'CAR', 'CAT', 'CUP', 'CUT', 'DAY', 'DID', 'DIE', 'DOG', 'DRY', 'DUE', 'EAR',
  'EAT', 'EGG', 'END', 'EYE', 'FAR', 'FEW', 'FIT', 'FLY', 'FOR', 'GET', 'GOT',
  'GUN', 'HAD', 'HAS', 'HAT', 'HER', 'HIM', 'HIS', 'HIT', 'HOT', 'HOW', 'ICE',
  'ITS', 'JOB', 'KEY', 'LAW', 'LAY', 'LED', 'LEG', 'LET', 'LIE', 'LOT', 'LOW',
  'MAN', 'MAP', 'MAY', 'MEN', 'MET', 'MIX', 'NET', 'NEW', 'NOT', 'NOW', 'OFF',
  'OIL', 'OLD', 'ONE', 'OUR', 'OUT', 'OWN', 'PAY', 'PEN', 'PUT', 'RAN', 'RUN',
  'SAT', 'SAW', 'SAY', 'SEA', 'SEE', 'SET', 'SHE', 'SIT', 'SIX', 'SKY', 'SON',
  'SUN', 'TEN', 'THE', 'TOO', 'TOP', 'TRY', 'TWO', 'USE', 'WAR', 'WAS', 'WAY',
  'WHO', 'WHY', 'WIN', 'YES', 'YET', 'YOU',
  
  // Add some longer words
  'ABOUT', 'ABOVE', 'ACTOR', 'AFTER', 'AGAIN', 'APPLE', 'BEACH', 'BOARD', 'BRAIN',
  'BRAVE', 'BREAD', 'BREAK', 'BUILD', 'CHART', 'CHILD', 'CLEAN', 'CLEAR', 'CLOCK',
  'CLOUD', 'COLOR', 'DANCE', 'DREAM', 'DRINK', 'DRIVE', 'EARTH', 'EIGHT', 'EVERY',
  'FIELD', 'FIGHT', 'FIRST', 'FLOOR', 'FOCUS', 'FORCE', 'FRESH', 'FRONT', 'FRUIT',
  'GLASS', 'GRADE', 'GRAND', 'GRASS', 'GREAT', 'GREEN', 'HAPPY', 'HEART', 'HEAVY',
  'HOUSE', 'HUMAN', 'LARGE', 'LEARN', 'LEVEL', 'LIGHT', 'LUCKY', 'MAGIC', 'MAJOR',
  'METAL', 'MONEY', 'MOUSE', 'MUSIC', 'NIGHT', 'NORTH', 'OCEAN', 'PAINT', 'PAPER',
  'PARTY', 'PEACE', 'PHONE', 'PLANE', 'PLANT', 'PLATE', 'POINT', 'POWER', 'PRICE',
  'PRIDE', 'PRIZE', 'QUEEN', 'QUIET', 'RADIO', 'RANGE', 'RATIO', 'REACH', 'READY',
  'RIGHT', 'RIVER', 'ROUND', 'ROYAL', 'SCALE', 'SCOPE', 'SCORE', 'SENSE', 'SERVE',
  'SHAPE', 'SHARE', 'SHARP', 'SHEEP', 'SHINE', 'SHIRT', 'SHOCK', 'SHORE', 'SHORT',
  'SIGHT', 'SKILL', 'SLEEP', 'SMART', 'SMILE', 'SMOKE', 'SOLID', 'SOUND', 'SOUTH',
  'SPACE', 'SPEED', 'SPORT', 'STAFF', 'STAGE', 'STAND', 'START', 'STATE', 'STEAM',
  'STEEL', 'STICK', 'STILL', 'STOCK', 'STONE', 'STORE', 'STORM', 'STORY', 'SWEET',
  'TABLE', 'TASTE', 'THEME', 'THERE', 'THICK', 'THING', 'THINK', 'THIRD', 'THREE',
  'THROW', 'TIGER', 'TIGHT', 'TITLE', 'TODAY', 'TOTAL', 'TOUCH', 'TOWER', 'TRACK',
  'TRADE', 'TRAIN', 'TREND', 'TRIAL', 'TRUST', 'TRUTH', 'UNCLE', 'UNDER', 'UNION',
  'UNITY', 'VALUE', 'VIDEO', 'VISIT', 'VOICE', 'WASTE', 'WATCH', 'WATER', 'WHERE',
  'WHICH', 'WHITE', 'WHOLE', 'WHOSE', 'WOMAN', 'WORLD', 'WORTH', 'WOULD', 'WRITE',
  'WRONG', 'YOUNG'
]);

/**
 * Validates if a word exists in our dictionary
 * @param {string} word - The word to validate
 * @returns {boolean} - True if the word is valid
 */
export const isValidWord = (word) => {
  // Minimum 3 letters
  if (!word || word.length < 3) {
    return false;
  }
  
  // Check against dictionary
  return DICTIONARY.has(word.toUpperCase());
};

/**
 * Calculate score for a word based on length
 * @param {string} word - The word to score
 * @returns {number} - The score for the word
 */
export const calculateWordScore = (word) => {
  if (!word) return 0;
  
  const length = word.length;
  
  // Scoring system based on word length
  if (length <= 3) return 1;
  if (length === 4) return 2;
  if (length === 5) return 4;
  if (length === 6) return 6;
  if (length === 7) return 9;
  if (length >= 8) return 12;
};

export default {
  isValidWord,
  calculateWordScore
};