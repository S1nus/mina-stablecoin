import {
  SmartContract,
  state,
  State,
  method,
  DeployArgs,
  Permissions,
  UInt64,
  AccountUpdate,
  PrivateKey,
  PublicKey,
  MerkleMapWitness
} from 'snarkyjs';

import {
  Account as StableAccount
} from './state';

export class Stable extends SmartContract {

  events = {
    'create-account': PublicKey
  }

  @state(Field) accountRoot = State<Field>();

  deploy(args: DeployArgs) {
    super.deploy(args);
    this.setPermissions({
      ...Permissions.default(),
      editState: Permissions.proof(),
      send: Permissions.proof(),
    });
  }

  @method init(initialRoot: Field) {
    this.accountRoot.set(initialRoot);
  }

  @method createAccount(
    owner: PublicKey,
    exclusionWitness: MerkleMapWitness,
    inclusionWitness: MerkleMapWitness,
    insertionRoot: Field,
  ) {
    // Create hash of empty account
    // Format is Poseidon( Field(MinaBalance), Field(mUSDBalance), Field(Debt) )
    const emptyAccountHash = Poseidon.hash([Field(0), Field(0), Field(0)]);

    // TODO: Verify Merkle Exclusion proof
    // This is not implemented yet, might require sorted merkle tree
    const [exclusionWitnessRoot, exclusionWitnessKey] = exclusionWitness.computeRootAndKey(emptyAccountHash);
    exclusionWitnessRoot.assertEquals(this.accountRoot);
    exclusionWitnessKey.assertEquals(Poseidon.hash(owner.toFields()));

    // Verify insertion
    const [inclusionWitnessRoot, inclusionWitnessKey] = inclusionWitness.computeRootAndKey(emptyAccountHash);
    inclusionWitnessRoot.assertEquals(this.accountRoot);
    inclusionWitnessKey.assertEquals(Poseidon.hash(owner.toFields()));
    // Update State
    this.accountRoot.set(insertionRoot);
    // Emit Event
    this.emitEvent("create-account", owner);
  }

  @method createPosition(
    user: PublicKey,
    amount: number
  ) {
    const payerUpdate = AccountUpdate.create(user);
    payerUpdate.send({ to: this.address, amount: UInt64.from(number) });
  }

  @method withdraw(user: PublicKey) {
    this.send({ to: user, amount: UInt64.from(1000000) });
  }
}
