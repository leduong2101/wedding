"""Generate an original quiet pentatonic music-box loop. Python standard library only."""
import math
import struct
import wave
from pathlib import Path

RATE = 22050
BEAT = 0.6
MELODY = [72, 76, 79, 81, 79, 76, 74, 72, 67, 72, 74, 76, 79, 76, 74, 0,
          72, 74, 76, 79, 81, 79, 76, 74, 72, 67, 69, 72, 74, 76, 72, 0]
samples = [0.0] * int(RATE * BEAT * len(MELODY))

def note(midi, start, volume, duration=1.8):
    frequency = 440 * 2 ** ((midi - 69) / 12)
    for j in range(int(duration * RATE)):
        t = j / RATE
        envelope = min(1, t / 0.008) * math.exp(-3.5 * t)
        tone = math.sin(2 * math.pi * frequency * t) + 0.22 * math.sin(2 * math.pi * frequency * 2 * t)
        samples[(int(start * RATE) + j) % len(samples)] += volume * envelope * tone

for i, midi in enumerate(MELODY):
    if midi:
        note(midi, i * BEAT, 0.16)
    if i % 4 == 0:
        note([48, 55, 53, 55][(i // 4) % 4], i * BEAT, 0.08, 2.4)

destination = Path(__file__).resolve().parents[1] / 'assets' / 'music-demo.wav'
destination.parent.mkdir(exist_ok=True)
with wave.open(str(destination), 'wb') as output:
    output.setnchannels(1)
    output.setsampwidth(2)
    output.setframerate(RATE)
    output.writeframes(b''.join(struct.pack('<h', int(max(-1, min(1, sample)) * 32767)) for sample in samples))
print(f'Generated original demo loop: {destination.name} ({len(samples) / RATE:.1f}s)')
