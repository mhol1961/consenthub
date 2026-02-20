#!/usr/bin/env python3
"""Generate voiceover audio files for ConsentHub Remotion videos using Edge TTS."""

import edge_tts
import asyncio
import json
import os
from mutagen.mp3 import MP3

VOICE = "en-GB-SoniaNeural"
RATE = "+0%"
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "public", "audio")

# Narration scripts for each scene
SCRIPTS = {
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


async def generate_audio(name: str, text: str):
    """Generate a single audio file."""
    output_path = os.path.join(OUTPUT_DIR, f"{name}.mp3")
    communicate = edge_tts.Communicate(text, VOICE, rate=RATE)
    await communicate.save(output_path)
    print(f"  Generated: {name}.mp3")
    return output_path


async def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    print(f"Generating voiceover with voice: {VOICE}")
    print(f"Rate: {RATE}")
    print(f"Output directory: {OUTPUT_DIR}")
    print()

    # Generate all audio files
    paths = {}
    for name, text in SCRIPTS.items():
        path = await generate_audio(name, text)
        paths[name] = path

    print()
    print("Getting audio durations...")

    # Get durations using mutagen
    durations = {}
    for name, path in paths.items():
        audio = MP3(path)
        duration_sec = audio.info.length
        duration_frames = round(duration_sec * 30)  # 30fps
        durations[name] = {
            "seconds": round(duration_sec, 2),
            "frames": duration_frames,
            "file": f"audio/{name}.mp3",
        }
        print(f"  {name}: {duration_sec:.2f}s ({duration_frames} frames)")

    # Save durations JSON
    json_path = os.path.join(OUTPUT_DIR, "durations.json")
    with open(json_path, "w") as f:
        json.dump(durations, f, indent=2)
    print(f"\nDurations saved to: {json_path}")


if __name__ == "__main__":
    asyncio.run(main())
