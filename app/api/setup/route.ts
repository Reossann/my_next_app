import { Pool } from 'pg';
import { NextResponse } from 'next/server';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// データベースのテーブルを作成する関数
const createTable = async () => {
  const queryText = `
    CREATE TABLE IF NOT EXISTS todos (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
  try {
    await pool.query(queryText);
    return 'テーブルの準備ができました';
  } catch (err) {
    console.error(err);
    return 'テーブル作成に失敗しました';
  }
};

// GETリクエストが来たらテーブル作成を実行
export async function GET() {
  const message = await createTable();
  return NextResponse.json({ message: message });
}