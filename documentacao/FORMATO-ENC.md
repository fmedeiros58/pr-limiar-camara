# Formato ACERVO-ENC/1

Envelope JSON versionado:

```json
{
  "formato": "ACERVO-ENC/1",
  "tipo": "publication|work|media|catalog",
  "id": "identificador-estavel",
  "alg": "AES-256-GCM",
  "kdf": {"name": "PBKDF2-SHA-256", "iterations": 600000},
  "salt": "base64",
  "iv": "base64",
  "aad": "base64",
  "ciphertext": "base64"
}
```

O PBKDF2 é a implementação portátil inicial baseada apenas na Web Crypto API. O formato reserva o campo `kdf` para migração futura a Argon2id sem quebrar o catálogo. Nunca reutilizar `iv` com a mesma chave.

