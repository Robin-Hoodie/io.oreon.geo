<template>
  <div class="map">
    <div class="google-map"
         id="map"
         ref="map">
    </div>
  </div>
</template>

<script>
  import firebase from 'firebase';
  import db from '@/firebase/init';

  export default {
    name: 'GMap',
    data() {
      return {
        lat: 53,
        lng: -2
      }
    },
    mounted() {
      const user = firebase.auth().currentUser;
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          this.lat = position.coords.latitude;
          this.lng = position.coords.longitude;
          db.collection('users')
            .where('user_id', '==', user.uid)
            .get()
            .then(snapshot => snapshot.forEach(user => db.collection('users')
                .doc(user.id).update({
                  geolocation: {
                    lat: this.lat,
                    lng: this.lng
                  }
                })
              )
            )
            .then(this.renderMap)
            .catch(error => console.error(error));
        }, error => {
          console.error(error);
          this.renderMap();
        }, {
          maximumAge: 60000,
          timeout: 3000
        });
      } else {
        this.renderMap();
      }
    },
    methods: {
      renderMap() {
        const map = new google.maps.Map(this.$refs.map, {
          center: {
            lat: this.lat,
            lng: this.lng
          },
          zoom: 6,
          maxZoom: 15,
          minZoom: 3,
          streetViewControl: false
        });

        db.collection('users')
          .get()
          .then(snapshot => snapshot.forEach(user => {
            const data = user.data();
            if (data.geolocation) {
              const marker = new google.maps.Marker({
                position: {
                  ...data.geolocation
                },
                map
              });
              marker.addListener('click', () => this.$router.push({
                name: 'ViewProfile', params: {
                  id: user.id
                }
              }));
            }
          }))
      }
    }
  }
</script>

<style>
  .google-map {
    width: 100%;
    height: 100%;
    margin: 0 auto;
    background-color: #fff;
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
  }
</style>
