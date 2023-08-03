-- sudo -u postgres createdb bet_1x2_manager

-- sudo -u postgres psql bet_1x2_manager

CREATE EXTENSION "uuid-ossp";

-- psql bet_1x2_manager

create table ´user´ (
	login text primary key,
	password text not null
);

create table project (
	id uuid default uuid_generate_v4() primary key,
	name text not null
);

create table bet (
	project uuid references project(id) not null,
	date_time text not null,
	home text not null,
	away text not null,
	odd numeric(5, 2) not null,
	bet numeric(9, 2) not null,
	prize numeric(9, 2) not null,
	expected_result char not null,
	actual_result char(2),
	bet_sum numeric(9, 2) not null,
	bet_total numeric(9, 2) not null,
	prize_total numeric(9, 2) not null
);

CREATE FUNCTION test_new_bet_must_be_open() RETURNS trigger AS $$
BEGIN
  IF new.actual_result IS NOT NULL THEN
    RAISE EXCEPTION 'Bets must be created open or updated to closed.';
  END IF;
  RETURN NEW;
  END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER new_bet_must_be_open BEFORE INSERT ON bet
FOR EACH ROW EXECUTE PROCEDURE test_new_bet_must_be_open();

-- DROP TRIGGER new_bet_must_be_later ON bet; DROP FUNCTION test_new_bet_must_be_later;
CREATE FUNCTION test_new_bet_must_be_later() RETURNS trigger AS $$
DECLARE
  most_recent_date_time TEXT;
BEGIN
  SELECT date_time INTO most_recent_date_time FROM bet WHERE project = NEW.project ORDER BY date_time DESC LIMIT 1;
  IF (most_recent_date_time IS NULL) OR (NEW.date_time > most_recent_date_time) THEN
    RETURN NEW;
  END IF;
  RAISE EXCEPTION 'Bets must be created with date after the last one.';
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER new_bet_must_be_later BEFORE INSERT ON bet
FOR EACH ROW EXECUTE PROCEDURE test_new_bet_must_be_later();

-- DROP TRIGGER new_bet_must_be_unique ON bet; DROP FUNCTION test_new_bet_must_be_unique;
CREATE FUNCTION test_new_bet_must_be_unique() RETURNS trigger AS $$
DECLARE
  open_bet_count BIGINT;
BEGIN
  SELECT count(*) INTO open_bet_count FROM bet WHERE project = NEW.project AND actual_result IS NULL;
  IF open_bet_count > 0 THEN
    RAISE EXCEPTION 'Can''t start a new series because there already is an open series.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER new_bet_must_be_unique BEFORE INSERT ON bet
FOR EACH ROW EXECUTE PROCEDURE test_new_bet_must_be_unique();

CREATE FUNCTION test_bet_date_time_format() RETURNS trigger AS $$
DECLARE
  matches boolean;
BEGIN
  select new.date_time similar to '[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}(Z|((\+|-)([0-9]{2}:[0-9]{2})))' into matches;
  IF matches THEN
    RETURN NEW;
  END IF;
  RAISE EXCEPTION 'Bet date/time must be formatted according to ISO 8601.';
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER bet_date_time_format BEFORE INSERT OR UPDATE ON bet
FOR EACH ROW EXECUTE PROCEDURE test_bet_date_time_format();

CREATE FUNCTION test_bet_expected_result_value() RETURNS trigger AS $$
DECLARE
  matches boolean;
BEGIN
  select new.expected_result in ('1', 'X', '2') into matches;
  IF matches THEN
    RETURN NEW;
  END IF;
  RAISE EXCEPTION 'Bet expected result must be 1, X or 2.';
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER bet_expected_result_value BEFORE INSERT OR UPDATE ON bet
FOR EACH ROW EXECUTE PROCEDURE test_bet_expected_result_value();

-- DROP TRIGGER bet_actual_result_value ON bet; DROP FUNCTION test_bet_actual_result_value;
CREATE FUNCTION test_bet_actual_result_value() RETURNS trigger AS $$
DECLARE
  matches boolean;
BEGIN
  SELECT new.actual_result IN ('1', 'X', '2', '1R', 'XR', '2R') OR new.actual_result IS NULL INTO matches;
  IF matches THEN
    RETURN NEW;
  END IF;
  RAISE EXCEPTION 'Bet actual result must be 1, X, 2 or null.';
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER bet_actual_result_value BEFORE INSERT OR UPDATE ON bet
FOR EACH ROW EXECUTE PROCEDURE test_bet_actual_result_value();
