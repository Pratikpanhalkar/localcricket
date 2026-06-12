require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const JWT_SECRET = process.env.JWT_SECRET;
const SALT_ROUNDS = 10;

const EMAIL_USER = process.env.EMAIL_USER || "";
const EMAIL_PASS = process.env.EMAIL_PASS || "";
const APP_BASE_URL = process.env.APP_BASE_URL || "http://localhost:5173";

// ── Railway assigns a PORT env var; fall back to 3000 locally ────────────────
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use(express.json());
const allowedOrigins = process.env.APP_BASE_URL
  ? process.env.APP_BASE_URL.split(',').map(o => o.trim())
  : ['http://localhost:5173'];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, curl)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked: ${origin}`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "ejs");

// ─── DB CONNECTION ─────────────────────────────────────────────────────────────
// Railway provides MYSQL_URL (or MYSQLDATABASE, MYSQLHOST, etc.)
// We support both a full connection URL and individual env vars.
let connection;

if (process.env.MYSQL_URL || process.env.DATABASE_URL) {
  // Railway MySQL plugin exposes MYSQL_URL
  connection = mysql.createConnection(process.env.MYSQL_URL || process.env.DATABASE_URL);
} else {
  connection = mysql.createConnection({
    host:     process.env.MYSQLHOST     || process.env.DB_HOST     || "localhost",
    port:     process.env.MYSQLPORT     || process.env.DB_PORT     || 3306,
    user:     process.env.MYSQLUSER     || process.env.DB_USER     || "root",
    password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || "",
    database: process.env.MYSQLDATABASE || process.env.DB_NAME     || "Localcric",
  });
}

connection.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    process.exit(1); // Crash fast so Railway restarts with correct config
  } else {
    console.log("Connected to MySQL");
  }
});

// ─── NODEMAILER TRANSPORTER ────────────────────────────────────────────────────

// ─── AUTH MIDDLEWARE ───────────────────────────────────────────────────────────
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token. Please log in again." });
    }
    req.user = user;
    next();
  });
}

// ─── REGISTER ─────────────────────────────────────────────────────────────────
app.post("/register", async (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    return res.status(400).json({ message: "Username, email and password required" });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email address" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const sql = "INSERT INTO users (username, password, email) VALUES (?, ?, ?)";

    connection.query(sql, [username, hashedPassword, email], (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(409).json({ message: "Username or email already taken" });
        }
        console.error(err);
        return res.status(500).json({ message: "Database Error" });
      }
      res.json({ message: "Register Success" });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// ─── LOGIN ─────────────────────────────────────────────────────────────────────
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  const sql = "SELECT * FROM users WHERE username = ?";

  connection.query(sql, [username], async (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database Error" });
    }

    if (result.length === 0) {
      return res.status(401).json({ message: "Invalid Username or Password" });
    }

    const user = result[0];

    try {
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return res.status(401).json({ message: "Invalid Username or Password" });
      }

      const token = jwt.sign(
        { id: user.id, username: user.username },
        JWT_SECRET,
        { expiresIn: "8h" }
      );

      return res.json({
        message: "Login Success",
        id: user.id,
        username: user.username,
        token,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Server Error" });
    }
  });
});

// ─── FORGOT PASSWORD ───────────────────────────────────────────────────────────
app.post("/forgot-password", (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  connection.query("SELECT * FROM users WHERE email = ?", [email], async (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database Error" });
    }

    if (result.length === 0) {
      return res.json({
        message: "If that email is registered, you will receive a reset link shortly.",
      });
    }

    const user = result[0];

    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
    const expiry = new Date(Date.now() + 60 * 60 * 1000);

    const sql = "UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE id = ?";
    connection.query(sql, [hashedToken, expiry, user.id], async (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Database Error" });
      }

      const resetLink = `${APP_BASE_URL}/reset-password?token=${rawToken}&id=${user.id}`;

      const mailOptions = {
        from: `"LocalCric" <${EMAIL_USER}>`,
        to: user.email,
        subject: "LocalCric — Password Reset Request",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 520px; margin: auto; padding: 32px; border: 1px solid #e0e0e0; border-radius: 8px;">
            <h2 style="color: #1565C0; margin-bottom: 8px;">Password Reset</h2>
            <p>Hi <strong>${user.username}</strong>,</p>
            <p>We received a request to reset your LocalCric password. Click the button below to choose a new password.</p>
            <p style="margin: 32px 0;">
              <a href="${resetLink}"
                style="background:#1565C0; color:#fff; padding: 12px 28px; text-decoration:none; border-radius:6px; font-size:15px;">
                Reset My Password
              </a>
            </p>
            <p style="font-size:13px; color:#888;">
              This link expires in <strong>1 hour</strong>. If you didn't request a password reset, you can safely ignore this email.
            </p>
            <hr style="border:none; border-top:1px solid #eee; margin-top:32px;">
            <p style="font-size:12px; color:#aaa;">LocalCric &bull; Local Cricket Management</p>
          </div>
        `,
      };

      try {
  await fetch("https://api.brevo.com/v3/smtp/email", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "api-key": process.env.BREVO_API_KEY,
  },
  body: JSON.stringify({
    sender: { email: "pratikspstd@gmail.com", name: "LocalCric" },
    to: [{ email: user.email }],
    subject: "LocalCric — Password Reset Request",
    htmlContent: mailOptions.html,
  }),

});
res.json({
  message: "If that email is registered, you will receive a reset link shortly.",
});
} catch (mailErr) {
  console.error("Email send failed:", mailErr);
  res.status(500).json({ message: "Failed to send email. Please try again later." });
}
    });
  });
});

