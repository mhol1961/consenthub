#!/usr/bin/env python3
"""Generate all voiceover audio files for ConsentHub videos."""

import edge_tts
import asyncio
import json
import os
from mutagen.mp3 import MP3

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "public", "audio")

VOICES = {
    "british": {"id": "en-GB-SoniaNeural", "rate": "+5%", "suffix": ""},
    "australian-female": {"id": "en-AU-NatashaNeural", "rate": "+5%", "suffix": "-au-f"},
    "australian-male": {"id": "en-AU-WilliamNeural", "rate": "+5%", "suffix": "-au-m"},
}

# =============================================================================
# FULL SCRIPTS — for FullOverview (7.5 min)
# =============================================================================
FULL_SCRIPTS = {
    # Section title voiceovers (play during title cards to eliminate dead air)
    "title-the-problem": "The Problem.",
    "title-the-solution": "The Solution.",
    "title-the-platform": "The Platform.",
    "title-how-it-works": "How It Works.",
    "title-key-features": "Key Features.",
    "title-pricing": "Pricing.",
    "title-get-started": "Get Started.",

    "logo-intro": (
        "ConsentHub. "
        "HIPAA-compliant consent management, built for Microsoft Dynamics 365."
    ),
    "problem-scene": (
        "Healthcare organisations are drowning in paper consent forms. "
        "Forms get lost, misfiled, or expire without anyone noticing. "
        "Manual data entry into Dynamics creates errors and dangerous compliance gaps. "
        "Without a proper audit trail, you're one failed HIPAA audit away from serious legal consequences. "
        "And patients have no way to manage their own consent preferences. "
        "The current system is fundamentally broken."
    ),
    "solution-scene": (
        "ConsentHub changes everything. "
        "Capture legally binding consent with digital signatures, right from any device. "
        "Every record syncs in real time with Microsoft Dynamics 365, both directions, automatically. "
        "An immutable audit trail secured with SHA-256 checksums ensures absolute regulatory compliance. "
        "And patients get their own self-service portal to manage preferences on their terms. "
        "This is consent management done properly."
    ),
    "dashboard-demo": (
        "Your entire consent operation in a single dashboard. "
        "See total patients, active consents, pending reviews, and compliance scores at a glance. "
        "Interactive charts show consent trends over time, broken down by type. "
        "The activity feed gives you a real-time stream of every consent action across your organisation. "
        "Filter, search, and drill into any record instantly. "
        "Complete visibility. Zero guesswork."
    ),
    "consent-wizard": (
        "Capturing consent takes just three steps. "
        "First, select from your library of pre-built, regulation-compliant templates. "
        "HIPAA treatment consent, research participation, data sharing — they're all ready to go. "
        "Next, the patient signs digitally, right on screen. Legally binding and instantly verified. "
        "And finally, confirmation. The consent is recorded, a PDF is generated automatically, "
        "and the record syncs to Dynamics 365 in less than one second. "
        "What used to take days now takes seconds."
    ),
    "sync-visualization": (
        "Real-time bi-directional integration with Microsoft Dynamics 365. "
        "When a consent is captured in ConsentHub, it appears in Dynamics immediately. "
        "When a contact is updated in Dynamics, ConsentHub reflects the change automatically. "
        "Consent records, PDF documents, and audit entries flow seamlessly between systems. "
        "No batch jobs. No overnight imports. No data discrepancies. Ever."
    ),
    "audit-trail": (
        "Every action is logged and every record is verifiable. "
        "ConsentHub maintains an immutable audit trail that cannot be altered or deleted. "
        "Each entry is protected with a SHA-256 cryptographic checksum. "
        "One-click verification confirms that no record has been tampered with. "
        "When the auditors arrive, you're not scrambling for paperwork. "
        "You're showing them a verified, tamper-proof digital record. "
        "HIPAA compliance, guaranteed."
    ),
    "pricing-comparison": (
        "Enterprise-grade compliance shouldn't require an enterprise budget. "
        "Our Starter plan begins at just 600 dollars per month, perfect for single-location practices. "
        "The Professional plan, our most popular, gives you the full platform "
        "including Dynamics integration and advanced analytics for 1,200 dollars per month. "
        "And for large health systems, our Enterprise plan delivers unlimited scale, "
        "custom integrations, and dedicated support. "
        "That's 60 to 80 percent less than traditional enterprise consent platforms."
    ),
    "feature-grid": (
        "Six powerful capabilities in one unified platform. "
        "A consent engine with legally binding digital signatures. "
        "Native Dynamics 365 integration with real-time bi-directional sync. "
        "Built-in HIPAA and GDPR compliance with immutable audit logs. "
        "A patient self-service portal with secure magic-link access. "
        "A comprehensive admin dashboard with real-time analytics. "
        "And a full REST API with webhooks for custom integrations. "
        "Everything you need, nothing you don't."
    ),
    "cta-endcard": (
        "Ready to modernise your consent workflow? "
        "Visit consenthub.io to schedule a personalised demo and see ConsentHub in action."
    ),
}

