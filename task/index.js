var Task = function () {
	this.data = {
		id: null,
		name: null,
		priority: null,
		status: null,
		date: null,
		description: null
	};

	this.fill = function (info) {
		for(var prop in this.data) {
			if(this.data[prop] !== 'undefined') {
				this.data[prop] = info[prop];
			}
		}
	};

	this.setTaskDate = function () {
		this.data.date = Date.now();
	};


	this.getInformation = function () {
		return this.data;
	};
};

module.exports = function (info) {
	var instance = new Task();

	instance.fill(info);

	return instance;
};