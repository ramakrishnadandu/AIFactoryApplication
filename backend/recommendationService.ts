import express, { Request, Response } from 'express';
import { createLogger, transports, format } from 'winston';

// Setup logger
const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.colorize(),
        format.timestamp(),
        format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level}]: ${message}`;
        })
    ),
    transports: [new transports.Console()],
});

const app = express();
app.use(express.json());

type Task = {
    name: string;
    priority?: 'High' | 'Medium' | 'Low';
    deadline?: string;
    estimatedTime: number; // in minutes
};

interface UserProfile {
    role: string;
    goals: string[];
    tasks: Task[];
    availableTime: number; // in minutes
    energyLevel: 'Low' | 'Medium' | 'High';
    priorityAreas: string[];
    deadlines?: string[];
}

type Schedule = {
    timeBlocks: { taskName: string; start: string; end: string; }[];
    recommendedDeepWork: string[];
    breaks: string[];
    improvementHabit: string;
    learningActivity: string;
    motivationTip: string;
};

app.post('/recommendation', (req: Request, res: Response) => {
    try {
        const userProfile: UserProfile = req.body;

        // Categorize tasks by priority
        const highPriorityTasks = userProfile.tasks.filter(task => task.priority === 'High');
        const mediumPriorityTasks = userProfile.tasks.filter(task => task.priority === 'Medium');
        const lowPriorityTasks = userProfile.tasks.filter(task => task.priority === 'Low');

        // Break down tasks into manageable steps (simulated, refine logic as necessary)
        const allTasks = [highPriorityTasks, mediumPriorityTasks, lowPriorityTasks];

        // Time-blocking schedule creation
        let currentTime = new Date();
        const schedule: Schedule = { timeBlocks: [], recommendedDeepWork: [], breaks: [], improvementHabit: '', learningActivity: '', motivationTip: '' };
        let totalScheduledTime = 0;

        // Allocate time based on energy level and priority
        const energyFactor = userProfile.energyLevel === 'High' ? 1 : userProfile.energyLevel === 'Medium' ? 0.75 : 0.5;
        const maxFocusTime = energyFactor * 90; // Max 90 minutes session

        for (const priorityTasks of allTasks) {
            for (const task of priorityTasks) {
                if (totalScheduledTime >= userProfile.availableTime) break;

                const taskTime = Math.min(task.estimatedTime, maxFocusTime, userProfile.availableTime - totalScheduledTime);
                const taskEndTime = new Date(currentTime.getTime() + taskTime * 60000);

                schedule.timeBlocks.push({ taskName: task.name, start: currentTime.toTimeString().split(' ')[0], end: taskEndTime.toTimeString().split(' ')[0] });

                if (taskTime === maxFocusTime) {
                    schedule.recommendedDeepWork.push(task.name);
                    schedule.breaks.push(`Break after ${task.name}`);
                }

                currentTime = taskEndTime;
                totalScheduledTime += taskTime;
                if (totalScheduledTime >= userProfile.availableTime) break;
            }
        }

        // Add improvement habit and learning activity
        schedule.improvementHabit = "5-minute meditation for improving focus";
        schedule.learningActivity = "30 minutes reading tech blogs related to DevOps";

        // Motivation tip based on user's role
        schedule.motivationTip = "Remember, continuous improvement is better than delayed perfection.";

        res.status(200).json({
            schedule: schedule.timeBlocks,
            priorities: {
                high: highPriorityTasks,
                medium: mediumPriorityTasks,
                low: lowPriorityTasks,
            },
            deepWorkSessions: schedule.recommendedDeepWork,
            breaks: schedule.breaks,
            improvement: schedule.improvementHabit,
            learning: schedule.learningActivity,
            motivation: schedule.motivationTip,
        });

    } catch (error) {
        logger.error(`Error generating recommendation: ${error.message}`);
        res.status(500).json({ error: 'Error generating recommendation' });
    }
});

const PORT = 8003;
app.listen(PORT, () => {
    logger.info(`Recommendation Service running on port ${PORT}`);
});