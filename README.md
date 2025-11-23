# hexday
Vacation Scrapbook allows you to plan out vacations and save your favorite memories! Add destinations and photos to trips to create the perfect getaway.

## Inspiration

Since this HackDay was all about learning about MongoDB, we wanted to pick a problem that fit well within its NoSQL approach. We realized that keeping track of items that had many variations, especially those that needed to store a variable number of specific items (such as photos or keypoints), were well suited to the Mongo approach. We decided to build Vacation Scrapbook since it was exactly this type of problem, where we sometimes have varying levels of details when it comes to documenting what we were doing at which time.

## How we built it

We used a Python backend with Flask connecting it to a React frontend. Everything is backed to MongoDB!

## Challenges/What we learned

How to use MongoDB! We wanted to understand the philosophy behind MongoDB, so we spent time thinking about how to set up a database that took advantage of its features. This included thinking about how to split up data into collections, and what to index by for scalability.

## What's next

Currently, images are being stored directly through MongoDB, but this might not be the best for scalability. We might move these to FireBase for better content delivery in the future.
