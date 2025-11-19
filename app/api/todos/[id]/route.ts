import { Pool } from 'pg';
import { NextResponse, NextRequest } from 'next/server'; // NextRequestをインポート

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// URLからIDを自力で抜き出すヘルパー関数
function getIdFromUrl(url: string) {
  try {
    const segments = new URL(url).pathname.split('/');
    return parseInt(segments[segments.length - 1]); // URLの最後の部分（'1'など）を取得
  } catch (e) {
    return NaN;
  }
}

// PUT: 特定のTodoを更新
// 【重要】第1引数を NextRequest に変更
export async function PUT(request: NextRequest) {
  try {
    const id = getIdFromUrl(request.url); // URLからIDを抜き出す！
    const { title } = await request.json();
    
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const queryText = 'UPDATE todos SET title = $1 WHERE id = $2 RETURNING *';
    const result = await pool.query(queryText, [title, id]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
    }
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error(error); 
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// DELETE: 特定のTodoを削除
// 【重要】第1引数を NextRequest に変更
export async function DELETE(request: NextRequest) {
  try {
    const id = getIdFromUrl(request.url); // URLからIDを抜き出す！

    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const queryText = 'DELETE FROM todos WHERE id = $1 RETURNING *';
    const result = await pool.query(queryText, [id]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
    }
    return new Response(null, { status: 204 }); 
  } catch (error) {
    console.error(error); 
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}