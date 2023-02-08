const google = require('googleapis');
const docs = require('@googleapis/docs');
const { getFileIdsInFolder } = require('./drive-utils');

const scopes = ['https://www.googleapis.com/auth/documents.readonly'];
const jwt = new google.Auth.JWT(
  process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  null,
  process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  scopes
);

const client = docs.docs({ version: 'v1', auth: jwt });

const getDocument = async (documentId) => {
  const document = await client.documents.get({
    documentId,
  });
  return {
    title: document.data.title,
    content: document.data.body.content,
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
