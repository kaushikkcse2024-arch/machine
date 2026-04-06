# Hyundai Horizontal Milling Machine - Spur Gear Cutting Virtual Lab

## Overview

This is an interactive 3D virtual laboratory simulation for spur gear cutting on a Hyundai horizontal milling machine using an involute gear cutter and plain indexing head (dividing head). The simulation provides a realistic workshop experience with accurate machine geometry, indexing calculations, and cutting physics.

**Based on:** TC 9-524 Technical Manual (Military Machining Operations) - Chapter 8: Milling Operations

---

## Machine Components Simulated

### 1. **Hyundai Horizontal Milling Machine**
- **Machine Bed** - Blue cast iron foundation (shown in darker tones)
- **Column** - Vertical support housing spindle drive
- **Spindle** - Rotates the arbor horizontally
- **Arbor** - Horizontal shaft carrying the milling cutter
- **Overarm** - Supports arbor from above via arbor support bracket
- **Table/Worktable** - Carries workpiece and indexing head; travels longitudinally (X-axis)
- **Knee** - Adjusts vertically (Z-axis) via elevation screw
- **Saddle** - Provides cross-feed adjustment (Y-axis)

### 2. **Indexing Head (Dividing Head)**
- **Index Plate** - Has multiple circles of holes (35, 40, 50 holes typical)
- **Index Crank** - Rotates to select indexing holes
- **Crank Pin** - Engages holes on index plate
- **Spindle** - Taper-spindle for mounting gear blank
- Mounted on left side of table

### 3. **Tail Stock**
- **Fixed Center** (live center) - Provides support point for gear blank on right side
- **Quill** - Adjustable with handwheel
- Mounted on right side of table

### 4. **Gear Blank (Workpiece)**
- **Cylindrical Configuration** - Mounted between indexing head and tailstock centers
- **Material** - Typically steel or ductile iron (shown in metallic gray)
- **Position** - Between centers, ready for tooth cutting

### 5. **Involute Gear Cutter**
- **Form Cutter** - Formed to specific tooth profile for given tooth count
- **Carbide Cutting Edges** - Gold/brass colored teeth around periphery
- **Mounting** - On horizontal arbor above workpiece
- **Typical Specs** - 2.5" diameter, 12 teeth, high-speed steel or carbide

---

## Plain Indexing Formula

The simulation uses **Plain Indexing** with a standard 40-tooth worm wheel:

### Formula:
```
Crank Turns = 40 ÷ Number of Teeth on Gear Blank
```

### Examples:
- **24 Teeth**: 40 ÷ 24 = 1.667 turns = 1 turn + 2/3 turn
- **40 Teeth**: 40 ÷ 40 = 1 turn
- **30 Teeth**: 40 ÷ 30 = 1.333 turns = 1 turn + 1/3 turn

If the result is fractional, use the index plate's hole circles to dial in the precise fraction.

---

## Gear Cutting Workflow

### Setup Phase:
1. **Enter Number of Teeth** - Specify desired tooth count (12-120)
2. **Click "Setup Gear Blank"** - Initializes simulation with indexing calculations
3. **Verify Indexing** - Displays crank turns needed per tooth
4. **Configure Parameters**:
   - Spindle Speed (RPM)
   - Feed Rate (in/min)
   - Depth of Cut (in)

### Cutting Phase (Tooth-by-Tooth):
1. **Start Cutting** - Begins spindle rotation and first tooth cut
2. **Automatic Feed** - Table moves at set feed rate
3. **Automatic Indexing** - After each tooth is cut, machine indexes to next position
4. **Progress Display** - Shows which tooth is being cut (e.g., "Tooth 5 / 24")
5. **Repeat** - Process continues for all teeth
6. **Auto-Stop** - Stops when all teeth are complete

---

## Simulation Controls

### Control Panel (Right Side)

#### Machine Setup Section:
- **Total Teeth Input** - Set number of teeth (12-120)
- **Setup Gear Blank Button** - Initialize with gear parameters

#### Cutting Parameters Section:
- **Spindle Speed Slider** - Range: 50-400 RPM
- **Feed Rate Slider** - Range: 0.5-5 in/min
- **Depth of Cut Slider** - Range: 0.01-0.25 in

#### Indexing Control Section:
- **Indexing Method** - Select "Plain Indexing" (standard)
- **Index Information Display** - Shows crank turns calculation

