-- Database for this project's code. Written by ModSquad after each reply: do not edit.
-- Generated 2026-10-25 11:43 UTC by ModSquad for PostgreSQL.
-- Rebuilt from the knowledge entity, not dumped from the original database:
-- table and column names are the original ones; foreign-key columns are filled
-- from the entity's links; a table keyed by a surrogate number has a text "key".
-- Load into an empty database:  psql "$DATABASE_URL" -f this-file.sql

BEGIN;
SET LOCAL client_min_messages = warning;

DROP TABLE IF EXISTS "booking_status" CASCADE;
DROP TABLE IF EXISTS "country" CASCADE;
DROP TABLE IF EXISTS "currency" CASCADE;
DROP TABLE IF EXISTS "gender" CASCADE;
DROP TABLE IF EXISTS "id_document_type" CASCADE;
DROP TABLE IF EXISTS "language" CASCADE;
DROP TABLE IF EXISTS "language" CASCADE;
DROP TABLE IF EXISTS "notification_channel" CASCADE;
DROP TABLE IF EXISTS "train_class" CASCADE;
DROP TABLE IF EXISTS "user_role" CASCADE;

CREATE TABLE "booking_status" (
  "status_code" TEXT PRIMARY KEY,
  "status_name" TEXT,
  "is_terminal" BOOLEAN,
  "description" TEXT
);
INSERT INTO "booking_status" ("status_code", "status_name", "is_terminal", "description") VALUES ('PEN', 'Pending Payment', FALSE, 'Inventory held; awaiting payment');
INSERT INTO "booking_status" ("status_code", "status_name", "is_terminal", "description") VALUES ('PRC', 'Processing', FALSE, 'Payment received; supplier confirmation in progress');
INSERT INTO "booking_status" ("status_code", "status_name", "is_terminal", "description") VALUES ('CNF', 'Confirmed', FALSE, 'Booking confirmed with supplier');
INSERT INTO "booking_status" ("status_code", "status_name", "is_terminal", "description") VALUES ('VCH', 'Voucher Issued', FALSE, 'Ticket / voucher issued to traveller');
INSERT INTO "booking_status" ("status_code", "status_name", "is_terminal", "description") VALUES ('MOD', 'Modified', FALSE, 'Booking amended after confirmation');
INSERT INTO "booking_status" ("status_code", "status_name", "is_terminal", "description") VALUES ('PCN', 'Partially Cancelled', FALSE, 'Some travellers or items cancelled');
INSERT INTO "booking_status" ("status_code", "status_name", "is_terminal", "description") VALUES ('COM', 'Completed', TRUE, 'Travel completed');
INSERT INTO "booking_status" ("status_code", "status_name", "is_terminal", "description") VALUES ('CAN', 'Cancelled', TRUE, 'Booking cancelled');
INSERT INTO "booking_status" ("status_code", "status_name", "is_terminal", "description") VALUES ('NSH', 'No Show', TRUE, 'Traveller did not show up');
INSERT INTO "booking_status" ("status_code", "status_name", "is_terminal", "description") VALUES ('FAI', 'Failed', TRUE, 'Supplier confirmation failed');
INSERT INTO "booking_status" ("status_code", "status_name", "is_terminal", "description") VALUES ('EXP', 'Expired', TRUE, 'Hold expired without payment');
INSERT INTO "booking_status" ("status_code", "status_name", "is_terminal", "description") VALUES ('REF', 'Refunded', TRUE, 'Fully refunded');