# =============================================================================
# BRIEF SCRIPTS — for TwoMinDemo (2 min)
# Shorter, punchier. Logo intro must be under 4 seconds.
# =============================================================================
BRIEF_SCRIPTS = {
    "logo-intro-brief": "ConsentHub.",
    "problem-scene-brief": (
        "Paper consent forms are unreliable, manual entry creates compliance gaps, "
        "and without a proper audit trail, HIPAA violations become a real risk."
    ),
    "solution-scene-brief": (
        "ConsentHub delivers digital signatures, real-time Dynamics sync, "
        "immutable audit trails, and a patient self-service portal."
    ),
    "dashboard-demo-brief": (
        "Monitor your entire consent operation from one dashboard — "
        "metrics, charts, and activity streams, all in real time."
    ),
    "consent-wizard-brief": (
        "Three steps: select a template, capture the signature, and confirm. "
        "The record syncs to Dynamics in less than one second."
    ),
    "sync-visualization-brief": (
        "Bi-directional Dynamics 365 integration — consent records, documents, "
        "and audit entries sync instantly between systems."
    ),
    "audit-trail-brief": (
        "Every action is logged with SHA-256 checksums. "
        "One-click verification proves no record has been tampered with."
    ),
    "feature-grid-brief": (
        "Six core capabilities: consent engine, Dynamics integration, "
        "HIPAA compliance, patient portal, admin dashboard, and full API."
    ),
    "pricing-comparison-brief": (
        "Starting at just 600 dollars per month — "
        "60 to 80 percent less than enterprise alternatives."
    ),
    "cta-endcard-brief": "Visit consenthub.io to schedule your demo.",
}

# =============================================================================
# CLIP SCRIPTS — for 30-second short clips
# =============================================================================
CLIP_SCRIPTS = {
    # Clip 1: Why Consent Is Broken
    "clip1-intro": "ConsentHub.",
    "clip1-problem": (
        "Paper forms get lost, manual Dynamics entry creates errors, "
        "and no audit trail means failed HIPAA audits."
    ),
    "clip1-solution": (
        "ConsentHub delivers digital signatures, real-time Dynamics sync, "
        "and immutable compliance records."
    ),
    "clip1-cta": "Visit consenthub.io to learn more.",

    # Clip 2: Dynamics 365 Integration
    "clip2-intro": "ConsentHub.",
    "clip2-sync": (
        "Bi-directional Dynamics 365 sync — consent records flow between systems "
        "in less than one second."
    ),
    "clip2-dashboard": (
        "Monitor everything from a unified dashboard — "
        "metrics, charts, and activity in real time."
    ),
    "clip2-cta": "Visit consenthub.io to see it in action.",

    # Clip 3: HIPAA Compliance
    "clip3-intro": "ConsentHub.",
    "clip3-audit": (
        "Immutable audit trails with SHA-256 verification — "
        "every consent action logged and tamper-proof."
    ),
    "clip3-wizard": (
        "Capture compliant consent in three simple steps: "
        "template, signature, confirmed."
    ),
    "clip3-cta": "Visit consenthub.io to schedule a demo.",

    # Clip 4: Enterprise Power, Startup Pricing
    "clip4-intro": "ConsentHub.",
    "clip4-pricing": (
        "Full enterprise compliance from just 600 dollars per month — "
        "60 to 80 percent less than alternatives."
    ),
    "clip4-features": (
        "Consent engine, Dynamics integration, HIPAA compliance, "
        "patient portal, dashboard, and API — all included."
    ),
    "clip4-cta": "Visit consenthub.io to get started.",
}


