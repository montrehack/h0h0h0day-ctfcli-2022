const transformOptions = {
	presets: [
		[
			"@babel/preset-env",
			{
				targets: {
					node: "current"
				}
			}
		],
		"@babel/preset-typescript"
	]
};

export default transformOptions;
