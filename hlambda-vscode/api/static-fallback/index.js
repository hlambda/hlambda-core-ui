module.exports = async (req, res) => {
	res.status(404);
	res.setHeader('Cache-Control', 'no-store');
	res.send('Not Found');
};
