CREATE TABLE public."user"
(
    id     serial4 PRIMARY KEY,
    "name" varchar NOT NULL UNIQUE
);

CREATE TABLE public.book
(
    id     serial4 PRIMARY KEY,
    "name" varchar NOT NULL UNIQUE,
    score  float8  NOT NULL
);

CREATE TABLE public.book_borrow_history
(
    id       serial4 PRIMARY KEY,
    book_id  int4 NOT NULL REFERENCES public.book (id),
    user_id  int4 NOT NULL REFERENCES public.user (id),
    returned bool NOT NULL
);

CREATE INDEX idx_bbh_book_and_user ON public.book_borrow_history (book_id, user_id);

CREATE TABLE public.book_score
(
    id      serial4 PRIMARY KEY,
    book_id int4   NOT NULL REFERENCES public.book (id),
    user_id int4   NOT NULL REFERENCES public.user (id),
    score   float8 NOT NULL
);

CREATE UNIQUE INDEX idx_bs_book_and_user ON public.book_score (book_id, user_id);
