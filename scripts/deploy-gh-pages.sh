#!/bin/bash
# Sync gh-pages with this repo. Relies upon a separate cloned gh repo, checked out to gh-pages branch.
# Relies on user being on master in main repo, and all checked in, etc.

# Update gh-pages repo, just in case others have done updates.
cd ../react-experiments-gh-pages
git pull --ff

# Back to project folder
cd ../react-experiments

# Copy public contents into gh-pages
cp -pr public/* ../react-experiments-gh-pages/

# Back to gh-pages
cd ../react-experiments-gh-pages
git add .
git commit -am "Sync public folder into gh-pages repo."
git push

# Back to project folder, to finish.
cd ../react-experiments
