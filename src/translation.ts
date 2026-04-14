const MYMEMORY_URL = 'https://api.mymemory.translated.net/get';

export async function translateText(
  text: string,
  sourceLangCode: string,
  targetLangCode: string
): Promise<string> {
  if (!text || !sourceLangCode || !targetLangCode || sourceLangCode === targetLangCode) {
    return text;
  }

  try {
    const langPair = `${sourceLangCode}|${targetLangCode}`;
    const url = `${MYMEMORY_URL}?q=${encodeURIComponent(text)}&langpair=${encodeURIComponent(langPair)}`;
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      const trans = data.responseData?.translatedText;
      if (trans && trans.length > 0 && trans !== text) {
        return trans;
      }
    }
  } catch (e) {
    console.error(`Translation error ${sourceLangCode}→${targetLangCode}:`, e);
  }

  return text;
}

export async function translateViaEnglish(
  text: string,
  sourceLangCode: string,
  targetLangCode: string
): Promise<string> {
  if (sourceLangCode === 'en') {
    return translateText(text, 'en', targetLangCode);
  }
  if (targetLangCode === 'en') {
    return translateText(text, sourceLangCode, 'en');
  }
  
  const step1 = await translateText(text, sourceLangCode, 'en');
  if (step1 === text) {
    return text;
  }
  
  const step2 = await translateText(step1, 'en', targetLangCode);
  return step2;
}

export async function translatePhrases(
  texts: string[],
  sourceLangCode: string,
  targetLangCode: string
): Promise<string[]> {
  if (!targetLangCode || !sourceLangCode || targetLangCode === sourceLangCode) {
    return texts;
  }

  const results: string[] = [];
  
  for (const text of texts) {
    const direct = await translateText(text, sourceLangCode, targetLangCode);
    if (direct !== text) {
      results.push(direct);
    } else {
      const via = await translateViaEnglish(text, sourceLangCode, targetLangCode);
      results.push(via);
    }
  }
  
  return results;
}

export async function fetchPinyin(text: string): Promise<string> {
  if (!text) return '';
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=zh-CN&tl=en&dt=rm&q=${encodeURIComponent(text)}`;
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      return data[0]?.[1]?.[3] || data[0]?.[1]?.[2] || ''; 
    }
  } catch {}
  return '';
}

export async function translateGamePhrases(
  englishPhrases: string[],
  fromLangCode: string,
  toLangCode: string
): Promise<{
  displayPhrases: string[];
  correctTranslations: string[];
  allTranslations: string[];
  pinyins?: string[];
}> {
  console.log(`Translating: ${englishPhrases.length} phrases, ${fromLangCode} → ${toLangCode}`);
  
  const displayPhrases = await translatePhrases(englishPhrases, 'en', fromLangCode);
  console.log('Display phrases:', displayPhrases.slice(0, 3));
  
  const correctTranslations: string[] = [];
  for (const phrase of displayPhrases) {
    const translated = await translateViaEnglish(phrase, fromLangCode, toLangCode);
    correctTranslations.push(translated);
  }
  console.log('Correct translations:', correctTranslations.slice(0, 3));
  
  const distractorPhrases = englishPhrases.length > 5 
    ? englishPhrases.slice(3, Math.min(10, englishPhrases.length))
    : englishPhrases;
  const distractorTranslations = await translatePhrases(distractorPhrases, 'en', toLangCode);

  let pinyins: string[] = [];
  if (toLangCode === 'zh-CN') {
    pinyins = await Promise.all(correctTranslations.map(fetchPinyin));
  }

  return {
    displayPhrases,
    correctTranslations,
    allTranslations: distractorTranslations,
    pinyins,
  };
}
