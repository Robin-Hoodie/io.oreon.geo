<template>
  <div class="sign-up container">
    <form @submit.prevent="signUp"
          class="card-panel"
          novalidate>
      <h2 class="center deep-purple-text">
        Sign Up
      </h2>
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
      <div class="field">
        <label for="alias">Alias</label>
        <input type="text"
               name="alias"
               id="alias"
               v-model="alias">
      </div>
      <p class="red-text center-align"
         v-if="feedback">
        {{feedback}}
      </p>
      <div class="field center">
        <button class="btn deep-purple"
                type="submit">
          Sign Up
        </button>
      </div>
    </form>
  </div>
</template>

<script>
  import slugify from 'slugify';
  import db from '@/firebase/init';
  import firebase from 'firebase';

  export default {
    name: 'SignUp',
    data() {
      return {
        email: '',
        password: '',
        alias: '',
        feedback: ''
      }
    },
    methods: {
      signUp() {
        if (this.alias && this.email && this.password) {
          const slug = slugify(this.alias, {
            replacement: '-',
            remove: /[$*_+~.()'"!\-:@]/g,
            lower: true
          });
          let ref = db.collection('users').doc(slug);
          ref.get()
            .then(doc => {
              if (doc.exists) {
                this.feedback = 'This alias already exists';
              } else {
                this.feedback = '';
                firebase.auth()
                  .createUserWithEmailAndPassword(this.email, this.password)
                  .then(credentials => ref.set({
                    alias: this.alias,
                    geolocation: null,
                    user_id: credentials.user.uid
                  }))
                  .then(() => this.$router.push({ name: 'GMap' }))
                  .catch(error => {
                    this.feedback = error.message;
                    console.error(error)
                  });
              }
            })
            .catch(error => console.error(error));

        } else {
          this.feedback = 'You must enter a value for all fields';
        }
      }
    }
  }
</script>

<style>

  .sign-up {
    max-width: 400px;
    margin-top: 60px;
  }

  .sign-up h2 {
    font-size: 2.4em;
  }

  .sign-up .field {
    margin-bottom: 16px;
  }
</style>
