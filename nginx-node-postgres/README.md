To spin up the containers with multiple web containers run:

```
docker-compose up --scale web=3
```

To run load testing the endpoint run

```
k6 run -u 200 -d 30s --summary-export=export.json --out json=my_test_result.json k6script.js
```

[Load balancer with nginx and docker compose](https://levelup.gitconnected.com/nginx-load-balancing-and-using-with-docker-7e16c49f5d9)
