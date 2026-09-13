-- ECHO — The Signal Guardian


create table if not exists grievances (
    id uuid primary key default gen_random_uuid(),

    name varchar(100) not null,

    age integer not null
        check (age > 0 and age <= 120),

    location varchar(200) not null,

    email varchar(255) not null,

    grievance text not null,

    category varchar(50) default 'OTHER',

    priority varchar(30) default 'NORMAL',

    status varchar(30) default 'RECEIVED',

    created_at timestamptz default now()
);

-- Row Level Security: allow public INSERT only (no public read).
alter table grievances enable row level security;

-- Public visitors may submit a grievance...
create policy "public can insert grievances"
    on grievances for insert
    to anon
    with check (true);

-- ...but there is NO select/update/delete policy, so grievances can never be
-- read publicly. The backend uses the service role key which bypasses RLS.
