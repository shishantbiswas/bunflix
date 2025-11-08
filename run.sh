docker build -t bunflix:latest .
docker rm anime --force
docker run --name anime -p 4000:3000 -d --restart unless-stopped --cpus="1" --memory="512m"  bunflix:latest