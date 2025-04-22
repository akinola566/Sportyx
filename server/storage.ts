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
import { eq, desc } from "drizzle-orm";
import { db } from "./db";

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

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(userData: Omit<InsertUser, "confirmPassword">): Promise<User> {
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  }

  async updateUser(id: number, data: Partial<User>): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set(data)
      .where(eq(users.id, id))
      .returning();
    return updatedUser || undefined;
  }

  async getActivationCode(code: string): Promise<ActivationCodeType | undefined> {
    const [activationCode] = await db
      .select()
      .from(activationCodes)
      .where(eq(activationCodes.code, code));
    return activationCode || undefined;
  }

  async createActivationCode(code: string): Promise<ActivationCodeType> {
    const [activationCode] = await db
      .insert(activationCodes)
      .values({ code })
      .returning();
    return activationCode;
  }

  async activateUser(userId: number, codeId: number): Promise<boolean> {
    // Start a transaction to ensure both operations complete together
    return db.transaction(async (tx) => {
      // Update the user's activation status
      const [updatedUser] = await tx
        .update(users)
        .set({ isIdActivated: true })
        .where(eq(users.id, userId))
        .returning();

      if (!updatedUser) return false;

      // Mark the activation code as used
      const [updatedCode] = await tx
        .update(activationCodes)
        .set({ isUsed: true, usedById: userId })
        .where(eq(activationCodes.id, codeId))
        .returning();

      return !!updatedCode;
    });
  }

  async getPredictions(): Promise<Prediction[]> {
    return db.select().from(predictions).orderBy(desc(predictions.createdAt));
  }

  async getPrediction(id: number): Promise<Prediction | undefined> {
    const [prediction] = await db
      .select()
      .from(predictions)
      .where(eq(predictions.id, id));
    return prediction || undefined;
  }

  async createPrediction(predictionData: Omit<Prediction, "id" | "createdAt">): Promise<Prediction> {
    const [prediction] = await db
      .insert(predictions)
      .values(predictionData)
      .returning();
    return prediction;
  }

  async seedPredictions(): Promise<void> {
    // Sample predictions for testing
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

    // Insert all predictions
    await db.insert(predictions).values(samplePredictions);
  }
}

// Create default activation codes for testing
async function initializeDatabase() {
  const dbStorage = new DatabaseStorage();
  
  try {
    // Check if we have any activation codes, if not create initial ones
    const allCodes = await db.select().from(activationCodes);
    
    if (allCodes.length === 0) {
      console.log("Creating initial activation codes...");
      await dbStorage.createActivationCode("SPORTPRO123");
      await dbStorage.createActivationCode("WINNER456");
      await dbStorage.createActivationCode("PREDICT789");
    }
    
    // Check if we have any predictions, if not seed the predictions
    const allPredictions = await db.select().from(predictions);
    
    if (allPredictions.length === 0) {
      console.log("Seeding initial predictions...");
      await dbStorage.seedPredictions();
    }
  } catch (error) {
    console.error("Error initializing database:", error);
  }
}

// Use the database storage
export const storage = new DatabaseStorage();

// Initialize the database with test data
initializeDatabase().catch(console.error);
