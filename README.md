<h1  style="text-decoration: none; cursor: none;">
Bunflix
<img src="https://bunflix.bsws.in/favicon.ico"  style="width: 30px;" alt="icon" />
</h1>

A simple Netflix clone build using [Next.js](https://nextjs.org/), [tailwindcss](https://tailwindcss.com/), [TheMoviesDatabase API](https://www.themoviedb.org/) and the [Aniwatch API](https://github.com/ghoshRitesh12/aniwatch-api) by [Ritesh Ghosh](https://github.com/ghoshRitesh12). I built this to learn about web development and over time this repo has become my most commited repo of all.

### Tech Stack
<div >
  <img src="https://img.shields.io/badge/Next.js-000000?logo=nextdotjs&logoColor=white&style=for-the-badge" height="30" alt="nextjs logo"  />
  <img width="12" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white&style=for-the-badge" height="30" alt="typescript logo"  />
  <img width="12" />
  <img src="https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black&style=for-the-badge" height="30" alt="react logo"  />
  <img width="12" />
  <img src="https://img.shields.io/badge/Tailwind CSS-06B6D4?logo=tailwindcss&logoColor=black&style=for-the-badge" height="30" alt="tailwindcss logo"  />
  <img width="12" />
</div>


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
