# Quick Start Guide - Gear Cutting Simulation

## 30-Second Setup

1. **Open** `index.html` in your browser
2. **Enter** number of teeth (e.g., 24)
3. **Click** "Setup Gear Blank"
4. **Adjust** sliders for spindle speed, feed rate, depth of cut
5. **Click** "▶ Start Cutting"
6. **Watch** the simulation automatically cut all teeth

## What You'll See

- **3D Machine**: Hyundai horizontal mill with indexing head and tail stock
- **Gear Blank**: Cylindrical workpiece rotating between centers
- **Involute Cutter**: Large form cutter with carbide teeth
- **Progress Display**: Shows "Tooth X / Y" as cutting progresses
- **Automatic Indexing**: Machine automatically positions for next tooth after each cut

## Key Controls

| Control | Purpose |
|---------|---------|
| **Total Teeth Input** | Specify how many teeth to cut |
| **Setup Gear Blank** | Initialize with tooth count |
| **Spindle Speed Slider** | RPM (50-400) |
| **Feed Rate Slider** | in/min (0.5-5) |
| **Depth of Cut Slider** | in (0.01-0.25) |
| **▶ Start Cutting** | Begin simulation |
| **⏸ Pause** | Pause (when running) |
| **↻ Reset** | Return to idle state |
| **🔄 (Top Right)** | Rotate camera view |
| **🔍+/🔍-** | Zoom in/out |

## Understanding Plain Indexing

The machine automatically calculates:
```
Crank Turns per Tooth = 40 ÷ Number of Teeth
```

**Examples:**
- 24 teeth → 1.667 turns per tooth
- 30 teeth → 1.333 turns per tooth
- 40 teeth → 1 turn per tooth

The simulation rotates the indexing head by this exact amount after each tooth is cut.

## Typical Workflow

### Setup (1 minute)
1. Set teeth = 24
2. Click Setup
3. Note: "Indexing: 1.6667 crank turns per tooth"

### Cutting (2 minutes)
4. Spindle Speed: 200 RPM
5. Feed Rate: 2 in/min
6. Depth: 0.10 in
7. Click Start → Automatic cutting begins

### Observation
- Watch "Tooth 1 / 24" through "Tooth 24 / 24"
- See machine automatically index between cuts
- Machine stops when done

## For Different Tooth Counts

| Teeth | Cutter Type | Use Case |
|-------|-------------|----------|
| 16-20 | Coarse tooth | Large industrial gears |
| 24-30 | Medium tooth | Standard gears |
| 40-50 | Fine tooth | Precision gears |
| 60-80 | Extra fine | High-precision machinery |

**Try Each**: Click Reset, change tooth count, run again to see differences!

## Tips for Best Results

✓ **Spindle Speed**: Higher for aluminum (~300 RPM), lower for steel (~200 RPM)
✓ **Feed Rate**: Lower for better finish (~0.5), higher for faster removal (~3)
✓ **Depth of Cut**: Smaller for finishing (~0.05), larger for roughing (~0.15)
✓ **Observation**: Pause to inspect current tooth being cut

## Camera Controls

| Action | Control |
|--------|---------|
| **Rotate View** | Click/drag with mouse OR rotate button |
| **Zoom In** | Scroll up OR + button |
| **Zoom Out** | Scroll down OR - button |
| **Pan** | Right-click drag |

## Realistic Features

✓ Real 3D machine geometry  
✓ Physically accurate indexing head with hole plate  
✓ Tail stock with live center support  
✓ Involute gear cutter form  
✓ Proper light and shadow  
✓ Cutting force/power calculations  
✓ Automatic tooth-by-tooth progression  
✓ Machine state monitoring  

## Help & Documentation

**Need more info?**
- Click **"? Help & Procedures"** for detailed workflow
- Read **README_GEAR_CUTTING_SIMULATION.md** for complete technical documentation
- Check **"Tool Information"** panel for cutter specs

## Browser Compatibility

- ✓ Chrome, Firefox, Safari, Edge (latest versions)
- ✓ Requires WebGL (GPU acceleration)
- ✓ Best on 1920x1080 or larger
- ✓ Smooth 60 FPS on modern computers

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Animation too fast | Reduce simulation speed slider |
| Text too small | Use browser zoom (Ctrl/+ or Cmd/+) |
| Simulation won't start | Close other tabs, clear cache |
| Black screen | Check browser console (F12) for errors |

## Learning Path

1. **Beginner**: Run simulation with default 24 teeth
2. **Intermediate**: Experiment with different tooth counts (16, 32, 40)
3. **Advanced**: Compare cutting parameters and observe surface finish differences
4. **Expert**: Calculate indexing manually, verify against simulation

## Real-World Application

This simulation is based on **TC 9-524** (U.S. Army Technical Manual) and accurately represents spur gear cutting on industrial horizontal milling machines like the Hyundai 149.

**Practical Uses:**
- Train new machinists on indexing procedures
- Demonstrate cutting physics principles
- Plan tooling setups
- Understand machine capabilities
- Learn traditional dividing head methods

---

**Ready to begin?** Open `index.html` and start cutting! 🔧

For detailed technical reference, see `README_GEAR_CUTTING_SIMULATION.md`
