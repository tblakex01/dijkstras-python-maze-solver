# 🎮 Dijkstra's Python Maze Solver

An interactive maze game that uses Dijkstra's algorithm for both maze generation and pathfinding. Play through randomly generated mazes and find the optimal path to the exit! 

## 🎯 Features

- 🔄 Random maze generation using Depth-First Search
- 🤖 Pathfinding using Dijkstra's algorithm
- 🎲 Dynamic maze regeneration
- 🎯 Interactive gameplay with keyboard controls
- 🗺️ Visual solution path display
- 🏆 Move counter and win detection
- ⌨️ Support for both WASD and arrow keys

## 🛠️ Tech Stack

- 🐍 Python (Backend)
  - NumPy
  - Matplotlib
- ⚛️ React (Frontend)
  - Tailwind CSS
  - Lucide Icons
  - shadcn/ui components
- 🧮 Algorithms
  - Dijkstra's Algorithm (Pathfinding)
  - Depth-First Search (Maze Generation)

## 🚀 Getting Started

### Prerequisites

```bash
# Python dependencies
pip install numpy matplotlib

# Node.js dependencies
npm install
```

### Running the Game

#### Python Version
```python
from maze_solver import create_and_solve_maze

# Create a 15x15 maze
maze, solution = create_and_solve_maze(15, 15)
```

#### Web Version
```bash
# Start the development server
npm run dev
```

## 🎮 How to Play

1. 🎲 Use arrow keys or WASD to move the blue player dot
2. 🏁 Navigate from the green start to the red end
3. 🔄 Click "New Maze" to generate a fresh maze
4. 👁️ Toggle solution visibility with the eye icon
5. 🎯 Try to reach the end in the minimum number of moves!

## 🎨 Game Elements

- 🔵 Blue dot: Player
- ⬛ Black squares: Walls
- ⬜ White squares: Paths
- 🟩 Green square: Start
- 🟥 Red square: End
- 💫 Yellow path: Optimal solution (when visible)

## 🌟 Features Coming Soon

- 📊 High score system
- ⏱️ Time tracking
- 🎨 Custom themes
- 🔧 Adjustable difficulty levels
- 📏 Different maze sizes

## 🤝 Contributing

Feel free to open issues and pull requests for any improvements you'd like to add!

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built using React and Python
- UI components from shadcn/ui
- Icons from Lucide React
- AI Powered Workflow
