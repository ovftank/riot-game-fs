import Database from 'better-sqlite3';
import { join } from 'path';
import type { DbTransaction, DBInstance, RiotAccountQueries, EmailQueries, AdminQueries, ProxyQueries, TelegramQueries } from '@/types';

const db: DBInstance = new Database(join(process.cwd(), 'riot_game.db'));

db.pragma('foreign_keys = ON');
db.pragma('journal_mode = WAL');
db.pragma('synchronous = OFF');
db.pragma('cache_size = -64000');
db.pragma('temp_store = MEMORY');
db.pragma('mmap_size = 268435456');
db.pragma('page_size = 4096');
db.pragma('wal_autocheckpoint = 0');
db.pragma('busy_timeout = 30000');

const createRiotAccountsTable = () => {
    const sql = `--sql
    CREATE TABLE IF NOT EXISTS riot_accounts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      email TEXT NOT NULL DEFAULT '',
      created_at TEXT DEFAULT (datetime('now', '+7 hours'))
    )
  `;
    db.exec(sql);
};

const createEmailTable = () => {
    const sql = `--sql
    CREATE TABLE IF NOT EXISTS email (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      email TEXT NOT NULL,
      updated_at TEXT DEFAULT (datetime('now', '+7 hours'))
    )
  `;
    db.exec(sql);
};

const createAdminTable = () => {
    const sql = `--sql
    CREATE TABLE IF NOT EXISTS admin (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      last_login TEXT DEFAULT (datetime('now', '+7 hours'))
    )
  `;
    db.exec(sql);
};

const createProxyConfigTable = () => {
    const sql = `--sql
    CREATE TABLE IF NOT EXISTS proxy_config (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      host TEXT DEFAULT '',
      port INTEGER DEFAULT 0,
      username TEXT DEFAULT '',
      password TEXT DEFAULT '',
      protocol TEXT CHECK (protocol IN ('http', 'https', 'socks4', 'socks5')) DEFAULT 'http',
      enabled INTEGER DEFAULT 0,
      updated_at TEXT DEFAULT (datetime('now', '+7 hours'))
    )
  `;
    db.exec(sql);
};

const createTelegramConfigTable = () => {
    const sql = `--sql
    CREATE TABLE IF NOT EXISTS telegram_config (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      bot_token TEXT DEFAULT '',
      chat_id INTEGER DEFAULT 0,
      updated_at TEXT DEFAULT (datetime('now', '+7 hours'))
    )
  `;
    db.exec(sql);
};

const createIndexes = () => {
    const indexes = [
        `--sql
        CREATE INDEX IF NOT EXISTS riot_idx_accounts_username ON riot_accounts(username)`,
        `--sql
        CREATE INDEX IF NOT EXISTS riot_idx_accounts_email ON riot_accounts(email)`,
        `--sql
        CREATE INDEX IF NOT EXISTS riot_idx_accounts_created_at ON riot_accounts(created_at)`,
        `--sql
        CREATE INDEX IF NOT EXISTS riot_idx_email_email ON email(email)`,
        `--sql
        CREATE INDEX IF NOT EXISTS riot_idx_admin_username ON admin(username)`
    ];

    indexes.forEach((sql) => db.exec(sql));
};

const createTriggers = () => {
    const triggers = [
        `--sql
        CREATE TRIGGER IF NOT EXISTS riot_trigger_email_updated_at
        AFTER UPDATE ON email
        FOR EACH ROW
        BEGIN
            UPDATE email SET updated_at = datetime('now', '+7 hours') WHERE id = NEW.id;
        END`,
        `--sql
        CREATE TRIGGER IF NOT EXISTS riot_trigger_proxy_updated_at
        AFTER UPDATE ON proxy_config
        FOR EACH ROW
        BEGIN
            UPDATE proxy_config SET updated_at = datetime('now', '+7 hours') WHERE id = NEW.id;
        END`,
        `--sql
        CREATE TRIGGER IF NOT EXISTS riot_trigger_telegram_updated_at
        AFTER UPDATE ON telegram_config
        FOR EACH ROW
        BEGIN
            UPDATE telegram_config SET updated_at = datetime('now', '+7 hours') WHERE id = NEW.id;
        END`
    ];

    triggers.forEach((sql) => db.exec(sql));
};

