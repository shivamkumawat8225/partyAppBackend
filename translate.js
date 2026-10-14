const AWS = require('./aws-config');
const translate = new AWS.Translate();

const translateText = async (text, sourceLang, targetLang) => {
  const params = {
    Text: text,
    SourceLanguageCode: sourceLang,
    TargetLanguageCode: targetLang
  };

  try {
    const data = await translate.translateText(params).promise();
    return data.TranslatedText;
  } catch (error) {
    console.error('Error translating text:', error);
    throw error;
  }
};

module.exports = translateText;