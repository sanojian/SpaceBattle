function Comm() {

	this.connect = function() {
		io.connect('http://localhost:5000');
	}
}