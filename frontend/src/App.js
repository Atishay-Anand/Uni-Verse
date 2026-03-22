import Login from "./services/Login";
import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid
} from "recharts";

function App() {

  // ================= LOGIN STATE =================
  const [userId, setUserId] = useState(null);

  // ================= STATES =================
  const [data, setData] = useState({});
  const [chartData, setChartData] = useState([]);

  const [subject, setSubject] = useState("");
  const [status, setStatus] = useState("Present");

  const [moodRating, setMoodRating] = useState(5);
  const [note, setNote] = useState("");

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");

  // ================= FETCH DASHBOARD =================
  useEffect(() => {
    if (userId) {
      fetchDashboard();
    }
  }, [userId]);

  const fetchDashboard = () => {
    fetch(`http://localhost:5000/api/dashboard?userId=${userId}`)
      .then(res => res.json())
      .then(res => {
        setData(res);

        setChartData([
          { name: "Attendance", value: parseFloat(res.attendance) || 0 },
          { name: "Expense", value: res.expense || 0 }
        ]);
      });
  };

  // ================= ADD ATTENDANCE =================
  const addAttendance = () => {
    if (!subject) {
      alert("Enter subject!");
      return;
    }

    fetch("http://localhost:5000/api/attendance", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userId,
        subject,
        status
      })
    })
      .then(res => res.json())
      .then(() => {
        setSubject("");
        fetchDashboard();
      });
  };

  // ================= ADD MOOD =================
  const addMood = () => {
    fetch("http://localhost:5000/api/mood", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userId,
        rating: Number(moodRating),
        note
      })
    })
      .then(res => res.json())
      .then(() => {
        setNote("");
        fetchDashboard();
      });
  };

  // ================= ADD EXPENSE =================
  const addExpense = () => {
    if (!amount || !category) {
      alert("Enter all fields!");
      return;
    }

    fetch("http://localhost:5000/api/expense", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userId,
        amount: Number(amount),
        category
      })
    })
      .then(res => res.json())
      .then(() => {
        setAmount("");
        setCategory("");
        fetchDashboard();
      });
  };

  // ================= LOGIN SCREEN =================
  if (!userId) {
    return <Login setUserId={setUserId} />;
  }

  // ================= UI =================
  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>

      <h1>🌌 Uni-Verse Dashboard</h1>

      {/* ===== CARDS ===== */}

      <div style={card}>
        <h2>📊 Attendance</h2>
        <p>{data.attendance}</p>
      </div>

      <div style={card}>
        <h2>😊 Mood</h2>
        <p style={{
          color: data.mood?.includes("🔥") ? "red" : "green"
        }}>
          {data.mood}
        </p>
      </div>

      <div style={card}>
        <h2>💰 Expense</h2>
        <p>₹ {data.expense}</p>
      </div>

      {/* ===== GRAPH ===== */}

      <div style={card}>
        <h2>📈 Analytics Graph</h2>

        <BarChart width={400} height={300} data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" />
        </BarChart>
      </div>

      {/* ===== ADD ATTENDANCE ===== */}

      <div style={card}>
        <h2>➕ Add Attendance</h2>

        <input
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          style={input}
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={input}
        >
          <option>Present</option>
          <option>Absent</option>
        </select>

        <button onClick={addAttendance} style={button}>
          Add
        </button>
      </div>

      {/* ===== ADD MOOD ===== */}

      <div style={card}>
        <h2>😊 Add Mood</h2>

        <input
          type="number"
          min="1"
          max="5"
          value={moodRating}
          onChange={(e) => setMoodRating(e.target.value)}
          style={input}
        />

        <input
          placeholder="Note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          style={input}
        />

        <button onClick={addMood} style={button}>
          Add Mood
        </button>
      </div>

      {/* ===== ADD EXPENSE ===== */}

      <div style={card}>
        <h2>💰 Add Expense</h2>

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={input}
        />

        <input
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={input}
        />

        <button onClick={addExpense} style={button}>
          Add Expense
        </button>
      </div>

    </div>
  );
}

// ================= STYLES =================

const card = {
  borderRadius: "10px",
  padding: "20px",
  margin: "10px",
  backgroundColor: "#f5f5f5",
  boxShadow: "0 2px 5px rgba(0,0,0,0.2)"
};

const input = {
  display: "block",
  margin: "10px 0",
  padding: "8px",
  width: "200px"
};

const button = {
  padding: "8px 15px",
  backgroundColor: "#007bff",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer"
};

export default App;