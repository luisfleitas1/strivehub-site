
CREATE TABLE public.daily_recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recommendation_date date NOT NULL DEFAULT CURRENT_DATE,
  primary_action text NOT NULL,
  supporting_reason text NOT NULL,
  scores jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, recommendation_date)
);

ALTER TABLE public.daily_recommendations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own recommendations"
  ON public.daily_recommendations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own recommendations"
  ON public.daily_recommendations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
