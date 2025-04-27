import express, { Request, Response, NextFunction } from 'express'; // Додаємо NextFunction
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import pool from './db';
import dotenv from 'dotenv';
import { RowDataPacket } from 'mysql2/promise';

require('dotenv').config();

const app = express();
app.use(cors({
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Додай OPTIONS
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // Якщо потрібні куки або авторизаційні заголовки
}));

app.use((req, res, next) => {
  console.log(`Отримано запит: ${req.method} ${req.url}`);
  next();
});

app.use(express.json());

interface User extends RowDataPacket {
  id: number;
  username: string;
  password_hash: string;
  email: string | null;
  firstName?: string;
  lastName?: string;
  address?: string;
  created_at: string;
}

interface Product extends RowDataPacket {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  subcategory: string;
  description?: string;
  popularity?: number;
}

interface JwtPayload {
  userId: number;
}

const requiredEnvVars = ['JWT_SECRET', 'PORT'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Змінна середовища ${envVar} не визначена!`);
  }
}

// Middleware для перевірки токена
const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Токен відсутній або невірний формат' });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env['JWT_SECRET']!) as JwtPayload;
    (req as any).user = decoded;
    next();
  } catch (error: any) {
    res.status(401).json({ error: 'Невірний токен', details: error.message });
    return;
  }
};

// Реєстрація
app.post('/api/register', async (req: Request, res: Response) => {
  try {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
      return res.status(400).json({ error: 'Усі поля (username, password, email) є обов’язковими' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.execute(
      'INSERT INTO users (username, password_hash, email) VALUES (?, ?, ?)',
      [username, hashedPassword, email]
    );
    return res.status(201).json({ message: 'Користувач зареєстрований' });
  } catch (error: any) {
    return res.status(500).json({ error: 'Помилка реєстрації', details: error.message });
  }
});

// Логін
app.post('/api/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const [rows] = await pool.execute('SELECT * FROM users WHERE username = ?', [username]) as [User[], any];
    const user = rows[0];

    if (!user) {
      return res.status(401).json({ error: 'Невірний логін або пароль' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Невірний логін або пароль' });
    }

    const token = jwt.sign({ userId: user.id }, process.env['JWT_SECRET']!, { expiresIn: '1h' });
    return res.json({ token });
  } catch (error: any) {
    return res.status(500).json({ error: 'Помилка авторизації', details: error.message });
  }
});

// Отримання даних користувача
app.get('/api/user', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [userId]) as [User[], any];
    const user = rows[0];

    if (!user) {
      return res.status(404).json({ error: 'Користувача не знайдено' });
    }

    return res.json(user);
  } catch (error: any) {
    return res.status(500).json({ error: 'Помилка отримання даних', details: error.message });
  }
});

// Оновлення даних користувача
app.put('/api/user', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { firstName, lastName, address } = req.body;

    await pool.execute(
      'UPDATE users SET firstName = ?, lastName = ?, address = ? WHERE id = ?',
      [firstName || null, lastName || null, address || null, userId]
    );

    const [updatedRows] = await pool.execute('SELECT * FROM users WHERE id = ?', [userId]) as [User[], any];
    const updatedUser = updatedRows[0];

    return res.json(updatedUser);
  } catch (error: any) {
    return res.status(500).json({ error: 'Помилка оновлення даних', details: error.message });
  }
});

// Отримання всіх продуктів
app.get('/api/products', async (req: Request, res: Response) => {
  try {
    const { category, subcategory } = req.query;
    let query = 'SELECT * FROM products';
    const params: any[] = [];

    if (category) {
      query += ' WHERE category = ?';
      params.push(category);
      if (subcategory) {
        query += ' AND subcategory = ?';
        params.push(subcategory);
      }
    }

    const [rows] = await pool.execute(query, params) as [Product[], any];
    return res.json(rows);
  } catch (error: any) {
    return res.status(500).json({ error: 'Помилка отримання продуктів', details: error.message });
  }
});

// Отримання продукту за ID
app.get('/api/products/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute('SELECT * FROM products WHERE id = ?', [id]) as [Product[], any];
    const product = rows[0];

    if (!product) {
      return res.status(404).json({ error: 'Продукт не знайдено' });
    }

    return res.json(product);
  } catch (error: any) {
    return res.status(500).json({ error: 'Помилка отримання продукту', details: error.message });
  }
});

// Захищений маршрут (для тестування)
app.get('/api/protected', authenticateToken, (req: Request, res: Response) => {
  return res.json({ message: 'Доступ дозволено', userId: (req as any).user.userId });
});

const PORT = parseInt(process.env['PORT']!, 10);
app.listen(PORT, () => {
  console.log(`Сервер запущено на порту ${PORT}`);
});
