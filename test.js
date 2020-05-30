const sleep = (ms) =>
	new Promise((resolve) => {
		setTimeout(() => {
			resolve(ms);
		}, ms);
	});

sleep(2000).then((result) => console.log(result));
