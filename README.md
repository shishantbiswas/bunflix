A simple Netflix clone build using [Next.js](https://nextjs.org/), [tailwindcss](https://tailwindcss.com/), [TheMoviesDatabase API](https://www.themoviedb.org/) and the [Aniwatch API](https://github.com/ghoshRitesh12/aniwatch-api) by [Ritesh Ghosh](https://github.com/ghoshRitesh12). I built this to learn about web development and over time this repo has become my most commited repo of all.


### Setup

First, you'll need the api key from the [TheMoviesDatabase API](https://developer.themoviedb.org/docs/getting-started) and host your own instance of [Aniwatch API](https://github.com/ghoshRitesh12/aniwatch-api) on somewhere like [Vercel](https://vercel.com) then put those credentials in a .env file

```env
# https://developer.themoviedb.org/docs/getting-started
TMDB_KEY=your_key_from_tmdb 

# https://github.com/ghoshRitesh12/aniwatch-api
ANIWATCH_API=host_your_own_instance 
```

### Deploy

With the setup now complete it can be deployed almost anywhere like [Vercel](https://vercel.com), [Netlify](https://netlify.com) or any Cloud Provider there is a seperate branch for docker setup but i'm planning to make a docker image using github actions