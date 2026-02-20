#!/usr/bin/env python3
"""Generate all voiceover audio files for ConsentHub videos — full, brief, and clip versions."""

import edge_tts
import asyncio
import json
import os
from mutagen.mp3 import MP3

VOICE = "en-GB-SoniaNeural"
RATE = "+0%"
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "public", "audio")

# =============================================================================
# FULL SCRIPTS — for FullOverview (7.5 min)
# =============================================================================
FULL_SCRIPTS = {
    "logo-intro": (
        "ConsentHub. "
        "HIPAA-compliant consent management, built for Microsoft Dynamics 365."
    ),
    "problem-scene": (
        "Healthcare organisations are drowning in paper consent forms. "
        "Forms get lost, misfiled, or expire without anyone noticing. "
        "Manual data entry into Dynamics creates errors and dangerous compliance gaps. "
        "Without a proper audit trail, you're one failed HIPAA audit away from serious legal consequences. "
        "And patients? They have no way to manage their own consent preferences. "
        "The current system is fundamentally broken."
    ),
    "solution-scene": (
        "ConsentHub changes everything. "
        "Capture legally binding consent with digital signatures, right from any device. "
        "Every record syncs in real time with Microsoft Dynamics 365, both directions, automatically. "
        "An immutable audit trail, secured with SHA-256 checksums, ensures absolute regulatory compliance. "
        "And patients get their own self-service portal to manage preferences on their terms. "
        "This is consent management, done properly."
    ),
    "dashboard-demo": (
        "Your entire consent operation, in a single dashboard. "
        "See total patients, active consents, pending reviews, and compliance scores at a glance. "
        "Interactive charts show consent trends over time, broken down by type. "
        "The activity feed gives you a real-time stream of every consent action across your organisation. "
        "Filter, search, and drill into any record instantly. "
        "Complete visibility, zero guesswork."
    ),
    "consent-wizard": (
        "Capturing consent takes just three steps. "
        "First, select from your library of pre-built, regulation-compliant templates. "
        "HIPAA treatment consent, research participation, data sharing — they're all ready to go. "
        "Next, the patient signs digitally, right on screen. Legally binding and instantly verified. "
        "And finally, confirmation. The consent is recorded, a PDF is generated automatically, "
        "and the record syncs to Dynamics 365 in under 200 milliseconds. "
        "What used to take days now takes seconds."
    ),
    "sync-visualization": (
        "Real-time, bi-directional integration with Microsoft Dynamics 365. "
        "When a consent is captured in ConsentHub, it appears in Dynamics immediately. "
        "When a contact is updated in Dynamics, ConsentHub reflects the change automatically. "
        "Consent records, PDF documents, and audit entries flow seamlessly between systems. "
        "Average sync latency: under 200 milliseconds. "
        "No batch jobs. No overnight imports. No data discrepancies. Ever."
    ),
    "audit-trail": (
        "Every action is logged. Every record is verifiable. "
        "ConsentHub maintains an immutable audit trail that cannot be altered or deleted. "
        "Each entry is protected with a SHA-256 cryptographic checksum. "
        "One click verification confirms that no record has been tampered with. "
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
        "Everything you need. Nothing you don't."
    ),
    "cta-endcard": (
        "Ready to modernise your consent workflow? "
        "Visit consenthub.io to schedule a personalised demo and see ConsentHub in action."
    ),
}

# =============================================================================
# BRIEF SCRIPTS — for TwoMinDemo (2 min)
# =============================================================================
BRIEF_SCRIPTS = {
    "logo-intro-brief": (
        "ConsentHub. HIPAA-compliant consent management for Dynamics 365."
    ),
    "problem-scene-brief": (
        "Paper consent forms are unreliable. "
        "Manual entry creates compliance gaps. "
        "And without a proper audit trail, HIPAA violations are a real risk."
    ),
    "solution-scene-brief": (
        "ConsentHub delivers digital signatures, real-time Dynamics sync, "
        "immutable audit trails, and a patient self-service portal."
    ),
    "dashboard-demo-brief": (
        "Monitor your entire consent operation from one dashboard. "
        "Metrics, charts, and activity streams, all in real time."
    ),
    "consent-wizard-brief": (
        "Three steps. Select a template, capture the signature, and confirm. "
        "The record syncs to Dynamics in under 200 milliseconds."
    ),
    "sync-visualization-brief": (
        "Bi-directional Dynamics 365 integration. "
        "Consent records, documents, and audit entries sync instantly between systems."
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
        "Starting at just 600 dollars per month. "
        "60 to 80 percent less than enterprise alternatives."
    ),
    "cta-endcard-brief": (
        "Visit consenthub.io to schedule your demo."
    ),
}

