<template>
  <div class="sign-in container">
    <form class="card-panel"
          @submit.prevent="signIn">
      <h2 class="center-align deep-purple-text">Sign In</h2>
      <div class="field">
        <label for="email">Email</label>
        <input type="email"
               name="email"
               id="email"
               v-model="email">
      </div>
      <div class="field">
        <label for="password">Password</label>
        <input type="password"
               name="password"
               id="password"
               v-model="password">
      </div>
      <p v-if="this.feedback"
         class="red-text center-align">
        {{this.feedback}}
      </p>
      <div class="field center-align">
        <button class="btn deep-purple"
                type="submit">Sign In
        </button>
      </div>
    </form>
    <div class="center-align google-btn">
      <button class="btn white"
              @click="signInWithGoogle()">
        <img width="20px"
             class="google-btn__logo"
             alt="Google Logo"
             :src="googleLogo"/>
        Sign in with Google
      </button>
    </div>
  </div>
</template>

<script>
  import firebase from 'firebase';
  import db from '@/firebase/init';
  import googleLogo from '@/assets/google_logo.png';

  export default {
    name: 'SignIn',
    data() {
      return {
        email: '',
        password: '',
        feedback: '',
        googleLogo
      }
    },
    methods: {
      signIn() {
        if (this.email && this.password) {
          this.feedback = '';
          firebase
            .auth()
            .signInWithEmailAndPassword(this.email, this.password)
            .then(() => this.$router.push({ name: 'GMap' }))
            .catch(error => {
              this.feedback = error.message;
              console.error(error);
            });
        } else {
          this.feedback = 'Please provide an email and password';
        }
      },
      signInWithGoogle() {
        const provider = new firebase.auth.GoogleAuthProvider();
        this.signInWithPopup(provider);
      },
      signInWithPopup(provider) {
        firebase.auth().signInWithPopup(provider)
          .then(credentials => {
            const ref = db.collection('users').doc(credentials.user.uid);
            ref.get()
              .then(doc => {
                if (!doc.exists) {
                  return ref.set({
                    geolocation: null,
                    alias: credentials.user.displayName
                  });
                }
              })
              .then(() => this.$router.push({ name: 'GMap' }))
              .catch(error => console.error(error));
          })
          .catch(error => console.error(error))
      }
    }
  }
</script>

<style>
  .sign-in {
    max-width: 400px;
    margin-top: 60px;
  }

  .sign-in h2 {
    font-size: 2.4em;
  }

  .sign-in .field {
    margin-bottom: 16px;
  }

  .sign-in .google-btn button {
    color: black;
    font-weight: bold;
    margin-bottom: 20px;
  }

  .sign-in .google-btn .google-btn__logo {
    position: relative;
    right: 5px;
    top: 5px;
  }
</style>
