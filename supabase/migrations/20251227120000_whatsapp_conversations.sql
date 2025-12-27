-- WhatsApp Conversations Table for Thunder Scout
-- Stores all inbound, outbound, and owner CC messages

CREATE TABLE IF NOT EXISTS whatsapp_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_number text NOT NULL,
  message_type text NOT NULL CHECK (message_type IN ('inbound', 'outbound', 'owner_cc')),
  message_text text NOT NULL,
  language text CHECK (language IN ('EN', 'AR', 'auto', NULL)),
  segment_detected text CHECK (segment_detected IN ('achiever', 'caregiver', 'gift', 'b2b', 'unknown', NULL)),
  profile_name text,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Index for efficient querying by phone and time
CREATE INDEX IF NOT EXISTS idx_whatsapp_conversations_phone_created
  ON whatsapp_conversations (phone_number, created_at DESC);

-- Index for analytics by segment
CREATE INDEX IF NOT EXISTS idx_whatsapp_conversations_segment
  ON whatsapp_conversations (segment_detected, created_at DESC);

-- RLS policies (public insert for edge functions, read for authenticated)
ALTER TABLE whatsapp_conversations ENABLE ROW LEVEL SECURITY;

-- Allow edge functions to insert (they use service role)
CREATE POLICY "Allow service role full access" ON whatsapp_conversations
  FOR ALL
  USING (true)
  WITH CHECK (true);

COMMENT ON TABLE whatsapp_conversations IS 'Thunder Scout WhatsApp conversation logs';
COMMENT ON COLUMN whatsapp_conversations.message_type IS 'inbound=customer message, outbound=AI reply, owner_cc=copy to owner';
COMMENT ON COLUMN whatsapp_conversations.segment_detected IS 'Customer segment: achiever, caregiver, gift, b2b, or unknown';
