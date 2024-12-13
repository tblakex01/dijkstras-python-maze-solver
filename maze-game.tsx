import React, { useState, useEffect, useCallback } from 'react';
import { AlertCircle, RotateCcw, Eye, EyeOff, Award } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Maze cell size in pixels
const CELL_SIZE = 30;
const GRID_SIZE = 15;

// Define movement keys
const MOVEMENT_KEYS = {
  ArrowUp: [0, -1],
  ArrowRight: [1, 0],
  ArrowDown: [0, 1],
  ArrowLeft: [-1, 0],
  w: [0, -1],
  d: [1, 0],
  s: [0, 1],
  a: [-1, 0],
  W: [0, -1],
  D: [1, 0],
  S: [0, 1],
  A: [-1, 0]
};

const MazeGame = () => {
  const [maze, setMaze] = useState(null);
  const [playerPos, setPlayerPos] = useState({ x: 1, y: 1 });
  const [solution, setSolution] = useState(null);
  const [showSolution, setShowSolution] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [moves, setMoves] = useState(0);
  const [message, setMessage] = useState('Use arrow keys or WASD to move');

  // Generate maze using DFS
  const generateMaze = () => {
    const width = GRID_SIZE;
    const height = GRID_SIZE;
    const maze = Array(height * 2 + 1).fill().map(() => 
      Array(width * 2 + 1).fill(1)
    );
    
    const stack = [{x: 0, y: 0}];
    const visited = new Set();
    
    while (stack.length > 0) {
      const current = stack[stack.length - 1];
      visited.add(`${current.x},${current.y}`);
      
      const neighbors = [];
      [[0, 1], [1, 0], [0, -1], [-1, 0]].forEach(([dx, dy]) => {
        const nx = current.x + dx;
        const ny = current.y + dy;
        if (nx >= 0 && nx < width && ny >= 0 && ny < height && 
            !visited.has(`${nx},${ny}`)) {
          neighbors.push({x: nx, y: ny});
        }
      });
      
      if (neighbors.length > 0) {
        const next = neighbors[Math.floor(Math.random() * neighbors.length)];
        maze[current.y * 2 + 1][current.x * 2 + 1] = 0;
        maze[next.y * 2 + 1][next.x * 2 + 1] = 0;
        maze[current.y * 2 + 1 + (next.y - current.y)]
            [current.x * 2 + 1 + (next.x - current.x)] = 0;
        stack.push(next);
      } else {
        stack.pop();
      }
    }
    
    // Set start and end points
    maze[1][1] = 0;
    maze[height * 2 - 1][width * 2 - 1] = 0;
    
    return maze;
  };

  // Solve maze using Dijkstra's algorithm
  const solveMaze = useCallback((maze) => {
    const height = maze.length;
    const width = maze[0].length;
    const start = {x: 1, y: 1};
    const end = {x: width - 2, y: height - 2};
    
    const pq = [{dist: 0, pos: start}];
    const distances = new Map();
    const previous = new Map();
    distances.set(`${start.x},${start.y}`, 0);
    
    while (pq.length > 0) {
      const {dist, pos} = pq.shift();
      
      if (pos.x === end.x && pos.y === end.y) break;
      
      if (dist > distances.get(`${pos.x},${pos.y}`)) continue;
      
      [[0, 1], [1, 0], [0, -1], [-1, 0]].forEach(([dx, dy]) => {
        const nx = pos.x + dx;
        const ny = pos.y + dy;
        
        if (nx >= 0 && nx < width && ny >= 0 && ny < height && maze[ny][nx] === 0) {
          const newDist = dist + 1;
          const key = `${nx},${ny}`;
          
          if (!distances.has(key) || newDist < distances.get(key)) {
            distances.set(key, newDist);
            previous.set(key, pos);
            pq.push({dist: newDist, pos: {x: nx, y: ny}});
            pq.sort((a, b) => a.dist - b.dist);
          }
        }
      });
    }
    
    // Reconstruct path
    const path = [];
    let current = end;
    while (previous.has(`${current.x},${current.y}`)) {
      path.unshift(current);
      current = previous.get(`${current.x},${current.y}`);
    }
    path.unshift(start);
    
    return path;
  }, []);

  // Move player function
  const movePlayer = useCallback((dx, dy) => {
    if (gameWon) return;
    
    const newX = playerPos.x + dx;
    const newY = playerPos.y + dy;
    
    if (maze && maze[newY] && maze[newY][newX] === 0) {
      setPlayerPos({ x: newX, y: newY });
      setMoves(m => m + 1);
      
      if (newX === maze[0].length - 2 && newY === maze.length - 2) {
        setGameWon(true);
        setMessage('Congratulations! You reached the end!');
      }
    }
  }, [playerPos, maze, gameWon]);

  // Handle keyboard input
  const handleKeyDown = useCallback((e) => {
    const movement = MOVEMENT_KEYS[e.key];
    if (movement) {
      e.preventDefault();
      const [dx, dy] = movement;
      movePlayer(dx, dy);
    }
  }, [movePlayer]);

  // Initialize game
  const initGame = useCallback(() => {
    const newMaze = generateMaze();
    setMaze(newMaze);
    setPlayerPos({ x: 1, y: 1 });
    setSolution(solveMaze(newMaze));
    setShowSolution(false);
    setGameWon(false);
    setMoves(0);
    setMessage('Use arrow keys or WASD to move');
  }, [solveMaze]);

  useEffect(() => {
    initGame();
  }, [initGame]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!maze) return null;

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="flex gap-4 mb-4">
        <button
          onClick={initGame}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          <RotateCcw className="w-4 h-4" /> New Maze
        </button>
        <button
          onClick={() => setShowSolution(!showSolution)}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          {showSolution ? 
            <EyeOff className="w-4 h-4" /> : 
            <Eye className="w-4 h-4" />
          }
          {showSolution ? 'Hide' : 'Show'} Solution
        </button>
      </div>

      <div className="relative border-2 border-gray-300 rounded">
        <div 
          className="grid gap-0"
          style={{
            gridTemplateColumns: `repeat(${maze[0].length}, ${CELL_SIZE}px)`,
          }}
        >
          {maze.map((row, y) => (
            row.map((cell, x) => {
              const isStart = x === 1 && y === 1;
              const isEnd = x === maze[0].length - 2 && y === maze.length - 2;
              return (
                <div
                  key={`${x}-${y}`}
                  className={`
                    w-8 h-8 border border-gray-200
                    ${cell === 1 ? 'bg-gray-800' : 'bg-white'}
                    ${solution && showSolution && 
                      solution.some(pos => pos.x === x && pos.y === y) ? 
                      'bg-yellow-200' : ''}
                    ${isStart ? 'bg-green-200' : ''}
                    ${isEnd ? 'bg-red-200' : ''}
                  `}
                />
              );
            })
          ))}
        </div>

        <div
          className="absolute w-5 h-5 bg-blue-500 rounded-full transition-all duration-200"
          style={{
            left: `${playerPos.x * CELL_SIZE + (CELL_SIZE - 20) / 2}px`,
            top: `${playerPos.y * CELL_SIZE + (CELL_SIZE - 20) / 2}px`,
          }}
        />
      </div>

      <div className="text-lg font-semibold">Moves: {moves}</div>

      {gameWon ? (
        <Alert className="w-96">
          <Award className="w-4 h-4" />
          <AlertTitle>Congratulations!</AlertTitle>
          <AlertDescription>
            You solved the maze in {moves} moves!
            {solution && moves <= solution.length && 
              " That's the optimal solution!"}
          </AlertDescription>
        </Alert>
      ) : (
        <div className="mt-4 text-sm text-gray-600">
          {message}
        </div>
      )}
    </div>
  );
};

export default MazeGame;