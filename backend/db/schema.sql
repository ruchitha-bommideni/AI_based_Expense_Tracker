-- Schema for AI-Based Expense Tracker

-- ===============================
-- Table: public.groups
-- ===============================
CREATE TABLE IF NOT EXISTS public.groups (
    id SERIAL PRIMARY KEY,
    group_name VARCHAR(255) NOT NULL,
    key VARCHAR(255) NOT NULL,
    CONSTRAINT groups_group_name_key UNIQUE (group_name)
);

-- ===============================
-- Table: public.participant
-- ===============================
CREATE TABLE IF NOT EXISTS public.participant (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    group_id INTEGER,
    CONSTRAINT participant_group_id_fkey FOREIGN KEY (group_id)
        REFERENCES public.groups (id)
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);

-- ===============================
-- Table: public.expenses
-- ===============================
CREATE TABLE IF NOT EXISTS public.expenses (
    id SERIAL PRIMARY KEY,
    group_id INTEGER NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    description TEXT NOT NULL,
    payer_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    category VARCHAR(50),
    CONSTRAINT expenses_group_id_fkey FOREIGN KEY (group_id)
        REFERENCES public.groups (id)
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);

-- ===============================
-- Table: public.payments
-- ===============================
CREATE TABLE IF NOT EXISTS public.payments (
    id SERIAL PRIMARY KEY,
    expense_id INTEGER NOT NULL,
    payer_id INTEGER NOT NULL,
    payee_id INTEGER NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    group_id INTEGER NOT NULL,
    CONSTRAINT fk_expense FOREIGN KEY (expense_id)
        REFERENCES public.expenses (id)
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT fk_pay_group FOREIGN KEY (group_id)
        REFERENCES public.groups (id)
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT fk_payee FOREIGN KEY (payee_id)
        REFERENCES public.participant (id)
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT fk_payer FOREIGN KEY (payer_id)
        REFERENCES public.participant (id)
        ON UPDATE NO ACTION
        ON DELETE CASCADE
);
