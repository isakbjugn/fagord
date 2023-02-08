const { google } = require('googleapis');

const scopes = ['https://www.googleapis.com/auth/drive.readonly'];

const jwt = new google.auth.JWT(
  process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  null,
  process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  scopes
);

const drive = google.drive({ version: 'v3', auth: jwt });

const getFolder = async (folderId) => {
  return await drive.files.get({ fileId: folderId });
};

const getFolderContent = async (folderId) => {
  const folder = await drive.files.list({
    q: `'${folderId}' in parents and trashed=false`,
  });
  return folder.data.files;
};

const getFileIdsInFolder = async (folderId) => {
  const files = await getFolderContent(folderId);
  return files.map((file) => file.id);
};

module.exports = {
  getFolder,
  getFolderContent,
  getFileIdsInFolder,
};
