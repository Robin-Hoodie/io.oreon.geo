<template>
  <div class="view-profile container">
    <div class="card"
         v-if="profile">
      <h2 class="deep-purple-text center-align">
        {{profile.alias}}'s Wall
      </h2>
      <ul class="comments collection">
        <li v-for="comment in comments"
            :key="comment.time">
          <div class="deep-purple-text">
            {{comment.from}}
          </div>
          <div class="grey-text darken-2">
            {{comment.content}}
          </div>
          <i class="material-icons delete"
             v-if="user && comment.from === user.alias"
             @click="removeComment(comment.id)">delete</i>
        </li>
      </ul>
      <form @submit.prevent="addComment">
        <div class="field">
          <label for="comment">Add a comment</label>
          <input type="text"
                 id="comment"
                 name="comment"
                 v-model="newComment">
          <p v-if="feedback"
             class="red-text center-align">{{feedback}}</p>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
  import db from '@/firebase/init';
  import firebase from 'firebase';

  export default {
    name: 'ViewProfile',
    data() {
      return {
        profile: null,
        newComment: '',
        feedback: '',
        user: null,
        comments: []
      }
    },
    created() {
      const ref = db
        .collection('users');
      ref.where('user_id', '==', firebase.auth().currentUser.uid)
        .get()
        .then(snapshot => snapshot.forEach(user => {
          this.user = user.data();
          this.user.id = user.id;
        }))
        .catch(error => console.error(error));

      ref.doc(this.$route.params.id)
        .get()
        .then(doc => {
          if (doc.exists) {
            this.profile = doc.data();
          } else {
            this.$router.push({ name: 'SignIn' });
          }
        })
        .catch(error => console.error(error));

      db.collection('comments')
        .where('to', '==', this.$route.params.id)
        .onSnapshot(snapshot => snapshot.docChanges()
          .forEach(change => {
            if (change.type === 'added') {
              this.comments.unshift({
                id: change.doc.id,
                ...change.doc.data()
              });
            } else if (change.type === 'removed') {
              this.comments = this.comments.filter(comment => change.doc.data().time !== comment.time);
            }
          }));
    },
    methods: {
      addComment() {
        if (this.newComment) {
          db.collection('comments')
            .add({
              to: this.$route.params.id,
              from: this.user.alias,
              content: this.newComment,
              time: Date.now()
            })
            .then(() => this.newComment = '')
            .catch(error => console.error(error));
        } else {
          this.feedback = 'You need to enter some text to comment';
        }
      },
      removeComment(id) {
        db.collection('comments')
          .doc(id)
          .delete()
          .catch(error => console.error(error));
      }
    }
  }
</script>

<style>
  .view-profile .card {
    padding: 20px;
    margin-top: 60px;
  }

  .view-profile h2 {
    font-size: 2em;
    margin-top: 0;
  }

  .view-profile li {
    padding: 10px;
    border-bottom: 1px solid #eee;
    position: relative;
  }

  .view-profile .delete {
    position: absolute;
    top: 5px;
    right: 5px;
    color: #ccc;
    font-size: 1.5em;
    cursor: pointer;
  }
</style>
