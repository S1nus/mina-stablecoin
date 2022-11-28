import { Field, SmartContract, state, State } from 'snarkyjs';

/**
 * Basic Example
 * See https://docs.minaprotocol.com/zkapps for more info.
 *
 * The Add contract initializes the state variable 'num' to be a Field(1) value by default when deployed.
 * When the 'update' method is called, the Add contract adds Field(2) to its 'num' contract state.
 *
 * This file is safe to delete and replace with your own contract.
 */

export class MUSDStable extends SmartContract {
  @state(Field) mapRoot = State<Field>();

  /*@method init(initialRoot: Field) {
    super.init();
    this.mapRoot.set(initialRoot);
  }*/

  init(initialRoot: Field) {
    super.init();
    this.mapRoot.set(Field(initialRoot));
  }
}

/*export class Add extends SmartContract {
  @state(Field) num = State<Field>();

  init() {
    super.init();
    this.num.set(Field(1));
  }

  @method update() {
    const currentState = this.num.get();
    this.num.assertEquals(currentState); // precondition that links this.num.get() to the actual on-chain state
    const newState = currentState.add(2);
    this.num.set(newState);
  }
}*/