#### Simulation Control Section:
- **▶ Start Cutting** - Begin the cutting simulation
- **⏸ Pause** - Pause (when running)
- **⏹ Stop** - Stop and return to idle
- **→ Next Tooth** - Manually skip to next tooth
- **↻ Reset** - Reset all progress
- **Simulation Speed Slider** - Adjust animation speed (0.1x - 5x)

#### Tool Information Section:
- Displays cutter specifications
- Module and Pitch information

#### Documentation Section:
- **? Help & Procedures** - Opens workflow guide
- **📊 Show Statistics** - Displays detailed metrics

### Viewport Controls (Top Right):
- **🔄 Rotate View** - Orbit camera around machine
- **🔍+ Zoom In** - Enlarge view
- **🔍- Zoom Out** - Reduce zoom

### Real-Time Display (Top Left):
- **Machine State** - Current spindle/feed status
- **Spindle Speed** - Current RPM
- **Depth of Cut** - Current cutting depth
- **Gear Tooth** - "X / Y" showing current tooth progress
- **Cutter Position** - World coordinates

---

## Calculations Explained

### 1. Cutting Speed (Vc)
```
Vc = π × D × N / 1000
Vc = Cutting speed (m/min)
D = Cutter diameter (mm)
N = Spindle speed (RPM)
```

**Typical for High-Speed Steel Gear Cutters:**
- Mild Steel: 60-100 m/min
- Alloy Steel: 40-60 m/min
- Cast Iron: 20-40 m/min

### 2. Feed Rate & Module
```
Module (M) = 25.4 ÷ Diametral Pitch (DP)
M = Tooth size in mm
```

**Example:**
- 20 DP (Diametral Pitch) → M ≈ 1.27 mm
- 10 DP → M ≈ 2.54 mm

### 3. Material Removal Rate (MRR)
```
MRR = Width × Depth × Feed Rate
MRR = Volume of material removed per minute
```

### 4. Cutting Force (Fc)
```
Fc = ks × Width × Chip Thickness
ks = Specific cutting force (~1800 N/mm² for steel)
```

### 5. Power Consumption (P)
```
P = (Fc × Vc) / 60,000
P = Power in kilowatts
```

### 6. Surface Finish (Ra)
```
Ra ≈ (Feed/Tooth)² / (8 × Radius)
Ra = Surface roughness in micrometers
```

Lower feed rates and larger cutter radii produce smoother surfaces.

---

## Physical Hardware Reference

### Indexing Head Specifications (from simulation)
- **Worm Wheel**: 40 teeth (standard)
- **Index Plate Holes**: Multiple circles for different divisions
- **Crank Movement**: Engages holes to rotate spindle precisely
- **Gear Ratio**: 40:1 (one worm rotation = 1/40 spindle rotation)

### Arbor Support
- **Position**: Overarm mounted above workpiece
- **Function**: Prevents arbor deflection during cutting
- **Adjustment**: Can be positioned along overarm based on cutter position

### Tail Stock
- **Type**: Live center (rotating)
- **Adjustment**: Quill movement via handwheel
- **Purpose**: Supports right end of gear blank

---

## Best Practices for Gear Cutting

### Spindle Speed Selection
1. Calculate cutting speed from material and cutter type
2. Use formula: N = (Vc × 1000) / (π × D)
3. Start conservative, increase as needed

### Feed Rate Guidelines
- **Rough Cut**: Higher feed (chipbreaking tooth form)
- **Finishing Cut**: Lower feed (smoother surface)
- Typical range: 0.5-5 in/min for manual machines

### Depth of Cut
- **Roughing**: 0.15-0.25 in (3.8-6.4 mm)
- **Finishing**: 0.05-0.10 in (1.3-2.5 mm)
- Never exceed machine capability

### Indexing Tips
- Always index in one direction (clockwise preferred)
- Use appropriate hole circle on index plate
- Check indexing accuracy with test cuts
- Use dividers/calculations to verify hole selection

---

## Simulation Features

### Realistic 3D Visualization
- ✓ Three-dimensional machine model with proper geometry
- ✓ Cast iron body colormapping
- ✓ Carbide cutting edge visualization
- ✓ Gear blank rotation during cutting
- ✓ Part labels with machine component identification
- ✓ Realistic lighting and shadows

### Interactive Controls
- ✓ Real-time parameter adjustment
- ✓ Orbit camera for 360° view
- ✓ Zoom in/out for detail inspection
- ✓ Pause/resume simulation

### Cutting Physics
- ✓ Tooth-by-tooth cutting progression with indexing
- ✓ Material removal visualization
- ✓ Cutting force and power calculations
- ✓ Surface finish predictions
- ✓ Automatic indexing between teeth

