function formatDate(date) {
	return new Date(date).toLocaleDateString('ph');
}

export default formatDate;