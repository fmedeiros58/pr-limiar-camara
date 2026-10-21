import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';

const normalize = value => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
const hash = (page, line, word, value) => createHash('sha256').update(`PR-LIMIAR-WORD/1|${page}|${line}|${word}|${normalize(value)}`).digest('hex');
const before = JSON.parse(execFileSync('git', ['show', 'HEAD:matriz-livro.json'], { encoding: 'utf8' }));
const after = JSON.parse(await readFile('matriz-livro.json', 'utf8'));
let total = 0;
for (let pageIndex = 0; pageIndex < before.paginas.length; pageIndex++) {
  const oldPage = before.paginas[pageIndex], newPage = after.paginas[pageIndex];
  for (let lineIndex = 0; lineIndex < oldPage.linhas.length; lineIndex++) {
    const oldLine = oldPage.linhas[lineIndex], newLine = newPage.linhas[lineIndex];
    for (let wordIndex = 0; wordIndex < oldLine.palavras.length; wordIndex++) {
      total++;
      const item = newLine.palavras[wordIndex];
      if (item.compromisso !== hash(oldPage.pagina_pdf, oldLine.numero, wordIndex + 1, oldLine.palavras[wordIndex])) throw new Error(`Compromisso inválido em ${oldPage.pagina_pdf}/${oldLine.numero}/${wordIndex + 1}`);
    }
  }
}
if (!after.protecao_respostas || total !== 8508) throw new Error('Metadados de proteção ou contagem inesperados.');
console.log(`Integridade da matriz: ${total} compromissos conferidos.`);

