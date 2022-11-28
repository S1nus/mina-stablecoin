import { Field, MerkleMap, PrivateKey, isReady, Poseidon } from 'snarkyjs';

class Account {
  constructor(owner) {
    this.owner = owner;
    this.minaBalance = Field(0);
    this.musdBalance = Field(0);
    this.debt = Field(0);
  }

  serialize() {
    return Poseidon.hash([this.minaBalance, this.musdBalance, this.debt]);
  }
}

await isReady;

const key = PrivateKey.random();
const publicKey = key.toPublicKey();
console.log(publicKey.toFields());
const map = new MerkleMap();

const account = new Account(publicKey);
const accountSerialized = account.serialize();
console.log(accountSerialized);
const hashedPubkey = Poseidon.hash(publicKey.toFields());

map.set(hashedPubkey, accountSerialized);
