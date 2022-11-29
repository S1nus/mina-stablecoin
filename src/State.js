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
const hashedPubkey = Poseidon.hash(publicKey.toFields());

map.set(hashedPubkey, accountSerialized);
let root = map.getRoot();
console.log("Root:");
console.log(root);
const witness = map.getWitness(hashedPubkey);

function borrowDebt(
  accountOwnerHash,
  accountHash,
  accountMinaBalance,
  accountMUSDBalance,
  accountDebt,
  witness,
  borrowAmount,
  oraclePrice,
) {
  // 1. Verify that the account hash is the result of the data
  Poseidon.hash([accountMinaBalance, accountMUSDBalance, accountDebt])
  .assertEquals(accountHash);
  console.log("Account hash looks good");

  // 2. Verify that the merkle path from the account to the current state root
  const [witnessRoot, witnessKey] = witness.computeRootAndKey(accountHash);
  witnessRoot.assertEquals(root);
  witnessKey.assertEquals(accountOwnerHash);
  console.log("Merkle Witness Looks Good");
  // 3. Verify that the Mina Balance is worth more than 1.1x borrowAmount 
  // 4. Create new Account, emit Mina event, update state with new root
}

/*borrowDebt(
  hashedPubkey,
  accountSerialized,
  Field(0),
  Field(0),
  Field(0),
  witness,
  Field(0),
);*/

/*function repayDebt(
  accountOwnerHash,
  accountHash,
  accountMinaBalance,
  accountMUSDBalance,
  accountDebt,
  witness,
) {
  // 1. Verify that the account hash is the result of the data
  // 2. Verify the merkle path from the account to the current state root
  // 3. Subtract MUSD balance from debt, update account, state root, and emit event.
}

function transferMUSD() {

}*/
