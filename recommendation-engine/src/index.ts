import express, { Request, Response } from 'express';

// Type Definitions
interface UserInput {
  sleepTime: string;
  wakeTime: string;
  disturbances: number;
  stressLevels: number;
  caffeineIntake: number;
}

interface DeviceData {
  steps: number;
  heartRate: number[];
  sleepCycles: number[];
  screenTimeBeforeBed: number;
}

interface EnvironmentalInputs {
  noiseLevel?: number;
  lightExposure?: number;
  temperature?: number;
}

interface AnalysisResult {
  sleepScore: number;
  issuesDetected: string[];
  severity: 'mild' | 'moderate' | 'severe';
  rootCauses: string[];
  recommendations: Recommendation[];
  alerts: string[];
}

interface Recommendation {
  type: 'behavioral' | 'environmental' | 'medical';
  action: string;
  priority: 'high' | 'medium' | 'low';
}

// Utility Functions
const calculateSleepScore = (userInput: UserInput, deviceData: DeviceData): number => {
  // Simplified scoring algorithm
  let score = 100;
  score -= userInput.disturbances * 5;
  score -= userInput.stressLevels * 5;
  score -= Math.max(0, userInput.caffeineIntake - 1) * 3;
  score -= deviceData.screenTimeBeforeBed > 60 ? 10 : 0;

  return Math.max(0, Math.min(100, score));
};

const detectIssues = (userInput: UserInput, deviceData: DeviceData): string[] => {
  const issues = [];
  if (userInput.disturbances > 3) issues.push('Insomnia');
  if (userInput.stressLevels > 2) issues.push('Stress/anxiety-induced sleep issues');
  if (deviceData.screenTimeBeforeBed > 60) issues.push('Late-night screen usage');
  if (userInput.sleepTime !== 'consistent' || userInput.wakeTime !== 'consistent') {
    issues.push('Irregular sleep schedule');
  }
  return issues;
};

const determineSeverity = (issues: string[]): 'mild' | 'moderate' | 'severe' => {
  if (issues.length > 3) return 'severe';
  if (issues.length > 1) return 'moderate';
  return 'mild';
};

const generateRecommendations = (issues: string[]): Recommendation[] => {
  const recommendations = [];
  if (issues.includes('Late-night screen usage')) {
    recommendations.push({
      type: 'behavioral',
      action: 'Reduce screen time at least 1 hour before bed',
      priority: 'high'
    });
  }
  if (issues.includes('Irregular sleep schedule')) {
    recommendations.push({
      type: 'behavioral',
      action: 'Establish a consistent bedtime and wake-up time',
      priority: 'medium'
    });
  }
  // Add more recommendations based on detected issues
  return recommendations;
};

const assessEnvironment = (environmentalInputs?: EnvironmentalInputs): string[] => {
  const rootCauses = [];
  if (environmentalInputs?.noiseLevel && environmentalInputs.noiseLevel > 50) {
    rootCauses.push('High noise levels');
  }
  if (environmentalInputs?.lightExposure && environmentalInputs.lightExposure > 300) {
    rootCauses.push('Excessive light exposure');
  }
  // Add more root cause checks
  return rootCauses;
};

// Express App Setup
const app = express();
app.use(express.json());

app.post('/analyze', (req: Request, res: Response) => {
  const userInput: UserInput = req.body.userInput;
  const deviceData: DeviceData = req.body.deviceData;
  const environmentalInputs: EnvironmentalInputs = req.body.environmentalInputs;

  const issuesDetected = detectIssues(userInput, deviceData);
  const severity = determineSeverity(issuesDetected);
  const recommendations = generateRecommendations(issuesDetected);
  const rootCauses = assessEnvironment(environmentalInputs);

  const analysisResult: AnalysisResult = {
    sleepScore: calculateSleepScore(userInput, deviceData),
    issuesDetected,
    severity,
    rootCauses,
    recommendations,
    alerts: ['Consult a doctor if symptoms persist']
  };

  if (issuesDetected.includes('Possible sleep apnea risk detected')) {
    analysisResult.alerts.push('Possible sleep apnea risk detected');
  }

  res.json(analysisResult);
});

const PORT = 8002;
app.listen(PORT, () => {
  console.log(`Recommendation Engine running on port ${PORT}`);
});