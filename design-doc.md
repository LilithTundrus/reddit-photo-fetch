# Initial Design Draft

__(This doc is just for laying out my ideas for the project)__


# Authors: Lilith Tundrus

# What this project is:

- A basic Reddit 'client' to get new photos from a set of configurable subreddits

## Base Intended Features:
- Ability to save/fetch a configurable set of subreddit's new photos based on the last check
- Potentially only save photos above a certain score or maybe only with certain words
- Potentially an ability to schedule the checks instead of manually being run


# What this project is NOT:
- This is NOT a fully featured reddit client
- This will not have a frontend GUI


# Architecture Overview

At the beginning, architecture may not be that clear cut but there should definitely be a main script
that calls a basic wrapper and gets everything set up to run rather than it just being one script