// ─── RESET PASSWORD ────────────────────────────────────────────────────────────
app.post("/reset-password", async (req, res) => {
  const { userId, token, newPassword } = req.body;

  if (!userId || !token || !newPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const sql = "SELECT * FROM users WHERE id = ? AND reset_token = ? AND reset_token_expiry > NOW()";

  connection.query(sql, [userId, hashedToken], async (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database Error" });
    }

    if (result.length === 0) {
      return res.status(400).json({ message: "Reset link is invalid or has expired. Please request a new one." });
    }

    try {
      const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
      const updateSql = "UPDATE users SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE id = ?";
      connection.query(updateSql, [hashedPassword, userId], (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Database Error" });
        }
        res.json({ message: "Password reset successfully. You can now log in." });
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server Error" });
    }
  });
});

// ─── PROTECTED ROUTES ──────────────────────────────────────────────────────────

app.post("/create_team", authenticateToken, (req, res) => {
  const { TeamName, playerCount } = req.body;
  const sql = "INSERT INTO teams (TeamName, playerCount) VALUES (?, ?)";
  connection.query(sql, [TeamName, playerCount], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database Error" });
    }
    res.json({ message: "Data Inserted Successfully" });
  });
});

app.post("/Addplayer", authenticateToken, (req, res) => {
  const { name, role } = req.body;
  const adminId = req.user.id;
  const sql = "INSERT INTO players (playerName, playerrole, admin_id) VALUES (?, ?, ?)";
  connection.query(sql, [name, role, adminId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database Error" });
    }
    res.json({ message: "Data Inserted Successfully" });
  });
});

app.delete("/DeletePlayer/:playerId", authenticateToken, (req, res) => {
  const playerId = req.params.playerId;
  const adminId = req.user.id;

  connection.query(
    "SELECT * FROM players WHERE Player_id = ? AND admin_id = ?",
    [playerId, adminId],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Database Error" });
      if (result.length === 0)
        return res.status(403).json({ message: "Player not found or access denied" });

      connection.query("DELETE FROM match_players WHERE player_id = ?", [playerId], (err) => {
        if (err) return res.status(500).json({ message: "Database Error" });

        connection.query("DELETE FROM players WHERE Player_id = ?", [playerId], (err) => {
          if (err) return res.status(500).json({ message: "Database Error" });
          res.json({ message: "Player Deleted Successfully" });
        });
      });
    }
  );
});

app.post("/CreateMatch", authenticateToken, (req, res) => {
  const { team1, team2, overs, matchDate } = req.body;
  const adminId = req.user.id;
  const sql = "INSERT INTO matches (team1_name, team2_name, overs, match_date, admin_id) VALUES (?,?,?,?,?)";
  connection.query(sql, [team1, team2, overs, matchDate, adminId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database Error" });
    }
    res.json({ message: "Match Created Successfully" });
  });
});

