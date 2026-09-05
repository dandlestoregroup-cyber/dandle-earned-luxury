-- DANDLE PayTabs production order/payment ledger.
-- Additive migration: no existing tables or product data are replaced.

create table if not exists public.dandle_orders (
  id uuid primary key,
  user_id uuid null,
  status text not null default 'pending_payment'
    check (status in ('pending_payment', 'paid', 'payment_failed', 'cancelled', 'refunded')),
  currency text not null default 'EGP' check (currency = 'EGP'),
  customer jsonb not null,
  order_lines jsonb not null check (jsonb_typeof(order_lines) = 'array' and jsonb_array_length(order_lines) > 0),
  subtotal_egp numeric(12,2) not null check (subtotal_egp >= 0),
  shipping_egp numeric(12,2) not null default 0 check (shipping_egp >= 0),
  discount_egp numeric(12,2) not null default 0 check (discount_egp >= 0),
  total_egp numeric(12,2) not null check (total_egp > 0),
  paytabs_cart_id uuid not null unique,
  paytabs_tran_ref text null,
  paytabs_redirect_url text null,
  payment_status text not null default 'checkout_created',
  payment_metadata jsonb null,
  access_token_hash text not null check (access_token_hash ~ '^[a-f0-9]{64}$'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  paid_at timestamptz null,
  last_reconciled_at timestamptz null,
  constraint dandle_orders_total_matches check (
    total_egp = subtotal_egp + shipping_egp - discount_egp
  )
);

create unique index if not exists dandle_orders_paytabs_tran_ref_unique
  on public.dandle_orders(paytabs_tran_ref)
  where paytabs_tran_ref is not null;

create index if not exists dandle_orders_pending_reconcile_idx
  on public.dandle_orders(status, created_at)
  where status = 'pending_payment';

alter table public.dandle_orders enable row level security;

-- No anon/authenticated table policies are intentional. Browser access goes through
-- DANDLE server endpoints; service_role remains server-only and bypasses RLS.
revoke all on table public.dandle_orders from anon, authenticated;

grant select, insert, update on table public.dandle_orders to service_role;

create or replace function public.dandle_orders_preserve_checkout_snapshot()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if new.id is distinct from old.id
    or new.user_id is distinct from old.user_id
    or new.currency is distinct from old.currency
    or new.customer is distinct from old.customer
    or new.order_lines is distinct from old.order_lines
    or new.subtotal_egp is distinct from old.subtotal_egp
    or new.shipping_egp is distinct from old.shipping_egp
    or new.discount_egp is distinct from old.discount_egp
    or new.total_egp is distinct from old.total_egp
    or new.paytabs_cart_id is distinct from old.paytabs_cart_id
    or new.access_token_hash is distinct from old.access_token_hash
    or new.created_at is distinct from old.created_at
  then
    raise exception 'DANDLE checkout snapshot is immutable';
  end if;
  return new;
end;
$$;

drop trigger if exists dandle_orders_preserve_checkout_snapshot_trigger on public.dandle_orders;
create trigger dandle_orders_preserve_checkout_snapshot_trigger
before update on public.dandle_orders
for each row execute function public.dandle_orders_preserve_checkout_snapshot();

create or replace function public.settle_dandle_paytabs_order(
  p_order_id uuid,
  p_tran_ref text,
  p_metadata jsonb default '{}'::jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order public.dandle_orders%rowtype;
begin
  if p_tran_ref is null or length(trim(p_tran_ref)) = 0 then
    raise exception 'Missing PayTabs transaction reference';
  end if;

  select * into v_order
  from public.dandle_orders
  where id = p_order_id
  for update;

  if not found then
    raise exception 'DANDLE order not found';
  end if;

  if v_order.status = 'paid' then
    if v_order.paytabs_tran_ref is distinct from p_tran_ref then
      raise exception 'Paid order transaction reference mismatch';
    end if;
    return jsonb_build_object('settled', false, 'duplicate', true, 'status', 'paid');
  end if;

  if v_order.status <> 'pending_payment' then
    return jsonb_build_object('settled', false, 'duplicate', true, 'status', v_order.status);
  end if;

  if v_order.paytabs_tran_ref is not null and v_order.paytabs_tran_ref <> p_tran_ref then
    raise exception 'PayTabs transaction reference mismatch';
  end if;

  update public.dandle_orders
  set status = 'paid',
      payment_status = 'paid',
      paytabs_tran_ref = p_tran_ref,
      payment_metadata = coalesce(p_metadata, '{}'::jsonb),
      paid_at = coalesce(paid_at, now()),
      last_reconciled_at = now(),
      updated_at = now()
  where id = p_order_id
    and status = 'pending_payment';

  if not found then
    return jsonb_build_object('settled', false, 'duplicate', true, 'status', 'paid');
  end if;

  return jsonb_build_object('settled', true, 'duplicate', false, 'status', 'paid');
end;
$$;

revoke all on function public.settle_dandle_paytabs_order(uuid, text, jsonb) from public, anon, authenticated;
grant execute on function public.settle_dandle_paytabs_order(uuid, text, jsonb) to service_role;
