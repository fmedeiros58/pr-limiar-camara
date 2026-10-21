import assert from 'node:assert/strict';
import { webcrypto } from 'node:crypto';

const { subtle } = webcrypto;
const encoder = new TextEncoder();
const password = 'senha-de-teste-do-acervo';
const salt = webcrypto.getRandomValues(new Uint8Array(16));
const iv = webcrypto.getRandomValues(new Uint8Array(12));
const aad = encoder.encode('ACERVO-ENC/1|publication|teste');
const material = await subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveKey']);
const key = await subtle.deriveKey({ name: 'PBKDF2', salt, iterations: 600000, hash: 'SHA-256' }, material, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
const plaintext = encoder.encode(JSON.stringify({ titulo: 'Teste fictício', corpo: 'Conteúdo protegido.' }));
const ciphertext = new Uint8Array(await subtle.encrypt({ name: 'AES-GCM', iv, additionalData: aad }, key, plaintext));
const recovered = await subtle.decrypt({ name: 'AES-GCM', iv, additionalData: aad }, key, ciphertext);
assert.equal(new TextDecoder().decode(recovered), new TextDecoder().decode(plaintext));
ciphertext[0] ^= 1;
await assert.rejects(() => subtle.decrypt({ name: 'AES-GCM', iv, additionalData: aad }, key, ciphertext));
console.log('Criptografia: cifragem, recuperação e adulteração conferidas.');