CREATE TABLE "country" (
  "country_code" TEXT PRIMARY KEY,
  "iso3_code" TEXT,
  "country_name" TEXT,
  "phone_code" TEXT,
  "currency_code" TEXT
);
INSERT INTO "country" ("country_code", "iso3_code", "country_name", "phone_code", "currency_code") VALUES ('IN', 'IND', 'India', '+91', 'INR');
INSERT INTO "country" ("country_code", "iso3_code", "country_name", "phone_code", "currency_code") VALUES ('AE', 'ARE', 'United Arab Emirates', '+971', 'AED');
INSERT INTO "country" ("country_code", "iso3_code", "country_name", "phone_code", "currency_code") VALUES ('SG', 'SGP', 'Singapore', '+65', 'SGD');
INSERT INTO "country" ("country_code", "iso3_code", "country_name", "phone_code", "currency_code") VALUES ('TH', 'THA', 'Thailand', '+66', 'THB');
INSERT INTO "country" ("country_code", "iso3_code", "country_name", "phone_code", "currency_code") VALUES ('GB', 'GBR', 'United Kingdom', '+44', 'GBP');
INSERT INTO "country" ("country_code", "iso3_code", "country_name", "phone_code", "currency_code") VALUES ('FR', 'FRA', 'France', '+33', 'EUR');
INSERT INTO "country" ("country_code", "iso3_code", "country_name", "phone_code", "currency_code") VALUES ('DE', 'DEU', 'Germany', '+49', 'EUR');
INSERT INTO "country" ("country_code", "iso3_code", "country_name", "phone_code", "currency_code") VALUES ('US', 'USA', 'United States', '+1', 'USD');
INSERT INTO "country" ("country_code", "iso3_code", "country_name", "phone_code", "currency_code") VALUES ('JP', 'JPN', 'Japan', '+81', 'JPY');
INSERT INTO "country" ("country_code", "iso3_code", "country_name", "phone_code", "currency_code") VALUES ('ID', 'IDN', 'Indonesia', '+62', 'IDR');
INSERT INTO "country" ("country_code", "iso3_code", "country_name", "phone_code", "currency_code") VALUES ('AU', 'AUS', 'Australia', '+61', 'AUD');
INSERT INTO "country" ("country_code", "iso3_code", "country_name", "phone_code", "currency_code") VALUES ('QA', 'QAT', 'Qatar', '+974', 'QAR');

CREATE TABLE "currency" (
  "currency_code" TEXT PRIMARY KEY,
  "currency_name" TEXT,
  "symbol" TEXT,
  "decimal_places" BIGINT
);
INSERT INTO "currency" ("currency_code", "currency_name", "symbol", "decimal_places") VALUES ('INR', 'Indian Rupee', '₹', 2);
INSERT INTO "currency" ("currency_code", "currency_name", "symbol", "decimal_places") VALUES ('USD', 'US Dollar', '$', 2);
INSERT INTO "currency" ("currency_code", "currency_name", "symbol", "decimal_places") VALUES ('EUR', 'Euro', '€', 2);
INSERT INTO "currency" ("currency_code", "currency_name", "symbol", "decimal_places") VALUES ('GBP', 'Pound Sterling', '£', 2);
INSERT INTO "currency" ("currency_code", "currency_name", "symbol", "decimal_places") VALUES ('AED', 'UAE Dirham', 'د.إ', 2);
INSERT INTO "currency" ("currency_code", "currency_name", "symbol", "decimal_places") VALUES ('SGD', 'Singapore Dollar', 'S$', 2);
INSERT INTO "currency" ("currency_code", "currency_name", "symbol", "decimal_places") VALUES ('THB', 'Thai Baht', '฿', 2);
INSERT INTO "currency" ("currency_code", "currency_name", "symbol", "decimal_places") VALUES ('JPY', 'Japanese Yen', '¥', 0);
INSERT INTO "currency" ("currency_code", "currency_name", "symbol", "decimal_places") VALUES ('IDR', 'Indonesian Rupiah', 'Rp', 2);
INSERT INTO "currency" ("currency_code", "currency_name", "symbol", "decimal_places") VALUES ('AUD', 'Australian Dollar', 'A$', 2);
INSERT INTO "currency" ("currency_code", "currency_name", "symbol", "decimal_places") VALUES ('QAR', 'Qatari Riyal', 'ر.ق', 2);

CREATE TABLE "gender" (
  "gender_code" TEXT PRIMARY KEY,
  "gender_name" TEXT
);
INSERT INTO "gender" ("gender_code", "gender_name") VALUES ('M', 'Male');
INSERT INTO "gender" ("gender_code", "gender_name") VALUES ('F', 'Female');
INSERT INTO "gender" ("gender_code", "gender_name") VALUES ('X', 'Other / Unspecified');
INSERT INTO "gender" ("gender_code", "gender_name") VALUES ('U', 'Prefer not to say');