### Educational Content
- ✓ Step-by-step setup procedures
- ✓ Inline calculations and formulas
- ✓ Help modal with detailed procedures
- ✓ Indexing information display
- ✓ Machine state monitoring

---

## Technical Specifications

### Input Parameters:
| Parameter | Min | Max | Units | Default |
|-----------|-----|-----|-------|---------|
| Spindle Speed | 50 | 400 | RPM | 200 |
| Feed Rate | 0.5 | 5.0 | in/min | 2.0 |
| Depth of Cut | 0.01 | 0.25 | in | 0.10 |
| Number of Teeth | 12 | 120 | teeth | 24 |

### 3D Model:
- **Renderer**: Three.js (WebGL)
- **Geometry**: Procedurally generated cylinders, boxes, tori
- **Materials**: PBR (Physically-Based Rendering)
- **Shadows**: PCF Soft Shadows, real-time
- **Lighting**: Key + Fill + Accent lights with proper color temperature

### UI Framework:
- **HTML5 Canvas**: For 3D rendering
- **CSS3**: Modern styling with glassmorphism effects
- **JavaScript (ES6+)**: Modular architecture
- **Font**: Inter (UI), Orbitron (technical elements)

---

## File Structure

```
d:\HM\
├── index.html                          # Main HTML file
├── README_GEAR_CUTTING_SIMULATION.md  # This documentation
├── css/
│   └── styles.css                     # All styling (modern dark theme)
└── js/
    ├── machine.js                     # 3D machine model (Three.js)
    ├── simulation.js                  # Cutting physics & state machine
    ├── ui.js                          # Control panel logic
    ├── main.js                        # App initialization & workflows
    └── experiment.js                  # Experiment mode (optional)
```

---

## Usage Tips

### For Students:
1. Start with a simple gear (24 teeth)
2. Use recommended spindle speeds and feeds
3. Observe how changing parameters affects cutting
4. Check calculations in the help modal
5. Practice indexing calculations manually

### For Instructors:
1. Use to demonstrate machine components
2. Show tooth-by-tooth cutting progression
3. Discuss indexing calculations
4. Introduce cutting physics concepts
5. Compare different parameter combinations

### For Enthusiasts:
1. Experiment with different tooth counts
2. Observe cutting force changes
3. Optimize parameters for best surface finish
4. Learn traditional indexing methods
5. Appreciate mechanical machine design

---

## References

**Primary Source**: TC 9-524, Chapter 8 - Milling Operations (U.S. Army Technical Manual)

**Topics Covered**:
- Horizontal milling machine types and components
- Milling cutter classification and selection
- Indexing/dividing head operation
- Gear cutting procedures
- Cutting speed and feed calculations
- Safety precautions and best practices

**Key Sections**:
- Pages 8-1 to 8-31: Complete milling operations guide
- Figure 8-1: Milling machine configurations
- Figure 8-19: Indexing fixture details
- Table 8-1: Cutting speed recommendations
- Table 8-7: Involute gear cutter specifications

---

## Browser Compatibility

- ✓ Chrome/Edge 90+
- ✓ Firefox 88+
- ✓ Safari 14+
- ✓ Requires WebGL support

**Performance Notes**:
- Optimized for 1920x1080 resolution
- Smooth 60 FPS on modern GPUs
- Tested on Desktop machines
- Mobile support limited (touch controls not implemented)

---

## Troubleshooting

### Simulation won't start:
- Clear browser cache
- Check JavaScript console for errors
- Verify WebGL is enabled

### Choppy animation:
- Reduce simulation speed slider
- Close other browser tabs
- Check GPU drivers

### UI text too small:
- Use browser zoom (Ctrl/Cmd + Plus)
- Adjust browser font size settings

---

## Future Enhancements

Potential additions to the simulation:
- [ ] Helical gear cutting with lead angle
- [ ] Bevel gear cutting simulation
- [ ] Automatic toolpath generation
- [ ] G-code export
- [ ] CNC variant with automatic indexing
- [ ] Material strain/stress visualization
- [ ] Chip formation animation
- [ ] Multiple language support
- [ ] Touch/mobile gesture controls
- [ ] AR/VR integration

---

## License & Attribution

This simulation is created for educational purposes based on U.S. Army Technical Manual TC 9-524. 

**Educational Use**: Free to use in academic, training, and instructional contexts.

---

## Contact & Feedback

For questions, suggestions, or bug reports, please document the issue and browser information used.

---

**Last Updated**: April 3, 2026
**Version**: 1.0 - Initial Release
**Status**: Production Ready ✓
