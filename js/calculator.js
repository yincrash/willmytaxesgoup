/**
 * Trump Tax rates:
 * | rate | single          | married       |
 * | :--- | :-------------- | :------------ |
 * | 12%  | $0 - 37500      | $0 - 75000    |
 * | 25%  | $37500 - 112500 | $75000-225000 |
 * | 33%  | $112500+        | $225000+      |
 */

/**
 * Taxes under the propsed Trump plan from Oct 2016
 * @param  {number} adjusted gross income
 * @param  {string} "single" "hoh" or "married"
 * @return {number} tax burden
 */
function calculateTrumpTaxes(agi,  status) {
	// the minimum of each bracket
	let bracket = [ 0, 37500, 112500 ];
	let rates = [ .12, .25, .33 ];
	if (status == "married") {
		bracket = [ 0, 75000, 225000 ];
	}

	return taxesHelper(bracket, rates, agi);
}

/**
 * Taxes under the 2016 tax bracket
 * @param  {number} adjusted gross income
 * @param  {string} "single" "hoh" or "married"
 * @return {number} tax burden
 */
function calculate2016Taxes(agi,  status) {
	// the minimum of each bracket
	let bracket = [ 0, 9275, 37650, 91150, 190150, 413350, 415050 ];
	let rates = [ .10, .15, .25, .28, .33, .35, .40 ];
	if (status == "married") {
		bracket = [ 0, 18550, 75300, 151900, 231450, 413350, 466950 ];
	} else if (status == "hoh") {
		bracket = [ 0, 13250, 50400, 130150, 210800, 413350, 441000 ];
	}

	return taxesHelper(bracket, rates, agi);
}

/**
 * Calculate the tax burden given set of tax brackets and rates
 * and the given AGI.
 * @param  {Array} tax brackets
 * @param  {Array} tax rates for those brackets
 * @param  {number} AGI 
 * @return {number} tax burden
 */
function taxesHelper(bracket, rates, agi) {
	let taxes = 0;
	for (let i = bracket.length; i >= 0; i--) {
		if (agi > bracket[i]) {
			const amount = agi - bracket[i];
			agi = bracket[i];
			taxes += amount * rates[i];
		}
	}

	return taxes;
}

function calculate() {
	let agi = $("#agi").val();
	let status = $("input:radio[name ='status']:checked").val();
	let trump = calculateTrumpTaxes(agi, status);
	let current = calculate2016Taxes(agi, status);
	$("#trumptaxes").text("$" + trump.toFixed(2));
	$("#2016taxes").text("$" + current.toFixed(2));
	let diff = (trump - current);
	if (diff < 0) {
		$("#taxdifference-label").text("You will pay less");
	} else {
		$("#taxdifference-label").text("You will pay more");
	}
	$("#taxdifference").text("$" + Math.abs(diff).toFixed(2));
	$("#taxpercent").text(((diff / current) * 100).toFixed(2) + "%");
}