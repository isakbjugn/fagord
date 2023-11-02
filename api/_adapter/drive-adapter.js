const { JWT } = require('google-auth-library');
const { drive } = require('@googleapis/drive');

const scopes = ['https://www.googleapis.com/auth/drive.readonly'];
const serviceAccountAuth = new JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  scopes: scopes
});

const driveClient = drive({ version: 'v3', auth: serviceAccountAuth });

const exportFileAsHtml = async (fileId) => {
  return await driveClient.files.export({
    fileId,
    mimeType: 'text/html',
  });
};

const getFileIdsInFolder = async (folderId) => {
  const folder = await driveClient.files.list({
    q: `'${folderId}' in parents and trashed=false`,
  });
  return folder.data.files.map((file) => file.id);
};

module.exports = {
  getFileIdsInFolder,
  exportFileAsHtml,
};
