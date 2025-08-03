# WebWar3 - 3D Bear Character Demo

A React Three.js application featuring an animated 3D bear character with weapon systems and sound effects.

## Features

### 🐻 CharacterBearGLTF Component
- **Modular Design**: Fully customizable bear character with props for color, animation, and weapon
- **Optimized Performance**: Mobile-friendly with reduced complexity and efficient rendering
- **Animation System**: Smooth arm and leg animations for running and shooting states
- **Material System**: 5 different materials (main, dark, light, accent, black) for visual variety

### 🎯 Weapon System
- **Multiple Weapons**: AK-47, Pistol, Shotgun, Sword, and None options
- **Realistic Positioning**: Weapons are properly positioned relative to the bear's hands
- **Material Variety**: Different materials for weapon parts (metal, wood, dark gray)

### 🔊 Sound Integration
- **Audio Management**: Dedicated SoundManager component and useSoundManager hook
- **Sound Effects**: Rifle shooting, hurt sounds, and death sounds
- **Automatic Playback**: Sounds trigger automatically based on animation states

### 🎮 Interactive Demo
- **Real-time Controls**: Change color, animation, and weapon on the fly
- **Multiple Bears**: Showcase multiple characters with different configurations
- **Performance Stats**: Optional FPS and performance monitoring
- **3D Controls**: Orbit controls for camera manipulation
- **Mobile Joystick**: Touch-friendly joystick for mobile movement control

## Technical Specifications

### Bear Design
- **Body**: Main rectangular body at [0, 1.3, 0] with boxGeometry [1.2, 1.2, 0.8]
- **Head**: Square head at [0, 2.2, 0] with boxGeometry [0.9, 0.9, 0.9]
- **Snout**: Rectangular snout at [0, 2.0, 0.4] with boxGeometry [0.6, 0.4, 0.3]
- **Ears**: Two square ears at [-0.4, 2.6, 0] and [0.4, 2.6, 0]
- **Eyes**: Two small black eyes at [-0.2, 2.3, 0.45] and [0.2, 2.3, 0.45]
- **Nose**: Small black nose at [0, 2.0, 0.55]
- **Arms & Legs**: Animated limbs with paws and feet
- **Tail**: Square tail at [0, 1.2, -0.4]

### Animation System
- **useFrame Hook**: Continuous animation updates with delta time
- **Arm Rotation**: Math.sin(timeRef.current + offset) * 0.25 for running animations
- **Leg Rotation**: Math.sin(timeRef.current + offset) * 0.15 for running animations
- **Offset System**: Math.PI offset for right side, 0 for left side

### Performance Optimizations
- **Shadow Casting**: All meshes have castShadow and receiveShadow
- **Material Reuse**: useMemo for material creation and reuse
- **Mobile Optimization**: Reduced rotation values and complexity
- **Grouped Animation**: Arms and legs grouped for efficient animation

## Installation

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```

3. **Build for Production**:
   ```bash
   npm run build
   ```

## Mobile Controls

The application includes a touch-friendly joystick that appears automatically on mobile devices:

- **Joystick Position**: Bottom-left corner of the screen
- **Movement**: Drag the joystick handle to move the bear character
- **Auto-Animation**: Movement automatically triggers running animation
- **Touch Support**: Works with both touch and mouse input
- **Responsive**: Automatically detects mobile devices and shows joystick

## Usage

### Basic Character Usage
```jsx
import { CharacterBearGLTF } from './components/CharacterBearGLTF';

// Default bear
<CharacterBearGLTF />

// Customized bear
<CharacterBearGLTF 
  color="#ef4444"
  animation="Run"
  weapon="AK"
  position={[0, 0, 0]}
/>
```

### Sound Management
```jsx
import { useSoundManager } from './components/SoundManager';

function MyComponent() {
  const { playRifle, playHurt, playDead } = useSoundManager(0.5);
  
  const handleShoot = () => {
    playRifle();
  };
}
```

## Props

### CharacterBearGLTF Props
- `color` (string, default: "#3b82f6"): Primary color of the bear
- `animation` (string, default: "Idle"): Animation state ("Idle", "Run", "Run_Shoot", "Hurt", "Dead")
- `weapon` (string, default: "AK"): Weapon type ("None", "AK", "Pistol", "Shotgun", "Sword")
- `position` (array, default: [0, 0, 0]): Initial position of the bear
- `movement` (object, default: {x: 0, y: 0}): Movement vector for joystick control
- `...props`: All standard Three.js group props

### SoundManager Props
- `playRifle` (boolean): Trigger rifle sound
- `playHurt` (boolean): Trigger hurt sound
- `playDead` (boolean): Trigger death sound
- `volume` (number, default: 0.5): Audio volume (0-1)

## File Structure

```
src/
├── components/
│   ├── CharacterBearGLTF.jsx    # Main bear character component
│   ├── SoundManager.jsx         # Audio management component
│   ├── Joystick.jsx             # Mobile joystick control component
│   └── BearDemo.jsx             # Interactive demo scene
├── App.jsx                      # Main application component
├── main.jsx                     # Application entry point
└── index.css                    # Global styles

public/
├── rifle.mp3                    # Rifle shooting sound
├── hurt.mp3                     # Hurt sound effect
└── dead.mp3                     # Death sound effect
```

## Dependencies

- **React 18.2.0**: UI framework
- **@react-three/fiber 8.13.3**: React renderer for Three.js
- **@react-three/drei 9.75.0**: Useful helpers for React Three Fiber
- **Three.js 0.153.0**: 3D graphics library
- **Vite 4.1.0**: Build tool and dev server
- **Tailwind CSS 3.3.3**: Utility-first CSS framework

## Browser Support

- Modern browsers with WebGL support
- Mobile browsers (optimized for performance)
- Chrome, Firefox, Safari, Edge

## Performance Notes

- Optimized for 60fps on modern devices
- Reduced complexity for mobile performance
- Efficient material reuse and shadow casting
- Minimal geometry for fast rendering

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for your own applications! 