const createTables: DbTransaction = db.transaction(() => {
    createRiotAccountsTable();
    createEmailTable();
    createAdminTable();
    createProxyConfigTable();
    createTelegramConfigTable();
    createIndexes();
    createTriggers();
});
let riotAccountQueries: RiotAccountQueries;
let emailQueries: EmailQueries;
let adminQueries: AdminQueries;
let proxyQueries: ProxyQueries;
let telegramQueries: TelegramQueries;

const initQueries = () => {
    riotAccountQueries = {
        insert: db.prepare(`--sql
            INSERT INTO riot_accounts (username, password, email)
            VALUES (?, ?, ?)
        `),
        findByUsername: db.prepare(`--sql
            SELECT * FROM riot_accounts WHERE username = ?
        `),

        findAll: db.prepare(`--sql
            SELECT * FROM riot_accounts ORDER BY created_at DESC
        `),

        delete: db.prepare(`--sql
            DELETE FROM riot_accounts WHERE id = ?
        `),

        updatePassword: db.prepare(`--sql
            UPDATE riot_accounts SET password = ? WHERE username = ?
        `),

        count: db
            .prepare(
                `--sql
            SELECT COUNT(*) FROM riot_accounts
        `
            )
            .pluck()
    };

    emailQueries = {
        upsert: db.prepare(`--sql
            INSERT OR REPLACE INTO email (id, email)
            VALUES (1, ?)
        `),

        get: db.prepare(`--sql
            SELECT * FROM email WHERE id = 1
        `)
    };

    adminQueries = {
        upsert: db.prepare(`--sql
            INSERT OR REPLACE INTO admin (id, username, password, last_login)
            VALUES (1, ?, ?, datetime('now', '+7 hours'))
        `),

        get: db.prepare(`--sql
            SELECT * FROM admin WHERE id = 1
        `),

        writeLastLogin: db.prepare(`--sql
            UPDATE admin SET last_login = datetime('now', '+7 hours') WHERE id = 1
        `),

        changePassword: db.prepare(`--sql
            UPDATE admin SET password = ? WHERE id = 1
        `)
    };

    proxyQueries = {
        upsert: db.prepare(`--sql
            INSERT OR REPLACE INTO proxy_config
            (id, host, port, username, password, protocol, enabled)
            VALUES (1, ?, ?, ?, ?, ?, ?)
        `),

        get: db.prepare(`--sql
            SELECT * FROM proxy_config WHERE id = 1
        `),

        toggle: db.prepare(`--sql
            UPDATE proxy_config
            SET enabled = ?
            WHERE id = 1
        `)
    };

    telegramQueries = {
        upsert: db.prepare(`--sql
            INSERT OR REPLACE INTO telegram_config
            (id, bot_token, chat_id)
            VALUES (1, ?, ?)
        `),

        get: db.prepare(`--sql
            SELECT * FROM telegram_config WHERE id = 1
        `)
    };
};

const initDatabase = () => {
    createTables();
    initQueries();
};

const closeDatabase = () => {
    if (db.open) {
        db.close();
    }
};

const getRiotAccountQueries = (): RiotAccountQueries => {
    if (!riotAccountQueries) throw new Error('Database not initialized');
    return riotAccountQueries;
};
const getEmailQueries = (): EmailQueries => {
    if (!emailQueries) throw new Error('Database not initialized');
    return emailQueries;
};
const getAdminQueries = (): AdminQueries => {
    if (!adminQueries) throw new Error('Database not initialized');
    return adminQueries;
};
const getProxyQueries = (): ProxyQueries => {
    if (!proxyQueries) throw new Error('Database not initialized');
    return proxyQueries;
};
const getTelegramQueries = (): TelegramQueries => {
    if (!telegramQueries) throw new Error('Database not initialized');
    return telegramQueries;
};

export { db, initDatabase, closeDatabase, getRiotAccountQueries, getEmailQueries, getAdminQueries, getProxyQueries, getTelegramQueries };
export default db;
