import { Pool } from 'pg';
import { NextResponse } from 'next/server';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// GET: 全てのTodoを取得
export async function GET(request: Request) {
  try {
    const result = await pool.query('SELECT * FROM todos ORDER BY id ASC');
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// POST: 新しいTodoを作成
export async function POST(request: Request) {
  try {
    const { title } = await request.json();
    const queryText = 'INSERT INTO todos (title) VALUES ($1) RETURNING *';
    const result = await pool.query(queryText, [title]);
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}