import Vue from 'vue'
import Router from 'vue-router'
import GMap from '@/components/home/GMap'
import SignUp from '@/components/auth/SignUp'
import SignIn from '@/components/auth/SignIn'
import firebase from 'firebase'
import ViewProfile from '@/components/profile/ViewProfile';

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/',
      name: GMap.name,
      component: GMap,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/signUp',
      name: SignUp.name,
      component: SignUp
    },
    {
      path: '/signIn',
      name: SignIn.name,
      component: SignIn
    },
    {
      path: '/profile/:id',
      name: ViewProfile.name,
      component: ViewProfile,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '**',
      redirect: '/'
    }
  ],
  mode: 'history'
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(rec => rec.meta.requiresAuth)) {
    if (firebase.auth().currentUser !== null) {
      next();
    } else {
      next({ name: SignIn.name });
    }
  } else {
    next();
  }
});

export default router;
