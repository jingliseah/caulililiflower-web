import pkg from 'pg';
const { Pool } = pkg

const pool = new Pool({
  user: 'jingli',
  host: 'localhost',
  database: 'jingli',
  password: '',
  port: 5432,
});

export default pool;