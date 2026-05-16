
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const enginePath = path.join(__dirname, 'pikafish-engine/pikafish');

console.log('Testing engine at:', enginePath);

const engineProcess = spawn(enginePath, [], {
  stdio: ['pipe', 'pipe', 'pipe']
});

if (engineProcess.stdout) {
  engineProcess.stdout.on('data', (data) => {
    console.log('Engine output:', data.toString());
  });
}

if (engineProcess.stderr) {
  engineProcess.stderr.on('data', (data) => {
    console.error('Engine stderr:', data.toString());
  });
}

engineProcess.on('exit', (code) => {
  console.log('Engine exited with code:', code);
});

// Test UCI commands
setTimeout(() => {
  console.log('Sending uci...');
  if (engineProcess.stdin) {
    engineProcess.stdin.write('uci\n');
  }
}, 500);

setTimeout(() => {
  console.log('Sending isready...');
  if (engineProcess.stdin) {
    engineProcess.stdin.write('isready\n');
  }
}, 2000);

setTimeout(() => {
  console.log('Sending position...');
  // 中国象棋标准初始局面
  if (engineProcess.stdin) {
    engineProcess.stdin.write('position fen rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR w - - 0 1\n');
    engineProcess.stdin.write('go movetime 2000\n');
  }
}, 3000);

setTimeout(() => {
  console.log('Sending quit...');
  if (engineProcess.stdin) {
    engineProcess.stdin.write('quit\n');
  }
}, 8000);
