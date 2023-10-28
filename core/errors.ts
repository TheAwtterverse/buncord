export class NullClient extends Error {
    constructor() {
        super("Client can not be null.");
        this.name = "NullClient";
    }
}