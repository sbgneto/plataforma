// Build de produção + commit + push, num comando só.
// Uso: npm run deploy            (mensagem automática com data/hora)
//      npm run deploy "mensagem" (mensagem de commit personalizada)
import { execSync } from 'node:child_process';

function run(cmd) {
  console.log(`\n$ ${cmd}`);
  execSync(cmd, { stdio: 'inherit' });
}

function hasStagedChanges() {
  // `git diff --cached --quiet` sai com código 0 se NÃO há mudanças staged,
  // e diferente de 0 se houver.
  try {
    execSync('git diff --cached --quiet');
    return false;
  } catch {
    return true;
  }
}

const message = process.argv.slice(2).join(' ') || `Deploy ${new Date().toISOString()}`;

// 1. Gera a build de produção na pasta docs/ (de onde o GitHub Pages publica).
run('npm run build');

// 2. Prepara todos os arquivos (código + docs/).
run('git add -A');

// 3. Commita (pula se não houver nada novo).
if (hasStagedChanges()) {
  run(`git commit -m "${message}"`);
} else {
  console.log('\nNada novo para commitar.');
}

// 4. Envia para o GitHub.
run('git push');

console.log(
  '\n✅ Deploy enviado! Aguarde ~1 minuto e recarregue ' +
    'https://sbgneto.github.io/plataforma/ (use Ctrl+Shift+R para furar o cache).',
);