# =============================================================================
# CLIP SCRIPTS — for 30-second short clips
# =============================================================================
CLIP_SCRIPTS = {
    # Clip 1: Why Consent Is Broken
    "clip1-intro": "ConsentHub.",
    "clip1-problem": (
        "Paper forms get lost. Manual Dynamics entry creates errors. "
        "No audit trail means failed HIPAA audits."
    ),
    "clip1-solution": (
        "ConsentHub delivers digital signatures, real-time Dynamics sync, "
        "and immutable compliance records."
    ),
    "clip1-cta": "Visit consenthub.io to learn more.",

    # Clip 2: Dynamics 365 Integration
    "clip2-intro": "ConsentHub.",
    "clip2-sync": (
        "Bi-directional Dynamics 365 sync. "
        "Consent records flow between systems in under 200 milliseconds."
    ),
    "clip2-dashboard": (
        "Monitor everything from a unified dashboard. "
        "Metrics, charts, and activity in real time."
    ),
    "clip2-cta": "Visit consenthub.io to see it in action.",

    # Clip 3: HIPAA Compliance
    "clip3-intro": "ConsentHub.",
    "clip3-audit": (
        "Immutable audit trails with SHA-256 verification. "
        "Every consent action logged and tamper-proof."
    ),
    "clip3-wizard": (
        "Capture compliant consent in three simple steps. "
        "Template, signature, confirmed."
    ),
    "clip3-cta": "Visit consenthub.io to schedule a demo.",

    # Clip 4: Enterprise Power, Startup Pricing
    "clip4-intro": "ConsentHub.",
    "clip4-pricing": (
        "Full enterprise compliance from just 600 dollars per month. "
        "60 to 80 percent less than alternatives."
    ),
    "clip4-features": (
        "Consent engine, Dynamics integration, HIPAA compliance, "
        "patient portal, dashboard, and API."
    ),
    "clip4-cta": "Visit consenthub.io to get started.",
}


async def generate_audio(name: str, text: str):
    """Generate a single audio file."""
    output_path = os.path.join(OUTPUT_DIR, f"{name}.mp3")
    communicate = edge_tts.Communicate(text, VOICE, rate=RATE)
    await communicate.save(output_path)
    return output_path


async def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    print(f"Voice: {VOICE} | Rate: {RATE}")
    print(f"Output: {OUTPUT_DIR}\n")

    all_scripts = {}
    all_scripts.update(FULL_SCRIPTS)
    all_scripts.update(BRIEF_SCRIPTS)
    all_scripts.update(CLIP_SCRIPTS)

    durations = {}

    for name, text in all_scripts.items():
        path = await generate_audio(name, text)
        audio = MP3(path)
        dur = audio.info.length
        frames = round(dur * 30)
        durations[name] = {
            "seconds": round(dur, 2),
            "frames": frames,
            "file": f"audio/{name}.mp3",
        }
        print(f"  {name}: {dur:.2f}s ({frames}f)")

    # Save durations JSON
    json_path = os.path.join(OUTPUT_DIR, "durations.json")
    with open(json_path, "w") as f:
        json.dump(durations, f, indent=2)

    print(f"\n{len(durations)} audio files generated.")
    print(f"Durations saved to: {json_path}")

    # Print summary by category
    print("\n--- FULL (FullOverview) ---")
    total = 0
    for k in FULL_SCRIPTS:
        s = durations[k]["seconds"]
        total += s
        print(f"  {k}: {s:.1f}s")
    print(f"  TOTAL: {total:.1f}s")

    print("\n--- BRIEF (TwoMinDemo) ---")
    total = 0
    for k in BRIEF_SCRIPTS:
        s = durations[k]["seconds"]
        total += s
        print(f"  {k}: {s:.1f}s")
    print(f"  TOTAL: {total:.1f}s")

    for clip_num in range(1, 5):
        prefix = f"clip{clip_num}"
        clip_keys = [k for k in CLIP_SCRIPTS if k.startswith(prefix)]
        total = sum(durations[k]["seconds"] for k in clip_keys)
        print(f"\n--- CLIP {clip_num} ---")
        for k in clip_keys:
            print(f"  {k}: {durations[k]['seconds']:.1f}s")
        print(f"  TOTAL: {total:.1f}s")


if __name__ == "__main__":
    asyncio.run(main())
