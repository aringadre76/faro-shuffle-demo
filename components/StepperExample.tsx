import Stepper, { Step } from './Stepper';

export default function StepperExample() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Stepper
        initialStep={1}
        onStepChange={(step) => console.log('Step changed to:', step)}
        onFinalStepCompleted={() => console.log('All steps completed!')}
      >
        <Step>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome to the React Bits Stepper!</h2>
            <p className="text-gray-600 mb-6">
              This is the first step of our multi-step process. Click "Continue" to proceed.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-blue-800">
                The stepper component provides smooth animations and intuitive navigation between steps.
              </p>
            </div>
          </div>
        </Step>

        <Step>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Step 2: Configuration</h2>
            <p className="text-gray-600 mb-6">
              Here you can configure your settings. The stepper tracks your progress automatically.
            </p>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-green-800">
                Notice how the step indicators show your current position and completed steps.
              </p>
            </div>
          </div>
        </Step>

        <Step>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Step 3: Review</h2>
            <p className="text-gray-600 mb-6">
              Review your selections before completing the process.
            </p>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-yellow-800">
                You can navigate back to previous steps using the "Back" button or by clicking on step indicators.
              </p>
            </div>
          </div>
        </Step>

        <Step>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Final Step</h2>
            <p className="text-gray-600 mb-6">
              This is the final step. Click "Complete" to finish the process.
            </p>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-purple-800">
                The stepper will call the onFinalStepCompleted callback when you finish.
              </p>
            </div>
          </div>
        </Step>
      </Stepper>
    </div>
  );
}
