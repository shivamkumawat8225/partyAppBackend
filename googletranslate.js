const translate = require('./google-cloud-config');
const detectLanguage = async (text) => {
  try {
    const [detection] = await translate.detect(text);
    return detection.language;
  } catch (error) {
    console.error('Error detecting language:', error);
    throw error;
  }
};
const translateText = async (text, sourceLang, targetLang) => {
  try {
    // const sourceLang = await detectLanguage(text);
    const [translation] = await translate.translate(text, { from: sourceLang, to: targetLang });
    return translation;
  } catch (error) {
    console.error('Error translating text:', error);
    throw error;
  }
};

module.exports = translateText;