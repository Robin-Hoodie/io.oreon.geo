# Oreon Geo

Pet project that lets users view other user's last known location and gives them the opportunity to comment on each other's walls.
The comments will be updated in real-time as they come in.

This project was written in Vue and uses Firestore as its real-time database as well as its authentication providers.   
Drawing the map and marking the users' last known location is handled via the Google Maps API  
Lastly, Materialize is used as the CSS framework.

## Live version

A live version of the project can be found over at `https://geo.oreon.io`

Start by signing up, after that you will be redirected to the world map where you will see markers of other users' locations.  
Clicking on one of these markers takes you to their profile page where you will be able to comment on their wall

## Local Setup

- Clone project
- Install dependencies `npm install` or `yarn install`
- Set up a [firestore database](https://firebase.google.com/docs/firestore/quickstart)
- Set up a `src/firebase/init.js` file with the following contents:
```
import firebase from 'firebase'

const config = {
  //You can find this config in your firebase console under 'General Settings' -- 'Add Firebase to your Webapp'
};

const firebaseApp = firebase.initializeApp(config);
firebaseApp.firestore().settings({
  timestampsInSnapshots: true
});
export default firebaseApp.firestore();
```
- Serve with hot reload at `localhost:8080` with `npm run dev` or `yarn dev`
- Build for production with `npm run build` or `yarn build`


