# ACERVO MEDEIROS — arquitetura inicial

## Diretórios

- `administracao/editor`: editor local visual e gestão de rascunhos.
- `administracao/ferramentas`: criptografia e geração de pacotes.
- `conteudos-protegidos`: fontes privadas sincronizadas pelo OneDrive.
- `acervo-criptografado`: cópia cifrada, versionada e pronta para publicação.
- `publicacao-github`: espelho do pacote público, sem originais legíveis.
- `backups`: exportações e snapshots manuais.
- `documentacao`: decisões, formato e procedimentos de recuperação.

## Formato criptografado

Cada arquivo `.enc.json` possui `formato`, `alg`, `kdf`, `salt`, `iv`, `aad`, `ciphertext` e metadados mínimos não sensíveis. A autenticação AES-GCM cobre o conteúdo e o identificador lógico. O catálogo também é cifrado; a página pública não precisa expor títulos, categorias ou palavras-chave.

## Administração

O editor local solicita ao administrador uma pasta do OneDrive pelo seletor nativo do navegador. Ele grava documentos independentes e realiza gravações atômicas por arquivo temporário seguido de substituição. O OneDrive é sincronização de arquivos, não banco de dados transacional.

## Publicação

O botão de publicação prepara o espelho `publicacao-github` e gera um manifesto SHA-256. O envio remoto não é automático nesta primeira versão: credenciais GitHub nunca serão armazenadas no acervo.

