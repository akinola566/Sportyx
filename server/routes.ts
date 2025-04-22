import express from "express";
import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { ZodError } from "zod";
import { loginSchema, insertUserSchema, activationCodeSchema } from "@shared/schema";
import bcrypt from "bcrypt";
import { nanoid } from "nanoid";
import session from "express-session";
import memorystore from "memorystore";

interface UserSession {
  userId: number;
  username: string;
}

declare module "express-session" {
  interface SessionData {
    user: UserSession;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Create session middleware
  const MemoryStore = memorystore(session);

  app.use(
    session({
      cookie: { maxAge: 86400000 }, // 24 hours
      store: new MemoryStore({
        checkPeriod: 86400000, // prune expired entries every 24h
      }),
      resave: false,
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET || "sports-prediction-secret",
    })
  );

  // Authentication middleware
  const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    if (!req.session.user) {
      return res.status(401).json({ message: "Authentication required" });
    }
    next();
  };

  // API Routes
  const apiRouter = express.Router();
  
  // Auth routes
  apiRouter.post("/auth/register", async (req: Request, res: Response) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUserByEmail = await storage.getUserByEmail(userData.email);
      if (existingUserByEmail) {
        return res.status(400).json({ message: "Email already in use" });
      }
      
      const existingUserByUsername = await storage.getUserByUsername(userData.username);
      if (existingUserByUsername) {
        return res.status(400).json({ message: "Username already in use" });
      }
      
      // Hash password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
      
      // Create user
      const user = await storage.createUser({
        email: userData.email,
        username: userData.username,
        password: hashedPassword,
        phoneNumber: userData.phoneNumber
      });
      
      res.status(201).json({ 
        message: "User registered successfully",
        userId: user.id 
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to register user" });
    }
  });
  
  apiRouter.post("/auth/login", async (req: Request, res: Response) => {
    try {
      const { emailOrUsername, password } = loginSchema.parse(req.body);
      
      // Find user by email or username
      let user = await storage.getUserByEmail(emailOrUsername);
      if (!user) {
        user = await storage.getUserByUsername(emailOrUsername);
      }
      
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Verify password
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Set user session
      req.session.user = {
        userId: user.id,
        username: user.username
      };
      
      res.status(200).json({ 
        message: "Login successful",
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          isIdActivated: user.isIdActivated
        }
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Login failed" });
    }
  });
  
  apiRouter.post("/auth/logout", (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to logout" });
      }
      res.clearCookie("connect.sid");
      res.status(200).json({ message: "Logged out successfully" });
    });
  });
  
  apiRouter.get("/auth/check", (req: Request, res: Response) => {
    if (req.session.user) {
      return res.status(200).json({ 
        isAuthenticated: true,
        user: req.session.user
      });
    }
    res.status(401).json({ isAuthenticated: false });
  });
  
  apiRouter.get("/auth/me", requireAuth, async (req: Request, res: Response) => {
    try {
      const user = await storage.getUser(req.session.user.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.status(200).json({
        id: user.id,
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber,
        isIdActivated: user.isIdActivated
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user data" });
    }
  });
  
  // User routes
  apiRouter.post("/user/activate", requireAuth, async (req: Request, res: Response) => {
    try {
      const { code } = activationCodeSchema.parse(req.body);
      
      // Check if code exists and is unused
      const activationCode = await storage.getActivationCode(code);
      if (!activationCode || activationCode.isUsed) {
        return res.status(400).json({ message: "Invalid activation code" });
      }
      
      // Update user activation status
      await storage.activateUser(req.session.user.userId, activationCode.id);
      
      res.status(200).json({ message: "Account activated successfully" });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to activate account" });
    }
  });
  
  apiRouter.get("/user/activation-status", requireAuth, async (req: Request, res: Response) => {
    try {
      const user = await storage.getUser(req.session.user.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.status(200).json({ isActivated: user.isIdActivated });
    } catch (error) {
      res.status(500).json({ message: "Failed to check activation status" });
    }
  });
  
  // Admin route to generate activation codes (in a real app, this would be protected)
  apiRouter.post("/admin/generate-activation-code", async (req: Request, res: Response) => {
    try {
      const code = nanoid(10); // Generate a unique code
      await storage.createActivationCode(code);
      
      res.status(201).json({ code });
    } catch (error) {
      res.status(500).json({ message: "Failed to generate activation code" });
    }
  });
  
  // Predictions routes
  apiRouter.get("/predictions", requireAuth, async (req: Request, res: Response) => {
    try {
      // Check if user is activated
      const user = await storage.getUser(req.session.user.userId);
      if (!user || !user.isIdActivated) {
        return res.status(403).json({ message: "Account not activated" });
      }
      
      const predictions = await storage.getPredictions();
      res.status(200).json(predictions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch predictions" });
    }
  });
  
  // Seed some predictions for demo purposes
  apiRouter.get("/seed", async (req: Request, res: Response) => {
    try {
      await storage.seedPredictions();
      res.status(200).json({ message: "Database seeded successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to seed database" });
    }
  });

  app.use("/api", apiRouter);

  const httpServer = createServer(app);

  return httpServer;
}
