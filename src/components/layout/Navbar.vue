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
            <router-link :to="{name: 'ViewProfile', params: { id: user.uid}}">{{user.email}}</router-link>
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
        .onAuthStateChanged(user => this.user = user);
    }
  }
</script>

<style>

</style>
