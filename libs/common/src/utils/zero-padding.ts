export const addZeroPadding = (
	s: string,
	totalStringLength: number,
): string => {
	while (s.length < totalStringLength) {
		s = '0' + s;
	}
	return s;
};
export const removeZeroPadding = (s: string): string => {
	let cutPosition = 0;
	while (s[cutPosition] === '0') {
		cutPosition++;
	}
	const stringNoPadding = s.slice(cutPosition, s.length);
	return stringNoPadding;
};
