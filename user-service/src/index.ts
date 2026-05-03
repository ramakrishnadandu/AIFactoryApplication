import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';

const app = express();
const PORT = process.env.PORT || 8000;

app.use(bodyParser.json());

interface User {
  id: string;
  name: string;
}

interface SleepData {
  userId: string;
  date: Date;
  sleepDuration: number;
  questionnaire: {
    sleepTime: string;
    wakeTime: string;
    disturbances: number;
    stressLevels: number;
    caffeineIntake: number;
  };
  deviceData?: {
    steps?: number;
    heartRate?: number;
    sleepCycles?: number;
    screenTimeBeforeBed?: number;
  };
  environmentalData?: {
    noiseLevel?: number;
    lightExposure?: number;
    temperature?: number;
  };
}

interface SleepAnalysisResult {
  sleep_score: number;
  issue_detected: string[];
  severity: string;
  root_causes: string[];
  recommendations: Recommendation[];
  alerts: string[];
}

interface Recommendation {
  type: 'behavioral' | 'environmental' | 'medical';
  action: string;
  priority: 'high' | 'medium' | 'low';
}

app.post('/analyze-sleep', async (req, res) => {
  const sleepData: SleepData = req.body;

  try {
    const analysisResponse = await axios.post<SleepAnalysisResult>('http://localhost:8001/analyze', sleepData);
    const analysisResult = analysisResponse.data;

    const userResponse = await axios.get<User>(`http://localhost:8000/users/${sleepData.userId}`);
    const user = userResponse.data;

    const recommendationsResponse = await axios.post<Recommendation[]>('http://localhost:8002/recommendations', {
      sleepAnalysis: analysisResult,
      user
    });

    const finalResult = {
      ...analysisResult,
      recommendations: recommendationsResponse.data
    };

    res.json(finalResult);
  } catch (error) {
    console.error('Error analyzing sleep data:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`User Service running on port ${PORT}`);
});