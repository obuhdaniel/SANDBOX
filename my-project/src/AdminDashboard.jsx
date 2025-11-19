import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Users, 
  Trophy, 
  Download, 
  Search, 
  Filter,
  Calendar,
  User,
  CheckCircle,
  XCircle,
  TrendingUp
} from 'lucide-react';

const API_BASE = 'https://raas.on.shiper.app/api';

export  function Admin() {
  const [submissions, setSubmissions] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [dailySubmissions, setDailySubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [subsRes, statsRes, leaderRes, dailyRes] = await Promise.all([
        fetch(`${API_BASE}/submissions?limit=100`),
        fetch(`${API_BASE}/statistics`),
        fetch(`${API_BASE}/leaderboard?limit=20`),
        fetch(`${API_BASE}/analytics/daily-submissions?days=30`)
      ]);

      const subsData = await subsRes.json();
      const statsData = await statsRes.json();
      const leaderData = await leaderRes.json();
      const dailyData = await dailyRes.json();

      if (subsData.success) setSubmissions(subsData.data.submissions);
      if (statsData.success) setStatistics(statsData.data);
      if (leaderData.success) setLeaderboard(leaderData.data);
      if (dailyData.success) setDailySubmissions(dailyData.data);

    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const filteredSubmissions = submissions.filter(sub => 
    sub.userName.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (dateFilter ? sub.timestamp.split('T')[0] === dateFilter : true)
  );

  const exportToCSV = () => {
    const headers = ['Name', 'Score', 'Total', 'Percentage', 'Completed Exercises', 'Date'];
    const csvData = filteredSubmissions.map(sub => [
      sub.userName,
      sub.score,
      sub.total,
      `${((sub.score / sub.total) * 100).toFixed(1)}%`,
      sub.completedExercises.join(', '),
      new Date(sub.timestamp).toLocaleString()
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `python-sandbox-submissions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Python Sandbox Admin</h1>
            <p className="text-gray-400">Monitor submissions and analytics</p>
          </div>
          <button
            onClick={fetchData}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-semibold transition-colors"
          >
            Refresh Data
          </button>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-gray-800 border-b border-gray-700 px-6">
        <div className="flex space-x-1">
          {['overview', 'submissions', 'leaderboard', 'analytics'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 font-medium capitalize transition-colors ${
                activeTab === tab
                  ? 'bg-gray-700 text-white border-b-2 border-blue-500'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </nav>

      <div className="p-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                icon={<Users className="h-6 w-6" />}
                title="Total Submissions"
                value={statistics?.totalSubmissions || 0}
                color="blue"
              />
              <StatCard
                icon={<CheckCircle className="h-6 w-6" />}
                title="Average Score"
                value={`${statistics?.averages?.averageScore?.toFixed(1) || 0}/${exercises.length}`}
                subtitle={`${statistics?.averages?.averagePercentage?.toFixed(1) || 0}%`}
                color="green"
              />
              <StatCard
                icon={<Trophy className="h-6 w-6" />}
                title="Best Score"
                value={`${statistics?.averages?.maxScore || 0}/${exercises.length}`}
                color="yellow"
              />
              <StatCard
                icon={<TrendingUp className="h-6 w-6" />}
                title="Completion Rate"
                value={`${((statistics?.averages?.averageScore / exercises.length) * 100).toFixed(1)}%`}
                color="purple"
              />
            </div>

            {/* Recent Submissions */}
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Recent Submissions</h2>
                <button
                  onClick={() => setActiveTab('submissions')}
                  className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                >
                  View All
                </button>
              </div>
              <div className="space-y-3">
                {submissions.slice(0, 5).map((sub, index) => (
                  <div key={sub._id} className="flex items-center justify-between p-3 bg-gray-700 rounded">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium">{sub.userName}</div>
                        <div className="text-sm text-gray-400">
                          {new Date(sub.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg">
                        {sub.score}/{sub.total}
                      </div>
                      <div className="text-sm text-gray-400">
                        {((sub.score / sub.total) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Leaderboard Preview */}
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Top Performers</h2>
                <button
                  onClick={() => setActiveTab('leaderboard')}
                  className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                >
                  View Leaderboard
                </button>
              </div>
              <div className="space-y-3">
                {leaderboard.slice(0, 5).map((user, index) => (
                  <div key={user.userName} className="flex items-center justify-between p-3 bg-gray-700 rounded">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        index === 0 ? 'bg-yellow-500 text-yellow-900' :
                        index === 1 ? 'bg-gray-400 text-gray-900' :
                        index === 2 ? 'bg-orange-500 text-orange-900' :
                        'bg-gray-600'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="font-medium">{user.userName}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">Best: {user.bestScore}/{exercises.length}</div>
                      <div className="text-sm text-gray-400">
                        {user.attempts} attempt{user.attempts !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Submissions Tab */}
        {activeTab === 'submissions' && (
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">All Submissions</h2>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={exportToCSV}
                  className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-semibold transition-colors"
                >
                  <Download className="h-4 w-4" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-4 font-semibold">User</th>
                    <th className="text-left py-3 px-4 font-semibold">Score</th>
                    <th className="text-left py-3 px-4 font-semibold">Percentage</th>
                    <th className="text-left py-3 px-4 font-semibold">Completed Exercises</th>
                    <th className="text-left py-3 px-4 font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubmissions.map((sub) => (
                    <tr key={sub._id} className="border-b border-gray-700 hover:bg-gray-750">
                      <td className="py-3 px-4">
                        <div className="font-medium">{sub.userName}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold">
                          {sub.score}/{sub.total}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className={`font-semibold ${
                          (sub.score / sub.total) >= 0.8 ? 'text-green-400' :
                          (sub.score / sub.total) >= 0.6 ? 'text-yellow-400' :
                          'text-red-400'
                        }`}>
                          {((sub.score / sub.total) * 100).toFixed(1)}%
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm text-gray-400">
                          {sub.completedExercises.length} exercises
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm text-gray-400">
                          {new Date(sub.timestamp).toLocaleString()}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredSubmissions.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  No submissions found matching your criteria
                </div>
              )}
            </div>
          </div>
        )}

        {/* Leaderboard Tab */}
        {activeTab === 'leaderboard' && (
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Leaderboard</h2>
              <div className="text-gray-400">
                Top {leaderboard.length} performers
              </div>
            </div>

            <div className="space-y-4">
              {leaderboard.map((user, index) => (
                <div key={user.userName} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${
                      index === 0 ? 'bg-yellow-500 text-yellow-900' :
                      index === 1 ? 'bg-gray-400 text-gray-900' :
                      index === 2 ? 'bg-orange-500 text-orange-900' :
                      'bg-gray-600'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-bold text-lg">{user.userName}</div>
                      <div className="text-sm text-gray-400">
                        {user.attempts} attempt{user.attempts !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-xl">
                      Best: {user.bestScore}/{exercises.length}
                    </div>
                    <div className="text-sm text-gray-400">
                      Average: {(user.averageScore * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Daily Submissions Chart */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-bold mb-4">Daily Submissions</h3>
                <div className="space-y-2">
                  {dailySubmissions.slice(-7).map((day) => (
                    <div key={day._id} className="flex items-center justify-between">
                      <div className="text-sm text-gray-400">{day._id}</div>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 bg-gray-700 rounded-full h-3">
                          <div 
                            className="bg-blue-500 h-3 rounded-full"
                            style={{ 
                              width: `${Math.min((day.count / Math.max(...dailySubmissions.map(d => d.count))) * 100, 100)}%` 
                            }}
                          ></div>
                        </div>
                        <div className="text-sm font-medium w-8">{day.count}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Score Distribution */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-bold mb-4">Score Distribution</h3>
                <div className="space-y-2">
                  {statistics?.scoresDistribution?.map((dist) => (
                    <div key={dist._id} className="flex items-center justify-between">
                      <div className="text-sm">
                        Score {dist._id}: 
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 bg-gray-700 rounded-full h-3">
                          <div 
                            className="bg-green-500 h-3 rounded-full"
                            style={{ 
                              width: `${(dist.count / statistics.totalSubmissions) * 100}%` 
                            }}
                          ></div>
                        </div>
                        <div className="text-sm font-medium w-8">{dist.count}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-bold mb-4">Performance Metrics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <MetricCard
                  title="Perfect Scores"
                  value={statistics?.scoresDistribution?.find(s => s._id === exercises.length)?.count || 0}
                  total={statistics?.totalSubmissions}
                />
                <MetricCard
                  title="Above 80%"
                  value={statistics?.scoresDistribution?.filter(s => s._id >= exercises.length * 0.8).reduce((sum, s) => sum + s.count, 0) || 0}
                  total={statistics?.totalSubmissions}
                />
                <MetricCard
                  title="Below 50%"
                  value={statistics?.scoresDistribution?.filter(s => s._id < exercises.length * 0.5).reduce((sum, s) => sum + s.count, 0) || 0}
                  total={statistics?.totalSubmissions}
                />
                <MetricCard
                  title="Average Completion"
                  value={`${statistics?.averages?.averagePercentage?.toFixed(1)}%`}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper Components
const StatCard = ({ icon, title, value, subtitle, color }) => {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    purple: 'bg-purple-500'
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {subtitle && <p className="text-gray-400 text-sm mt-1">{subtitle}</p>}
        </div>
        <div className={`${colorClasses[color]} p-3 rounded-lg`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ title, value, total }) => (
  <div className="bg-gray-700 rounded-lg p-4 text-center">
    <div className="text-2xl font-bold text-white">{value}</div>
    <div className="text-gray-400 text-sm mt-1">{title}</div>
    {total && (
      <div className="text-gray-500 text-xs mt-1">
        {((value / total) * 100).toFixed(1)}% of total
      </div>
    )}
  </div>
);

// Add this at the end of the file (same exercises array from your original code)
const exercises = [
  {
    id: 1,
    title: "Hello World",
    description: "Print the text: Hello, World!",
    expectedOutput: "Hello, World!",
    hint: "Use print() with the text in quotes"
  },
  {
    id: 2,
    title: "Your Name",
    description: "Print your name",
    expectedOutput: null,
    hint: "Type your name inside quotes"
  },
  {
    id: 3,
    title: "Multiple Words",
    description: "Print: Python is fun",
    expectedOutput: "Python is fun",
    hint: "Put the entire sentence in quotes"
  },
  {
    id: 4,
    title: "Numbers",
    description: "Print the number 42",
    expectedOutput: "42",
    hint: "Numbers can be printed with or without quotes"
  },
  {
    id: 5,
    title: "Two Lines",
    description: "Print 'Hello' on one line and 'Python' on the next line",
    expectedOutput: "Hello\nPython",
    hint: "Use two separate print statements"
  },
  {
    id: 6,
    title: "Addition Result",
    description: "Print the result of 15 + 27",
    expectedOutput: "42",
    hint: "You can do math inside print()"
  },
  {
    id: 7,
    title: "Multiplication",
    description: "Print the result of 6 * 7",
    expectedOutput: "42",
    hint: "Use the * operator for multiplication"
  },
  {
    id: 8,
    title: "Text and Number",
    description: "Print: The answer is 100",
    expectedOutput: "The answer is 100",
    hint: "Put the entire phrase in quotes"
  },
  {
    id: 9,
    title: "Three Lines",
    description: "Print the numbers 1, 2, and 3, each on a separate line",
    expectedOutput: "1\n2\n3",
    hint: "Use three print statements"
  },
  {
    id: 10,
    title: "Empty Line",
    description: "Print 'Start', then a blank line, then 'End'",
    expectedOutput: "Start\n\nEnd",
    hint: "Use print() with nothing inside for a blank line"
  },
  {
    id: 11,
    title: "Quotes in Text",
    description: "Print: She said \"Hello\"",
    expectedOutput: "She said \"Hello\"",
    hint: "Use single quotes around the text or escape double quotes with \\"
  },
  {
    id: 12,
    title: "Comma Separator",
    description: "Print 'apple', 'banana', 'cherry' separated by spaces using commas in print",
    expectedOutput: "apple banana cherry",
    hint: "Use print('apple', 'banana', 'cherry')"
  },
  {
    id: 13,
    title: "Concatenation",
    description: "Print 'Hello' + 'World' as one word",
    expectedOutput: "HelloWorld",
    hint: "Use the + operator between strings"
  },
  {
    id: 14,
    title: "Subtraction",
    description: "Print the result of 100 - 58",
    expectedOutput: "42",
    hint: "Use the - operator"
  },
  {
    id: 15,
    title: "Division",
    description: "Print the result of 84 / 2",
    expectedOutput: "42.0",
    hint: "Use the / operator for division"
  },
  {
    id: 16,
    title: "Repeat String",
    description: "Print 'Ha' three times as 'HaHaHa'",
    expectedOutput: "HaHaHa",
    hint: "Use 'Ha' * 3"
  },
  {
    id: 17,
    title: "Mixed Operations",
    description: "Print the result of (5 + 3) * 2",
    expectedOutput: "16",
    hint: "Use parentheses for order of operations"
  },
  {
    id: 18,
    title: "Multiple Items",
    description: "Print three separate items on the same line: Python, 2025, and True",
    expectedOutput: "Python 2025 True",
    hint: "Separate items with commas in print()"
  },
  {
    id: 19,
    title: "Apostrophe",
    description: "Print: It's a beautiful day",
    expectedOutput: "It's a beautiful day",
    hint: "Use double quotes around text containing an apostrophe"
  },
  {
    id: 20,
    title: "Simple Math Expression",
    description: "Print: 2 + 2 = and then the result",
    expectedOutput: "2 + 2 = 4",
    hint: "Combine text and calculation: print('2 + 2 =', 2 + 2)"
  }
];