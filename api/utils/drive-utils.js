const { google } = require('googleapis');

const scopes = ['https://www.googleapis.com/auth/drive.readonly'];
const jwt = new google.auth.JWT(
  process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  null,
  process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  scopes
);

const drive = google.drive({ version: 'v3', auth: jwt });

const exportFileAsHtml = async (fileId) => {
  return await drive.files.export({
    fileId,
    mimeType: 'text/html',
  });
};

const getFileIdsInFolder = async (folderId) => {
  const folder = await drive.files.list({
    q: `'${folderId}' in parents and trashed=false`,
  });
  return folder.data.files.map((file) => file.id);
};

module.exports = {
  getFileIdsInFolder,
  exportFileAsHtml,
};
