const ACERVO_CRYPTO = (() => {
  const text = new TextEncoder();
  const decoder = new TextDecoder();
  const ITERATIONS = 600000;

  const bytesToB64 = bytes => {
    let binary = '';
    for (const byte of bytes) binary += String.fromCharCode(byte);
    return btoa(binary);
  };
  const b64ToBytes = value => Uint8Array.from(atob(value), char => char.charCodeAt(0));
  const utf8 = value => text.encode(String(value));

  async function deriveKey(password, salt, iterations = ITERATIONS) {
    const material = await crypto.subtle.importKey('raw', utf8(password), 'PBKDF2', false, ['deriveKey']);
    return crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt, iterations, hash: 'SHA-256' }, material,
      { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']
    );
  }

  async function encryptJson(value, { password, type, id, iterations = ITERATIONS } = {}) {
    if (!password) throw new Error('Informe uma senha de criptografia.');
    if (!type || !id) throw new Error('Tipo e identificador são obrigatórios.');
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const aad = utf8(`ACERVO-ENC/1|${type}|${id}`);
    const key = await deriveKey(password, salt, iterations);
    const plaintext = utf8(JSON.stringify(value));
    const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv, additionalData: aad }, key, plaintext);
    return { formato: 'ACERVO-ENC/1', type, id, alg: 'AES-256-GCM', kdf: { name: 'PBKDF2-SHA-256', iterations }, salt: bytesToB64(salt), iv: bytesToB64(iv), aad: bytesToB64(aad), ciphertext: bytesToB64(new Uint8Array(ciphertext)) };
  }

  async function decryptJson(envelope, password) {
    if (!envelope || envelope.formato !== 'ACERVO-ENC/1' || envelope.alg !== 'AES-256-GCM') throw new Error('Formato criptográfico não reconhecido.');
    const salt = b64ToBytes(envelope.salt), iv = b64ToBytes(envelope.iv), aad = b64ToBytes(envelope.aad);
    const key = await deriveKey(password, salt, envelope.kdf?.iterations || ITERATIONS);
    try {
      const plaintext = await crypto.subtle.decrypt({ name: 'AES-GCM', iv, additionalData: aad }, key, b64ToBytes(envelope.ciphertext));
      return JSON.parse(decoder.decode(plaintext));
    } catch { throw new Error('Senha incorreta ou arquivo adulterado.'); }
  }

  async function sha256(value) {
    const digest = await crypto.subtle.digest('SHA-256', typeof value === 'string' ? utf8(value) : value);
    return [...new Uint8Array(digest)].map(byte => byte.toString(16).padStart(2, '0')).join('');
  }

  async function externalKeyFromChallenge(phrase) {
    const normalized = String(phrase || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().replace(/[^A-Z]/g, '');
    if (!normalized) throw new Error('Expressão Playfair inválida.');
    return (await sha256(`PR-LIMIAR-ACERVO-EXTERNA/1|${normalized}`)).toUpperCase();
  }

  async function wrapInternalPassword(internalPassword, externalPassword, id) {
    return encryptJson({ password: String(internalPassword) }, { password: externalPassword, type: 'key-wrap', id });
  }

  async function unwrapInternalPassword(wrapped, externalPassword) {
    const value = await decryptJson(wrapped, externalPassword);
    if (!value || typeof value.password !== 'string' || !value.password) throw new Error('Envelope de chave inválido.');
    return value.password;
  }

  async function decryptKeyring(envelope, externalPassword) {
    if (!envelope || envelope.formato !== 'ACERVO-KEYRING/1') throw new Error('Envelope de acesso externo não reconhecido.');
    const wrapped = envelope.chaves?.find(item => item && item.id && item.envelope);
    if (!wrapped) throw new Error('Nenhuma chave externa disponível.');
    const internalPassword = await unwrapInternalPassword(wrapped.envelope, externalPassword);
    return decryptJson(envelope.conteudo, internalPassword);
  }

  return { encryptJson, decryptJson, sha256, externalKeyFromChallenge, wrapInternalPassword, unwrapInternalPassword, decryptKeyring, bytesToB64, b64ToBytes };
})();

