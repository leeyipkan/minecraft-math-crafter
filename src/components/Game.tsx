import { useState, useEffect, useRef } from 'react';
import type { GameResult } from '../App';

interface GameProps {
  onFinish: (result: GameResult) => void;
  onCancel: () => void;
}

interface Question {
  text: string;
  answer: number;
  type: 'COUNT' | 'ADD' | 'SUB';
}

const Game: React.FC<GameProps> = ({ onFinish, onCancel }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [results, setResults] = useState<boolean[]>([]);
  const [timer, setTimer] = useState(0);
  const [totalTimer, setTotalTimer] = useState(0);
  const [feedback, setFeedback] = useState<{ message: string; isCorrect: boolean } | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const sessionStartTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    // Generate 5 questions with increasing difficulty (Levels)
    const generated: Question[] = [];
    for (let i = 0; i < 5; i++) {
      let type: 'ADD' | 'SUB' = Math.random() > 0.5 ? 'ADD' : 'SUB';
      let text = '';
      let answer = 0;
      
      if (i === 0) {
        // Level 1: 2 single digit addition or subtraction, result is single digit
        if (type === 'ADD') {
          answer = Math.floor(Math.random() * 8) + 2; // 2 to 9
          const a = Math.floor(Math.random() * (answer - 1)) + 1;
          const b = answer - a;
          text = `${a} + ${b} = ?`;
        } else {
          const a = Math.floor(Math.random() * 8) + 2; // 2 to 9
          const b = Math.floor(Math.random() * (a - 1)) + 1;
          answer = a - b;
          text = `${a} - ${b} = ?`;
        }
      } else if (i === 1) {
        // Level 2: Simple addition and subtraction by 3 single digit numbers, result is single digit
        const subType = Math.floor(Math.random() * 3);
        if (subType === 0) { // a + b + c
          type = 'ADD';
          answer = Math.floor(Math.random() * 7) + 3; // 3 to 9
          const a = Math.floor(Math.random() * (answer - 2)) + 1;
          const b = Math.floor(Math.random() * (answer - a - 1)) + 1;
          const c = answer - a - b;
          text = `${a} + ${b} + ${c} = ?`;
        } else if (subType === 1) { // a + b - c
          type = 'ADD';
          const a = Math.floor(Math.random() * 5) + 1; // 1 to 5
          const b = Math.floor(Math.random() * 4) + 1; // 1 to 4
          const c = Math.floor(Math.random() * (a + b - 1)) + 1;
          answer = a + b - c;
          text = `${a} + ${b} - ${c} = ?`;
        } else { // a - b - c
          type = 'SUB';
          const a = Math.floor(Math.random() * 4) + 6; // 6 to 9
          const b = Math.floor(Math.random() * 3) + 1; // 1 to 3
          const c = Math.floor(Math.random() * (a - b - 1)) + 1;
          answer = a - b - c;
          text = `${a} - ${b} - ${c} = ?`;
        }
      } else if (i === 2) {
        // Level 3: First number 10-19, second number single digit, result single digit (Forces subtraction)
        type = 'SUB';
        answer = Math.floor(Math.random() * 9) + 1; // Result: 1 to 9
        const a = Math.floor(Math.random() * 10) + 10; // First number: 10 to 19
        const b = a - answer; // Second number
        
        // Ensure b is a single digit (1-9). 
        // If a is 19 and answer is 9, b is 10 (invalid).
        // To strictly follow the rule, let's derive it from a valid b instead.
        const validB = Math.floor(Math.random() * 9) + 1; // 1 to 9
        const validAnswer = Math.floor(Math.random() * 9) + 1; // 1 to 9
        const validA = validB + validAnswer; // 2 to 18
        
        if (validA >= 10) {
           answer = validAnswer;
           text = `${validA} - ${validB} = ?`;
        } else {
           // Fallback to ensure A is at least 10
           const safeB = Math.floor(Math.random() * (9 - (10 - validAnswer))) + (10 - validAnswer);
           const safeA = safeB + validAnswer;
           answer = validAnswer;
           text = `${safeA} - ${safeB} = ?`;
        }
      } else if (i === 3) {
        // Level 4: e.g., 18 - ? = 6 (Answer is 12)
        type = 'SUB';
        answer = Math.floor(Math.random() * 6) + 10; // 10 to 15 (Force large apple use)
        const c = Math.floor(Math.random() * 5) + 3; // 3 to 7
        const a = c + answer;
        text = `${a} - ? = ${c}`;
      } else if (i === 4) {
        // Level 5: Mix of higher missing values
        type = Math.random() > 0.5 ? 'ADD' : 'SUB';
        answer = Math.floor(Math.random() * 6) + 11; // 11 to 16 (Max out the chest)
        if (type === 'ADD') {
          const a = Math.floor(Math.random() * 4) + 1; // 1 to 4
          const c = a + answer;
          text = `${a} + ? = ${c}`;
        } else {
          const c = Math.floor(Math.random() * 4) + 1; // 1 to 4
          const a = c + answer;
          text = `${a} - ? = ${c}`;
        }
      }
      
      generated.push({ text, answer, type });
    }
    setQuestions(generated);
    startTimeRef.current = Date.now();
    sessionStartTimeRef.current = Date.now();
    
    const interval = setInterval(() => {
      if (!feedback) {
        setTimer(Math.floor((Date.now() - startTimeRef.current) / 1000));
        setTotalTimer(Math.floor((Date.now() - sessionStartTimeRef.current) / 1000));
      } else {
        // Offset the start times while feedback is showing to "pause" the timer
        startTimeRef.current += 1000 / 60; 
        sessionStartTimeRef.current += 1000 / 60;
      }
    }, 1000 / 60);
    
    return () => clearInterval(interval);
  }, [feedback]);

  const [itemsInChest, setItemsInChest] = useState(0);

  const handleSubmit = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const correct = itemsInChest === currentQuestion.answer;
    
    if (correct) {
      setFeedback({ message: 'CORRECT! GREAT JOB!', isCorrect: true });
      // For correct answers, wait 1.5 seconds then auto-advance
      setTimeout(() => {
        handleNext(true);
      }, 1500);
    } else {
      setFeedback({ message: `WRONG! THE CORRECT ANSWER WAS ${currentQuestion.answer}`, isCorrect: false });
    }
  };

  const handleNext = (isCorrectOverride?: boolean) => {
    const isCorrect = isCorrectOverride !== undefined ? isCorrectOverride : (feedback?.isCorrect ?? false);
    const newResults = [...results, isCorrect];
    setResults(newResults);
    setFeedback(null);
    
    if (currentQuestionIndex < 4) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setItemsInChest(0);
      startTimeRef.current = Date.now(); 
      setTimer(0);
    } else {
      const finalScore = newResults.filter(r => r).length;
      onFinish({
        score: finalScore,
        time: totalTimer,
        questions: newResults
      });
    }
  };

  if (questions.length === 0) return <div>Loading...</div>;

  const currentQuestion = questions[currentQuestionIndex];

  const maxCapacity = 20; // Expanded to 5x4
  const sourceValue = maxCapacity - itemsInChest;
  const sourceLarge = Math.floor(sourceValue / 10);
  const sourceSmall = sourceValue % 10;
  const sourceEmpty = maxCapacity - (sourceLarge * 4 + sourceSmall);

  const chestValue = itemsInChest;
  const chestLarge = Math.floor(chestValue / 10);
  const chestSmall = chestValue % 10;
  const chestEmpty = maxCapacity - (chestLarge * 4 + chestSmall);

  return (
    <div className="minecraft-panel" style={{ width: '95%', maxWidth: '1000px', padding: '40px', textAlign: 'center', position: 'relative' }}>
      {/* Feedback Overlay */}
      {feedback && !feedback.isCorrect && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.85)',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: '4px',
          padding: '20px'
        }}>
          <h2 style={{ 
            fontSize: '2.5rem', 
            color: '#ff4444',
            textShadow: '3px 3px #000',
            marginBottom: '30px'
          }}>
            {feedback.message}
          </h2>
          <button className="minecraft-btn" onClick={() => handleNext(false)}>
            CONTINUE
          </button>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: '#555', alignItems: 'center' }}>
        <span style={{ fontSize: '26px', fontWeight: 'bold', color: '#888' }}>Total: {totalTimer}s</span>
        
        {/* Visual Progress Tracker */}
        <div style={{ display: 'flex', gap: '5px' }}>
          {[0, 1, 2, 3, 4].map(index => {
            if (index < results.length) {
              return (
                <span key={index} style={{ fontSize: '1.5rem' }}>
                  {results[index] ? '⭐' : '❌'}
                </span>
              );
            } else {
              return (
                <span key={index} style={{ fontSize: '1.5rem', opacity: 0.3 }}>
                  ⚪
                </span>
              );
            }
          })}
        </div>

        <span style={{ fontSize: '26px', fontWeight: 'bold' }}>Level {currentQuestionIndex + 1}</span>
      </div>
      
      <div style={{ backgroundColor: '#333', padding: '20px', borderRadius: '8px', marginBottom: '20px', border: '4px solid #111' }}>
        <h2 style={{ fontSize: '2.5rem', margin: 0, color: '#fff', textShadow: '2px 2px #000' }}>
          {currentQuestion.text}
        </h2>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', alignItems: 'stretch', marginBottom: '30px' }}>
        {/* Item Source */}
        <div style={{
          width: '215px', // Accommodates 5 columns (5 * 32px + 4 * 5px gap + 20px padding)
          height: '180px',
          backgroundColor: '#5ea243',
          border: '5px solid #373737',
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 32px)',
          gridTemplateRows: 'repeat(4, 32px)',
          gap: '5px',
          padding: '10px',
          position: 'relative',
          gridAutoFlow: 'row dense',
          boxSizing: 'border-box'
        }}>
          {[...Array(sourceLarge)].map((_, i) => (
            <div 
              key={`src-large-${i}`}
              onClick={() => setItemsInChest(prev => Math.min(prev + 10, maxCapacity))}
              style={{
                gridColumn: 'span 2',
                gridRow: 'span 2',
                backgroundColor: '#8b8b8b',
                border: '2px solid #fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '3.5rem',
                boxSizing: 'border-box'
              }}
            >
              🍎
            </div>
          ))}
          {[...Array(sourceSmall)].map((_, i) => (
            <div 
              key={`src-small-${i}`}
              onClick={() => setItemsInChest(prev => Math.min(prev + 1, maxCapacity))}
              style={{
                backgroundColor: '#8b8b8b',
                border: '2px solid #fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem',
                boxSizing: 'border-box'
              }}
            >
              🍎
            </div>
          ))}
          {[...Array(sourceEmpty)].map((_, i) => (
            <div 
              key={`src-empty-${i}`}
              style={{
                backgroundColor: '#333',
                border: '2px solid #222',
                opacity: 0.5,
                boxSizing: 'border-box'
              }}
            >
            </div>
          ))}
          <div style={{ 
            position: 'absolute', 
            bottom: '-40px', 
            left: '0',
            width: '100%', 
            fontSize: '26px', 
            color: '#373737',
            textAlign: 'center',
            whiteSpace: 'nowrap'
          }}>
            Apples: {sourceValue}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '10px', alignItems: 'center' }}>
          <div 
            onClick={() => setItemsInChest(prev => Math.min(prev + 1, maxCapacity))}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              width: '60px',
              height: '60px',
              backgroundColor: '#4a90e2', // Blue box
              border: '4px solid #2a5a8e',
              borderRadius: '8px',
              fontSize: '2rem',
              cursor: 'pointer',
              boxShadow: '0 4px #2a5a8e',
              transition: 'transform 0.1s',
              color: 'white',
              userSelect: 'none'
            }}
            onMouseDown={(e) => e.currentTarget.style.transform = 'translateY(2px)'}
            onMouseUp={(e) => e.currentTarget.style.transform = 'translateY(0px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0px)'}
          >
            ➡️
          </div>

          <div style={{ 
            backgroundColor: '#333', 
            color: '#fff', 
            padding: '5px 10px', 
            borderRadius: '4px', 
            fontSize: '0.9rem',
            fontFamily: 'monospace',
            minWidth: '50px',
            textAlign: 'center',
            border: '2px solid #111'
          }}>
            {timer}s
          </div>

          <div 
            onClick={() => setItemsInChest(prev => Math.max(prev - 1, 0))}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              width: '60px',
              height: '60px',
              backgroundColor: '#e74c3c', // Red box
              border: '4px solid #c0392b',
              borderRadius: '8px',
              fontSize: '2rem',
              cursor: 'pointer',
              boxShadow: '0 4px #c0392b',
              transition: 'transform 0.1s',
              color: 'white',
              userSelect: 'none'
            }}
            onMouseDown={(e) => e.currentTarget.style.transform = 'translateY(2px)'}
            onMouseUp={(e) => e.currentTarget.style.transform = 'translateY(0px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0px)'}
          >
            ⬅️
          </div>
        </div>

        {/* Chest */}
        <div 
          style={{
            width: '215px', // Accommodates 5 columns
            height: '180px',
            backgroundColor: '#866043',
            border: '5px solid #373737',
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 32px)',
            gridTemplateRows: 'repeat(4, 32px)',
            gap: '5px',
            padding: '10px',
            position: 'relative',
            gridAutoFlow: 'row dense',
            boxSizing: 'border-box'
          }}
        >
          {[...Array(chestLarge)].map((_, i) => (
            <div 
              key={`chest-large-${i}`}
              onClick={() => setItemsInChest(prev => Math.max(prev - 10, 0))}
              style={{ 
                gridColumn: 'span 2',
                gridRow: 'span 2',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontSize: '3.5rem',
                cursor: 'pointer',
                boxSizing: 'border-box'
              }}
            >
              🍎
            </div>
          ))}
          {[...Array(chestSmall)].map((_, i) => (
            <div 
              key={`chest-small-${i}`}
              onClick={() => setItemsInChest(prev => Math.max(prev - 1, 0))}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontSize: '1.2rem',
                cursor: 'pointer',
                boxSizing: 'border-box'
              }}
            >
              🍎
            </div>
          ))}
          {[...Array(chestEmpty)].map((_, i) => (
            <div 
              key={`chest-empty-${i}`}
              style={{
                boxSizing: 'border-box'
              }}
            >
            </div>
          ))}
          <div style={{ 
            position: 'absolute', 
            bottom: '-40px', 
            left: '0',
            width: '100%', 
            fontSize: '26px', 
            color: '#373737',
            textAlign: 'center',
            whiteSpace: 'nowrap'
          }}>
            Chest: {chestValue}
          </div>
        </div>
      </div>

      {/* Inline Feedback for Correct Answers */}
      <div style={{ height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
        {feedback && feedback.isCorrect && (
          <div style={{ 
            color: '#56ad36', 
            fontSize: '1.5rem', 
            fontWeight: 'bold',
            textShadow: '1px 1px #000'
          }}>
            {feedback.message}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
        <button 
          className="minecraft-btn" 
          onClick={handleSubmit} 
          disabled={!!feedback}
          style={{ width: '150px' }}
        >
          Submit
        </button>
        
        <button 
          className="minecraft-btn" 
          onClick={onCancel}
          style={{ backgroundColor: '#a33', width: '150px' }}
        >
          QUIT
        </button>
      </div>
    </div>
  );
};

export default Game;
