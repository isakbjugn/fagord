const { JWT } = require('google-auth-library');
const { docs } = require('@googleapis/docs');
const { listFilesInFolder } = require('./drive-adapter');

const scopes = ['https://www.googleapis.com/auth/documents.readonly'];
const serviceAccountAuth = new JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  scopes: scopes
});

const docsClient = docs({ version: 'v1', auth: serviceAccountAuth });

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
  const document = await docsClient.documents.get({
    documentId,
  });

  return {
    title: getTitle(document.data.body.content),
    subtitle: getSubtitle(document.data.body.content),
    imageUrl: getImageUrl(document.data.inlineObjects),
  };
};

const getAllDocuments = async () => {
  const files = await listFilesInFolder(process.env.ARTICLE_FOLDER_ID);
  let documents = [];
  for (const file of files) {
    const document = await getDocument(file.id);
    document.id = file.id;
    document.key = deriveDocumentKey(file.name);
    document.name = file.name;
    document.createdTime = file.createdTime;
    document.modifiedTime = file.modifiedTime;
    documents.push(document);
  }
  return documents;
};

const deriveDocumentKey = (documentTitle) =>
  documentTitle.toLowerCase()
      .replace(/\s+/g, '-')
      .replace('ø', 'o')
      .replace('æ', 'a')
      .replace('å', 'a');

module.exports = {
  getDocument,
  getAllDocuments,
};
