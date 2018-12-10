#!/usr/bin/env bash
git add ./actions/firebase.js ./google.*
git commit -am "updating heroku"
git push heroku master --force && git reset --hard HEAD~1