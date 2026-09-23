-- Survey-specific tables. No names, email, IP address, user ID or precise timestamps
-- are stored with survey answers. Interview contacts have unrelated random IDs.
begin;
create table public.bildlarare_responses (
  id uuid primary key,
  survey_version text not null check (survey_version = '1.0'),
  answers jsonb not null check (
    jsonb_typeof(answers) = 'object'
    and answers @> '{"Q24":"Ja"}'::jsonb
    and octet_length(answers::text) <= 100000
    and (answers - array['Q24','Q1','Q1_other','Q2','Q3','Q46','Q7','Q11','Q5','Q23','Q38','Q53','Q53_other','Q54','Q27','Q44','Q13','Q35','Q34','Q36','Q17','Q52','Q42','Q19','Q22','Q49','Q48','Q47','Q45','Q28','Q39','Q40','Q51','Q33','Q32','Q56','Q57','Q58','Q29']) = '{}'::jsonb
  )
);
create table public.bildlarare_interview_contacts (
  id uuid primary key,
  name text not null check (length(trim(name)) between 1 and 200),
  email text not null check (length(email) between 3 and 254 and email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'),
  consent boolean not null check (consent = true)
);
alter table public.bildlarare_responses enable row level security;
alter table public.bildlarare_interview_contacts enable row level security;
revoke all on public.bildlarare_responses from public, anon, authenticated;
revoke all on public.bildlarare_interview_contacts from public, anon, authenticated;
grant insert on public.bildlarare_responses to anon;
grant insert on public.bildlarare_interview_contacts to anon;
create policy "Submit survey with consent" on public.bildlarare_responses for insert to anon with check (answers @> '{"Q24":"Ja"}'::jsonb);
create policy "Submit separate interview interest" on public.bildlarare_interview_contacts for insert to anon with check (consent = true);
-- No SELECT, UPDATE or DELETE grants/policies for any browser role.
commit;
