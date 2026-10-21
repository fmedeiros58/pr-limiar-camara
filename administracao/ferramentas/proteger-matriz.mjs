import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const path = process.argv[2] || 'matriz-livro.json';
const normalize = value => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
const commitment = (page, line, word, value) => createHash('sha256').update(`PR-LIMIAR-WORD/1|${page}|${line}|${word}|${normalize(value)}`).digest('hex');
const matrix = JSON.parse(await readFile(path, 'utf8'));
for (const page of matrix.paginas || []) for (const line of page.linhas || []) {
  line.palavras = line.palavras.map((value, index) => typeof value === 'string' ? {
    compromisso: commitment(page.pagina_pdf, line.numero, index + 1, value),
    comprimento: normalize(value).length
  } : value);
}
matrix.protecao_respostas = { formato: 'PR-LIMIAR-COMMITMENT/1', algoritmo: 'SHA-256', contexto: 'PR-LIMIAR-WORD/1', observacao: 'As palavras em claro foram removidas do arquivo publicado; a conferência depende do exemplar de referência.' };
await writeFile(path, `${JSON.stringify(matrix, null, 2)}\n`, 'utf8');

