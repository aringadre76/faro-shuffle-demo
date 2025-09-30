'use client';

import { useState } from 'react';
import Aurora from './Aurora';
import Particles from './Particles';
import Galaxy from './Galaxy';
import Cubes from './Cubes';
import AnimatedList from './AnimatedList';
import SplitText from './SplitText';
import Stepper, { Step } from './Stepper';

export default function AnimationShowcase() {
  const [activeBackground, setActiveBackground] = useState<'aurora' | 'particles' | 'galaxy'>('aurora');
  const [showCubes, setShowCubes] = useState(false);
  const [showList, setShowList] = useState(false);
  const [showStepper, setShowStepper] = useState(false);

  const listItems = [
    'React Components',
    'Animated Backgrounds',
    'Interactive Elements',
    'Smooth Transitions',
    'Modern UI Design',
    'Creative Animations',
    'User Experience',
    'Visual Effects'
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Components */}
      <div className="absolute inset-0 z-0">
        {activeBackground === 'aurora' && (
          <Aurora
            colorStops={['#3A29FF', '#FF94B4', '#FF3232']}
            speed={1.0}
            blend={0.5}
            amplitude={1.0}
          />
        )}
        {activeBackground === 'particles' && (
          <Particles
            particleCount={200}
            particleSpread={10}
            speed={0.1}
            particleColors={['#ffffff', '#3A29FF', '#FF94B4']}
            moveParticlesOnHover={true}
            particleHoverFactor={1}
            alphaParticles={false}
            particleBaseSize={100}
            sizeRandomness={1}
            cameraDistance={20}
            disableRotation={false}
          />
        )}
        {activeBackground === 'galaxy' && (
          <Galaxy
            focal={[0.5, 0.5]}
            rotation={[1.0, 0.0]}
            starSpeed={0.5}
            density={1}
            hueShift={140}
            disableAnimation={false}
            speed={1.0}
            mouseInteraction={true}
            glowIntensity={0.3}
            saturation={0.0}
            mouseRepulsion={true}
            twinkleIntensity={0.3}
            rotationSpeed={0.1}
            repulsionStrength={2}
            autoCenterRepulsion={0}
            transparent={true}
          />
        )}
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-8">
        <div className="max-w-4xl w-full space-y-12">
          {/* Header */}
          <div className="text-center space-y-6">
            <SplitText
              text="React Bits Animation Showcase"
              className="text-6xl font-bold text-white"
              delay={50}
              duration={0.8}
              ease="power3.out"
              splitType="chars"
              from={{ opacity: 0, y: 50 }}
              to={{ opacity: 1, y: 0 }}
            />
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Explore the power of animated React components with beautiful backgrounds and interactive elements
            </p>
          </div>

          {/* Background Controls */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setActiveBackground('aurora')}
              className={`px-6 py-3 rounded-full font-medium transition-all ${
                activeBackground === 'aurora'
                  ? 'bg-white text-black'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              Aurora
            </button>
            <button
              onClick={() => setActiveBackground('particles')}
              className={`px-6 py-3 rounded-full font-medium transition-all ${
                activeBackground === 'particles'
                  ? 'bg-white text-black'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              Particles
            </button>
            <button
              onClick={() => setActiveBackground('galaxy')}
              className={`px-6 py-3 rounded-full font-medium transition-all ${
                activeBackground === 'galaxy'
                  ? 'bg-white text-black'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              Galaxy
            </button>
          </div>

          {/* Interactive Components */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button
              onClick={() => setShowCubes(!showCubes)}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 text-white hover:bg-white/20 transition-all"
            >
              <h3 className="text-xl font-semibold mb-2">3D Cubes</h3>
              <p className="text-white/70">Interactive 3D cube grid with tilt effects</p>
            </button>

            <button
              onClick={() => setShowList(!showList)}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 text-white hover:bg-white/20 transition-all"
            >
              <h3 className="text-xl font-semibold mb-2">Animated List</h3>
              <p className="text-white/70">Scrollable list with smooth animations</p>
            </button>

            <button
              onClick={() => setShowStepper(!showStepper)}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 text-white hover:bg-white/20 transition-all"
            >
              <h3 className="text-xl font-semibold mb-2">Stepper</h3>
              <p className="text-white/70">Multi-step form with progress indicators</p>
            </button>
          </div>

          {/* Component Displays */}
          {showCubes && (
            <div className="bg-black/50 backdrop-blur-sm border border-white/20 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6 text-center">3D Cubes Animation</h3>
              <Cubes
                gridSize={8}
                maxAngle={45}
                radius={3}
                easing="power3.out"
                duration={{ enter: 0.3, leave: 0.6 }}
                borderStyle="1px solid #fff"
                faceColor="#060010"
                shadow={false}
                autoAnimate={true}
                rippleOnClick={true}
                rippleColor="#fff"
                rippleSpeed={2}
              />
            </div>
          )}

          {showList && (
            <div className="bg-black/50 backdrop-blur-sm border border-white/20 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6 text-center">Animated List</h3>
              <div className="max-w-md mx-auto">
                <AnimatedList
                  items={listItems}
                  onItemSelect={(item, index) => console.log('Selected:', item, index)}
                  showGradients={true}
                  enableArrowNavigation={true}
                  className="h-64"
                  itemClassName="text-white"
                  displayScrollbar={true}
                  initialSelectedIndex={-1}
                />
              </div>
            </div>
          )}

          {showStepper && (
            <div className="bg-black/50 backdrop-blur-sm border border-white/20 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6 text-center">Multi-Step Form</h3>
              <Stepper
                initialStep={1}
                onStepChange={(step) => console.log('Step changed to:', step)}
                onFinalStepCompleted={() => console.log('All steps completed!')}
              >
                <Step>
                  <div className="text-center text-white">
                    <h4 className="text-xl font-semibold mb-4">Welcome!</h4>
                    <p>This is the first step of our demo stepper.</p>
                  </div>
                </Step>
                <Step>
                  <div className="text-center text-white">
                    <h4 className="text-xl font-semibold mb-4">Configuration</h4>
                    <p>Configure your settings in this step.</p>
                  </div>
                </Step>
                <Step>
                  <div className="text-center text-white">
                    <h4 className="text-xl font-semibold mb-4">Review</h4>
                    <p>Review your selections before completing.</p>
                  </div>
                </Step>
              </Stepper>
            </div>
          )}

          {/* Footer */}
          <div className="text-center text-white/60">
            <p>Built with React Bits - Animated UI Components</p>
          </div>
        </div>
      </div>
    </div>
  );
}
