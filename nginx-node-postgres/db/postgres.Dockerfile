FROM postgres
COPY ./read-user.sql /docker-entrypoint-initdb.d/read-user.sql
COPY ./insert-user.sql /docker-entrypoint-initdb.d/insert-user.sql
COPY ./update-user.sql /docker-entrypoint-initdb.d/update-user.sql
COPY ./delete-user.sql /docker-entrypoint-initdb.d/delete-user.sql
