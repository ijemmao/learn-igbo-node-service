#!/usr/bin/env bash
git add .
git commit -am "updating master"
git push origin master --force
git add ./actions/firebase.js ./google.* --force
git commit -am "updating heroku"
git push heroku master --force && git reset --hard HEAD~1