CREATE TABLE "id_document_type" (
  "doc_type_code" TEXT PRIMARY KEY,
  "doc_type_name" TEXT,
  "is_travel_doc" BOOLEAN,
  "has_expiry" BOOLEAN
);
INSERT INTO "id_document_type" ("doc_type_code", "doc_type_name", "is_travel_doc", "has_expiry") VALUES ('PASSPORT', 'Passport', TRUE, TRUE);
INSERT INTO "id_document_type" ("doc_type_code", "doc_type_name", "is_travel_doc", "has_expiry") VALUES ('VISA', 'Visa', TRUE, TRUE);
INSERT INTO "id_document_type" ("doc_type_code", "doc_type_name", "is_travel_doc", "has_expiry") VALUES ('NATID', 'National ID Card', FALSE, FALSE);
INSERT INTO "id_document_type" ("doc_type_code", "doc_type_name", "is_travel_doc", "has_expiry") VALUES ('AADHAAR', 'Aadhaar Card', FALSE, FALSE);
INSERT INTO "id_document_type" ("doc_type_code", "doc_type_name", "is_travel_doc", "has_expiry") VALUES ('DL', 'Driving Licence', FALSE, TRUE);
INSERT INTO "id_document_type" ("doc_type_code", "doc_type_name", "is_travel_doc", "has_expiry") VALUES ('VOTER', 'Voter ID', FALSE, FALSE);
INSERT INTO "id_document_type" ("doc_type_code", "doc_type_name", "is_travel_doc", "has_expiry") VALUES ('RESPERM', 'Residence Permit', TRUE, TRUE);
INSERT INTO "id_document_type" ("doc_type_code", "doc_type_name", "is_travel_doc", "has_expiry") VALUES ('OCI', 'Overseas Citizen of India Card', TRUE, FALSE);

CREATE TABLE "language" (
  "language_code" TEXT PRIMARY KEY,
  "name_pt" TEXT,
  "name_en" TEXT,
  "native_name" TEXT
);
INSERT INTO "language" ("language_code", "name_pt", "name_en", "native_name") VALUES ('pt', 'Português', 'Portuguese', 'Português');
INSERT INTO "language" ("language_code", "name_pt", "name_en", "native_name") VALUES ('en', 'Inglês', 'English', 'English');
INSERT INTO "language" ("language_code", "name_pt", "name_en", "native_name") VALUES ('es', 'Espanhol', 'Spanish', 'Español');
INSERT INTO "language" ("language_code", "name_pt", "name_en", "native_name") VALUES ('fr', 'Francês', 'French', 'Français');
INSERT INTO "language" ("language_code", "name_pt", "name_en", "native_name") VALUES ('de', 'Alemão', 'German', 'Deutsch');

CREATE TABLE "language" (
  "language_code" TEXT PRIMARY KEY,
  "language_name" TEXT,
  "native_name" TEXT
);
INSERT INTO "language" ("language_code", "language_name", "native_name") VALUES ('en', 'English', 'English');
INSERT INTO "language" ("language_code", "language_name", "native_name") VALUES ('hi', 'Hindi', 'हिन्दी');
INSERT INTO "language" ("language_code", "language_name", "native_name") VALUES ('bn', 'Bengali', 'বাংলা');
INSERT INTO "language" ("language_code", "language_name", "native_name") VALUES ('mr', 'Marathi', 'मराठी');
INSERT INTO "language" ("language_code", "language_name", "native_name") VALUES ('ta', 'Tamil', 'தமிழ்');
INSERT INTO "language" ("language_code", "language_name", "native_name") VALUES ('te', 'Telugu', 'తెలుగు');
INSERT INTO "language" ("language_code", "language_name", "native_name") VALUES ('kn', 'Kannada', 'ಕನ್ನಡ');
INSERT INTO "language" ("language_code", "language_name", "native_name") VALUES ('ml', 'Malayalam', 'മലയാളം');
INSERT INTO "language" ("language_code", "language_name", "native_name") VALUES ('fr', 'French', 'Français');
INSERT INTO "language" ("language_code", "language_name", "native_name") VALUES ('de', 'German', 'Deutsch');
INSERT INTO "language" ("language_code", "language_name", "native_name") VALUES ('es', 'Spanish', 'Español');
INSERT INTO "language" ("language_code", "language_name", "native_name") VALUES ('ar', 'Arabic', 'العربية');
INSERT INTO "language" ("language_code", "language_name", "native_name") VALUES ('ja', 'Japanese', '日本語');
INSERT INTO "language" ("language_code", "language_name", "native_name") VALUES ('zh', 'Chinese', '中文');

