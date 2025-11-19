import { Pool } from 'pg';

// データベース接続（RenderのURLを使います）
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// GETリクエスト（/api/todos にアクセスが来た時）
export async function GET(request: Request) {
  try {
    const result = await pool.query('SELECT * FROM todos');
    return new Response(JSON.stringify(result.rows), { status: 200 });
  } catch (error) {
    return new Response('Server error', { status: 500 });
  }
}

// POSTリクエスト（/api/todos にデータが送られた時）
export async function POST(request: Request) {
  try {
    const { title } = await request.json();
    const queryText = 'INSERT INTO todos (title) VALUES ($1) RETURNING *';
    const result = await pool.query(queryText, [title]);
    return new Response(JSON.stringify(result.rows[0]), { status: 201 });
  } catch (error) {
    return new Response('Server error', { status: 500 });
  }
}