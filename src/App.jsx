import { useState } from 'react'
import './App.css'

// The five subjects we collect marks for.
// Keeping them in one array means we can build the form and the
// total/average calculations from the same list instead of repeating code.
const SUBJECTS = [
  { key: 'tamil', label: 'Tamil' },
  { key: 'english', label: 'English' },
  { key: 'maths', label: 'Mathematics' },
  { key: 'science', label: 'Science' },
  { key: 'computerScience', label: 'Computer Science' },
]

// Turns an average percentage into a letter grade.
function getGrade(average) {
  if (average >= 90) return 'A+'
  if (average >= 80) return 'A'
  if (average >= 70) return 'B'
  if (average >= 60) return 'C'
  if (average >= 50) return 'D'
  return 'F'
}

// Used to color the grade badge and result banner.
function getGradeTier(grade) {
  if (grade === 'A+' || grade === 'A') return 'excellent'
  if (grade === 'B' || grade === 'C') return 'good'
  if (grade === 'D') return 'pass'
  return 'fail'
}

// The empty/starting shape of the form.
const initialMarks = SUBJECTS.reduce((acc, subject) => {
  acc[subject.key] = ''
  return acc
}, {})

function App() {
  const [studentName, setStudentName] = useState('')
  const [marks, setMarks] = useState(initialMarks)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)

  function handleMarkChange(key, value) {
    setMarks((prev) => ({ ...prev, [key]: value }))
  }

  function validate() {
    if (studentName.trim() === '') {
      return 'Please enter the student name.'
    }

    for (const subject of SUBJECTS) {
      const value = marks[subject.key]

      if (value.trim() === '') {
        return `Please enter marks for ${subject.label}.`
      }

      const numericValue = Number(value)

      if (Number.isNaN(numericValue)) {
        return `Marks for ${subject.label} must be a number.`
      }

      if (numericValue < 0 || numericValue > 100) {
        return `Marks for ${subject.label} must be between 0 and 100.`
      }
    }

    return ''
  }

  function handleCalculate(event) {
    event.preventDefault()

    const validationError = validate()
    if (validationError) {
      setError(validationError)
      setResult(null)
      return
    }

    setError('')

    const total = SUBJECTS.reduce(
      (sum, subject) => sum + Number(marks[subject.key]),
      0
    )
    const average = total / SUBJECTS.length
    const grade = getGrade(average)
    const passed = average >= 50

    setResult({
      studentName: studentName.trim(),
      total,
      average,
      grade,
      passed,
    })
  }

  function handleReset() {
    setStudentName('')
    setMarks(initialMarks)
    setError('')
    setResult(null)
  }

  return (
    <div className="page">
      <div className="sheet">
        <header className="sheet-header">
          <span className="sheet-eyebrow">Report Card</span>
          <h1>Student Grade Calculator</h1>
          <p className="sheet-subtitle">
            Enter marks out of 100 for each subject to work out the total,
            average, and grade.
          </p>
        </header>

        <form className="grade-form" onSubmit={handleCalculate}>
          <div className="field">
            <label htmlFor="studentName">Student Name</label>
            <input
              id="studentName"
              type="text"
              placeholder="e.g. Poovetha R"
              value={studentName}
              onChange={(event) => setStudentName(event.target.value)}
            />
          </div>

          <div className="subject-grid">
            {SUBJECTS.map((subject) => (
              <div className="field" key={subject.key}>
                <label htmlFor={subject.key}>{subject.label}</label>
                <input
                  id={subject.key}
                  type="number"
                  min="0"
                  max="100"
                  placeholder="0-100"
                  value={marks[subject.key]}
                  onChange={(event) =>
                    handleMarkChange(subject.key, event.target.value)
                  }
                />
              </div>
            ))}
          </div>

          {error && <p className="error-message">{error}</p>}

          <div className="button-row">
            <button type="submit" className="btn btn-primary">
              Calculate Grade
            </button>
            <button type="button" className="btn btn-secondary" onClick={handleReset}>
              Reset
            </button>
          </div>
        </form>

        {result && (
          <section className={`result result--${getGradeTier(result.grade)}`}>
            <div className="result-header">
              <div>
                <p className="result-label">Student</p>
                <p className="result-name">{result.studentName}</p>
              </div>
              <div className={`grade-badge grade-badge--${getGradeTier(result.grade)}`}>
                {result.grade}
              </div>
            </div>

            <div className="result-stats">
              <div className="stat">
                <span className="stat-label">Total Marks</span>
                <span className="stat-value">{result.total} / 500</span>
              </div>
              <div className="stat">
                <span className="stat-label">Average</span>
                <span className="stat-value">{result.average.toFixed(2)}%</span>
              </div>
              <div className="stat">
                <span className="stat-label">Result</span>
                <span className={`stat-value stat-pill ${result.passed ? 'pill-pass' : 'pill-fail'}`}>
                  {result.passed ? 'PASS' : 'FAIL'}
                </span>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

export default App