CREATE TABLE "notification_channel" (
  "channel_code" TEXT PRIMARY KEY,
  "channel_name" TEXT
);
INSERT INTO "notification_channel" ("channel_code", "channel_name") VALUES ('EMAIL', 'Email');
INSERT INTO "notification_channel" ("channel_code", "channel_name") VALUES ('SMS', 'SMS');
INSERT INTO "notification_channel" ("channel_code", "channel_name") VALUES ('PUSH', 'Push Notification');
INSERT INTO "notification_channel" ("channel_code", "channel_name") VALUES ('WHATSAPP', 'WhatsApp');
INSERT INTO "notification_channel" ("channel_code", "channel_name") VALUES ('IVR', 'Voice / IVR');

CREATE TABLE "train_class" (
  "class_code" TEXT PRIMARY KEY,
  "class_name" TEXT,
  "is_ac" BOOLEAN,
  "is_sleeper" BOOLEAN
);
INSERT INTO "train_class" ("class_code", "class_name", "is_ac", "is_sleeper") VALUES ('1A', 'AC First Class', TRUE, TRUE);
INSERT INTO "train_class" ("class_code", "class_name", "is_ac", "is_sleeper") VALUES ('2A', 'AC 2-Tier Sleeper', TRUE, TRUE);
INSERT INTO "train_class" ("class_code", "class_name", "is_ac", "is_sleeper") VALUES ('3A', 'AC 3-Tier Sleeper', TRUE, TRUE);
INSERT INTO "train_class" ("class_code", "class_name", "is_ac", "is_sleeper") VALUES ('3E', 'AC 3-Tier Economy', TRUE, TRUE);
INSERT INTO "train_class" ("class_code", "class_name", "is_ac", "is_sleeper") VALUES ('SL', 'Sleeper Class', FALSE, TRUE);
INSERT INTO "train_class" ("class_code", "class_name", "is_ac", "is_sleeper") VALUES ('CC', 'AC Chair Car', TRUE, FALSE);
INSERT INTO "train_class" ("class_code", "class_name", "is_ac", "is_sleeper") VALUES ('EC', 'Executive Chair Car', TRUE, FALSE);
INSERT INTO "train_class" ("class_code", "class_name", "is_ac", "is_sleeper") VALUES ('2S', 'Second Sitting', FALSE, FALSE);

CREATE TABLE "user_role" (
  "role_code" TEXT PRIMARY KEY,
  "role_name" TEXT,
  "description" TEXT
);
INSERT INTO "user_role" ("role_code", "role_name", "description") VALUES ('CUSTOMER', 'Customer', 'End traveller booking on the platform');
INSERT INTO "user_role" ("role_code", "role_name", "description") VALUES ('AGENT', 'Travel Agent', 'B2B agent booking on behalf of customers');
INSERT INTO "user_role" ("role_code", "role_name", "description") VALUES ('CORP_ADMIN', 'Corporate Admin', 'Manages corporate travel policy and approvals');
INSERT INTO "user_role" ("role_code", "role_name", "description") VALUES ('CORP_TRVLR', 'Corporate Traveller', 'Employee travelling under a corporate account');
INSERT INTO "user_role" ("role_code", "role_name", "description") VALUES ('SUPPORT', 'Support Executive', 'Handles customer queries and changes');
INSERT INTO "user_role" ("role_code", "role_name", "description") VALUES ('FINANCE', 'Finance Executive', 'Reconciliation, refunds and payouts');
INSERT INTO "user_role" ("role_code", "role_name", "description") VALUES ('CONTENT', 'Content Manager', 'Manages inventory content and promotions');
INSERT INTO "user_role" ("role_code", "role_name", "description") VALUES ('ADMIN', 'System Administrator', 'Full platform administration');

ALTER TABLE "country" ADD FOREIGN KEY ("currency_code") REFERENCES "currency" ("currency_code");

COMMIT;
