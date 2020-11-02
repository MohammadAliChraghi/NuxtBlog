CREATE DATABASE blog
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    CONNECTION LIMIT = -1;

CREATE TABLE public.users
(
    id serial NOT NULL,
    username character varying(64) NOT NULL,
    password character varying(64) NOT NULL,
    role character varying(64) NOT NULL,
    PRIMARY KEY (id)
);

ALTER TABLE public.users
    OWNER to postgres;    

INSERT INTO public.users(
	username, password, role)
	VALUES ('mac', '111111', 'admin');

CREATE TABLE public.visits
(
    id serial NOT NULL,
    date date NOT NULL,
    PRIMARY KEY (id)
);

ALTER TABLE public.visits
    OWNER to postgres;

    

CREATE TABLE public.posts
(
    id serial NOT NULL,
    title character varying(512) NOT NULL,
    author serial NOT NULL,
    text text NOT NULL,
    thumbnail character varying(512),
    PRIMARY KEY (id)
);

ALTER TABLE public.posts
    OWNER to postgres;