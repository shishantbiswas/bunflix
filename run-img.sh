docker rm flix --force
docker run --env-file ./.env -d --name flix --cpus="1" -m 1024m -p 4000:3000 flix