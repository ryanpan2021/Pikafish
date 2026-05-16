import { spawn, ChildProcess } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

interface EngineState {
  process: ChildProcess | null;
  isReady: boolean;
  pendingMove: ((move: string) => void) | null;
  buffer: string;
}

class PikafishEngine {
  private state: EngineState = {
    process: null,
    isReady: false,
    pendingMove: null,
    buffer: ''
  };

  constructor() {
    this.startEngine();
  }

  private startEngine() {
    try {
      const enginePath = path.join(__dirname, '../../pikafish-engine/pikafish');
      
      this.state.process = spawn(enginePath, [], {
        stdio: ['pipe', 'pipe', 'pipe']
      });

      this.state.process.stdout?.on('data', (data) => {
        this.handleOutput(data.toString());
      });

      this.state.process.stderr?.on('data', (data) => {
        console.error('Engine stderr:', data.toString());
      });

      this.state.process.on('exit', (code) => {
        console.log('Engine exited with code:', code);
        this.state.isReady = false;
        this.state.process = null;
      });

      this.sendCommand('uci');

    } catch (error) {
      console.error('Failed to start engine:', error);
    }
  }

  private handleOutput(output: string) {
    this.state.buffer += output;

    const lines = this.state.buffer.split('\n');
    this.state.buffer = lines.pop() || '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      if (trimmed === 'uciok') {
        this.state.isReady = true;
        this.sendCommand('isready');
      } else if (trimmed === 'readyok') {
        console.log('Engine is ready');
      } else if (trimmed.startsWith('bestmove')) {
        const match = trimmed.match(/bestmove\s+([a-z][0-9][a-z][0-9])/);
        if (match && this.state.pendingMove) {
          this.state.pendingMove(match[1]);
          this.state.pendingMove = null;
        }
      }
    }
  }

  private sendCommand(command: string) {
    if (this.state.process?.stdin) {
      this.state.process.stdin.write(command + '\n');
    }
  }

  public async getBestMove(fen: string, depth?: number): Promise<string> {
    return new Promise((resolve) => {
      if (!this.state.process || !this.state.isReady) {
        this.startEngine();
        setTimeout(() => this.getBestMove(fen, depth).then(resolve), 1000);
        return;
      }

      this.state.pendingMove = resolve;

      this.sendCommand(`position fen ${fen}`);
      if (depth) {
        this.sendCommand(`go depth ${depth}`);
      } else {
        this.sendCommand('go movetime 2000');
      }

      setTimeout(() => {
        if (this.state.pendingMove) {
          console.log('Engine timeout, returning fallback move');
          resolve('');
          this.state.pendingMove = null;
        }
      }, 5000);
    });
  }

  public close() {
    if (this.state.process) {
      this.state.process.kill();
      this.state.process = null;
    }
  }
}

let engineInstance: PikafishEngine | null = null;

export function getEngine() {
  if (!engineInstance) {
    engineInstance = new PikafishEngine();
  }
  return engineInstance;
}
