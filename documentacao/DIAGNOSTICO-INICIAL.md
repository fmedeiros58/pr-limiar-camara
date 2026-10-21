# ACERVO MEDEIROS — diagnóstico inicial

## Estado encontrado

O repositório original contém apenas a Câmara de Decifração e a página histórica do Pacto de Leitura. O `index.html` carrega três arquivos públicos, sorteia uma expressão literária e cinco posições, executa a cifra Playfair e grava em `sessionStorage` o registro `pr-limiar-passagem-v1`.

O comprovante é um SHA-256 de um texto que inclui o nonce da sessão e as respostas normalizadas. Ele comprova a resolução local do desafio, mas não é uma chave criptográfica persistente.

O `pacto-de-leitura.html` atualmente é uma publicação HTML estática e não valida o registro de sessão. Acesso direto continua possível. A transformação será feita sem reescrever a cifra Playfair.

## Decisão de segurança

O livro físico continua sendo o fator de experiência: o leitor precisa consultar as coordenadas no exemplar para encontrar as cinco palavras. Para não expor as respostas no catálogo público futuro, o pacote publicado do ACERVO não conterá originais nem rascunhos legíveis.

O desbloqueio usará uma credencial derivada da conclusão do percurso e uma chave de conteúdo independente. AES-256-GCM protegerá cada item individualmente, com nonce aleatório, salt de KDF e autenticação de integridade. O navegador só verá o plaintext depois do desbloqueio.

Como o GitHub Pages é hospedagem estática, um atacante determinado ainda pode estudar o JavaScript e automatizar o desafio. A solução oferece controle de acesso por experiência literária e proteção contra exposição direta, não sigilo equivalente a um serviço privado com segredo fora do cliente.

## Arquivos preservados

Não foram alterados nesta fase: `index.html`, `configuracao.json`, `matriz-livro.json`, `matriz-playfair.json` e `pacto-de-leitura.html`.

