<template>
  <div class="view-profile container">
    <div class="card"
         v-if="profile">
      <h2 class="deep-purple-text center-align">
        {{profile.alias}}'s Wall
      </h2>
      <ul class="comments collection">
        <li v-for="(comment, index) in comments"
            :key="index">
          <div class="deep-purple-text alias"
               @click="navigateToProfile(comment.from)">
            {{comment.from}}
          </div>
          <div>
            {{comment.content}}
          </div>
          <div class="grey-text time">
            {{comment.time}}
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
  import moment from 'moment';

  export default {
    name: 'ViewProfile',
    data() {
      return {
        newComment: '',
        feedback: '',
        profile: null,
        user: null,
        comments: []
      }
    },
    watch: {
      '$route.params.id': {
        handler: function (userId) {
          this.comments = [];

          db.collection('users')
            .doc(userId)
            .get()
            .then(doc => {
              if (doc.exists) {
                this.profile = doc.data();
                this.profile.id = userId;
              } else {
                this.$router.push({ name: 'SignIn' });
              }
            })
            .catch(error => console.error(error));

          db.collection('comments')
            .where('to', '==', userId)
            .orderBy('time', 'asc')
            .onSnapshot(snapshot => snapshot.docChanges()
              .forEach(change => {
                if (change.type === 'added') {
                  const data = change.doc.data();
                  this.comments.unshift({
                    id: change.doc.id,
                    time: moment(data.time).format('lll'),
                    content: data.content,
                    from: data.from,
                    to: data.to
                  });
                } else if (change.type === 'removed') {
                  this.comments = this.comments.filter(comment => change.doc.id !== comment.id);
                }
              }));
        },
        immediate: true
      }
    },
    created() {
      db.collection('users')
        .doc(firebase.auth().currentUser.uid)
        .get()
        .then(doc => {
          this.user = doc.data();
          this.user.id = doc.id;
        })
        .catch(error => console.error(error));
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
      },
      navigateToProfile(alias) {
        db.collection('users')
          .where('alias', '==', alias)
          .get()
          .then(snapshot => {
            this.$router.push({
              name: 'ViewProfile', params: {
                id: snapshot.docs[0].id
              }
            })
          })
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

  .view-profile .alias {
    cursor: pointer;
  }

  .view-profile .delete {
    position: absolute;
    top: 5px;
    right: 5px;
    color: #ccc;
    font-size: 1.5em;
    cursor: pointer;
  }

  .view-profile time {
    font-size: .4em;
  }
</style>
