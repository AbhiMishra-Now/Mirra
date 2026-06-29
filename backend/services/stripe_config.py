# Price ID to Subscription Tier mapping config
# Replace placeholders with actual Stripe Price IDs once configured in dashboard

STRIPE_PRICE_MAPPING = {
    "price_premium_monthly_placeholder": "PRO",
    "price_premium_yearly_placeholder": "PRO",
}

def get_tier_from_price_id(price_id: str) -> str:
    """
    Maps Stripe Price ID to MIRRA database tier ('FREE', 'PRO').
    Defaults to 'FREE' if unrecognized.
    """
    return STRIPE_PRICE_MAPPING.get(price_id, "FREE")