app.get("/GetPlayers", authenticateToken, (req, res) => {
  const adminId = req.user.id;
  connection.query("SELECT * FROM players WHERE admin_id = ?", [adminId], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

app.get("/PlayerProfile/:playerId", authenticateToken, (req, res) => {
  const playerId = req.params.playerId;
  const adminId  = req.user.id;

  const playerQuery = `SELECT * FROM players WHERE Player_id = ? AND admin_id = ?`;
  const battingQuery = `
    SELECT br.match_id, br.runs, br.balls, br.fours, br.sixes,
      CONCAT(m.team1_name, ' vs ', m.team2_name) AS match_name, m.match_date
    FROM batting_records br
    JOIN matches m ON br.match_id = m.id
    WHERE br.player_id = ? ORDER BY m.match_date DESC`;
  const bowlingQuery = `
    SELECT br.match_id, br.overs, br.runs_given, br.wickets,
      CONCAT(m.team1_name, ' vs ', m.team2_name) AS match_name, m.match_date
    FROM bowling_records br
    JOIN matches m ON br.match_id = m.id
    WHERE br.player_id = ? ORDER BY m.match_date DESC`;
  const historyQuery = `
    SELECT DISTINCT mp.match_id,
      CONCAT(m.team1_name, ' vs ', m.team2_name) AS match_name,
      m.match_date, mr.winner
    FROM match_players mp
    JOIN matches m ON mp.match_id = m.id
    LEFT JOIN match_results mr ON mr.match_id = m.id
    WHERE mp.player_id = ? ORDER BY m.match_date DESC`;

  connection.query(playerQuery, [playerId, adminId], (err, playerResult) => {
    if (err) return res.status(500).json({ message: "Database Error" });
    if (playerResult.length === 0)
      return res.status(404).json({ message: "Player not found or access denied" });

    const player = playerResult[0];
    connection.query(battingQuery, [playerId], (err, batting) => {
      if (err) return res.status(500).json({ message: "Database Error" });
      connection.query(bowlingQuery, [playerId], (err, bowling) => {
        if (err) return res.status(500).json({ message: "Database Error" });
        connection.query(historyQuery, [playerId], (err, matchHistory) => {
          if (err) return res.status(500).json({ message: "Database Error" });
          res.json({ player, batting, bowling, matchHistory });
        });
      });
    });
  });
});

app.get("/GetMatches", authenticateToken, (req, res) => {
  const adminId = req.user.id;
  connection.query("SELECT * FROM matches WHERE admin_id = ?", [adminId], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

app.post("/AddPlayersToMatch", authenticateToken, (req, res) => {
  const { matchId, teamAIds, teamBIds } = req.body;
  const teamA = teamAIds.split(",");
  const teamB = teamBIds.split(",");
  const values = [];
  teamA.forEach((id) => values.push([matchId, parseInt(id.trim()), "A"]));
  teamB.forEach((id) => values.push([matchId, parseInt(id.trim()), "B"]));
  const sql = "INSERT INTO match_players (match_id, player_id, team_side) VALUES ?";
  connection.query(sql, [values], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database Error" });
    }
    res.json({ message: "Players Assigned Successfully" });
  });
});

app.get("/GetMatchPlayers/:matchId", authenticateToken, (req, res) => {
  const matchId = req.params.matchId;
  const teamAQuery = `SELECT p.* FROM players p JOIN match_players mp ON p.Player_id = mp.player_id WHERE mp.match_id = ? AND mp.team_side = 'A'`;
  const teamBQuery = `SELECT p.* FROM players p JOIN match_players mp ON p.Player_id = mp.player_id WHERE mp.match_id = ? AND mp.team_side = 'B'`;
  connection.query(teamAQuery, [matchId], (err, teamA) => {
    if (err) return res.status(500).json(err);
    connection.query(teamBQuery, [matchId], (err, teamB) => {
      if (err) return res.status(500).json(err);
      res.json({ teamA, teamB });
    });
  });
});

app.post("/SaveBatting", authenticateToken, (req, res) => {
  const { matchId, records } = req.body;
  if (!records || !Array.isArray(records) || records.length === 0) {
    return res.status(400).json({ message: "No batting records to save" });
  }
  const values = records.map((r) => [matchId, r.player_id, r.runs, r.balls, r.fours, r.sixes]);
  connection.query("INSERT INTO batting_records (match_id, player_id, runs, balls, fours, sixes) VALUES ?", [values], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database Error" });
    }
    res.json({ message: "Batting Saved" });
  });
});

app.post("/SaveBowling", authenticateToken, (req, res) => {
  const { matchId, records } = req.body;
  if (!records || !Array.isArray(records) || records.length === 0) {
    return res.status(400).json({ message: "No bowling records received" });
  }
  const values = records.map((r) => [matchId, r.player_id, r.overs, r.runs_given, r.wickets]);
  connection.query("INSERT INTO bowling_records (match_id, player_id, overs, runs_given, wickets) VALUES ?", [values], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database Error" });
    }
    res.json({ message: "Bowling Saved" });
  });
});

app.post("/SaveMatchResult", authenticateToken, (req, res) => {
  const { matchId, winner } = req.body;
  const team1_score   = parseInt(req.body.team1_score)   || 0;
  const team1_wickets = parseInt(req.body.team1_wickets) || 0;
  const team2_score   = parseInt(req.body.team2_score)   || 0;
  const team2_wickets = parseInt(req.body.team2_wickets) || 0;
  const sql = `INSERT INTO match_results (match_id, team1_score, team1_wickets, team2_score, team2_wickets, winner) VALUES (?,?,?,?,?,?)`;
  connection.query(sql, [matchId, team1_score, team1_wickets, team2_score, team2_wickets, winner], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database Error" });
    }
    connection.query("UPDATE matches SET status='completed' WHERE id=?", [matchId]);
    res.json({ message: "Match Saved Successfully" });
  });
});

