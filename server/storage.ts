import { 
  users, 
  activationCodes, 
  predictions, 
  type User, 
  type InsertUser, 
  type ActivationCodeType,
  type InsertActivationCode,
  type Prediction
} from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: Omit<InsertUser, "confirmPassword">): Promise<User>;
  updateUser(id: number, data: Partial<User>): Promise<User | undefined>;
  
  getActivationCode(code: string): Promise<ActivationCodeType | undefined>;
  createActivationCode(code: string): Promise<ActivationCodeType>;
  activateUser(userId: number, codeId: number): Promise<boolean>;
  
  getPredictions(): Promise<Prediction[]>;
  getPrediction(id: number): Promise<Prediction | undefined>;
  createPrediction(prediction: Omit<Prediction, "id" | "createdAt">): Promise<Prediction>;
  seedPredictions(): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private activationCodes: Map<number, ActivationCodeType>;
  private predictions: Map<number, Prediction>;
  private userIdCounter: number;
  private codeIdCounter: number;
  private predictionIdCounter: number;

  constructor() {
    this.users = new Map();
    this.activationCodes = new Map();
    this.predictions = new Map();
    this.userIdCounter = 1;
    this.codeIdCounter = 1;
    this.predictionIdCounter = 1;
    
    // Add some initial activation codes for testing
    this.createActivationCode("SPORTPRO123");
    this.createActivationCode("WINNER456");
    this.createActivationCode("PREDICT789");
    
    // Seed predictions
    this.seedPredictions();
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );
  }

  async createUser(userData: Omit<InsertUser, "confirmPassword">): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();
    const user: User = { 
      ...userData, 
      id, 
      isIdActivated: false,
      createdAt: now.toISOString()
    };
    this.users.set(id, user);
    return user;
  }
  
  async updateUser(id: number, data: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser: User = { ...user, ...data };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  async getActivationCode(code: string): Promise<ActivationCodeType | undefined> {
    return Array.from(this.activationCodes.values()).find(
      (activationCode) => activationCode.code === code
    );
  }
  
  async createActivationCode(code: string): Promise<ActivationCodeType> {
    const id = this.codeIdCounter++;
    const now = new Date();
    const activationCode: ActivationCodeType = {
      id,
      code,
      isUsed: false,
      usedById: null,
      createdAt: now.toISOString()
    };
    this.activationCodes.set(id, activationCode);
    return activationCode;
  }
  
  async activateUser(userId: number, codeId: number): Promise<boolean> {
    const user = this.users.get(userId);
    const activationCode = this.activationCodes.get(codeId);
    
    if (!user || !activationCode) return false;
    
    // Update user activation status
    user.isIdActivated = true;
    this.users.set(userId, user);
    
    // Mark activation code as used
    activationCode.isUsed = true;
    activationCode.usedById = userId;
    this.activationCodes.set(codeId, activationCode);
    
    return true;
  }
  
  async getPredictions(): Promise<Prediction[]> {
    return Array.from(this.predictions.values()).sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }
  
  async getPrediction(id: number): Promise<Prediction | undefined> {
    return this.predictions.get(id);
  }
  
  async createPrediction(predictionData: Omit<Prediction, "id" | "createdAt">): Promise<Prediction> {
    const id = this.predictionIdCounter++;
    const now = new Date();
    const prediction: Prediction = {
      ...predictionData,
      id,
      createdAt: now.toISOString()
    };
    this.predictions.set(id, prediction);
    return prediction;
  }
  
  async seedPredictions(): Promise<void> {
    // Clear existing predictions
    this.predictions.clear();
    this.predictionIdCounter = 1;
    
    // Define sample predictions
    const samplePredictions = [
      {
        match: "Manchester City vs Liverpool",
        league: "Premier League",
        prediction: "Over 2.5",
        multiplier: "1.8x",
        time: "20:45",
        status: "Live"
      },
      {
        match: "Real Madrid vs Barcelona",
        league: "La Liga",
        prediction: "BTTS",
        multiplier: "1.95x",
        time: "21:00",
        status: "Upcoming"
      },
      {
        match: "Lakers vs Warriors",
        league: "NBA",
        prediction: "Warriors +3.5",
        multiplier: "1.75x",
        time: "03:30",
        status: "Live"
      },
      {
        match: "Djokovic vs Nadal",
        league: "ATP Finals",
        prediction: "Nadal Win",
        multiplier: "2.1x",
        time: "16:00",
        status: "Tomorrow"
      },
      {
        match: "Arsenal vs Tottenham",
        league: "Premier League",
        prediction: "Arsenal Win",
        multiplier: "1.9x",
        time: "17:30",
        status: "Tomorrow"
      },
      {
        match: "PSG vs Marseille",
        league: "Ligue 1",
        prediction: "Over 3.5",
        multiplier: "2.2x",
        time: "20:00",
        status: "Upcoming"
      },
      {
        match: "Bucks vs Celtics",
        league: "NBA",
        prediction: "Bucks -4.5",
        multiplier: "1.85x",
        time: "01:00",
        status: "Tomorrow"
      },
      {
        match: "Bayern Munich vs Dortmund",
        league: "Bundesliga",
        prediction: "Both Teams to Score",
        multiplier: "1.7x",
        time: "18:30",
        status: "Upcoming"
      }
    ];
    
    // Add predictions to storage
    for (const predData of samplePredictions) {
      await this.createPrediction(predData);
    }
  }
}

export const storage = new MemStorage();
