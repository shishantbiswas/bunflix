<h1  style="text-decoration: none; cursor: none;">
Bunflix
<img src="https://bunflix.bsws.in/favicon.ico"  width=20 alt="icon" />
</h1>

A simple Netflix clone build using [Next.js](https://nextjs.org/), [tailwindcss](https://tailwindcss.com/), [TheMoviesDatabase API](https://www.themoviedb.org/) and the [Aniwatch API](https://github.com/ghoshRitesh12/aniwatch-api) by [Ritesh Ghosh](https://github.com/ghoshRitesh12). I built this to learn about web development and over time this repo has become my most commited repo of all.

If you wish to deploy it there's a guide below screenshots

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


### Screenshots
<img src='./assets/images/Screenshot_20241227_225145.webp' style="border-radius:5px;"/>
<img src='./assets/images/Screenshot_20241227_231423.webp' style="border-radius:5px;"/>


### Setup

First, you'll need the api key from the [TheMoviesDatabase API](https://developer.themoviedb.org/docs/getting-started) and host your own instance of [Aniwatch API](https://github.com/ghoshRitesh12/aniwatch-api) on somewhere like [Vercel](https://vercel.com) then put those credentials in a .env file

```env
# https://developer.themoviedb.org/docs/getting-started
TMDB_KEY=your_key_from_tmdb

# https://github.com/ghoshRitesh12/aniwatch-api
ANIWATCH_API=host_your_own_instance
```

### One-Click Docker Deploy 

[![Deploy to Koyeb](https://www.koyeb.com/static/images/deploy/button.svg)](https://app.koyeb.com/deploy?name=bunflix&repository=shishantbiswas%2Fbunflix&branch=main&builder=dockerfile&instance_type=free&env%5BANIWATCH_API%5D=host_your_own_instance&env%5BTMDB_KEY%5D=your_key_from_tmdb&ports=3000%3Bhttp%3B%2F&hc_protocol%5B3000%5D=tcp&hc_grace_period%5B3000%5D=5&hc_interval%5B3000%5D=30&hc_restart_limit%5B3000%5D=3&hc_timeout%5B3000%5D=5&hc_path%5B3000%5D=%2F&hc_method%5B3000%5D=get)


### Deploy

With the setup now complete it can be deployed almost anywhere like [Vercel](https://vercel.com), [Netlify](https://netlify.com), [Railway](https://railway.app) or any Cloud Provider out there