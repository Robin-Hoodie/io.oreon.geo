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
  </div>
</template>

<script>
  import firebase from 'firebase';

  export default {
    name: 'SignIn',
    data() {
      return {
        email: '',
        password: '',
        feedback: ''
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
</style>
