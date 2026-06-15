-- =============================================================
-- Caulililiflower ecommerce schema
-- Square is the source of truth for products / catalog / pricing.
-- This schema covers application data only.
-- =============================================================

-- ── Users ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id              SERIAL PRIMARY KEY,
  username        VARCHAR(100) NOT NULL UNIQUE,
  email           VARCHAR(255) NOT NULL UNIQUE,
  contact_number  VARCHAR(30),
  password_hash   TEXT NOT NULL,
  role            VARCHAR(20) NOT NULL DEFAULT 'buyer',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Addresses ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS addresses (
  id              SERIAL PRIMARY KEY,
  user_id         INTEGER REFERENCES users(id) ON DELETE CASCADE,
  recipient_name  VARCHAR(255) NOT NULL,
  address_line1   VARCHAR(255) NOT NULL,
  address_line2   VARCHAR(255),
  city            VARCHAR(100) NOT NULL,
  state           VARCHAR(100) NOT NULL,
  postal_code     VARCHAR(20)  NOT NULL,
  country         VARCHAR(100) NOT NULL DEFAULT 'Malaysia',
  is_default      BOOLEAN NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Carts ─────────────────────────────────────────────────────
-- One active cart per user. Guest carts live in localStorage only.
CREATE TABLE IF NOT EXISTS carts (
  id              SERIAL PRIMARY KEY,
  user_id         INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Cart items ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cart_items (
  id                    SERIAL PRIMARY KEY,
  cart_id               INTEGER NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  square_item_id        VARCHAR(100) NOT NULL,
  square_variation_id   VARCHAR(100) NOT NULL,
  product_name          VARCHAR(255) NOT NULL,
  variation_name        VARCHAR(100),
  unit_price            NUMERIC(10,2) NOT NULL,
  quantity              INTEGER NOT NULL DEFAULT 1,
  added_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (cart_id, square_variation_id)
);

-- ── Orders ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cauli_orders (
  id                  SERIAL PRIMARY KEY,
  user_id             INTEGER REFERENCES users(id) ON DELETE SET NULL,

  -- Customer snapshot (denormalised so order history survives user edits)
  customer_name       VARCHAR(255) NOT NULL,
  customer_email      VARCHAR(255) NOT NULL,
  customer_phone      VARCHAR(30),

  -- Shipping address snapshot
  recipient_name      VARCHAR(255) NOT NULL,
  address_line1       VARCHAR(255) NOT NULL,
  address_line2       VARCHAR(255),
  city                VARCHAR(100) NOT NULL,
  state               VARCHAR(100) NOT NULL,
  postal_code         VARCHAR(20)  NOT NULL,
  country             VARCHAR(100) NOT NULL DEFAULT 'Malaysia',

  subtotal            NUMERIC(10,2) NOT NULL DEFAULT 0,
  shipping_cost       NUMERIC(10,2) NOT NULL DEFAULT 0,
  total_price         NUMERIC(10,2) NOT NULL DEFAULT 0,

  status              VARCHAR(30) NOT NULL DEFAULT 'pending',
  notes               TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Order items ───────────────────────────────────────────────
-- Full product snapshot — history stays accurate if Square data changes later.
CREATE TABLE IF NOT EXISTS cauli_order_items (
  id                    SERIAL PRIMARY KEY,
  order_id              INTEGER NOT NULL REFERENCES cauli_orders(id) ON DELETE CASCADE,
  square_item_id        VARCHAR(100) NOT NULL,
  square_variation_id   VARCHAR(100),
  product_name          VARCHAR(255) NOT NULL,
  variation_name        VARCHAR(100),
  unit_price            NUMERIC(10,2) NOT NULL,
  quantity              INTEGER NOT NULL DEFAULT 1,
  line_total            NUMERIC(10,2) NOT NULL
);

-- ── Checkout sessions ─────────────────────────────────────────
-- Links a checkout attempt to an order and optionally a Square payment.
CREATE TABLE IF NOT EXISTS checkout_sessions (
  id                    SERIAL PRIMARY KEY,
  order_id              INTEGER REFERENCES cauli_orders(id) ON DELETE CASCADE,
  square_payment_id     VARCHAR(100),
  square_checkout_id    VARCHAR(100),
  status                VARCHAR(30) NOT NULL DEFAULT 'pending',
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================
-- Migration notes
-- =============================================================
-- The following tables from the T-shirt demo schema are no longer
-- needed and can be dropped once you confirm no live data requires
-- preservation:
--
--   DROP TABLE IF EXISTS tshirt_inventory;
--   DROP TABLE IF EXISTS tshirt_products;
--   DROP TABLE IF EXISTS tshirt_sizes;
--
-- Run those manually after verifying the database.
-- =============================================================
