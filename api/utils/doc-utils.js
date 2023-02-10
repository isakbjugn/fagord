const { google } = require('googleapis');
const docs = require('@googleapis/docs');
const { getFileIdsInFolder } = require('./drive-utils');

const scopes = ['https://www.googleapis.com/auth/documents.readonly'];
const jwt = new google.auth.JWT(
  process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  null,
  process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  scopes
);

const client = docs.docs({ version: 'v1', auth: jwt });

const getFirstOfTextType = (contentArray, styleType) => {
  for (const content of contentArray) {
    if (
      content.hasOwnProperty('paragraph') &&
      content.paragraph.paragraphStyle.namedStyleType === styleType &&
      !content.paragraph.elements.some((element) =>
        element.hasOwnProperty('inlineObjectElement')
      )
    ) {
      for (const element of content.paragraph.elements) {
        if (element.hasOwnProperty('textRun')) {
          return element.textRun.content;
        }
      }
    }
  }
  return '';
};

const getTitle = (content) => {
  return getFirstOfTextType(content, 'TITLE');
};

const getSubtitle = (content) => {
  return getFirstOfTextType(content, 'SUBTITLE');
};

const getImageUrl = (inlineObjects) => {
  for (const objectId in inlineObjects) {
    if (inlineObjects.hasOwnProperty(objectId)) {
      return inlineObjects[objectId].inlineObjectProperties.embeddedObject
        .imageProperties.contentUri;
    }
  }
  return '';
};

const getDocument = async (documentId) => {
  const document = await client.documents.get({
    documentId,
  });

  return {
    documentId,
    documentKey: document.data.title.toLowerCase().replace(/\s+/g, '-'),
    documentTitle: document.data.title,
    title: getTitle(document.data.body.content),
    subtitle: getSubtitle(document.data.body.content),
    imageUrl: getImageUrl(document.data.inlineObjects),
  };
};

const getAllArticles = async () => {
  const documentIds = await getFileIdsInFolder(process.env.ARTICLE_FOLDER_ID);
  let articles = [];
  for (const id of documentIds) {
    const article = await getDocument(id);
    articles.push(article);
  }
  return articles;
};

module.exports = {
  getDocument,
  getAllArticles,
};
