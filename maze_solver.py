import random
import numpy as np
from collections import defaultdict
import heapq
import matplotlib.pyplot as plt

class Maze:
    def __init__(self, width, height):
        self.width = width
        self.height = height
        # Initialize maze with walls (1 represents walls, 0 represents paths)
        self.maze = np.ones((height * 2 + 1, width * 2 + 1))
        self.start = (1, 1)  # Start position
        self.end = (height * 2 - 1, width * 2 - 1)  # End position
        
    def generate_maze(self):
        """Generate maze using Depth-First Search"""
        # Initialize the grid
        stack = [(0, 0)]
        visited = set()
        
        while stack:
            current = stack[-1]
            visited.add(current)
            
            # Get unvisited neighbors
            neighbors = []
            for dx, dy in [(0, 1), (1, 0), (0, -1), (-1, 0)]:
                next_x, next_y = current[0] + dx, current[1] + dy
                if (0 <= next_x < self.width and 
                    0 <= next_y < self.height and 
                    (next_x, next_y) not in visited):
                    neighbors.append((next_x, next_y))
            
            if neighbors:
                # Choose random neighbor
                next_cell = random.choice(neighbors)
                # Remove wall between current cell and chosen neighbor
                wall_x = current[0] * 2 + 1 + (next_cell[0] - current[0])
                wall_y = current[1] * 2 + 1 + (next_cell[1] - current[1])
                self.maze[wall_y, wall_x] = 0
                # Mark cells as path
                self.maze[current[1] * 2 + 1, current[0] * 2 + 1] = 0
                self.maze[next_cell[1] * 2 + 1, next_cell[0] * 2 + 1] = 0
                stack.append(next_cell)
            else:
                stack.pop()
                
        # Ensure start and end points are open
        self.maze[self.start] = 0
        self.maze[self.end] = 0

    def get_neighbors(self, pos):
        """Get valid neighboring positions"""
        neighbors = []
        for dx, dy in [(0, 1), (1, 0), (0, -1), (-1, 0)]:
            new_x, new_y = pos[1] + dx, pos[0] + dy
            if (0 <= new_x < self.maze.shape[1] and 
                0 <= new_y < self.maze.shape[0] and 
                self.maze[new_y, new_x] == 0):
                neighbors.append((new_y, new_x))
        return neighbors

    def solve_dijkstra(self):
        """Solve maze using Dijkstra's algorithm"""
        # Priority queue for Dijkstra's algorithm
        pq = [(0, self.start)]
        distances = defaultdict(lambda: float('inf'))
        distances[self.start] = 0
        previous = {}
        
        while pq:
            current_dist, current_pos = heapq.heappop(pq)
            
            if current_pos == self.end:
                break
                
            if current_dist > distances[current_pos]:
                continue
                
            for neighbor in self.get_neighbors(current_pos):
                distance = current_dist + 1
                
                if distance < distances[neighbor]:
                    distances[neighbor] = distance
                    previous[neighbor] = current_pos
                    heapq.heappush(pq, (distance, neighbor))
        
        # Reconstruct path
        path = []
        current = self.end
        while current in previous:
            path.append(current)
            current = previous[current]
        path.append(self.start)
        path.reverse()
        
        return path

    def visualize(self, solution_path=None):
        """Visualize the maze and solution path"""
        plt.figure(figsize=(10, 10))
        plt.imshow(self.maze, cmap='binary')
        
        if solution_path:
            path_y, path_x = zip(*solution_path)
            plt.plot(path_x, path_y, 'r-', linewidth=3, alpha=0.7)
        
        plt.plot(self.start[1], self.start[0], 'go', label='Start', markersize=15)
        plt.plot(self.end[1], self.end[0], 'ro', label='End', markersize=15)
        plt.legend()
        plt.axis('off')
        plt.title('Maze with Solution Path')
        plt.show()

# Example usage
def create_and_solve_maze(width=15, height=15):
    # Create and generate maze
    maze = Maze(width, height)
    maze.generate_maze()
    
    # Solve maze using Dijkstra's algorithm
    solution = maze.solve_dijkstra()
    
    # Visualize maze with solution
    maze.visualize(solution)
    
    return maze, solution

if __name__ == "__main__":
    # Create a 15x15 maze
    maze, solution = create_and_solve_maze(15, 15)
    print(f"Solution path length: {len(solution)} steps")