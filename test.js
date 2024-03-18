const { 
	verifyUser,
	isUsernameInDb,
	getIntFromParam,
	isValidPassword
} = require("./functions");

describe("Get Int from parametrs", () => {
	it.each([
		["userId=5", 5],
		["Id=", NaN],
		["Id=0", 0],
		["gameId=15", 15],
	])("", (param, expected) => {
		const result = getIntFromParam(param);
		expect(result).toBe(expected);
	});
});

describe("Verifying user", () => {
	it.each([
		["projektPO@gmail.com", "Qwerty123_", 0],
		["+48434234234", "Qwerty!a", 1],
		["celujacy@back.end", "qwertyuio0", -1],
		["qwert@qw.er", "12385uio0", -1],
	])("", (username, password, expected) => {
		const result = 	verifyUser(username, password);
		expect(result).toBe(expected);
	});
});

describe("Checking username presense", () => {
	it.each([
		["projektPO@gmail.com", true],
		["+48434234234", true],
		["cy@back.end", false],
		["qwert@qw.er", false],
	])("", (username, expected) => {
		const result = 	isUsernameInDb(username);
		expect(result).toBe(expected);
	});
});

describe("Validation password", () => {
	it.each([
		["Qwerty123_", true],
		["TesterVova1_", true],
		["testervova", false],
		["Olek2", false],
	])("", (password, expected) => {
		const result = 	isValidPassword(password);
		expect(result).toBe(expected);
	});
});