async def generate_audio(name: str, text: str, voice_id: str, rate: str, suffix: str):
    """Generate a single audio file."""
    filename = f"{name}{suffix}.mp3"
    output_path = os.path.join(OUTPUT_DIR, filename)
    communicate = edge_tts.Communicate(text, voice_id, rate=rate)
    await communicate.save(output_path)
    return filename, output_path


async def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    all_scripts = {}
    all_scripts.update(FULL_SCRIPTS)
    all_scripts.update(BRIEF_SCRIPTS)
    all_scripts.update(CLIP_SCRIPTS)

    all_durations = {}

    for voice_key, voice_cfg in VOICES.items():
        voice_id = voice_cfg["id"]
        rate = voice_cfg["rate"]
        suffix = voice_cfg["suffix"]

        # For Australian voices, only generate clip scripts
        if voice_key != "british":
            scripts = {k: v for k, v in CLIP_SCRIPTS.items()}
        else:
            scripts = all_scripts

        print(f"\n{'='*60}")
        print(f"Voice: {voice_id} | Rate: {rate} | Suffix: '{suffix}'")
        print(f"{'='*60}")

        for name, text in scripts.items():
            filename, path = await generate_audio(name, text, voice_id, rate, suffix)
            audio = MP3(path)
            dur = audio.info.length
            frames = round(dur * 30)
            key = f"{name}{suffix}"
            all_durations[key] = {
                "seconds": round(dur, 2),
                "frames": frames,
                "file": f"audio/{filename}",
            }
            print(f"  {filename}: {dur:.2f}s ({frames}f)")

    # Save durations JSON
    json_path = os.path.join(OUTPUT_DIR, "durations.json")
    with open(json_path, "w") as f:
        json.dump(all_durations, f, indent=2)

    print(f"\n{len(all_durations)} audio files generated.")
    print(f"Durations saved to: {json_path}")

    # Print British summaries
    print("\n--- BRITISH: FULL (FullOverview) ---")
    total = 0
    for k in FULL_SCRIPTS:
        s = all_durations[k]["seconds"]
        total += s
        print(f"  {k}: {s:.1f}s")
    print(f"  TOTAL: {total:.1f}s")

    print("\n--- BRITISH: BRIEF (TwoMinDemo) ---")
    total = 0
    for k in BRIEF_SCRIPTS:
        s = all_durations[k]["seconds"]
        total += s
        print(f"  {k}: {s:.1f}s")
    print(f"  TOTAL: {total:.1f}s")

    for clip_num in range(1, 5):
        prefix = f"clip{clip_num}"
        clip_keys = [k for k in CLIP_SCRIPTS if k.startswith(prefix)]
        total = sum(all_durations[k]["seconds"] for k in clip_keys)
        print(f"\n--- BRITISH: CLIP {clip_num} ---")
        for k in clip_keys:
            print(f"  {k}: {all_durations[k]['seconds']:.1f}s")
        print(f"  TOTAL: {total:.1f}s")

    # Australian summaries
    for voice_key in ["australian-female", "australian-male"]:
        suffix = VOICES[voice_key]["suffix"]
        print(f"\n--- {voice_key.upper()} CLIPS ---")
        for clip_num in range(1, 5):
            prefix = f"clip{clip_num}"
            clip_keys = [f"{k}{suffix}" for k in CLIP_SCRIPTS if k.startswith(prefix)]
            total = sum(all_durations[k]["seconds"] for k in clip_keys)
            print(f"  Clip {clip_num}: {total:.1f}s total")


if __name__ == "__main__":
    asyncio.run(main())