app.get("/analysis", authenticateToken, (req, res) => {
  const adminId = req.user.id;
  const queries = {
    topRuns:     `SELECT p.Player_id, p.playerName, SUM(br.runs) AS total_runs FROM batting_records br JOIN players p ON br.player_id = p.Player_id JOIN matches m ON br.match_id = m.id WHERE m.admin_id = ? GROUP BY br.player_id ORDER BY total_runs DESC LIMIT 10`,
    topWickets:  `SELECT p.Player_id, p.playerName, SUM(br.wickets) AS total_wickets FROM bowling_records br JOIN players p ON br.player_id = p.Player_id JOIN matches m ON br.match_id = m.id WHERE m.admin_id = ? GROUP BY br.player_id ORDER BY total_wickets DESC LIMIT 10`,
    strikeRate:  `SELECT p.Player_id, p.playerName, ROUND((SUM(br.runs)/SUM(br.balls))*100, 2) AS strike_rate FROM batting_records br JOIN players p ON br.player_id = p.Player_id JOIN matches m ON br.match_id = m.id WHERE m.admin_id = ? GROUP BY br.player_id HAVING SUM(br.balls) > 20 ORDER BY strike_rate DESC LIMIT 10`,
    economy:     `SELECT p.Player_id, p.playerName, ROUND(SUM(br.runs_given)/SUM(br.overs), 2) AS economy FROM bowling_records br JOIN players p ON br.player_id = p.Player_id JOIN matches m ON br.match_id = m.id WHERE m.admin_id = ? GROUP BY br.player_id HAVING SUM(br.overs) > 4 ORDER BY economy ASC LIMIT 10`,
    topInnings:  `SELECT p.playerName, b.runs, b.balls, CONCAT(m.team1_name, ' vs ', m.team2_name) AS match_name FROM batting_records b JOIN players p ON b.player_id = p.Player_id JOIN matches m ON b.match_id = m.id WHERE m.admin_id = ? ORDER BY b.runs DESC LIMIT 10`,
    bestBowling: `SELECT p.playerName, b.wickets, b.runs_given, CONCAT(m.team1_name, ' vs ', m.team2_name) AS match_name FROM bowling_records b JOIN players p ON b.player_id = p.Player_id JOIN matches m ON b.match_id = m.id WHERE m.admin_id = ? ORDER BY b.wickets DESC, b.runs_given ASC LIMIT 10`,
  };
  connection.query(queries.topRuns, [adminId], (err, topRuns) => {
    if (err) return res.status(500).json(err);
    connection.query(queries.topWickets, [adminId], (err, topWickets) => {
      if (err) return res.status(500).json(err);
      connection.query(queries.strikeRate, [adminId], (err, strikeRate) => {
        if (err) return res.status(500).json(err);
        connection.query(queries.economy, [adminId], (err, economy) => {
          if (err) return res.status(500).json(err);
          connection.query(queries.topInnings, [adminId], (err, topInnings) => {
            if (err) return res.status(500).json(err);
            connection.query(queries.bestBowling, [adminId], (err, bestBowling) => {
              if (err) return res.status(500).json(err);
              res.json({ topRuns, topWickets, strikeRate, economy, topInnings, bestBowling });
            });
          });
        });
      });
    });
  });
});

app.get("/MatchAnalysis/:matchId", authenticateToken, (req, res) => {
  const matchId = req.params.matchId;
  const matchQuery   = `SELECT * FROM matches WHERE id = ?`;
  const resultQuery  = `SELECT * FROM match_results WHERE match_id = ?`;
  const battingQuery = `SELECT p.playerName, br.runs, br.balls, br.fours, br.sixes, mp.team_side FROM batting_records br JOIN players p ON br.player_id = p.Player_id JOIN match_players mp ON mp.player_id = p.Player_id AND mp.match_id = br.match_id WHERE br.match_id = ?`;
  const bowlingQuery = `SELECT p.playerName, bw.overs, bw.runs_given, bw.wickets, mp.team_side FROM bowling_records bw JOIN players p ON bw.player_id = p.Player_id JOIN match_players mp ON mp.player_id = p.Player_id AND mp.match_id = bw.match_id WHERE bw.match_id = ?`;
  connection.query(matchQuery, [matchId], (err, match) => {
    if (err) return res.status(500).json(err);
    connection.query(resultQuery, [matchId], (err, result) => {
      if (err) return res.status(500).json(err);
      connection.query(battingQuery, [matchId], (err, batting) => {
        if (err) return res.status(500).json(err);
        connection.query(bowlingQuery, [matchId], (err, bowling) => {
          if (err) return res.status(500).json(err);
          res.json({ match: match[0], result: result[0], batting, bowling });
        });
      });
    });
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Working on port ${PORT}`);
});