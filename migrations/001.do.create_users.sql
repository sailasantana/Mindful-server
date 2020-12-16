/* create table to hold all users. */
CREATE TABLE journal_users (
    user_name  TEXT PRIMARY KEY  NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    password TEXT NOT NULL,
    date_created TIMESTAMPTZ DEFAULT now() NOT NULL,
    date_modified TIMESTAMPTZ
);