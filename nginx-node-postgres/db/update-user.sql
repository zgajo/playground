CREATE ROLE update_only_user WITH LOGIN PASSWORD 'Test1234';

GRANT CONNECT ON DATABASE test TO update_only_user;
GRANT USAGE ON SCHEMA public TO update_only_user;
GRANT UPDATE ON ALL TABLES IN SCHEMA public TO update_only_user;
GRANT UPDATE ON ALL SEQUENCES IN SCHEMA public TO update_only_user;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT UPDATE ON TABLES TO update_only_user;
