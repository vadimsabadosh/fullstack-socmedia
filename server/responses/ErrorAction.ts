export class ErrorAction {
	message;
	ok = false;
	constructor(message: string) {
		this.message = message;
	}
}
