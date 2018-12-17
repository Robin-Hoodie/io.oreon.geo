<template>
  <div class="navbar">
    <nav class="deep-purple darken-1">
      <div class="container">
        <router-link class="brand-logo left"
                     :to="{name: 'GMap'}">Oreon Geo
        </router-link>
        <ul class="right">
          <li v-if="!user">
            <router-link :to="{name: 'SignUp'}">
              Sign up
            </router-link>
          </li>
          <li v-if="!user">
            <router-link :to="{name: 'SignIn'}">
              Sign in
            </router-link>
          </li>
          <li v-if="user">
            <router-link :to="{name: 'ViewProfile', params: { id: user.id}}">{{user.alias}}</router-link>
          </li>
          <li v-if="user">
            <a @click="logout">
              Logout
            </a>
          </li>
        </ul>
      </div>
    </nav>
  </div>
</template>

<script>
  import firebase from 'firebase';
  import db from '@/firebase/init';

  export default {
    name: 'Navbar',
    data() {
      return {
        user: null
      }
    },
    methods: {
      logout() {
        firebase.auth()
          .signOut()
          .then(() => this.$router.push({ name: 'SignIn' }))
          .catch(error => console.error(error));
      }
    },
    created() {
      firebase.auth()
        .onAuthStateChanged(user => {
          if (user) {
            db.collection('users').doc(user.uid).get().then(doc => {
              this.user = doc.data();
              this.user.id = user.uid;
            });
          } else {
            this.user = null;
          }
        });
    }
  }
</script>

<style>

</style>
