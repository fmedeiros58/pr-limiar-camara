# Estado da implementação

## Concluído

- Repositório original inspecionado sem reescrever a Câmara.
- `ROOT` convertido para caminho relativo, mantendo o mesmo destino em produção.
- Palavras da matriz pública substituídas por 8.508 compromissos SHA-256 vinculados às coordenadas.
- Validação do leitor atualizada para conferir a palavra encontrada contra o compromisso.
- Comprovante `pr-limiar-passagem-v1` preservado, agora com versão e indicação de compromissos.
- Editor local visual com novo post, nova obra, anexos, rascunho, prévia, criptografia, preparação de publicação e restauração.
- Formato `ACERVO-ENC/1` documentado.
- Testes automatizados de matriz, cifragem, descriptografia e adulteração.

## Próxima integração controlada

- Transformar o conteúdo de `pacto-de-leitura.html` em portal ACERVO MEDEIROS.
- Adicionar catálogo vazio cifrado e tela de senha/chave de leitura.
- Conectar a autorização da sessão ao portal sem usar o comprovante como chave permanente.
- Implementar leitura de mídias e documentos após descriptografia.
- Gerar manifesto de publicação e manual de recuperação completo.

O arquivo histórico de destino continua preservado neste ponto; a troca de sua interface será feita depois de o fluxo do catálogo cifrado ser validado.

