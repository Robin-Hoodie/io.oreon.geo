const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.checkAlias = functions.https.onCall((data, context) => {
  const ref = admin.firestore().collection('users')
    .where('alias', '==', data.alias);

  return ref.get()
    .then(snapshot => {
      return {
        unique: snapshot.size === 0
      }
    })
    .catch(() => {
      throw new functions.https.HttpsError('Failed to connect')
    });
});
