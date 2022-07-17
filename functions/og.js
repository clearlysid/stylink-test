const chromium = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');


exports.handler = async function (event, context) {
	const tgid = event.queryStringParameters && event.queryStringParameters.tgid

	// const headoutApiBaseUrl = `http://headout.com/api/v6/tour-groups/`
	// const data = await fetch(headoutApiBaseUrl + tgid).then(r => r.json())

	// const name = data.name
	// const image = data.imageUploads[0].url
	// const rating = data.reviewsDetails.averageRating
	// const fc = data.hasFreeCancellation
	// const ic = data.hasInstantConfirmation
	// const category = data.primaryCategory.heading

	// only for reference purposes
	// console.log(name, rating, fc, ic, category)

	// design for the thumbnail in HTML
	const imageMarkup = `
		<link rel="preconnect" href="https://fonts.googleapis.com"> 
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin> 
	<link href="https://fonts.googleapis.com/css2?family=Public+Sans:wght@300&display=swap" rel="stylesheet">
			<body style="background: #8000ff; color: white; font-family: 'Public Sans'">
				<h1>TGID:${tgid}, Name: <experience name></h1>
				<h2>Rating: 5 stars</h2>
				<img src="http://placekitten.com/300/400" height="300" width="400">
			</body>
		`

	// start a browser instance 
	const browser = await puppeteer.launch({
		args: chromium.args,
		executablePath: process.env.CHROME_EXECUTABLE_PATH || await chromium.executablePath,
		defaultViewport: { height: 630, width: 1200 },
		headless: true,
	});

	// generate a page with above markup and screenshot
	const page = await browser.newPage();
	await page.setContent(imageMarkup);
	await page.waitForTimeout(1000);
	const buffer = await page.screenshot();

	// return screenshot as final output

	await browser.close();

	return {
		statusCode: 200,
		headers: {
			"Content-Type": "image/png",
		},
		body: buffer.toString("base64"),
		// body: JSON.stringify({ status: "ok" })
		isBase64Encoded: true,
	};
};